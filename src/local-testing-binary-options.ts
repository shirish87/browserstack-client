import { BrowserStackOptions } from "@/api-client.ts";

export type LocalTestingBinaryOptions = Omit<BrowserStackOptions, "username"> &
  LocalBinaryFlags & {
    binHome?: string;

    /**
     * @default true
     */
    disableAPILogging?: boolean;

    /**
     * @default 10000
     */
    commandTimeoutMs?: number;
  };

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
