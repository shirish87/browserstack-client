import { BrowserStackOptions } from "@/api-client.ts";
import { env } from "@/env.ts";
import { BrowserStackError } from "@/error.ts";
import {
  binaryPath,
  dirExists,
  ensureDirExists,
  fileExists,
} from "@/fs-utils.ts";
import { LocalTestingClient } from "@/local-testing.ts";
import { spawnSync } from "node:child_process";
import { randomBytes } from "node:crypto";

export type LocalTestingBinaryOptions = Omit<BrowserStackOptions, "username"> &
  LocalBinaryFlags & {
    binHome?: string;
    disableLogging?: boolean;
    commandTimeoutMs?: number;
  };

/**
 * Represents a client for interacting with the BrowserStack Local binary and APIs.
 * Download, spawn, and control the BrowserStack Local binary.
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

  readonly child: { pid?: number; args: string[] } = {
    pid: undefined,
    args: [],
  };

  readonly commandTimeoutMs: number;

  state: "stopped" | "starting" | "started" | "stopping" = "stopped";

  /**
   * Constructs a new instance of the ScreenshotsClient class.
   * @param options - Optional configuration options for the client.
   */
  constructor(private readonly options?: LocalTestingBinaryOptions) {
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
  }

  async version(
    commandTimeoutMs: number = this.commandTimeoutMs
  ): Promise<string> {
    const binHome = await ensureDirExists(this.getBinHome());
    const binFilePath = await binaryPath(binHome);

    return new Promise((resolve, reject) => {
      const child = spawnSync(binFilePath, ["--version"], {
        timeout: commandTimeoutMs,
        cwd: binHome,
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
    commandTimeoutMs: number = this.commandTimeoutMs
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

    const binHome = await ensureDirExists(this.getBinHome()).catch(raiseError);
    const binFilePath = await binaryPath(binHome).catch(raiseError);
    const binArgs = await LocalTestingBinary.resolveArgs(
      this.authToken,
      this.localIdentifier,
      command.action,
      this.options
    );

    return new Promise<void>((resolve, reject) => {
      this.state = command.initialState;

      const child = spawnSync(binFilePath, binArgs, {
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

    if (binaryFlags?.disableLogging !== true) {
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

  private getBinHome(): string {
    const binHome = this.options?.binHome ?? env.BROWSERSTACK_LOCAL_BINARY_PATH;
    if (typeof binHome !== "string" || !binHome.trim().length) {
      throw new BrowserStackError("Missing options.binHome");
    }

    return binHome.trim();
  }
}

// export interface LocalIdentifierFlags {
//   /**
//    * Unique string for BrowserStack to uniquely identify each binary.
//    * You will need to specify the same string in Automate tests as well.
//    *
//    * local-identifier
//    */
//   id: string;

//   /**
//    * Using this option kills all other instances of BrowserStack Local binary running
//    * on this machine with the same --local-identifier options.
//    *
//    * NOTE: This option will NOT affect binaries running in remote servers and instances
//    * running with different --local-identifier options.
//    *
//    * force
//    */
//   force?: boolean;
// }

export interface BaseLocalBinaryFlags {
  /**
   * If you are behind corporate proxy setup, please specify your proxy host using this option.
   * proxy-* flags
   *
   * pac-file: Use a PAC file to configure the proxy if value is a string file path.
   * Note that this path needs to be present on the local machine.
   */
  proxy?: (ProxyParams<3128> | string) & {
    /**
     * Routes all traffic via the proxy specified - otherwise,
     * binary tries to connect directly as well for better performance.
     *
     * force-proxy
     */
    force?: boolean;
  };

  /**
   * Restrict BrowserStackLocal Binary access to few local servers and/or folders.
   * This flag limits the set of domains that your Local tunnel will resolve for your tests.
   * Regex is not supported, multiple entries are supported.
   * This flag is used to restrict the scope of URLs which the Local Binary can connect to,
   * typically for security and compliance purposes.
   *
   * Usage: host1,port1,ssl?,host2,port2,ssl?.
   * Example: localhost,8000,0,abc.example.com,8080,1
   *
   * NOTE: This flag is rendered useless when paired with --force-local
   * Please use --include-hosts or --exclude-hosts depending on your use-case.
   */
  only?: OnlyParam[];

  /**
   * This option restricts Binary usage to Automate product, and it cannot be used for Live/Screenshot testing.
   */
  onlyAutomate?: boolean;

  /**
   * Run multiple copies of the BrowserStackLocal binary (for better performance or other reasons)
   */
  localIdentifier?: string;

  /**
   * Starts or stop the binary as a daemon. Accepts only 2 commands: start, stop.
   * Start will start binary in background. Primarily used in Continous Integration server scripts.
   */
  daemon?: boolean;

  /**
   * Number of (X) minutes in order to auto close the local binary connections (with BrowserStack servers)
   * after X minutes of inactivity.
   *
   * NOTE: There should be no traffic flowing through binary during this period of X.
   * This flag will only work with local binary as of now.
   */
  timeout?: number;

  /**
   * Include this option to make sure this binary is exposed to Local API for debugging.
   * For more information refer to https://www.browserstack.com/local-testing#local-api-debugging
   *
   * Default: true
   * enable-logging-for-api
   */
  // apiLogging?: boolean;

  /**
   * Specify the number of parallel runs.
   */
  parallelRuns?: number;

  /**
   * Route all traffic via machine where BrowserStackLocal Binary is running.
   * Local tries to fetch public URLs directly, unless this option is specified.
   */
  forceLocal?: boolean;

  /**
   * Granular control over URLs accessible through tunnel.
   */
  hosts?: {
    /**
     * Granular control over the URLs that you want to tightly bind to your tunnel. Wildcards are supported.
     * You can also include specific IPs or IP ranges (subnet)
     * @example ["myinternalwebsite.*" ".*.browserstack.com"]
     * @example ["127.0.0.1" "8.8.8.8"]
     * @example ["255.255.255.252/30"]
     * include-hosts
     */
    include?: string[];

    /**
     * Granular control over the URLs that you want to disallow from your tunnel. Wildcards are supported.
     * This flag supersedes hosts.include
     * You can also include specific IPs or IP ranges (subnet)
     * @example [".*.google.com"]
     * @example ["127.0.0.1" "8.8.8.8"]
     * @example ["255.255.255.252/30"]
     * exclude-hosts
     */
    exclude?: string[];
  };

  debug?: {
    /**
     * Sets the level of logging required.
     * Set 1 to debug issues related to setting up connections.
     * Set 2 for logs related to network information.
     * Set 3 to dump all communication to local servers for each request and response.
     * Default: 1
     * verbose
     */
    level?: 1 | 2 | 3;

    /**
     * Logs all the output to the file specified.
     * log-file
     */
    logFile?: string;
  };

  /**
   * Addtionally, you can pass any other flags that are supported by the BrowserStackLocal binary.
   */
  more?: string[];
}

export interface LocalBinaryFolderTestingFlags {
  /**
   * Specify the absolute path to the Local folder to be used for testing.
   * This option is to be used when testing a local folder.
   *
   * @example /home/ubuntu/mysite/
   */
  folder: string;
}

export interface LocalBinaryServerTestingFlags {
  /**
   * If your local server is behind a proxy or you are using a proxy to log all communication to your local servers
   * local-proxy-* flags
   */
  localProxy?: ProxyParams<8081> & {
    /**
     * Test local HTTPS servers which are behind a proxy (in addition to port 443).
     *
     * NOTE: should not include port 443
     */
    httpsPorts?: number[];
  };
}

export interface ProxyParams<DefaultProxyPort extends number> {
  // proxy-* flags
  host: string;
  port?: number | DefaultProxyPort; // default: 3128

  // As of now, only HTTP Basic authentication is supported.
  auth?: {
    username: string;
    password: string;
  };

  rootCA?:
    | {
        /**
         * You can pass your corporate SSL root certificates of the system proxy server
         * to mark same as trusted in binary. To be used when running from Mac/Linux machines.
         * This flag automatically retrieves certificates from the keychain and
         * does not require a certificate file path.
         *
         * use-system-installed-ca
         */
        useSystem: boolean;
      }
    | {
        /**
         * You can pass the path to your corporate SSL root certificates of the system proxy server
         * to mark same as trusted in binary.
         *
         * use-ca-certificate
         */
        path: string;
      };
}

export interface OnlyParam {
  host: string;
  port: number;
  ssl?: boolean; // => 0 or 1
}

export type LocalBinaryFlags = BaseLocalBinaryFlags &
  (LocalBinaryFolderTestingFlags | LocalBinaryServerTestingFlags);
