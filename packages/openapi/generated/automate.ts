export interface paths {
    "/automate/browsers.json": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Fetches all automate browsers.
         * Fetches all automate browsers.
         */
        get: operations["getAutomateBrowsers"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/automate/plan.json": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Automate plan details
         * Fetches Automate plan details
         */
        get: operations["getAutomatePlan"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/automate/sessions/{sessionId}/appiumlogs": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Fetches Appium logs for a session
         * Fetches Appium logs for a session. Raw Appium Logs for each session are available to you in text format.
         */
        get: operations["getAutomateSessionAppiumLogs"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/automate/projects/{projectId}/badge_key": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Fetches the badge key for the project
         * Fetches the badge key for sharing a public link for the Automate dashboard to view the latest build and sessions for that project
         */
        get: operations["getAutomateProjectBadgeKey"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/automate/sessions/{sessionId}/terminallogs": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Upload terminal logs for your session.
         * Upload terminal logs for your session.
         */
        post: operations["uploadAutomateSessionTerminalLogs"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/automate/builds": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /**
         * Delete multiple builds on the server
         * Delete multiple builds on the server. You can delete a maximum of 5 builds at a time. Builds once deleted cannot be recovered.
         */
        delete: operations["deleteAutomateBuilds"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/automate/sessions/{sessionId}.json": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Fetches a session
         * Fetches a session for a particular build
         */
        get: operations["getAutomateSession"];
        /**
         * Update session status or name
         * Set the status for a session or update the name of the session. You can mark test status as passed or failed along with a reason.
         */
        put: operations["updateAutomateSession"];
        post?: never;
        /**
         * Delete a session on the server
         * Delete a session on the server. Sessions once deleted cannot be recovered
         */
        delete: operations["deleteAutomateSession"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/automate/sessions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /**
         * Delete multiple sessions on the server
         * Delete multiple sessions on the server. Sessions once deleted cannot be recovered.
         */
        delete: operations["deleteAutomateSessions"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/automate/custom_media/delete/{mediaId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /**
         * Delete a media file earlier uploaded to BrowserStack
         * Delete a media file on the server. Media files once deleted cannot be recovered
         */
        delete: operations["deleteAutomateMediaFile"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/automate/builds/{buildId}.json": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Fetches a build
         * Fetches a build
         */
        get: operations["getAutomateBuild"];
        /**
         * Update the name or tag of your build
         * Update the name or tag of your build after the build is complete. To delete a build tag, simply pass an empty string as value for build_tag.
         */
        put: operations["updateAutomateBuild"];
        post?: never;
        /**
         * Delete a build on the server
         * Delete a build on the server. Please note that deleting a build will delete all the sessions contained within it. Builds once deleted cannot be recovered
         */
        delete: operations["deleteAutomateBuild"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/automate/sessions/{sessionId}/logs": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Fetches session logs
         * Fetches session logs. Whenever you execute a session on BrowserStack, a session log is generated. These logs are available to you in text format.
         */
        get: operations["getAutomateSessionLogs"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/automate/upload-media": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Upload a media file
         * Upload a media file you want to use in your tests
         */
        post: operations["uploadAutomateMediaFile"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/automate/recycle_key.json": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * Reset Automate access key
         * Reset Automate access key
         */
        put: operations["recycleAutomateKey"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/automate/builds/{buildId}/sessions.json": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Fetches list of sessions
         * Fetches list of sessions for a particular build
         */
        get: operations["getAutomateSessions"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/automate/projects/{projectId}.json": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Fetches a project
         * Specific information about a particular project can be queried using the project ID
         */
        get: operations["getAutomateProject"];
        /**
         * Update the name of your project
         * Update the name of your project after the project is complete
         */
        put: operations["updateAutomateProject"];
        post?: never;
        /**
         * Delete your project
         * Delete a project on the server using the DELETE method. Please note that to delete a project, it needs to be empty of builds and sessions, and projects once deleted cannot be recovered
         */
        delete: operations["deleteAutomateProject"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/automate/sessions/{sessionId}/seleniumlogs": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Fetches Selenium logs for a session
         * Fetches Selenium logs for a session. Raw Selenium logs for each session are available to you in text format.
         */
        get: operations["getAutomateSessionSeleniumLogs"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/automate/builds/{buildId}/terminallogs": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Upload terminal logs for your build.
         * Upload terminal logs for your build.
         */
        post: operations["uploadAutomateBuildTerminalLogs"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/automate/recent_media_files": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Fetches list of uploaded media files
         * Fetches list of recently uploaded media files
         */
        get: operations["getAutomateMediaFiles"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/automate/projects.json": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Fetches list of projects
         * Fetches list of projects associated with your username and access key. You will need the id of the project for invoking any other Project API that follows in this document
         */
        get: operations["getAutomateProjects"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/automate/sessions/{sessionId}/consolelogs": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Fetches console logs for a session
         * Fetches console logs for a session. Console logs are enabled by default and are set to errors. You can disable them or change verbosity options by using the browserstack.console capability to disabled, errors, warnings, info, verbose. Raw Console Logs for each session are available to you in text format.
         */
        get: operations["getAutomateSessionConsoleLogs"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/automate/sessions/{sessionId}/telemetrylogs": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Fetches telemetry logs for a session
         * Fetches telemetry logs for a session. Telemetry logs for a session are available for tests run using Selenium 4. Telemetry logs are by default disabled for a session.
         */
        get: operations["getAutomateSessionTelemetryLogs"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/automate/builds.json": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Fetches list of builds
         * Fetch the 10 recent test builds that have run on BrowserStack. You can also limit the number of builds and paginate through your data
         */
        get: operations["getAutomateBuilds"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/automate/sessions/{sessionId}/networklogs": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Fetches network logs for a session
         * Fetches network logs for a session. Network Logs for each session are available to you in HAR (HTTP Archive) format.
         */
        get: operations["getAutomateSessionNetworkLogs"];
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
        /** AutomateProjectWithBuilds */
        AutomateProjectWithBuilds: components["schemas"]["AutomateProject"] & {
            builds: components["schemas"]["AutomateBuild"][];
        };
        /** AutomateBuildContainer */
        AutomateBuildContainer: {
            automation_build: components["schemas"]["AutomateBuild"];
            sessions: components["schemas"]["AutomateSessionContainer"][];
        };
        /** AutomateSessionContainer */
        AutomateSessionContainer: {
            automation_session: components["schemas"]["AutomateSession"];
        };
        /** AutomateBuild */
        AutomateBuild: {
            /**
             * Name of your build
             * @example pricing_project_build
             */
            name: string;
            /**
             * Duration of build execution
             * @example 10
             */
            duration: number;
            /** @enum {string} */
            status: "running" | "timeout" | "failed" | "done";
            /**
             * Identifier for the user
             * @example 256454
             */
            user_id?: number;
            /**
             * Identifier for your account or group
             * @example 2
             */
            group_id?: number;
            /**
             * Identifier for a team in a group
             * @example 0
             */
            sub_group_id?: number;
            /**
             * ID of your project
             * @example 866256
             */
            automation_project_id?: number;
            /**
             * Hashed ID of the build
             * @example 4207442b2b0567368956dba064c22a3235a76214
             */
            hashed_id: string;
            /**
             * Tag for the build
             * @example pricing_project_build
             */
            build_tag: string;
            /**
             * Indicates whether the build is a delta build
             * @example false
             */
            delta?: boolean;
            /**
             * Framework used for the build
             * @example selenium
             */
            framework?: string;
            /** Test data used for the build */
            test_data?: {
                [key: string]: unknown;
            };
            /**
             * Time at which the project was created on BrowserStack servers
             * @example 2020-03-11T10:14:36.000Z
             */
            created_at?: string;
            /**
             * Time at which the project was updated on BrowserStack servers
             * @example 2020-09-18T09:45:57.000Z
             */
            updated_at?: string;
        };
        /** AutomateMediaFile */
        AutomateMediaFile: {
            /**
             * Name of the uploaded media file.
             * @example profile.png
             */
            media_name: string;
            /**
             * Unique identifier returned upon successful upload of your media file on BrowserStack. This value is used to specify the media files to be used in your tests.
             * @example media://90c7a8h8dc82308108734e9a46c24d8f01de12881
             */
            media_url: string;
            /**
             * Unique ID returned on successful upload of your media file on BrowserStack.
             * @example 90c7a8h8dc82308108734e9a46c24d8f01de12881
             */
            media_id: string;
            /**
             * Media upload timestamp.
             * @example 2021-10-13T10:30:00.000Z
             */
            uploaded_at: string;
        };
        /** AutomateProject */
        AutomateProject: {
            /**
             * ID of your project
             * @example 866256
             */
            id: number;
            /**
             * Name of your project
             * @example pricing_project
             */
            name: string;
            /**
             * Identifier for the user
             * @example 256454
             */
            user_id: number;
            /**
             * Identifier for your account or group
             * @example 2
             */
            group_id: number;
            /**
             * Identifier for a team in a group
             * @example 0
             */
            sub_group_id: number;
            /**
             * Time at which the project was created on BrowserStack servers
             * @example 2020-03-11T10:14:36.000Z
             */
            created_at: string;
            /**
             * Time at which the project was updated on BrowserStack servers
             * @example 2020-09-18T09:45:57.000Z
             */
            updated_at: string;
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
    getAutomateBrowsers: {
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
    getAutomatePlan: {
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
                    "application/json": components["schemas"]["AutomatePlan"];
                };
            };
            400: components["schemas"]["400.BadRequest"];
            401: components["schemas"]["401.Unauthorized"];
            404: components["schemas"]["404.NotFound"];
            422: components["schemas"]["422.UnprocessableEntity"];
            500: components["schemas"]["5xx.InternalServerError"];
        };
    };
    getAutomateSessionAppiumLogs: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** ID of your session */
                sessionId: string;
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
                    "text/plain": string;
                };
            };
            400: components["schemas"]["400.BadRequest"];
            401: components["schemas"]["401.Unauthorized"];
            404: components["schemas"]["404.NotFound"];
            422: components["schemas"]["422.UnprocessableEntity"];
            500: components["schemas"]["5xx.InternalServerError"];
        };
    };
    getAutomateProjectBadgeKey: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** ID of your project */
                projectId: number;
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
                    "text/plain": string;
                };
            };
            400: components["schemas"]["400.BadRequest"];
            401: components["schemas"]["401.Unauthorized"];
            404: components["schemas"]["404.NotFound"];
            422: components["schemas"]["422.UnprocessableEntity"];
            500: components["schemas"]["5xx.InternalServerError"];
        };
    };
    uploadAutomateSessionTerminalLogs: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** ID of your session */
                sessionId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "multipart/form-data": {
                    /**
                     * Format: binary
                     * Path to the terminal log file on your machine. The max allowed file size is 2MB
                     */
                    file: Blob;
                };
            };
        };
        responses: {
            /** Successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /**
                         * Message indicating upload result.
                         * @example File has been uploaded successfully!
                         */
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
    deleteAutomateBuilds: {
        parameters: {
            query: {
                /** IDs of your builds */
                "buildId[]": string[];
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
                         * Message indicating the deletion of the builds
                         * @example The following build(s) were deleted successfully: 83078c39baf5c12cbbfcbd26a788d05ddfad626c,55e9782d749f601d09571023f56a8f0101929428.
                         */
                        message?: string;
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
    getAutomateSession: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** ID of your session */
                sessionId: string;
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
                        automation_session: components["schemas"]["AutomateSession"];
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
    updateAutomateSession: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** ID of your session */
                sessionId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /**
                     * Status of the session
                     * @example passed
                     * @enum {string}
                     */
                    status: "passed" | "failed";
                    /**
                     * Reason for marking the session as failed
                     * @example Test failed because of assertion error
                     */
                    reason: string;
                } | {
                    /**
                     * Name of the session
                     * @example Pricing Demo
                     */
                    name: string;
                };
            };
        };
        responses: {
            /** Successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        automation_session: components["schemas"]["AutomateSession"];
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
    deleteAutomateSession: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** ID of your session */
                sessionId: string;
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
                         * Status of deletion
                         * @example ok
                         */
                        status?: string;
                        /**
                         * Message indicating the deletion of the session
                         * @example Session 4207442b2b0567368956dba064c22a3235a76214 was deleted successfully.
                         */
                        message?: string;
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
    deleteAutomateSessions: {
        parameters: {
            query: {
                /** IDs of your sessions */
                "sessionId[]": string[];
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
                         * Message indicating the deletion of the sessions
                         * @example The following session(s) were deleted successfully: 83078c39baf5c12cbbfcbd26a788d05ddfad626c,55e9782d749f601d09571023f56a8f0101929428.
                         */
                        message?: string;
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
    deleteAutomateMediaFile: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** ID of your media file */
                mediaId: string;
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
                         * Status of deletion
                         * @example true
                         */
                        success: boolean;
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
    getAutomateBuild: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** ID of your build */
                buildId: string;
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
                        /** AutomateBuildContainer */
                        build: {
                            automation_build: components["schemas"]["AutomateBuild"];
                            sessions: components["schemas"]["AutomateSessionContainer"][];
                        };
                    };
                };
            };
            400: components["schemas"]["400.BadRequest"];
            401: components["schemas"]["401.Unauthorized"];
            403: components["schemas"]["403.Forbidden"];
            404: components["schemas"]["404.NotFound"];
            422: components["schemas"]["422.UnprocessableEntity"];
            500: components["schemas"]["5xx.InternalServerError"];
        };
    };
    updateAutomateBuild: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** ID of your build */
                buildId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /**
                     * The new build name that you want to set. Accepted characters are A-Z, a-z, 0-9, ., :, -, [], /, @, &, ', _. Character limit is 255.
                     * @example Selenium test
                     */
                    name?: string;
                    /**
                     * The new build tag that you want to set
                     * @example registration
                     */
                    build_tag?: string;
                };
            };
        };
        responses: {
            /** Successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        automation_build: components["schemas"]["AutomateBuild"];
                    } | {
                        /**
                         * Error message
                         * @example A build with this name already exists.
                         */
                        error: string;
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
    deleteAutomateBuild: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** ID of your build */
                buildId: string;
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
                         * Status of deletion
                         * @example ok
                         */
                        status?: string;
                        /**
                         * Message indicating the deletion of the build
                         * @example Build a4fb480a55efd6b3c558afb1ee051a7c337b8ef0 was deleted successfully.
                         */
                        message?: string;
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
    getAutomateSessionLogs: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** ID of your session */
                sessionId: string;
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
                    "text/plain": string;
                };
            };
            400: components["schemas"]["400.BadRequest"];
            401: components["schemas"]["401.Unauthorized"];
            404: components["schemas"]["404.NotFound"];
            422: components["schemas"]["422.UnprocessableEntity"];
            500: components["schemas"]["5xx.InternalServerError"];
        };
    };
    uploadAutomateMediaFile: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "multipart/form-data": {
                    /**
                     * Format: binary
                     * Path to the media file on your machine. Note: You can upload up to 10 media files on the BrowserStack server. By default, we delete the uploaded files after 30 days from the date of upload.
                     */
                    file: Blob;
                };
            };
        };
        responses: {
            /** Successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /**
                         * Unique identifier returned upon successful upload of your media file on BrowserStack. This value is used to specify the media files to be used in your tests.
                         * @example media://90c7a8h8dc82308108734e9a46c24d8f01de12881
                         */
                        media_url: string;
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
    recycleAutomateKey: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": Record<string, never>;
            };
        };
        responses: {
            /** Successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @example mkALWJIMwtzJOqyqONyq */
                        old_key: string;
                        /** @example OQMCfsukIHWoNSOWAqkv */
                        new_key: string;
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
    getAutomateSessions: {
        parameters: {
            query?: {
                /** Specify the number of results to be displayed. The default value is 10, and the maximum value is 100 */
                limit?: number;
                /** Retrieve sessions from a specific point using the offset parameter */
                offset?: number;
                /** Status of the session */
                status?: "running" | "timeout" | "failed" | "done";
            };
            header?: never;
            path: {
                /** ID of your build */
                buildId: string;
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
                    "application/json": components["schemas"]["AutomateSessionContainer"][];
                };
            };
            400: components["schemas"]["400.BadRequest"];
            401: components["schemas"]["401.Unauthorized"];
            404: components["schemas"]["404.NotFound"];
            422: components["schemas"]["422.UnprocessableEntity"];
            500: components["schemas"]["5xx.InternalServerError"];
        };
    };
    getAutomateProject: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** ID of your project */
                projectId: number;
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
                        project: components["schemas"]["AutomateProjectWithBuilds"];
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
    updateAutomateProject: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** ID of your project */
                projectId: number;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /**
                     * Name of your project
                     * @example pricing_project
                     */
                    name: string;
                };
            };
        };
        responses: {
            /** Successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AutomateProject"];
                };
            };
            400: components["schemas"]["400.BadRequest"];
            401: components["schemas"]["401.Unauthorized"];
            404: components["schemas"]["404.NotFound"];
            422: components["schemas"]["422.UnprocessableEntity"];
            500: components["schemas"]["5xx.InternalServerError"];
        };
    };
    deleteAutomateProject: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** ID of your project */
                projectId: number;
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
                         * Status of the operation
                         * @example ok
                         */
                        status?: string;
                        /**
                         * Message indicating the status of the operation
                         * @example Project 966019 was deleted successfully.
                         */
                        message?: string;
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
    getAutomateSessionSeleniumLogs: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** ID of your session */
                sessionId: string;
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
                    "text/plain": string;
                };
            };
            400: components["schemas"]["400.BadRequest"];
            401: components["schemas"]["401.Unauthorized"];
            404: components["schemas"]["404.NotFound"];
            422: components["schemas"]["422.UnprocessableEntity"];
            500: components["schemas"]["5xx.InternalServerError"];
        };
    };
    uploadAutomateBuildTerminalLogs: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** ID of your build */
                buildId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "multipart/form-data": {
                    /**
                     * Format: binary
                     * Path to the terminal log file on your machine. The max allowed file size is 2MB
                     */
                    file: Blob;
                };
            };
        };
        responses: {
            /** Successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /**
                         * Message indicating upload result.
                         * @example File has been uploaded successfully!
                         */
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
    getAutomateMediaFiles: {
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
                    "application/json": components["schemas"]["AutomateMediaFile"][];
                };
            };
            400: components["schemas"]["400.BadRequest"];
            401: components["schemas"]["401.Unauthorized"];
            404: components["schemas"]["404.NotFound"];
            422: components["schemas"]["422.UnprocessableEntity"];
            500: components["schemas"]["5xx.InternalServerError"];
        };
    };
    getAutomateProjects: {
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
                    "application/json": components["schemas"]["AutomateProject"][];
                };
            };
            400: components["schemas"]["400.BadRequest"];
            401: components["schemas"]["401.Unauthorized"];
            404: components["schemas"]["404.NotFound"];
            422: components["schemas"]["422.UnprocessableEntity"];
            500: components["schemas"]["5xx.InternalServerError"];
        };
    };
    getAutomateSessionConsoleLogs: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** ID of your session */
                sessionId: string;
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
                    "text/plain": string;
                };
            };
            400: components["schemas"]["400.BadRequest"];
            401: components["schemas"]["401.Unauthorized"];
            404: components["schemas"]["404.NotFound"];
            422: components["schemas"]["422.UnprocessableEntity"];
            500: components["schemas"]["5xx.InternalServerError"];
        };
    };
    getAutomateSessionTelemetryLogs: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** ID of your session */
                sessionId: string;
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
                    "application/octet-stream": unknown;
                };
            };
            400: components["schemas"]["400.BadRequest"];
            401: components["schemas"]["401.Unauthorized"];
            404: components["schemas"]["404.NotFound"];
            422: components["schemas"]["422.UnprocessableEntity"];
            500: components["schemas"]["5xx.InternalServerError"];
        };
    };
    getAutomateBuilds: {
        parameters: {
            query?: {
                /** ID of your project */
                projectId?: number;
                /** Specify the number of results to be displayed. The default value is 10, and the maximum value is 100 */
                limit?: number;
                /** Retrieve builds from a specific point using the offset parameter */
                offset?: number;
                /** Status of the build */
                status?: "running" | "timeout" | "failed" | "done";
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
                        automation_build: components["schemas"]["AutomateBuild"];
                    }[];
                };
            };
            400: components["schemas"]["400.BadRequest"];
            401: components["schemas"]["401.Unauthorized"];
            404: components["schemas"]["404.NotFound"];
            422: components["schemas"]["422.UnprocessableEntity"];
            500: components["schemas"]["5xx.InternalServerError"];
        };
    };
    getAutomateSessionNetworkLogs: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** ID of your session */
                sessionId: string;
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
                    "application/json": Record<string, never>;
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
