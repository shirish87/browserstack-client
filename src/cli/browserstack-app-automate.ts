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

enum AppPlatform {
  flutter = "flutter",
  appium = "appium",
  espresso = "espresso",
  xcuitest = "xcuitest",
  detox = "detox",
}

enum AppAutomateAction {
  upload = "upload",
  get = "get",
  list = "list",
  delete = "delete",
}

/**
 * This class provides common functionality for interacting with the App Automate platform.
 *
 * @internal
 */
class AppPlatformCommand {
  readonly appPlatform: AppPlatform;
  readonly supportedActions: AppAutomateAction[];

  private readonly _implPlatformCommand: {
    list: (
      clientOptions: Partial<BrowserStackOptions>,
      args: string[]
    ) => Promise<components["schemas"]["AppAutomateApp"][]>;
    upload: (
      options: { filename: string } & (
        | { file: Blob; url?: never }
        | { url: string; file?: never }
      ),
      clientOptions: Partial<BrowserStackOptions>,
      args: string[]
    ) => Promise<components["schemas"]["AppAutomateApp"]>;
    get: (
      options: { appId: string },
      clientOptions: Partial<BrowserStackOptions>,
      args: string[]
    ) => Promise<components["schemas"]["AppAutomateApp"]>;
    delete: (
      options: { appId: string },
      clientOptions: Partial<BrowserStackOptions>,
      args: string[]
    ) => Promise<boolean>;
  };

  constructor(
    appPlatform: AppPlatform,
    supportedActions: AppAutomateAction[],
    platformRun: AppPlatformCommand["_implPlatformCommand"]
  ) {
    this.appPlatform = appPlatform;
    this.supportedActions = supportedActions;
    this._implPlatformCommand = platformRun;
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

    if (app?.app_url) {
      logger.info(`Uploaded successfully at ${app?.app_url}`);
    } else {
      logger.error(`Failed to upload app`, app);
    }
  }

  async get(
    options: Partial<BrowserStackOptions> & {
      appId: string;
    },
    args: string[],
    logger: Logger
  ) {
    const { appId, ...clientOptions } = options;
    const app = await this._implPlatformCommand.get(
      { appId: AppPlatformCommand.cleanAppId(appId) },
      clientOptions,
      args
    );

    this._logApp(app, logger);
  }

  async delete(
    options: Partial<BrowserStackOptions> & {
      appId: string;
    },
    args: string[],
    logger: Logger
  ) {
    const { appId, ...clientOptions } = options;
    const success = await this._implPlatformCommand.delete(
      { appId: AppPlatformCommand.cleanAppId(appId) },
      clientOptions,
      args
    );

    if (success) {
      logger.info(`Deleted successfully: ${appId}`);
    } else {
      logger.error(`Failed to delete app: ${appId}`);
    }
  }

  private _logApp(
    app: components["schemas"]["AppAutomateApp"],
    logger: Logger
  ) {
    logger.info(
      app.app_url,
      app.uploaded_at ? new Date(app.uploaded_at).toISOString() : "",
      app.app_name,
      app.app_version
    );
  }

  static cleanAppId(appId: string, urlProto = "bs://") {
    return appId.startsWith(urlProto) ? appId.replace(urlProto, "") : appId;
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

/**
 * Represents a command with actions for interacting with Flutter apps on BrowserStack App Automate.
 */
const flutterPlatformCommand = new AppPlatformCommand(
  AppPlatform.flutter,
  [
    AppAutomateAction.upload,
    AppAutomateAction.list,
    AppAutomateAction.get,
    AppAutomateAction.delete,
  ],
  {
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
        return client.getFlutterApp(FlutterPlatform.android, options.appId);
      }

      return client
        .getFlutterApp(FlutterPlatform.ios, options.appId)
        .then(transformFlutterTestPackageToApp);
    },
    delete: async (options, clientOptions, args) => {
      const client = new AppAutomateClient(clientOptions);
      const platform = ensureFlutterPlatform(
        args[0]?.toLowerCase?.()?.trim?.()
      );

      const result = await (platform === FlutterPlatform.android
        ? client.deleteFlutterApp(FlutterPlatform.android, options.appId)
        : client.deleteFlutterApp(FlutterPlatform.ios, options.appId));

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
  if (!app.custom_id) {
    return app;
  }

  const customId = app.app_id;

  return {
    ...app,
    app_id: app.custom_id,
    app_url: `bs://${app.custom_id}`,
    custom_id: customId,
  };
};

/**
 * Represents a command with actions for interacting with Appium apps on BrowserStack App Automate.
 */
const appiumPlatformCommand = new AppPlatformCommand(
  AppPlatform.appium,
  [
    AppAutomateAction.upload,
    AppAutomateAction.list,
    AppAutomateAction.get,
    AppAutomateAction.delete,
  ],
  {
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

      return client.getAppiumAppsByCustomId(options.appId).then((r) => {
        if (!r.length) {
          throw new BrowserStackError(
            `No app found with custom ID: ${options.appId}`
          );
        }

        return patchAppIdWithCustomId(r[0]);
      });
    },
    delete: async (options, clientOptions) => {
      const client = new AppAutomateClient(clientOptions);
      const [app] = await client.getAppiumAppsByCustomId(options.appId);
      // if custom_id is not found, use app_id
      const appId = app?.app_id ?? options.appId;
      const r = await client.deleteAppiumApp(appId);
      return r?.success === true;
    },
  }
);

/**
 * Represents a command with actions for interacting with Espresso apps on BrowserStack App Automate.
 */
const espressoPlatformCommand = new AppPlatformCommand(
  AppPlatform.espresso,
  [
    AppAutomateAction.upload,
    AppAutomateAction.list,
    AppAutomateAction.get,
    AppAutomateAction.delete,
  ],
  {
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
      return client.getEspressoApp(options.appId);
    },
    delete: async (options, clientOptions) => {
      const client = new AppAutomateClient(clientOptions);
      const r = await client.deleteEspressoApp(options.appId);
      return r?.success?.message?.length > 0;
    },
  }
);

/**
 * Represents a command with actions for interacting with XCUITest apps on BrowserStack App Automate.
 */
const xcuiTestPlatformCommand = new AppPlatformCommand(
  AppPlatform.xcuitest,
  [
    AppAutomateAction.upload,
    AppAutomateAction.list,
    AppAutomateAction.get,
    AppAutomateAction.delete,
  ],
  {
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
      return client.getXCUITestApp(options.appId);
    },
    delete: async (options, clientOptions) => {
      const client = new AppAutomateClient(clientOptions);
      const r = await client.deleteXCUITestApp(options.appId);
      return r?.success?.message?.length > 0;
    },
  }
);

/**
 * Represents a command with actions for interacting with Detox apps on BrowserStack App Automate.
 */
const detoxPlatformCommand = new AppPlatformCommand(
  AppPlatform.detox,
  [AppAutomateAction.upload],
  {
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

/**
 * Map that associates each AppPlatform with its corresponding AppPlatformCommand.
 */
const appPlatformCommands = new Map<AppPlatform, AppPlatformCommand>([
  [AppPlatform.flutter, flutterPlatformCommand],
  [AppPlatform.appium, appiumPlatformCommand],
  [AppPlatform.espresso, espressoPlatformCommand],
  [AppPlatform.xcuitest, xcuiTestPlatformCommand],
  [AppPlatform.detox, detoxPlatformCommand],
]);

/**
 * Runs the specified action for the given AppPlatformCommand.
 *
 * @param platformRun - The AppPlatformCommand to run.
 * @param action - The AppAutomateAction to perform.
 * @param args - The arguments for the action.
 * @param logger - The logger to use for logging.
 * @param platforms - The platforms to consider for URL upload.
 * @returns A promise that resolves when the action is completed.
 * @throws {BrowserStackError} If the action is invalid or if required parameters are missing.
 */
async function run(
  platformRun: AppPlatformCommand,
  action: AppAutomateAction,
  args: string[],
  logger: Logger = globalThis.console,
  platforms: string[] = ["android", "ios"]
) {
  if (!platformRun.supportedActions.includes(action)) {
    throw new BrowserStackError(
      `Invalid action: ${action} (valid actions: ${platformRun.supportedActions.join(
        ", "
      )})`
    );
  }

  switch (action) {
    case AppAutomateAction.upload: {
      const pathArg = args.shift();
      if (!pathArg) {
        throw new BrowserStackError("No file path or URL provided");
      }

      if (pathArg?.toLowerCase?.().startsWith?.("http")) {
        if (!args[0] || platforms.includes(args[0])) {
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
    case AppAutomateAction.list: {
      await platformRun.list({}, args, logger);
      break;
    }
    case AppAutomateAction.get: {
      await platformRun.get({ appId: args[0] }, args.slice(1), logger);
      break;
    }
    case AppAutomateAction.delete: {
      await platformRun.delete({ appId: args[0] }, args.slice(1), logger);
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
 * Ensures that the provided app platform is valid.
 *
 * @param inputAppPlatform - The app platform to validate.
 * @param validAppPlatforms - An array of valid app platforms. Defaults to all values of AppPlatform.
 * @returns The validated action.
 * @throws {BrowserStackError} If the action is invalid.
 *
 * @internal
 */
function ensureValidAppPlatform(
  inputAppPlatform: string | undefined
): AppPlatform {
  const action = inputAppPlatform?.toLowerCase?.()?.trim?.();
  if (action && appPlatformCommands.has(action as AppPlatform)) {
    return action as AppPlatform;
  }

  throw new BrowserStackError(`Invalid app platform: ${action}`);
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
  validActions = Object.values(AppAutomateAction)
): AppAutomateAction {
  const action = inputAction?.toLowerCase?.()?.trim?.();
  if (action && validActions.includes(action as AppAutomateAction)) {
    return action as AppAutomateAction;
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

    const appPlatformCommand = appPlatformCommands.get(
      ensureValidAppPlatform(args[0])
    );
    if (!appPlatformCommand) {
      throw new BrowserStackError("Invalid app platform");
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
