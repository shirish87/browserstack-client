export interface paths {
    "/local/v1/list": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Fetches list of recent binary instances
         * Fetches list of recent binary instances for local testing. Note that the binary should have been started with the --enable-logging-for-api parameter.
         */
        get: operations["getLocalBinaryInstances"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/local/v1/{localInstanceId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Fetches details of a Local binary instance
         * Fetches details of a Local binary instance used for local testing. Note that the binary should have been started with the --enable-logging-for-api parameter.
         */
        get: operations["getLocalBinaryInstance"];
        put?: never;
        post?: never;
        /**
         * Disconnect a Local binary instance
         * Disconnect a Local binary instance
         */
        delete: operations["disconnectLocalBinaryInstance"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        /** Bad request. */
        "400.BadRequest": unknown;
        /** Your BrowserStack access credentials are invalid. */
        "401.Unauthorized": unknown;
        /** Authorized user is not the owner of the resource. */
        "403.Forbidden": unknown;
        /** The requested resource could not be found. */
        "404.NotFound": unknown;
        /** Request is well-formed but has semantic errors. The response will provide more details about error. */
        "422.UnprocessableEntity": unknown;
        /** Indicates an error with BrowserStack servers. */
        "5xx.InternalServerError": unknown;
        /** Browser */
        Browser: {
            /** @example Chrome */
            browser: string;
            /** @example 80.0 */
            browser_version: string;
        };
        /** BrowserDevice */
        BrowserDevice: components["schemas"]["Browser"] & {
            /** @example Android Browser */
            browser?: string;
            devices: string[];
            real_devices: string[];
        };
        /** BrowserList */
        BrowserList: components["schemas"]["BrowserPlatform"][];
        /** BrowserMapWindows */
        BrowserMapWindows: {
            [key: string]: components["schemas"]["BrowserPlatform"][];
        };
        /** BrowserMapOSX */
        BrowserMapOSX: {
            [key: string]: components["schemas"]["BrowserPlatform"][];
        };
        /** BrowserMapWinPhone */
        BrowserMapWinPhone: {
            [key: string]: components["schemas"]["BrowserDevice"][];
        };
        /** BrowserMapAndroid */
        BrowserMapAndroid: {
            [key: string]: components["schemas"]["BrowserRealDevice"][];
        };
        /** BrowserMap */
        BrowserMap: {
            Windows?: components["schemas"]["BrowserMapWindows"];
            "OS X"?: components["schemas"]["BrowserMapOSX"];
            winphone?: components["schemas"]["BrowserMapWinPhone"];
            android?: components["schemas"]["BrowserMapAndroid"];
        };
        /** BrowserPlatform */
        BrowserPlatform: components["schemas"]["Browser"] & {
            /** @example Windows */
            os: string;
            /** @example 10 */
            os_version: string;
            /** @example null */
            device?: string;
            /** @example null */
            real_mobile?: boolean;
        };
        /** BrowserRealDevice */
        BrowserRealDevice: components["schemas"]["Browser"] & {
            /** @example Android Browser */
            browser?: string;
            devices: string[];
            real_devices: string[];
        };
        /** NewWorker */
        NewWorker: {
            /**
             * URL to be opened in the browser
             * @example https://www.google.com/ncr
             */
            url: string;
            /**
             * Time in seconds before the worker is terminated. The default value is 300 seconds and the minimum value is 60 seconds. IMPORTANT: Irrespective of the timeout parameter, a browser worker is alive for a maximum time of 1800 seconds.
             * @example 300
             */
            timeout?: number;
            /**
             * Operating system name.
             * @example Windows
             */
            os: string;
            /**
             * Operating system version.
             * @example 10
             */
            os_version: string;
            /**
             * Name of the worker.
             * @example qunit-test-pricing
             */
            name?: string;
            /**
             * Name of the build the session is running under.
             * @example staging-build
             */
            build?: string;
            /**
             * Name of the project the build is organized under.
             * @example pricing-project
             */
            project?: string;
            /**
             * Enable video recording for the session. The default value is false.
             * @example true
             */
            "browserstack.video"?: boolean;
            /**
             * Set the resolution of VM before the beginning of your test. Available for Desktop only. The default value is 1024x768.
             * @example 1024x768
             */
            resolution?: string;
        } & ({
            /**
             * Browser name.
             * @example Chrome
             */
            browser: string;
            /**
             * Browser version.
             * @example 80.0
             */
            browser_version: string;
        } | {
            /**
             * Device name. If a device is not provided it defaults to the first device available for that os version.
             * @example iPhone 11 Pro
             */
            device?: string;
            /**
             * Browser name.
             * @example Chrome
             */
            browser?: string;
            /**
             * Browser version.
             * @example 80.0
             */
            browser_version?: string;
        });
        /** AutomatePlan */
        AutomatePlan: {
            /**
             * Specifies your Automate plan name
             * @example Automate Mobile
             */
            automate_plan: string;
            /**
             * Terminal access level
             * @example Public
             */
            terminal_access?: string;
            /**
             * Number of parallel sessions currently running
             * @example 0
             */
            parallel_sessions_running: number;
            /**
             * Maximum number of parallel sessions you can run
             * @example 0
             */
            parallel_sessions_max_allowed: number;
            /**
             * Maximum number of parallel sessions allowed in a team
             * @example 250
             */
            team_parallel_sessions_max_allowed: number;
            /**
             * Number of sessions currently queued
             * @example 10
             */
            queued_sessions: number;
            /**
             * Maximum number of sessions that can be queued
             * @example 240
             */
            queued_sessions_max_allowed: number;
        };
        /** AutomateSession */
        AutomateSession: components["schemas"]["BrowserPlatform"] & {
            /**
             * Hashed ID of the session
             * @example 4207442b2b0567368956dba064c22a3235a76214
             */
            hashed_id: string;
            /**
             * Name of your session
             * @example pricing_project_build
             */
            name: string;
            /**
             * Duration of session execution
             * @example 10
             */
            duration: number;
            /**
             * Status of the session
             * @enum {string}
             */
            status: "running" | "timeout" | "failed" | "done";
            /** Execution status of the session */
            browserstack_status: string;
            /**
             * Reason for test status
             * @example CLIENT_STOPPED_SESSION
             */
            reason: string;
            /**
             * Name of the build
             * @example pricing_project_build
             */
            build_name: string;
            /**
             * Name of the project
             * @example pricing_project
             */
            project_name: string;
            /**
             * Link to the session logs
             * @example https://automate.browserstack.com/builds/5343932818f9330c5d2b5c72aaf9dd8fde77b428/sessions/550709149fe79e949363b581e774d5ebffa1b8fe/logs
             */
            logs: string;
            /**
             * URL to view the session on Automate dashboard
             * @example https://automate.browserstack.com/builds/5343932818f9330c5d2b5c72aaf9dd8fde77b428/sessions/550709149fe79e949363b581e774d5ebffa1b8fe
             */
            browser_url: string;
            /**
             * URL to view the session publicly
             * @example https://automate.browserstack.com/builds/5343932818f9330c5d2b5c72aaf9dd8fde77b428/sessions/550709149fe79e949363b581e774d5ebffa1b8fe?auth_token=01df4e51ba67eb743484a08b024a44601a2ae0399c5c011a68d9564147be1387
             */
            public_url: string;
            /**
             * URL to view the Appium logs
             * @example https://api.browserstack.com/automate/builds/5343932818f9330c5d2b5c72aaf9dd8fde77b428/sessions/550709149fe79e949363b581e774d5ebffa1b8fe/appiumlogs
             */
            appium_logs_url: string;
            /**
             * URL to view session video
             * @example https://automate.browserstack.com/sessions/550709149fe79e949363b581e774d5ebffa1b8fe/video
             */
            video_url: string;
            /**
             * URL to view browser console logs
             * @example https://automate.browserstack.com/s3-upload/bs-selenium-logs-aps/s3.ap-south-1/550709149fe79e949363b581e774d5ebffa1b8fe/550709149fe79e949363b581e774d5ebffa1b8fe-console-logs-v2.txt
             */
            browser_console_logs_url: string;
            /**
             * URL to view browser logs
             * @example https://automate.browserstack.com/s3-upload/bs-selenium-logs-euw/s3.eu-west-1/550709149fe79e949363b581e774d5ebffa1b8fe/550709149fe79e949363b581e774d5ebffa1b8fe-har-logs.txt
             */
            har_logs_url: string;
            /**
             * URL to view selenium logs
             * @example https://automate.browserstack.com/s3-upload/bs-selenium-logs-euw/s3.eu-west-1/550709149fe79e949363b581e774d5ebffa1b8fe/550709149fe79e949363b581e774d5ebffa1b8fe-selenium-logs.txt
             */
            selenium_logs_url: string;
            /**
             * URL to view telemetry logs if it is enabled in your Selenium 4 session
             * @example https://automate.browserstack.com/s3-upload/bs-selenium-logs-euw/s3.eu-west-1/550709149fe79e949363b581e774d5ebffa1b8fe/550709149fe79e949363b581e774d5ebffa1b8fe-selenium-logs.txt
             */
            selenium_telemetry_logs_url: string;
            /**
             * Timestamp at which the session started executing
             * @example 2020-03-11T10:14:36.000Z
             */
            created_at: string;
        };
        /** Status */
        Status: {
            /** @example 10 */
            used_time: number;
            /** @example 0 */
            running_sessions: number;
            /** @example 0 */
            session_limit: number;
            /** @example Unlimited Testing Time */
            total_available_time: string;
        };
        /** Worker */
        Worker: components["schemas"]["BrowserPlatform"] & {
            /**
             * ID of the worker.
             * @example 122326697
             */
            id: number;
            /**
             * ID of the session.
             * @example 550709149fe79e949363b581e774d5ebffa1b8fe
             */
            sessionId?: string;
            /**
             * Current status of the worker.
             * @example running
             * @enum {string}
             */
            status?: "queue" | "running";
            /**
             * Dashboard URL of the session
             * @example
             */
            browser_url?: string;
        };
        /** LocalBinaryInstance */
        LocalBinaryInstance: {
            /**
             * Unique identifier for the Local instance.
             * @example QUERTY1
             */
            id: string;
            /**
             * User account that started the Local instance.
             * @example john@browserstack.com
             */
            email: string;
            /**
             * Hostname for the machine running the Local instance.
             * @example my-local-box
             */
            hostname?: string;
            /**
             * Timestamp at which the Local instance was last active.
             * @example 2013-03-14 16:25:45 UTC
             */
            lastActiveOn: string;
            /**
             * Timestamp at which the Local instance was started.
             * @example 2013-03-14 16:25:45 UTC
             */
            startTime: string;
            /**
             * Timestamp at which the Local instance was terminated.
             * @example 2013-03-14 16:25:45 UTC
             */
            endTime?: string;
            /**
             * Reason for termination of the Local instance.
             * @example User terminated the instance.
             */
            disconnectReason?: string;
            /**
             * Command line parameters used to start the Local instance.
             * @example --key <access_key> --enable-logging-for-api --local-identifier <local_identifier>
             */
            commandLineParams?: string;
            /**
             * Identifier for the Local instance.
             * @example 4207442b2b0567368956dba064c22a3235a76214
             */
            localIdentifier: string;
            /**
             * Public IP address of the machine running the Local instance.
             * @example 8.8.4.4
             */
            "public-IP"?: string;
            /**
             * @example [
             *       "127.0.0.1",
             *       "10.100.100.1"
             *     ]
             */
            privateIP?: string[];
        };
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    getLocalBinaryInstances: {
        parameters: {
            query: {
                auth_token: string;
                last?: number;
                state?: "running" | "all";
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** Successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /**
                         * API version
                         * @example v1
                         */
                        api_version: string;
                        /** Metadata */
                        meta_data: {
                            /** Parameters */
                            params?: {
                                [key: string]: unknown;
                            };
                        } & {
                            [key: string]: unknown;
                        };
                        instances: components["schemas"]["LocalBinaryInstance"][];
                    };
                };
            };
            400: components["schemas"]["400.BadRequest"];
            401: components["schemas"]["401.Unauthorized"];
            404: components["schemas"]["404.NotFound"];
            422: components["schemas"]["422.UnprocessableEntity"];
            500: components["schemas"]["5xx.InternalServerError"];
        };
    };
    getLocalBinaryInstance: {
        parameters: {
            query: {
                auth_token: string;
            };
            header?: never;
            path: {
                localInstanceId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** Successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /**
                         * API version
                         * @example v1
                         */
                        api_version: string;
                        /** Metadata */
                        meta_data: {
                            /** Parameters */
                            params?: {
                                [key: string]: unknown;
                            };
                        } & {
                            [key: string]: unknown;
                        };
                        instances: components["schemas"]["LocalBinaryInstance"][];
                    };
                };
            };
            400: components["schemas"]["400.BadRequest"];
            401: components["schemas"]["401.Unauthorized"];
            404: components["schemas"]["404.NotFound"];
            422: components["schemas"]["422.UnprocessableEntity"];
            500: components["schemas"]["5xx.InternalServerError"];
        };
    };
    disconnectLocalBinaryInstance: {
        parameters: {
            query: {
                auth_token: string;
            };
            header?: never;
            path: {
                localInstanceId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** Successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /**
                         * API version
                         * @example v1
                         */
                        api_version: string;
                        /** Metadata */
                        meta_data: {
                            /** Parameters */
                            params?: {
                                [key: string]: unknown;
                            };
                        } & {
                            [key: string]: unknown;
                        };
                        /** QUERTY1 successfully disconnected */
                        message: string;
                    };
                };
            };
            400: components["schemas"]["400.BadRequest"];
            401: components["schemas"]["401.Unauthorized"];
            404: components["schemas"]["404.NotFound"];
            422: components["schemas"]["422.UnprocessableEntity"];
            500: components["schemas"]["5xx.InternalServerError"];
        };
    };
}
