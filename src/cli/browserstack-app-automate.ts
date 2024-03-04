#!/usr/bin/env node

import { ensureKeyExists, ensureUsernameExists } from "@/cli/cli-utils";
import { BrowserStackError } from "@/error";
import { components } from "@/generated/openapi";
import {
  AppAutomateClient,
  BrowserStackOptions,
  FlutterPlatform,
} from "@/index";
import { randomBytes } from "node:crypto";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { basename, resolve } from "node:path";

const require = createRequire(import.meta.url);

enum Platform {
  flutter = "flutter",
  appium = "appium",
  espresso = "espresso",
  xcuitest = "xcuitest",
  detox = "detox",
  media = "media",
}

enum PlatformAction {
  upload = "upload",
  get = "get",
  list = "list",
  delete = "delete",
}

interface PlatformCommandSpec<T> {
  list: (
    clientOptions: Partial<BrowserStackOptions>,
    args: string[]
  ) => Promise<T[]>;

  upload: (
    options: { filename: string } & (
      | { file: Blob; url?: never }
      | { url: string; file?: never }
    ),
    clientOptions: Partial<BrowserStackOptions>,
    args: string[]
  ) => Promise<T>;

  get: (
    options: { id: string },
    clientOptions: Partial<BrowserStackOptions>,
    args: string[]
  ) => Promise<T>;

  delete: (
    options: { id: string },
    clientOptions: Partial<BrowserStackOptions>,
    args: string[]
  ) => Promise<boolean>;

  getURL: (app: T) => string | undefined;

  logParams: (app: T) => [string, ...unknown[]];

  getURLProtocol: () => string;
}

/**
 * This class provides common functionality for interacting with the App Automate platform.
 *
 * @internal
 */
class PlatformCommand<T> {
  readonly platform: Platform;
  readonly supportedActions: PlatformAction[];

  private readonly _implPlatformCommand: PlatformCommandSpec<T>;
  private readonly _urlProtocol: string;

  constructor(
    platform: Platform,
    supportedActions: PlatformAction[],
    platformRun: PlatformCommand<T>["_implPlatformCommand"]
  ) {
    this.platform = platform;
    this.supportedActions = supportedActions;
    this._implPlatformCommand = platformRun;
    this._urlProtocol = this._implPlatformCommand.getURLProtocol();
  }

  async list(
    options: Partial<BrowserStackOptions>,
    args: string[],
    logger: Logger
  ) {
    const apps = await this._implPlatformCommand.list(options, args);
    apps.forEach((app) => this._logApp(app, logger));
  }

  async upload(
    options: Partial<BrowserStackOptions> &
      ({ filename: string } & (
        | { filePath: string; url?: never }
        | { url: URL; filePath?: never }
      )),
    args: string[],
    logger: Logger
  ) {
    const { filename, filePath, url, ...clientOptions } = options;
    const app = await this._implPlatformCommand.upload(
      {
        filename,
        ...(filePath
          ? { file: new Blob([await readFile(filePath)]) }
          : { url: url!.toString() }),
      },
      clientOptions,
      args
    );

    const appURL = app ? this._implPlatformCommand.getURL(app) : undefined;
    if (appURL) {
      logger.info(appURL, "Uploaded successfully");
    } else {
      logger.error(`Failed to upload app`, app);
    }
  }

  async get(
    options: Partial<BrowserStackOptions> & {
      id: string;
    },
    args: string[],
    logger: Logger
  ) {
    const { id, ...clientOptions } = options;
    const app = await this._implPlatformCommand.get(
      { id: this.cleanupId(id) },
      clientOptions,
      args
    );

    this._logApp(app, logger);
  }

  async delete(
    options: Partial<BrowserStackOptions> & {
      id: string;
    },
    args: string[],
    logger: Logger
  ) {
    const { id, ...clientOptions } = options;
    const success = await this._implPlatformCommand.delete(
      { id: this.cleanupId(id) },
      clientOptions,
      args
    );

    if (success) {
      // TODO: should we really URI for consistency?
      logger.info(`${this._urlProtocol}${id}`, "Deleted successfully");
    } else {
      logger.error(`Failed to delete app: ${id}`);
    }
  }

  private _logApp(app: T, logger: Logger) {
    logger.info(...this._implPlatformCommand.logParams(app));
  }

  cleanupId(id: string, urlProto = this._urlProtocol) {
    return id.startsWith(urlProto) ? id.replace(urlProto, "") : id;
  }
}

const transformFlutterTestPackageToApp = (
  testPackage: components["schemas"]["AppAutomateTestPackage"]
): components["schemas"]["AppAutomateApp"] => {
  const { test_package_id, test_package_url, test_package_name, ...common } =
    testPackage;

  return {
    ...common,
    app_id: test_package_id,
    app_url: test_package_url,
    app_name: test_package_name,
  };
};

const ensureFlutterPlatform = (
  platform: string | undefined,
  validPlatforms = Object.values(FlutterPlatform)
) => {
  if (!platform || !validPlatforms.includes(platform as FlutterPlatform)) {
    throw new BrowserStackError(
      `Invalid or missing flutter platform. Supported platforms: ${validPlatforms
        .sort()
        .join(", ")}`
    );
  }

  return platform as FlutterPlatform;
};

const appPlatformCommand: Pick<
  PlatformCommandSpec<components["schemas"]["AppAutomateApp"]>,
  "getURL" | "logParams" | "getURLProtocol"
> = {
  getURLProtocol: () => "bs://",
  getURL: (app) => app?.app_url,
  logParams: (app) => [
    app?.app_url ?? "",
    app?.uploaded_at ? new Date(app.uploaded_at).toISOString() : "",
    app?.app_name,
    app?.app_version,
  ],
};

/**
 * Represents a command with actions for interacting with Flutter apps on BrowserStack App Automate.
 */
const flutterPlatformCommand = new PlatformCommand(
  Platform.flutter,
  [
    PlatformAction.upload,
    PlatformAction.list,
    PlatformAction.get,
    PlatformAction.delete,
  ],
  {
    ...appPlatformCommand,
    list: (clientOptions, args) => {
      const client = new AppAutomateClient(clientOptions);
      const platform = ensureFlutterPlatform(
        args[0]?.toLowerCase?.()?.trim?.()
      );

      if (platform === FlutterPlatform.android) {
        return client.getFlutterApps(FlutterPlatform.android);
      }

      return client
        .getFlutterApps(FlutterPlatform.ios)
        .then((r) => r.map(transformFlutterTestPackageToApp));
    },
    upload: (options, clientOptions, args) => {
      const client = new AppAutomateClient(clientOptions);
      let platform = args[0]?.toLowerCase?.()?.trim?.();

      if (
        !platform &&
        options.filename?.toLowerCase?.()?.match?.(/\.(apk|aar|appbundle)$/)
      ) {
        platform = FlutterPlatform.android;
      } else {
        platform = ensureFlutterPlatform(platform);
      }

      if (platform === FlutterPlatform.android) {
        return client.uploadFlutterApp(FlutterPlatform.android, options);
      }

      return client
        .uploadFlutterApp(FlutterPlatform.ios, options)
        .then(transformFlutterTestPackageToApp);
    },
    get: (options, clientOptions, args) => {
      const client = new AppAutomateClient(clientOptions);
      const platform = ensureFlutterPlatform(
        args[0]?.toLowerCase?.()?.trim?.()
      );

      if (platform === FlutterPlatform.android) {
        return client.getFlutterApp(FlutterPlatform.android, options.id);
      }

      return client
        .getFlutterApp(FlutterPlatform.ios, options.id)
        .then(transformFlutterTestPackageToApp);
    },
    delete: async (options, clientOptions, args) => {
      const client = new AppAutomateClient(clientOptions);
      const platform = ensureFlutterPlatform(
        args[0]?.toLowerCase?.()?.trim?.()
      );

      const result = await (platform === FlutterPlatform.android
        ? client.deleteFlutterApp(FlutterPlatform.android, options.id)
        : client.deleteFlutterApp(FlutterPlatform.ios, options.id));

      return result?.success?.message?.length > 0;
    },
  }
);

// there's no documented API to get an Appium app by it's app_id
// so we generate a custom_id and swap app_id with custom_id (sigh)
// TODO: revisit this hack
const patchAppIdWithCustomId = (
  app: components["schemas"]["AppAutomateApp"]
): components["schemas"]["AppAutomateApp"] => {
  if (!app.app_id || !app.custom_id) {
    return app;
  }

  const customId = app.app_id;

  return {
    ...app,
    app_id: app.custom_id,
    app_url: app.app_url.replace(app.app_id, app.custom_id),
    custom_id: customId,
  };
};

/**
 * Represents a command with actions for interacting with Appium apps on BrowserStack App Automate.
 */
const appiumPlatformCommand = new PlatformCommand(
  Platform.appium,
  [
    PlatformAction.upload,
    PlatformAction.list,
    PlatformAction.get,
    PlatformAction.delete,
  ],
  {
    ...appPlatformCommand,
    list: (clientOptions) => {
      const client = new AppAutomateClient(clientOptions);
      return client.getAppiumApps().then((r) => r.map(patchAppIdWithCustomId));
    },
    upload: (options, clientOptions) => {
      const client = new AppAutomateClient(clientOptions);

      return client
        .uploadAppiumApp({
          ...options,
          custom_id: randomBytes(20).toString("hex"),
        })
        .then(patchAppIdWithCustomId);
    },
    get: (options, clientOptions) => {
      const client = new AppAutomateClient(clientOptions);

      return client.getAppiumAppsByCustomId(options.id).then((r) => {
        if (!r.length) {
          throw new BrowserStackError(`${options.id} Not found`);
        }

        return patchAppIdWithCustomId(r[0]);
      });
    },
    delete: async (options, clientOptions) => {
      const client = new AppAutomateClient(clientOptions);
      const [app] = await client.getAppiumAppsByCustomId(options.id);
      // if custom_id is not found, use app_id
      const appId = app?.app_id ?? options.id;
      const r = await client.deleteAppiumApp(appId);
      return r?.success === true;
    },
  }
);

/**
 * Represents a command with actions for interacting with Espresso apps on BrowserStack App Automate.
 */
const espressoPlatformCommand = new PlatformCommand(
  Platform.espresso,
  [
    PlatformAction.upload,
    PlatformAction.list,
    PlatformAction.get,
    PlatformAction.delete,
  ],
  {
    ...appPlatformCommand,
    list: (clientOptions) => {
      const client = new AppAutomateClient(clientOptions);
      return client.getEspressoApps();
    },
    upload: (options, clientOptions) => {
      const client = new AppAutomateClient(clientOptions);
      return client.uploadEspressoApp(options);
    },
    get: (options, clientOptions) => {
      const client = new AppAutomateClient(clientOptions);
      return client.getEspressoApp(options.id);
    },
    delete: async (options, clientOptions) => {
      const client = new AppAutomateClient(clientOptions);
      const r = await client.deleteEspressoApp(options.id);
      return r?.success?.message?.length > 0;
    },
  }
);

/**
 * Represents a command with actions for interacting with XCUITest apps on BrowserStack App Automate.
 */
const xcuiTestPlatformCommand = new PlatformCommand(
  Platform.xcuitest,
  [
    PlatformAction.upload,
    PlatformAction.list,
    PlatformAction.get,
    PlatformAction.delete,
  ],
  {
    ...appPlatformCommand,
    list: (clientOptions) => {
      const client = new AppAutomateClient(clientOptions);
      return client.getXCUITestApps();
    },
    upload: (options, clientOptions) => {
      const client = new AppAutomateClient(clientOptions);
      return client.uploadXCUITestApp(options);
    },
    get: (options, clientOptions) => {
      const client = new AppAutomateClient(clientOptions);
      return client.getXCUITestApp(options.id);
    },
    delete: async (options, clientOptions) => {
      const client = new AppAutomateClient(clientOptions);
      const r = await client.deleteXCUITestApp(options.id);
      return r?.success?.message?.length > 0;
    },
  }
);

/**
 * Represents a command with actions for interacting with Detox apps on BrowserStack App Automate.
 */
const detoxPlatformCommand = new PlatformCommand(
  Platform.detox,
  [PlatformAction.upload],
  {
    ...appPlatformCommand,
    upload: (options, clientOptions, args) => {
      const appType = args?.[0]?.toLowerCase?.()?.trim?.();

      switch (appType) {
        case "app":
        case "app-client": {
          const client = new AppAutomateClient(clientOptions);
          return client.uploadDetoxAndroidApp(appType, options);
        }
        default:
          throw new BrowserStackError(
            "Invalid or missing detox app type. Supported types: app, app-client"
          );
      }
    },
    list: () => {
      throw new BrowserStackError("Listing detox apps is not supported");
    },
    get: () => {
      throw new BrowserStackError("Fetching detox apps is not supported");
    },
    delete: () => {
      throw new BrowserStackError("Deleting detox apps is not supported");
    },
  }
);

// there's no documented API to get an Appium app by it's app_id
// so we generate a custom_id and swap app_id with custom_id (sigh)
// TODO: revisit this hack
const patchMediaIdWithCustomId = (
  media: components["schemas"]["AppAutomateMediaFile"]
): components["schemas"]["AppAutomateMediaFile"] => {
  if (!media.custom_id) {
    return media;
  }

  const customId = media.media_id;

  return {
    ...media,
    media_id: media.custom_id,
    media_url: media.media_url.replace(media.media_id, media.custom_id),
    custom_id: customId,
  };
};

/**
 * Represents a command with actions for interacting with media files on BrowserStack App Automate.
 */
const mediaPlatformCommand = new PlatformCommand<
  components["schemas"]["AppAutomateMediaFile"]
>(
  Platform.media,
  [
    PlatformAction.upload,
    PlatformAction.list,
    PlatformAction.get,
    PlatformAction.delete,
  ],
  {
    getURLProtocol: () => "media://",
    getURL: (media) => media?.media_url,
    logParams: (media) => [
      media?.media_url ?? "",
      media?.uploaded_at ? new Date(media.uploaded_at).toISOString() : "",
      media?.media_name,
    ],
    list: (clientOptions) => {
      const client = new AppAutomateClient(clientOptions);
      return client
        .getMediaFiles()
        .then((r) => r.map(patchMediaIdWithCustomId));
    },
    upload: (options, clientOptions) => {
      if (options.url) {
        throw new BrowserStackError(
          "URL upload is not supported for media files"
        );
      }

      if (!options.file) {
        throw new BrowserStackError("No file provided for media upload");
      }

      const client = new AppAutomateClient(clientOptions);
      return client
        .uploadMediaFile({
          ...options,
          custom_id: randomBytes(20).toString("hex"),
        })
        .then(patchMediaIdWithCustomId);
    },
    get: (options, clientOptions) => {
      const client = new AppAutomateClient(clientOptions);

      return client.getMediaFilesByCustomId(options.id).then((r) => {
        if (!r.length) {
          throw new BrowserStackError(`${options.id} Not found`);
        }

        return patchMediaIdWithCustomId(r[0]);
      });
    },
    delete: async (options, clientOptions) => {
      const client = new AppAutomateClient(clientOptions);
      const [app] = await client.getMediaFilesByCustomId(options.id);
      // if custom_id is not found, use media_id
      const mediaId = app?.media_id ?? options.id;
      const r = await client.deleteMediaFile(mediaId);
      return r?.success === true;
    },
  }
);

type PlatformCommands =
  | PlatformCommand<components["schemas"]["AppAutomateApp"]>
  | PlatformCommand<components["schemas"]["AppAutomateMediaFile"]>;

/**
 * Map that associates each AppPlatform with its corresponding AppPlatformCommand.
 */
const platformCommands = new Map<Platform, PlatformCommands>(
  [
    flutterPlatformCommand,
    appiumPlatformCommand,
    espressoPlatformCommand,
    xcuiTestPlatformCommand,
    detoxPlatformCommand,
    mediaPlatformCommand,
  ].map((command) => [command.platform, command])
);

/**
 * Runs the specified action for the given AppPlatformCommand.
 *
 * @param platformRun - The AppPlatformCommand to run.
 * @param action - The AppAutomateAction to perform.
 * @param args - The arguments for the action.
 * @param logger - The logger to use for logging.
 * @param osPlatforms - The platforms to consider for URL upload.
 * @returns A promise that resolves when the action is completed.
 * @throws {BrowserStackError} If the action is invalid or if required parameters are missing.
 */
async function run(
  platformRun: PlatformCommands,
  action: PlatformAction,
  args: string[],
  logger: Logger = globalThis.console,
  osPlatforms: string[] = ["android", "ios"]
) {
  if (!platformRun.supportedActions.includes(action)) {
    throw new BrowserStackError(
      `Invalid action: ${action} (valid actions: ${platformRun.supportedActions.join(
        ", "
      )})`
    );
  }

  switch (action) {
    case PlatformAction.upload: {
      const pathArg = args.shift();
      if (!pathArg) {
        throw new BrowserStackError("No file path or URL provided");
      }

      if (pathArg?.toLowerCase?.().startsWith?.("http")) {
        if (!args[0] || osPlatforms.includes(args[0])) {
          // URL must be followed by filename and later optionally by platform=android|ios
          // maybe consider using basename(url.pathname) as filename
          throw new BrowserStackError("No filename provided for URL upload");
        }

        return await platformRun.upload(
          { url: new URL(pathArg), filename: args[0] },
          args.slice(1),
          logger
        );
      }

      const filePath = resolve(pathArg);
      await platformRun.upload(
        {
          filePath,
          filename: basename(filePath),
        },
        args,
        logger
      );
      break;
    }
    case PlatformAction.list: {
      await platformRun.list({}, args, logger);
      break;
    }
    case PlatformAction.get: {
      await platformRun.get({ id: args[0] }, args.slice(1), logger);
      break;
    }
    case PlatformAction.delete: {
      await platformRun.delete({ id: args[0] }, args.slice(1), logger);
      break;
    }
    default:
      throw new BrowserStackError(`Unsupported action: ${action}`);
  }
}

interface Logger {
  info(message: string, ...params: unknown[]): void;
  error(message: string, ...params: unknown[]): void;
}

/**
 * Ensures that the provided platform is valid.
 *
 * @param inputPlatform - The platform to validate.
 * @param validAppPlatforms - An array of valid platforms. Defaults to all values of AppPlatform.
 * @returns The validated action.
 * @throws {BrowserStackError} If the action is invalid.
 *
 * @internal
 */
function ensureValidPlatform(inputPlatform: string | undefined): Platform {
  const action = inputPlatform?.toLowerCase?.()?.trim?.();
  if (action && platformCommands.has(action as Platform)) {
    return action as Platform;
  }

  throw new BrowserStackError(`Invalid platform: ${action}`);
}

/**
 * Ensures that the provided action is valid.
 *
 * @param inputAction - The action to validate.
 * @param validActions - An array of valid actions. Defaults to all values of AppAutomateAction.
 * @returns The validated action.
 * @throws {BrowserStackError} If the action is invalid.
 *
 * @internal
 */
function ensureValidAction(
  inputAction: string | undefined,
  validActions = Object.values(PlatformAction)
): PlatformAction {
  const action = inputAction?.toLowerCase?.()?.trim?.();
  if (action && validActions.includes(action as PlatformAction)) {
    return action as PlatformAction;
  }

  throw new BrowserStackError(`Invalid action: ${action}`);
}

export async function main(
  inputArgs: string[] = process.argv.slice(2),
  logger: Logger = globalThis.console
) {
  try {
    ensureKeyExists(undefined);
    ensureUsernameExists(undefined);

    const args = inputArgs.map((arg) => arg.trim());

    const appPlatformCommand = platformCommands.get(
      ensureValidPlatform(args[0])
    );
    if (!appPlatformCommand) {
      throw new BrowserStackError("Invalid platform");
    }

    const action = ensureValidAction(args[1]);
    await run(appPlatformCommand, action, args.slice(2), logger);
  } catch (err) {
    if (err instanceof Error) {
      logger.error(err.message);
    } else {
      logger.error(`An unexpected error occurred: ${err}`);
    }

    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
