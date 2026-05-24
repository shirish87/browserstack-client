export interface paths {
    "/app-automate/builds/{buildId}.json": {
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
        get: operations["getAppAutomateBuild"];
        /**
         * Update the tag of your build
         * Update the tag of your build after the build is complete. To delete a build tag, simply pass an empty string as value for build_tag.
         */
        put: operations["updateAppAutomateBuild"];
        post?: never;
        /**
         * Delete a build on the server
         * Delete a build on the server. Please note that deleting a build will delete all the sessions contained within it. Builds once deleted cannot be recovered
         */
        delete: operations["deleteAppAutomateBuild"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/app-automate/recent_media_files/{customId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Fetches list of uploaded media files by custom ID
         * Fetches list of recently uploaded media files by custom ID
         */
        get: operations["getAppAutomateMediaFilesByCustomId"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/app-automate/builds/{buildId}/sessions/{sessionId}/logs": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Fetches session logs
         * Access the logs for the session in textual format. It includes information about the test session’s desired capabilities and detailed information about every request and response. You can view all the steps executed in the test and troubleshoot errors for any failed steps.
         */
        get: operations["getAppAutomateSessionLogs"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/app-automate/recent_apps": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Fetches list of uploaded apps
         * Fetches list of recently uploaded apps
         */
        get: operations["getAppAutomateApps"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/app-automate/recent_group_media": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Fetches list of uploaded media files for the entire group
         * Fetches list of recently uploaded media files for the entire group
         */
        get: operations["getAppAutomateGroupMediaFiles"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/app-automate/xcuitest/v2/apps/{appId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get details of an uploaded XCUITest app
         * Get details of an uploaded XCUITest app
         */
        get: operations["getAppAutomateXCUITestApp"];
        put?: never;
        post?: never;
        /**
         * Delete a XCUITest app that was previously uploaded to BrowserStack
         * Delete an app that was previously uploaded to BrowserStack. Note that apps once deleted cannot be recovered.
         */
        delete: operations["deleteAppAutomateXCUITestApp"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/app-automate/builds/{buildId}/sessions/{sessionId}/networklogs": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Fetches network logs
         * Access the network logs for your session. These logs capture network data such as network traffic, latency, HTTP requests/responses in the HAR (HTTP Archive) format. You can identify any performance bottlenecks or debug failed REST API responses. Network logs are disabled by default.
         */
        get: operations["getAppAutomateNetworkLogs"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/app-automate/builds/{buildId}/terminallogs": {
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
        post: operations["uploadAppAutomateBuildTerminalLogs"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/app-automate/flutter-integration-tests/v2/android/app": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Upload an app
         * Upload the application under test (AUT) for Flutter testing.
         */
        post: operations["uploadAppAutomateFlutterAndroidApp"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/app-automate/detox/v2/android/app": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Upload an app
         * Upload the application under test (AUT) for Detox Android testing.
         */
        post: operations["uploadAppAutomateDetoxAndroidApp"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/app-automate/xcuitest/v2/apps": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Fetches list of uploaded XCUITest apps
         * Fetches list of recently uploaded XCUITest apps
         */
        get: operations["getAppAutomateXCUITestApps"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/app-automate/sessions/{sessionId}/terminallogs": {
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
        post: operations["uploadAppAutomateSessionTerminalLogs"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/app-automate/plan.json": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get App Automate plan details
         * Fetches App Automate plan details
         */
        get: operations["getAppAutomatePlan"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/app-automate/flutter-integration-tests/v2/ios/test-package": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Upload a Flutter test package for iOS
         * Upload the application under test (AUT) for Flutter iOS testing in .zip format.
         */
        post: operations["uploadAppAutomateFlutteriOSApp"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/app-automate/detox/v2/android/app-client": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Upload an app client
         * Upload the app client under test for Detox Android testing.
         */
        post: operations["uploadAppAutomateDetoxAndroidAppClient"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/app-automate/xcuitest/v2/app": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Upload an app
         * Upload the application under test (AUT) for XCUITest testing.
         */
        post: operations["uploadAppAutomateXCUITestApp"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/app-automate/projects/{projectId}.json": {
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
        get: operations["getAppAutomateProject"];
        /**
         * Update the name of your project
         * Update the name of your project after the project is complete
         */
        put: operations["updateAppAutomateProject"];
        post?: never;
        /**
         * Delete your project
         * Delete a project on the server using the DELETE method. Please note that to delete a project, it needs to be empty of builds and sessions, and projects once deleted cannot be recovered
         */
        delete: operations["deleteAppAutomateProject"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/app-automate/devices.json": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get a list of supported Android and iOS devices
         * Fetches list of devices supported by App Automate
         */
        get: operations["getAppAutomateDevices"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/app-automate/builds/{buildId}/sessions/{sessionId}/appiumlogs": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Fetches Appium logs
         * Access the Appium logs for your session. These are logs generated by the Appium server and contain the details about your each Appium command execution in the test session. You can troubleshoot any errors in case your test session failed.
         */
        get: operations["getAppAutomateAppiumLogs"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/app-automate/app/delete/{appId}": {
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
         * Delete an app that was previously uploaded to BrowserStack
         * Delete an app that was previously uploaded to BrowserStack. Note that apps once deleted cannot be recovered.
         */
        delete: operations["deleteAppAutomateApp"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/app-automate/flutter-integration-tests/v2/android/apps/{appId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get details of an uploaded Flutter app
         * Get details of an uploaded Flutter app
         */
        get: operations["getAppAutomateFlutterAndroidApp"];
        put?: never;
        post?: never;
        /**
         * Delete a Flutter app that was previously uploaded to BrowserStack
         * Delete an app that was previously uploaded to BrowserStack. Note that apps once deleted cannot be recovered.
         */
        delete: operations["deleteAppAutomateFlutterAndroidApp"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/app-automate/upload-media": {
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
        post: operations["uploadAppAutomateMediaFile"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/app-automate/espresso/v2/apps": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Fetches list of uploaded Espresso apps
         * Fetches list of recently uploaded Espresso apps
         */
        get: operations["getAppAutomateEspressoApps"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/app-automate/builds/{buildId}/sessions/{sessionId}/appprofiling/v2": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Fetches app profiling data v2
         * Access the detailed app profling metrics such as installed app size, UI rendering metrics, resource consumption metrics, etc.
         */
        get: operations["getAppAutomateAppProfilingDataV2"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/app-automate/sessions/{sessionId}.json": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Fetches a session
         * Get details of a test session including its status and debugging information such as Appium logs and test video recording
         */
        get: operations["getAppAutomateSession"];
        /**
         * Update session status
         * Set the status for a session. You can mark test status as passed or failed along with a reason.
         */
        put: operations["updateAppAutomateSession"];
        post?: never;
        /**
         * Delete a session on the server
         * Delete a session on the server. Sessions once deleted cannot be recovered
         */
        delete: operations["deleteAppAutomateSession"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/app-automate/projects.json": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Retrieve a list of recent projects for your BrowserStack group
         * Fetch the last 10 projects or your BrowserStack group. You can also limit the number of projects and paginate through your data
         */
        get: operations["getAppAutomateProjects"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/app-automate/custom_media/delete/{mediaId}": {
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
         * Fetches list of uploaded media files for the entire group
         * Fetches list of recently uploaded media files for the entire group
         */
        delete: operations["deleteAppAutomateMediaFile"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/app-automate/espresso/v2/apps/{appId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get details of an uploaded Espresso app
         * Get details of an uploaded Espresso app
         */
        get: operations["getAppAutomateEspressoApp"];
        put?: never;
        post?: never;
        /**
         * Delete a Espresso app that was previously uploaded to BrowserStack
         * Delete an app that was previously uploaded to BrowserStack. Note that apps once deleted cannot be recovered.
         */
        delete: operations["deleteAppAutomateEspressoApp"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/app-automate/recent_media_files": {
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
        get: operations["getAppAutomateMediaFiles"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/app-automate/flutter-integration-tests/v2/ios/test-packages": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Fetches list of uploaded Flutter iOS test packages
         * Fetches list of recently uploaded Flutter iOS test packages
         */
        get: operations["getAppAutomateFlutteriOSApps"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/app-automate/upload": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Upload an app
         * Upload the application under test (AUT) for Appium testing.
         */
        post: operations["uploadAppAutomateApp"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/app-automate/recent_group_apps": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Fetches list of uploaded apps for the entire group
         * Fetches list of recently uploaded apps for the entire group
         */
        get: operations["getAppAutomateGroupApps"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/app-automate/espresso/v2/app": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Upload an app
         * Upload the application under test (AUT) for Espresso testing.
         */
        post: operations["uploadAppAutomateEspressoApp"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/app-automate/recent_apps/{customId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Fetches list of uploaded apps by custom ID
         * Fetches list of uploaded apps by custom ID
         */
        get: operations["getAppAutomateAppsByCustomId"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/app-automate/flutter-integration-tests/v2/android/apps": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Fetches list of uploaded Flutter apps
         * Fetches list of recently uploaded Flutter apps
         */
        get: operations["getAppAutomateFlutterAndroidApps"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/app-automate/builds/{buildId}/sessions/{sessionId}/devicelogs": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Fetches device logs
         * Access the device logs for your session. These are system logs specific to your application generated by the OS(Android/iOS) and can be helpful for debugging any application crashes during test execution.
         */
        get: operations["getAppAutomateDeviceLogs"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/app-automate/builds/{buildId}/sessions/{sessionId}/appprofiling": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Fetches app profiling data
         * Access the app profiling logs to view the resource consumption (CPU, memory, battery, and network) by your app on the device. The logs are only available for Android.
         */
        get: operations["getAppAutomateAppProfilingDataV1"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/app-automate/builds.json": {
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
        get: operations["getAppAutomateBuilds"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/app-automate/flutter-integration-tests/v2/ios/test-package/{appId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get details of an uploaded Flutter iOS test package
         * Get details of an uploaded Flutter iOS test package
         */
        get: operations["getAppAutomateFlutteriOSApp"];
        put?: never;
        post?: never;
        /**
         * Delete a Flutter iOS test package that was previously uploaded to BrowserStack
         * Delete a Flutter iOS test package that was previously uploaded to BrowserStack. Note that apps once deleted cannot be recovered.
         */
        delete: operations["deleteAppAutomateFlutteriOSApp"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/app-automate/projects/{projectId}/badge_key": {
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
        get: operations["getAppAutomateProjectBadgeKey"];
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
        /** AppAutomateProjectWithBuilds */
        AppAutomateProjectWithBuilds: components["schemas"]["AutomateProject"] & {
            builds: components["schemas"]["AutomateBuild"][];
        };
        /** AppAutomateBuildWrap */
        AppAutomateBuildWrap: {
            automation_build: components["schemas"]["AutomateBuild"];
        };
        /** AppAutomateBuildContainer */
        AppAutomateBuildContainer: {
            automation_build: components["schemas"]["AutomateBuild"];
            sessions: components["schemas"]["AppAutomateSessionContainer"][];
        };
        /** AppAutomateSessionContainer */
        AppAutomateSessionContainer: {
            automation_session: components["schemas"]["AutomateSession"];
        };
        /** AppAutomateApp */
        AppAutomateApp: {
            /**
             * Unique ID returned on successful upload of your app on BrowserStack.
             * @example 90c7a8h8dc82308108734e9a46c24d8f01de12881
             */
            app_id?: string;
            /**
             * Unique identifier returned upon successful upload of your app on BrowserStack. This value can be used later to specify the application under test in your Appium test scripts.
             * @example media://90c7a8h8dc82308108734e9a46c24d8f01de12881
             */
            app_url: string;
            /**
             * Name of the app file uploaded.
             * @example app-release.apk
             */
            app_name?: string;
            /**
             * Version of the app.
             * @example 1.0.0
             */
            app_version?: string;
            /**
             * Timestamp of the app file upload.
             * @example 2021-09-30T10:00:00.000Z
             */
            uploaded_at?: string;
            /**
             * Timestamp of the app file expiry.
             * @example 2021-09-30T10:00:00.000Z
             */
            expiry?: string;
            /**
             * Custom ID defined for the uploaded app. Accepted characters are A-Z, a-z, 0-9, ., -, _. All other characters are ignored. Character limit is 100.
             * @example media_1
             */
            custom_id?: string;
            /**
             * Shareable ID allows other users in your organization to test an app you uploaded.
             * @example steve/SampleApp
             */
            shareable_id?: string;
        };
        /** AppAutomateDevice */
        AppAutomateDevice: {
            /** @example ios */
            os: string;
            /** @example 14 */
            os_version: string;
            /** @example iPad Pro 12.9 2021 */
            device: string;
            /** @example true */
            real_mobile: boolean;
        };
        /** AppAutomateMediaFile */
        AppAutomateMediaFile: {
            /**
             * Unique ID returned on successful upload of your media file on BrowserStack.
             * @example 90c7a8h8dc82308108734e9a46c24d8f01de12881
             */
            media_id: string;
            /**
             * Unique identifier returned upon successful upload of your media file on BrowserStack. This value is used to specify the media files to be used in your tests.
             * @example media://90c7a8h8dc82308108734e9a46c24d8f01de12881
             */
            media_url: string;
            /**
             * Name of the media file uploaded.
             * @example media.jpg
             */
            media_name?: string;
            /**
             * Timestamp of the media file upload.
             * @example 2021-09-30T10:00:00.000Z
             */
            uploaded_at?: string;
            /**
             * Custom ID of the media file uploaded. Accepted characters are A-Z, a-z, 0-9, ., -, _. All other characters are ignored. Character limit is 100.
             * @example media_1
             */
            custom_id?: string;
            /**
             * Shareable ID allows members of other teams to use the media files in their tests.
             * @example steve/SampleMedia
             */
            shareable_id?: string;
        };
        /** AppAutomateAppProfilingV1 */
        AppAutomateAppProfilingV1: {
            timestamp?: string;
            cpu_usage?: number;
            memory_usage?: number;
            battery_level?: number;
            network_received?: number;
            network_sent?: number;
        };
        /** AppAutomateAppProfilingV2 */
        AppAutomateAppProfilingV2: {
            timestamp?: string;
            cpu_usage?: number;
            memory_usage?: number;
            battery_level?: number;
            network_received?: number;
            network_sent?: number;
            app_size_installed?: number;
            ui_rendering?: number;
        };
        /** AppAutomateSessionAppDetails */
        AppAutomateSessionAppDetails: {
            /**
             * Package name of the app
             * @example com.sample.loginapplication
             */
            app_name?: string;
            app_version?: string;
            app_url?: string;
            app_custom_id?: string;
            uploaded_at?: string;
        };
        /** AppAutomateSession */
        AppAutomateSession: components["schemas"]["AutomateSession"] & {
            app_details: components["schemas"]["AppAutomateSessionAppDetails"];
        };
        /** AppAutomateTestPackage */
        AppAutomateTestPackage: {
            /**
             * Unique ID returned on successful upload of your app on BrowserStack.
             * @example 90c7a8h8dc82308108734e9a46c24d8f01de12881
             */
            test_package_id?: string;
            /**
             * Unique identifier returned upon successful upload of your app on BrowserStack. This value can be used later to specify the application under test in your Appium test scripts.
             * @example media://90c7a8h8dc82308108734e9a46c24d8f01de12881
             */
            test_package_url: string;
            /**
             * Name of the media file uploaded.
             * @example media.zip
             */
            test_package_name?: string;
            /**
             * Timestamp of the media file upload.
             * @example 2021-09-30T10:00:00.000Z
             */
            uploaded_at?: string;
            /**
             * Custom ID defined for the uploaded app. Accepted characters are A-Z, a-z, 0-9, ., -, _. All other characters are ignored. Character limit is 100.
             * @example media_1
             */
            custom_id?: string;
            /**
             * Shareable ID allows other users in your organization to test an app you uploaded.
             * @example steve/SampleApp
             */
            shareable_id?: string;
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
            /** Public URL of the build */
            public_url: string;
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
    getAppAutomateBuild: {
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
                        build: components["schemas"]["AppAutomateBuildContainer"];
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
    updateAppAutomateBuild: {
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
                     * The new build tag that you want to set
                     * @example registration
                     */
                    build_tag: string;
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
    deleteAppAutomateBuild: {
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
    getAppAutomateMediaFilesByCustomId: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** Filter recently uploaded media files by custom ID. */
                customId: string;
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
                    "application/json": components["schemas"]["AppAutomateMediaFile"][] | {
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
    getAppAutomateSessionLogs: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** ID of your build */
                buildId: string;
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
    getAppAutomateApps: {
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
                    "application/json": components["schemas"]["AppAutomateApp"][] | {
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
    getAppAutomateGroupMediaFiles: {
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
                    "application/json": components["schemas"]["AppAutomateMediaFile"][] | {
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
    getAppAutomateXCUITestApp: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** App ID of your app */
                appId: string;
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
                        app: components["schemas"]["AppAutomateApp"];
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
    deleteAppAutomateXCUITestApp: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** ID of your uploaded app */
                appId: string;
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
                        /** AppDeleteSuccessMessage */
                        success: {
                            /**
                             * Indicates whether deletion was success or a failure.
                             * @example App with url bs://231e820c35ee15b8438ec31df1fb689c03abd8e5 was deleted.
                             */
                            message: string;
                        };
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
    getAppAutomateNetworkLogs: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** ID of your build */
                buildId: string;
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
    uploadAppAutomateBuildTerminalLogs: {
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
    uploadAppAutomateFlutterAndroidApp: {
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
                     * Custom ID for the app. Accepted characters are A-Z, a-z, 0-9, ., -, _. All other characters are ignored. Character limit is 100.
                     * @example app_1
                     */
                    custom_id?: string;
                } & ({
                    /**
                     * Format: binary
                     * Path to the app file on your machine. Supported file formats are .apk and .aab files for Android and .ipa file for iOS
                     */
                    file: Blob;
                } | {
                    /**
                     * URL of the app file. Ensure that its a publicly accessible URL as BrowserStack will attempt to download the app from this location. Supported file formats are .apk and .aab files for Android and .ipa file for iOS
                     * @example https://example.com/app.ipa
                     */
                    url: string;
                });
            };
        };
        responses: {
            /** Successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AppAutomateApp"];
                };
            };
            400: components["schemas"]["400.BadRequest"];
            401: components["schemas"]["401.Unauthorized"];
            404: components["schemas"]["404.NotFound"];
            422: components["schemas"]["422.UnprocessableEntity"];
            500: components["schemas"]["5xx.InternalServerError"];
        };
    };
    uploadAppAutomateDetoxAndroidApp: {
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
                     * Custom ID for the app. Accepted characters are A-Z, a-z, 0-9, ., -, _. All other characters are ignored. Character limit is 100.
                     * @example app_1
                     */
                    custom_id?: string;
                } & ({
                    /**
                     * Format: binary
                     * Path to the app file on your machine. Supported file formats are .apk and .aab files for Android and .ipa file for iOS
                     */
                    file: Blob;
                } | {
                    /**
                     * URL of the app file. Ensure that its a publicly accessible URL as BrowserStack will attempt to download the app from this location. Supported file formats are .apk and .aab files for Android and .ipa file for iOS
                     * @example https://example.com/app.ipa
                     */
                    url: string;
                });
            };
        };
        responses: {
            /** Successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AppAutomateApp"];
                };
            };
            400: components["schemas"]["400.BadRequest"];
            401: components["schemas"]["401.Unauthorized"];
            404: components["schemas"]["404.NotFound"];
            422: components["schemas"]["422.UnprocessableEntity"];
            500: components["schemas"]["5xx.InternalServerError"];
        };
    };
    getAppAutomateXCUITestApps: {
        parameters: {
            query?: {
                /** Show recent apps at a group level or user level. */
                scope?: "group" | "user";
                /** Filter recently uploaded apps by custom ID. Accepted characters are A-Z, a-z, 0-9, ., -, _. All other characters are ignored. Character limit is 100. */
                custom_id?: string;
                /** Number of recent apps to be fetched. Default is 10. */
                limit?: number;
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
                        apps: components["schemas"]["AppAutomateApp"][];
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
    uploadAppAutomateSessionTerminalLogs: {
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
    getAppAutomatePlan: {
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
    uploadAppAutomateFlutteriOSApp: {
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
                     * Custom ID for the app. Accepted characters are A-Z, a-z, 0-9, ., -, _. All other characters are ignored. Character limit is 100.
                     * @example app_1
                     */
                    custom_id?: string;
                } & ({
                    /**
                     * Format: binary
                     * Path to the app file on your machine. Supported file formats are .apk and .aab files for Android and .ipa file for iOS
                     */
                    file: Blob;
                } | {
                    /**
                     * URL of the app file. Ensure that its a publicly accessible URL as BrowserStack will attempt to download the app from this location. Supported file formats are .apk and .aab files for Android and .ipa file for iOS
                     * @example https://example.com/app.ipa
                     */
                    url: string;
                });
            };
        };
        responses: {
            /** Successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AppAutomateTestPackage"];
                };
            };
            400: components["schemas"]["400.BadRequest"];
            401: components["schemas"]["401.Unauthorized"];
            404: components["schemas"]["404.NotFound"];
            422: components["schemas"]["422.UnprocessableEntity"];
            500: components["schemas"]["5xx.InternalServerError"];
        };
    };
    uploadAppAutomateDetoxAndroidAppClient: {
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
                     * Custom ID for the app. Accepted characters are A-Z, a-z, 0-9, ., -, _. All other characters are ignored. Character limit is 100.
                     * @example app_1
                     */
                    custom_id?: string;
                } & ({
                    /**
                     * Format: binary
                     * Path to the app file on your machine. Supported file formats are .apk and .aab files for Android
                     */
                    file: Blob;
                } | {
                    /**
                     * URL of the app file. Ensure that its a publicly accessible URL as BrowserStack will attempt to download the app from this location. Supported file formats are .apk and .aab files for Android
                     * @example https://example.com/app.apk
                     */
                    url: string;
                });
            };
        };
        responses: {
            /** Successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AppAutomateApp"];
                };
            };
            400: components["schemas"]["400.BadRequest"];
            401: components["schemas"]["401.Unauthorized"];
            404: components["schemas"]["404.NotFound"];
            422: components["schemas"]["422.UnprocessableEntity"];
            500: components["schemas"]["5xx.InternalServerError"];
        };
    };
    uploadAppAutomateXCUITestApp: {
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
                     * Custom ID for the app. Accepted characters are A-Z, a-z, 0-9, ., -, _. All other characters are ignored. Character limit is 100.
                     * @example app_1
                     */
                    custom_id?: string;
                } & ({
                    /**
                     * Format: binary
                     * Path to the app file on your machine. Supported file formats are .apk and .aab files for Android and .ipa file for iOS
                     */
                    file: Blob;
                } | {
                    /**
                     * URL of the app file. Ensure that its a publicly accessible URL as BrowserStack will attempt to download the app from this location. Supported file formats are .apk and .aab files for Android and .ipa file for iOS
                     * @example https://example.com/app.ipa
                     */
                    url: string;
                });
            };
        };
        responses: {
            /** Successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AppAutomateApp"];
                };
            };
            400: components["schemas"]["400.BadRequest"];
            401: components["schemas"]["401.Unauthorized"];
            404: components["schemas"]["404.NotFound"];
            422: components["schemas"]["422.UnprocessableEntity"];
            500: components["schemas"]["5xx.InternalServerError"];
        };
    };
    getAppAutomateProject: {
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
                        project: components["schemas"]["AppAutomateProjectWithBuilds"];
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
    updateAppAutomateProject: {
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
    deleteAppAutomateProject: {
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
    getAppAutomateDevices: {
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
                    "application/json": components["schemas"]["AppAutomateDevice"][];
                };
            };
            400: components["schemas"]["400.BadRequest"];
            401: components["schemas"]["401.Unauthorized"];
            404: components["schemas"]["404.NotFound"];
            422: components["schemas"]["422.UnprocessableEntity"];
            500: components["schemas"]["5xx.InternalServerError"];
        };
    };
    getAppAutomateAppiumLogs: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** ID of your build */
                buildId: string;
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
    deleteAppAutomateApp: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** ID of your uploaded app */
                appId: string;
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
                        /** Indicates whether deletion was success or a failure. */
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
    getAppAutomateFlutterAndroidApp: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** App ID of your app */
                appId: string;
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
                        app: components["schemas"]["AppAutomateApp"];
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
    deleteAppAutomateFlutterAndroidApp: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** ID of your uploaded app */
                appId: string;
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
                        /** AppDeleteSuccessMessage */
                        success: {
                            /**
                             * Indicates whether deletion was success or a failure.
                             * @example App with url bs://231e820c35ee15b8438ec31df1fb689c03abd8e5 was deleted.
                             */
                            message: string;
                        };
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
    uploadAppAutomateMediaFile: {
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
                    /**
                     * Custom ID for the media file. This ID is used to specify the media files to be used in your tests.
                     * @example media_1
                     */
                    custom_id?: string;
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
                    "application/json": components["schemas"]["AppAutomateMediaFile"];
                };
            };
            400: components["schemas"]["400.BadRequest"];
            401: components["schemas"]["401.Unauthorized"];
            404: components["schemas"]["404.NotFound"];
            422: components["schemas"]["422.UnprocessableEntity"];
            500: components["schemas"]["5xx.InternalServerError"];
        };
    };
    getAppAutomateEspressoApps: {
        parameters: {
            query?: {
                /** Show recent apps at a group level or user level. */
                scope?: "group" | "user";
                /** Filter recently uploaded apps by custom ID. Accepted characters are A-Z, a-z, 0-9, ., -, _. All other characters are ignored. Character limit is 100. */
                custom_id?: string;
                /** Number of recent apps to be fetched. Default is 10. */
                limit?: number;
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
                        apps: components["schemas"]["AppAutomateApp"][];
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
    getAppAutomateAppProfilingDataV2: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** ID of your build */
                buildId: string;
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
                    "application/json": components["schemas"]["AppAutomateAppProfilingV2"];
                };
            };
            400: components["schemas"]["400.BadRequest"];
            401: components["schemas"]["401.Unauthorized"];
            404: components["schemas"]["404.NotFound"];
            422: components["schemas"]["422.UnprocessableEntity"];
            500: components["schemas"]["5xx.InternalServerError"];
        };
    };
    getAppAutomateSession: {
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
                        automation_session: components["schemas"]["AppAutomateSession"];
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
    updateAppAutomateSession: {
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
                        automation_session: components["schemas"]["AppAutomateSession"];
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
    deleteAppAutomateSession: {
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
    getAppAutomateProjects: {
        parameters: {
            query?: {
                /** Specify the number of results to be displayed. The default value is 10, and the maximum value is 100 */
                limit?: number;
                /** Retrieve projects from a specific point using the offset parameter */
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
    deleteAppAutomateMediaFile: {
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
                        /** Indicates whether deletion was success or a failure. */
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
    getAppAutomateEspressoApp: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** App ID of your app */
                appId: string;
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
                        app: components["schemas"]["AppAutomateApp"];
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
    deleteAppAutomateEspressoApp: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** ID of your uploaded app */
                appId: string;
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
                        /** AppDeleteSuccessMessage */
                        success: {
                            /**
                             * Indicates whether deletion was success or a failure.
                             * @example App with url bs://231e820c35ee15b8438ec31df1fb689c03abd8e5 was deleted.
                             */
                            message: string;
                        };
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
    getAppAutomateMediaFiles: {
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
                    "application/json": components["schemas"]["AppAutomateMediaFile"][] | {
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
    getAppAutomateFlutteriOSApps: {
        parameters: {
            query?: {
                /** Show recent apps at a group level or user level. */
                scope?: "group" | "user";
                /** Filter recently uploaded apps by custom ID. Accepted characters are A-Z, a-z, 0-9, ., -, _. All other characters are ignored. Character limit is 100. */
                custom_id?: string;
                /** Number of recent apps to be fetched. Default is 10. */
                limit?: number;
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
                        test_packages: components["schemas"]["AppAutomateTestPackage"][];
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
    uploadAppAutomateApp: {
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
                     * Custom ID for the app. Accepted characters are A-Z, a-z, 0-9, ., -, _. All other characters are ignored. Character limit is 100.
                     * @example app_1
                     */
                    custom_id?: string;
                } & ({
                    /**
                     * Format: binary
                     * Path to the app file on your machine. Supported file formats are .apk and .aab files for Android and .ipa file for iOS
                     */
                    file: Blob;
                } | {
                    /**
                     * URL of the app file. Ensure that its a publicly accessible URL as BrowserStack will attempt to download the app from this location. Supported file formats are .apk and .aab files for Android and .ipa file for iOS
                     * @example https://example.com/app.ipa
                     */
                    url: string;
                });
            };
        };
        responses: {
            /** Successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AppAutomateApp"];
                };
            };
            400: components["schemas"]["400.BadRequest"];
            401: components["schemas"]["401.Unauthorized"];
            404: components["schemas"]["404.NotFound"];
            422: components["schemas"]["422.UnprocessableEntity"];
            500: components["schemas"]["5xx.InternalServerError"];
        };
    };
    getAppAutomateGroupApps: {
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
                    "application/json": components["schemas"]["AppAutomateApp"][] | {
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
    uploadAppAutomateEspressoApp: {
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
                     * Custom ID for the app. Accepted characters are A-Z, a-z, 0-9, ., -, _. All other characters are ignored. Character limit is 100.
                     * @example app_1
                     */
                    custom_id?: string;
                } & ({
                    /**
                     * Format: binary
                     * Path to the app file on your machine. Supported file formats are .apk and .aab files for Android and .ipa file for iOS
                     */
                    file: Blob;
                } | {
                    /**
                     * URL of the app file. Ensure that its a publicly accessible URL as BrowserStack will attempt to download the app from this location. Supported file formats are .apk and .aab files for Android and .ipa file for iOS
                     * @example https://example.com/app.ipa
                     */
                    url: string;
                });
            };
        };
        responses: {
            /** Successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AppAutomateApp"];
                };
            };
            400: components["schemas"]["400.BadRequest"];
            401: components["schemas"]["401.Unauthorized"];
            404: components["schemas"]["404.NotFound"];
            422: components["schemas"]["422.UnprocessableEntity"];
            500: components["schemas"]["5xx.InternalServerError"];
        };
    };
    getAppAutomateAppsByCustomId: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** Custom ID of your app */
                customId: string;
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
                    "application/json": components["schemas"]["AppAutomateApp"][] | {
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
    getAppAutomateFlutterAndroidApps: {
        parameters: {
            query?: {
                /** Show recent apps at a group level or user level. */
                scope?: "group" | "user";
                /** Filter recently uploaded apps by custom ID. Accepted characters are A-Z, a-z, 0-9, ., -, _. All other characters are ignored. Character limit is 100. */
                custom_id?: string;
                /** Number of recent apps to be fetched. Default is 10. */
                limit?: number;
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
                        apps: components["schemas"]["AppAutomateApp"][];
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
    getAppAutomateDeviceLogs: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** ID of your build */
                buildId: string;
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
    getAppAutomateAppProfilingDataV1: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** ID of your build */
                buildId: string;
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
                    "application/json": components["schemas"]["AppAutomateAppProfilingV1"][];
                };
            };
            400: components["schemas"]["400.BadRequest"];
            401: components["schemas"]["401.Unauthorized"];
            404: components["schemas"]["404.NotFound"];
            422: components["schemas"]["422.UnprocessableEntity"];
            500: components["schemas"]["5xx.InternalServerError"];
        };
    };
    getAppAutomateBuilds: {
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
                    "application/json": components["schemas"]["AppAutomateBuildWrap"][];
                };
            };
            400: components["schemas"]["400.BadRequest"];
            401: components["schemas"]["401.Unauthorized"];
            404: components["schemas"]["404.NotFound"];
            422: components["schemas"]["422.UnprocessableEntity"];
            500: components["schemas"]["5xx.InternalServerError"];
        };
    };
    getAppAutomateFlutteriOSApp: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** Test package ID of your app */
                appId: string;
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
                        test_package: components["schemas"]["AppAutomateTestPackage"];
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
    deleteAppAutomateFlutteriOSApp: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** Test package ID of your app */
                appId: string;
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
                        /** AppDeleteSuccessMessage */
                        success: {
                            /**
                             * Indicates whether deletion was success or a failure.
                             * @example App with url bs://231e820c35ee15b8438ec31df1fb689c03abd8e5 was deleted.
                             */
                            message: string;
                        };
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
    getAppAutomateProjectBadgeKey: {
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
}
