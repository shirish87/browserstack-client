import { env } from "@/env.ts";
import { BrowserStackError } from "@/error.ts";
import {
  binaryPath,
  currentOSArch,
  dirExists,
  fileExists,
  saveFile,
} from "@/fs-utils.ts";
import {
  LocalTestingBinaryOptions,
  ProxyParams,
} from "@/local-testing-binary-options.ts";
import { LocalTestingClient } from "@/local-testing.ts";
import cp from "node:child_process";
import { randomBytes } from "node:crypto";

export type {
  LocalBinaryFlags,
  LocalBinaryFolderTestingFlags,
  LocalBinaryServerTestingFlags,
  LocalTestingBinaryOptions,
  ProxyParams
} from "@/local-testing-binary-options.ts";

/**
 * Represents a client for interacting with the BrowserStack Local binary and APIs.
 * Extends features of {@link LocalTestingClient} for the node.js runtime.
 * Download, spawn, and control the BrowserStack Local binary.
 * @public
 *
 * @example
 * ```ts
 * const localTesting = new BrowserStack.LocalTestingBinary({ key: "my-key" });
 * await localTesting.start();
 * console.log(localTesting.state); // "started"
 * console.log(localTesting.pid); // 12345
 * await localTesting.stop();
 * console.log(localTesting.state); // "stopped"
 * console.log(localTesting.pid); // undefined
 * ```
 */
export class LocalTestingBinary extends LocalTestingClient {
  readonly localIdentifier: string;

  private readonly child: { pid?: number; args: string[] } = {
    pid: undefined,
    args: [],
  };

  readonly commandTimeoutMs: number;

  readonly binHome: string;

  /**
   * The last state of the BrowserStackLocal daemon command.
   * @public
   */
  state: "stopped" | "starting" | "started" | "stopping" = "stopped";

  /**
   * Constructs a new instance of the ScreenshotsClient class.
   * @param options - Optional configuration options for the client.
   */
  constructor(
    /* @internal */
    private readonly options?: LocalTestingBinaryOptions
  ) {
    super(options);

    const localIdentifier =
      options?.localIdentifier ??
      env.BROWSERSTACK_LOCAL_ID?.trim?.() ??
      randomBytes(16).toString("hex");

    if (typeof localIdentifier !== "string" || !localIdentifier.trim().length) {
      throw new BrowserStackError("Missing options.localIdentifier.id");
    }

    this.localIdentifier = localIdentifier;
    this.commandTimeoutMs = options?.commandTimeoutMs ?? 10_000;
    this.binHome = this.getBinHome();
  }

  /**
   * Retrieves the version of the local testing binary.
   * @returns A promise that resolves to the version string.
   */
  async version(): Promise<string> {
    const binFilePath = await this.ensureBinaryExists();

    return new Promise((resolve, reject) => {
      const child = cp.spawnSync(binFilePath, ["--version"], {
        timeout: this.commandTimeoutMs,
        cwd: this.binHome,
        windowsHide: true,
      });

      const data = child.stdout?.toString?.("utf8")?.trim?.();
      const version = data?.match(/\s+version\s+(.*)$/i)?.[1]?.trim();
      if (typeof version === "string") {
        return resolve(version);
      }

      const error = child.stderr?.toString?.("utf8")?.trim?.();
      reject(
        new BrowserStackError(
          `Failed to get version: ${error ?? data} (status=${child.status})`
        )
      );
    });
  }

  /**
   * Starts the BrowserStackLocal daemon.
   *
   * @returns A promise that resolves to a string if the binary starts successfully, or undefined if there is an error.
   */
  async start(): Promise<string | undefined> {
    let result: string | undefined = undefined;

    await this.runDaemonCommand({
      action: "start",
      initialState: "starting",
      successState: "started",
      isSuccess: (_, state, message) => {
        const isSuccess = state === "connected";
        result ??= message;
        return isSuccess;
      },
    }).catch((err) => {
      if (result) {
        // propagate the error message from the binary if any
        Object.assign(err, { message: result });
      }

      throw err;
    });

    return result;
  }

  /**
   * Stops the BrowserStackLocal daemon.
   *
   * @returns A promise that resolves to a string if the daemon stops successfully, or undefined otherwise.
   */
  async stop(): Promise<string | undefined> {
    let result: string | undefined;

    await this.runDaemonCommand({
      action: "stop",
      initialState: "stopping",
      successState: "stopped",
      isSuccess: (_, state, message) => {
        // BrowserStackLocal stopped successfully
        result ??= message;

        const isSuccess =
          state === "success" &&
          message?.toLowerCase?.()?.includes?.("stopped successfully") === true;

        return isSuccess;
      },
    }).catch((err) => {
      if (result) {
        // propagate the error message from the binary if any
        Object.assign(err, { message: result });
      }

      throw err;
    });

    return result;
  }

  /**
   * @internal
   */
  private async runDaemonCommand(
    command: {
      action: "start" | "stop";
      initialState: "starting" | "stopping";
      successState: "started" | "stopped";
      isSuccess: (
        data: Record<string, unknown>,
        state?: string,
        message?: string
      ) => boolean;
    },
    commandTimeoutMs: number = this.commandTimeoutMs,
    binHome: string = this.binHome
  ): Promise<void> {
    const previousState = {
      state: this.state,
      pid: this.child.pid,
      args: this.child.args,
    };

    // all branches must reset state to "failureState" on error
    const raiseError = (err: Error) => {
      // running of this command request failed
      // reset to previous state
      this.state = previousState.state;
      this.child.pid = previousState.pid;
      this.child.args = previousState.args;

      throw err;
    };

    const binFilePath = await this.ensureBinaryExists().catch(raiseError);

    const binArgs = await LocalTestingBinary.resolveArgs(
      this.authToken,
      this.localIdentifier,
      command.action,
      this.options
    );

    return new Promise<void>((resolve, reject) => {
      this.state = command.initialState;

      const child = cp.spawnSync(binFilePath, binArgs, {
        timeout: commandTimeoutMs,
        cwd: binHome,
        windowsHide: true,
      });

      if (child.error) {
        return reject(new BrowserStackError(child.error.message, child.error));
      }

      const data = child.stdout?.toString?.("utf8")?.trim?.();
      if (data) {
        try {
          const r = JSON.parse(data);
          if (r && typeof r === "object") {
            const { state, message } = this.parseOutput(r);

            if (command.isSuccess(r, state, message)) {
              this.state = command.successState;

              if (command.action === "start") {
                this.child.pid = r.pid ?? child.pid;
                // remove --key
                this.child.args = binArgs.slice(2);
              } else if (command.action === "stop") {
                this.child.pid = undefined;
                this.child.args = [];
              }

              return resolve();
            }
          }
        } catch {
          // non-JSON output from binary is unexpected
        }
      }

      const error = child.stderr?.toString?.("utf8")?.trim?.();
      if (error) {
        try {
          const r = JSON.parse(error);
          if (r && typeof r === "object") {
            const { state, message } = this.parseOutput(r);

            if (message) {
              return reject(new BrowserStackError(`${message} state=${state}`));
            }
          }
        } catch {
          // non-JSON output from binary is unexpected
        }
      }

      return reject(new BrowserStackError(error ?? data));
    }).catch(raiseError);
  }

  /**
   * @internal
   */
  private static async resolveArgs(
    key: string,
    localIdentifier: string,
    daemonModeAction: "start" | "stop",
    binaryFlags?: LocalTestingBinaryOptions
  ): Promise<string[]> {
    if (typeof key !== "string" || !key.trim().length) {
      throw new BrowserStackError("Required: key");
    }

    if (typeof localIdentifier !== "string" || !localIdentifier.trim().length) {
      throw new BrowserStackError("Required: localIdentifier");
    }

    const args = [
      "--key",
      key.trim(),
      "--local-identifier",
      localIdentifier.trim(),
      "--daemon",
      daemonModeAction,
    ];

    if (!binaryFlags) {
      return args;
    }

    const addRootCAParams = async ({ rootCA }: ProxyParams<number>) => {
      if (rootCA && "useSystem" in rootCA && rootCA.useSystem === true) {
        args.push("--use-system-installed-ca");
      }

      if (
        rootCA &&
        "path" in rootCA &&
        rootCA.path &&
        (await fileExists(rootCA.path))
      ) {
        args.push("--use-ca-certificate", rootCA.path);
      }
    };

    // --force is pointless in daemon mode as it will kill all instances of the binary anyway
    // if (this.options?.localIdentifier?.force === true) {
    //   args.push("--force");
    // }

    if (binaryFlags?.disableAPILogging !== true) {
      args.push("--enable-logging-for-api");
    }

    if (binaryFlags.forceLocal === true) {
      args.push("--force-local");
    } else if (binaryFlags.only) {
      const only = binaryFlags.only.map(
        ({ host, port, ssl }) => `${host},${port},${ssl ? 1 : 0}`
      );

      args.push("--only", only.join(","));
    }

    if ("folder" in binaryFlags && (await dirExists(binaryFlags.folder))) {
      args.push("--folder", binaryFlags.folder);
    } else if ("localProxy" in binaryFlags && binaryFlags.localProxy) {
      const {
        host,
        port,
        auth: { username, password } = {
          username: undefined,
          password: undefined,
        },
      } = binaryFlags.localProxy;

      args.push("--local-proxy-host", host.trim());

      if (port) {
        args.push("--local-proxy-port", `${port}`);
      }

      if (username && password) {
        args.push("--local-proxy-user", username.trim());
        args.push("--local-proxy-pass", password.trim());
      }

      await addRootCAParams(binaryFlags.localProxy);
    }

    const proxy = binaryFlags?.proxy;
    if (proxy) {
      if (typeof proxy === "string") {
        // pac-file
        if (await fileExists(proxy)) {
          args.push("--proxy-pac", proxy);
        } else {
          throw new BrowserStackError(`Invalid proxy pac file: ${proxy}`);
        }
      } else {
        const {
          host,
          port,
          auth: { username, password } = {
            username: undefined,
            password: undefined,
          },
          force,
        } = proxy;

        args.push("--proxy-host", host.trim());

        if (port) {
          args.push("--proxy-port", `${port}`);
        }

        if (username && password) {
          args.push("--proxy-user", username.trim());
          args.push("--proxy-pass", password.trim());
        }

        if (force) {
          args.push("--force-proxy");
        }

        await addRootCAParams(proxy);
      }
    }

    if (binaryFlags.onlyAutomate === true) {
      args.push("--only-automate");
    }

    if (binaryFlags.debug) {
      const { level, logFile } = binaryFlags.debug;
      if (level) {
        args.push("--verbose", `${level}`);
      }

      if (logFile) {
        args.push("--log-file", logFile);
      }
    }

    if (binaryFlags.timeout) {
      args.push("--timeout", `${binaryFlags.timeout}`);
    }

    if (binaryFlags.parallelRuns) {
      args.push("--parallel-runs", `${binaryFlags.parallelRuns}`);
    }

    if (binaryFlags.hosts) {
      const { include, exclude } = binaryFlags.hosts;

      if (Array.isArray(include) && include.length) {
        args.push("--include-hosts", ...include);
      }

      if (Array.isArray(exclude) && exclude.length) {
        args.push("--exclude-hosts", ...exclude);
      }
    }

    return args.concat(binaryFlags.more ?? []);
  }

  get pid(): number | undefined {
    return this.child?.pid;
  }

  get args(): string[] {
    return this.child?.args ? Array.from(this.child?.args) : [];
  }

  /**
   * @internal
   */
  private parseOutput(r: Record<string, unknown>) {
    let state: string | undefined;
    let pid: string | undefined;
    let message: string | undefined;

    if (typeof r.status === "string") {
      state = r.status.trim();
    }

    if (typeof r.state === "string") {
      // let state=connected override status=success if it exists
      state = r.state.trim();
    }

    if (typeof r.pid === "string") {
      pid = r.pid.trim();
    }

    if ("message" in r && r.message) {
      if (typeof r.message === "string") {
        message = r.message.trim();
      } else if (typeof r.message === "object") {
        // {"state":"connected","pid":52107,"message":{"message":"Connected"}}
        message =
          "message" in r.message && typeof r.message.message === "string"
            ? r.message.message.trim()
            : undefined;
      }
    }

    return { state, pid, message };
  }

  /**
   * @internal
   */
  private getBinHome(): string {
    const binHome = this.options?.binHome ?? env.BROWSERSTACK_LOCAL_BINARY_PATH;
    if (typeof binHome !== "string" || !binHome.trim().length) {
      throw new BrowserStackError("Missing options.binHome");
    }

    return binHome.trim();
  }

  /**
   * @internal
   */
  private async ensureBinaryExists(): Promise<string> {
    try {
      const binPath = await binaryPath(this.binHome);
      if (await fileExists(binPath)) {
        return binPath;
      }
    } catch (err) {
      // expected err = ENOENT: no such file or directory, lstat <file>
    }

    const osArch = await currentOSArch();
    if (!osArch) {
      throw new BrowserStackError(`Unsupported platform: ${osArch}`);
    }

    try {
      const { content, filename } = await this.downloadBinary(osArch);
      return await saveFile(this.binHome, filename, content, 0o755);
    } catch (err) {
      if (err instanceof BrowserStackError) {
        throw err;
      } else if (err instanceof Error) {
        throw new BrowserStackError(
          `Failed to download binary: ${err.message}`,
          err
        );
      }

      throw new BrowserStackError(`Failed to download binary: ${err}`);
    }
  }
}
