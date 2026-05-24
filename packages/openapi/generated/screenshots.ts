export interface paths {
    "/screenshots/{jobId}.json": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Fetches a screenshot job
         * Fetches a screenshot job
         */
        get: operations["getScreenshotsJob"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/screenshots": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Take a screenshot
         * Take a screenshot of a website on a particular browser
         */
        post: operations["createScreenshotsJob"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/screenshots/browsers.json": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Fetches list of browsers
         * Fetches list of browsers supported by Screenshots API
         */
        get: operations["getScreenshotsBrowsers"];
        put?: never;
        post?: never;
        delete?: never;
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
        /** NewScreenshot */
        NewScreenshot: {
            browsers: {
                /** @example Chrome */
                browser?: string;
                /** @example 80.0 */
                browser_version?: string;
                /** @example Windows */
                os: string;
                /** @example 10 */
                os_version: string;
                /**
                 * Required if you want to test on a mobile device.
                 * @example null
                 */
                device?: string;
            }[];
            /**
             * Screen orientation for a mobile device. Default: portrait
             * @enum {string}
             */
            orientation?: "portrait" | "landscape";
            /** @example https://nextjs-template.vercel.app/ */
            url: string;
            /** Public URL to which the screenshot will be posted. */
            callback_url?: string;
            /**
             * Sceen resolution of the Windows machine. Values: 1024x768, 1280x1024. Default: 1024x768
             * @example 1024x768
             */
            win_res?: string;
            /**
             * Sceen resolution of the Mac machine. Values: 1024x768, 1280x960, 1280x1024, 1600x1200, 1920x1080. Default: 1024x768
             * @example 1024x768
             */
            mac_res?: string;
            /**
             * Quality of the screenshot. Default: Compressed
             * @enum {string}
             */
            quality?: "Compressed" | "Original";
            /** Set to true if URL is local and a Local Testing connection has been set up. Default: false */
            local?: boolean;
            /**
             * Time in seconds to wait before taking the screenshot. Default: 5
             * @example 5
             */
            wait_time?: number;
        };
        /** NewScreenshotsJob */
        NewScreenshotsJob: components["schemas"]["ScreenshotsJobBase"] & {
            /**
             * Unique identifier for the screenshot job.
             * @example 4207442b2b0567368956dba064c22a3235a76214
             */
            job_id: string;
        };
        /** Screenshot */
        Screenshot: components["schemas"]["ScreenshotBase"] & ({
            /** @example iPhone 4S (6.0) */
            device: string;
            /** @example Chrome */
            browser?: string;
            /** @example 80.0 */
            browser_version?: string;
        } | {
            /** @example Chrome */
            browser: string;
            /** @example 80.0 */
            browser_version: string;
        }) & {
            /**
             * URL to view the screenshot
             * @example https://www.browserstack.com/screenshots/13b93a14db22872fcb5fd1c86b730a51197db319/winxp_ie_7.0.png
             */
            image_url?: string;
            /**
             * URL to view the thumbnail of the screenshot
             * @example https://www.browserstack.com/screenshots/13b93a14db22872fcb5fd1c86b730a51197db319/thumb_winxp_ie_7.0.jpg
             */
            thumb_url?: string;
            /**
             * Timestamp at which the screenshot was taken
             * @example 2013-03-14 16:25:45 UTC
             */
            created_at?: string;
        };
        /** ScreenshotBase */
        ScreenshotBase: {
            /**
             * ID for the screenshot
             * @example be9989892cbba9b9edc2c95f403050aa4996ac6a
             */
            id: string;
            /** @enum {string} */
            state: "processing" | "pending" | "done" | "failed";
            /** @example https://nextjs-template.vercel.app/ */
            url: string;
            /** @example Windows */
            os: string;
            /** @example 10 */
            os_version: string;
        };
        /** ScreenshotsJob */
        ScreenshotsJob: components["schemas"]["ScreenshotsJobBase"] & {
            /**
             * Unique identifier for the screenshot job.
             * @example 4207442b2b0567368956dba064c22a3235a76214
             */
            id: string;
            /**
             * State of the screenshot job.
             * @example done
             * @enum {string}
             */
            state?: "queued_all" | "done";
        };
        /** ScreenshotsJobBase */
        ScreenshotsJobBase: {
            /**
             * Unique identifier for the screenshot job.
             * @example 4207442b2b0567368956dba064c22a3235a76214
             */
            job_id?: string;
            /**
             * Public URL to which the screenshot will be posted.
             * @example https://callback.example.com
             */
            callback_url?: string;
            /**
             * Sceen resolution of the Windows machine. Values: 1024x768, 1280x1024. Default: 1024x768
             * @example 1024x768
             */
            win_res?: string;
            /**
             * Sceen resolution of the Mac machine. Values: 1024x768, 1280x960, 1280x1024, 1600x1200, 1920x1080. Default: 1024x768
             * @example 1024x768
             */
            mac_res?: string;
            /**
             * Quality of the screenshot. Default: Compressed
             * @enum {string}
             */
            quality?: "Compressed" | "Original";
            /**
             * Time in seconds to wait before taking the screenshot. Default: 5
             * @example 5
             */
            wait_time?: number;
            /**
             * Screen orientation for a mobile device. Default: portrait
             * @enum {string}
             */
            orientation?: "portrait" | "landscape";
            screenshots?: components["schemas"]["Screenshot"][];
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
    getScreenshotsJob: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** ID of your screenshot job */
                jobId: string;
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
                    "application/json": components["schemas"]["ScreenshotsJob"];
                };
            };
            400: components["schemas"]["400.BadRequest"];
            401: components["schemas"]["401.Unauthorized"];
            404: components["schemas"]["404.NotFound"];
            422: components["schemas"]["422.UnprocessableEntity"];
            500: components["schemas"]["5xx.InternalServerError"];
        };
    };
    createScreenshotsJob: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["NewScreenshot"];
            };
        };
        responses: {
            /** Successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NewScreenshotsJob"];
                };
            };
            400: components["schemas"]["400.BadRequest"];
            401: components["schemas"]["401.Unauthorized"];
            404: components["schemas"]["404.NotFound"];
            422: components["schemas"]["422.UnprocessableEntity"];
            500: components["schemas"]["5xx.InternalServerError"];
        };
    };
    getScreenshotsBrowsers: {
        parameters: {
            query?: never;
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
                    "application/json": components["schemas"]["BrowserList"];
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
