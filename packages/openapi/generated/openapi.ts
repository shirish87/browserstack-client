export interface paths {
    "/browsers": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Fetches all available browsers.
         * @description Fetches all available browsers.
         */
        get: operations["getBrowsers"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/status": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Fetches status.
         * @description Fetches status.
         */
        get: operations["getStatus"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/worker": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Create a browser worker.
         * @description Create a browser worker. A browser worker is simply a new browser instance. A user can start multiple browser workers at a time. All browser workers when created are pushed in a queue and they run when their turn comes. We make sure that your browser worker starts running as soon as possible. Your testing time is calculated from the time when browser worker starts running.
         */
        post: operations["createWorker"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/workers": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Fetches all workers.
         * @description Fetches all workers.
         */
        get: operations["getWorkers"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/worker/{workerId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Fetch details of a worker.
         * @description Fetch details a worker.
         */
        get: operations["getWorker"];
        put?: never;
        post?: never;
        /**
         * Terminate a worker.
         * @description Terminate a worker.
         */
        delete: operations["deleteWorker"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/worker/{workerId}/url.json": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * Set a new URL for a worker-browser instance to navigate to
         * @description Set a new URL for a worker-browser instance to navigate to
         */
        put: operations["updateWorkerURL"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/worker/{workerId}/screenshot.{format}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Fetch a screenshot of the specified worker.
         * @description Fetch a screenshot of the current state of the worker.
         */
        get: operations["getWorkerScreenshot"];
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
         * @description Fetches Automate plan details
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
         * @description Reset Automate access key
         */
        put: operations["recycleAutomateKey"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/automate/browsers.json": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Fetches all automate browsers.
         * @description Fetches all automate browsers.
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
    "/automate/projects.json": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Fetches list of projects
         * @description Fetches list of projects associated with your username and access key. You will need the id of the project for invoking any other Project API that follows in this document
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
    "/automate/projects/{projectId}.json": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Fetches a project
         * @description Specific information about a particular project can be queried using the project ID
         */
        get: operations["getAutomateProject"];
        /**
         * Update the name of your project
         * @description Update the name of your project after the project is complete
         */
        put: operations["updateAutomateProject"];
        post?: never;
        /**
         * Delete your project
         * @description Delete a project on the server using the DELETE method. Please note that to delete a project, it needs to be empty of builds and sessions, and projects once deleted cannot be recovered
         */
        delete: operations["deleteAutomateProject"];
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
         * @description Fetches the badge key for sharing a public link for the Automate dashboard to view the latest build and sessions for that project
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
    "/automate/builds.json": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Fetches list of builds
         * @description Fetch the 10 recent test builds that have run on BrowserStack. You can also limit the number of builds and paginate through your data
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
    "/automate/builds/{buildId}.json": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Fetches a build
         * @description Fetches a build
         */
        get: operations["getAutomateBuild"];
        /**
         * Update the name or tag of your build
         * @description Update the name or tag of your build after the build is complete. To delete a build tag, simply pass an empty string as value for build_tag.
         */
        put: operations["updateAutomateBuild"];
        post?: never;
        /**
         * Delete a build on the server
         * @description Delete a build on the server. Please note that deleting a build will delete all the sessions contained within it. Builds once deleted cannot be recovered
         */
        delete: operations["deleteAutomateBuild"];
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
         * @description Delete multiple builds on the server. You can delete a maximum of 5 builds at a time. Builds once deleted cannot be recovered.
         */
        delete: operations["deleteAutomateBuilds"];
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
         * @description Upload terminal logs for your build.
         */
        post: operations["uploadAutomateBuildTerminalLogs"];
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
         * @description Fetches list of sessions for a particular build
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
    "/automate/sessions/{sessionId}.json": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Fetches a session
         * @description Fetches a session for a particular build
         */
        get: operations["getAutomateSession"];
        /**
         * Update session status or name
         * @description Set the status for a session or update the name of the session. You can mark test status as passed or failed along with a reason.
         */
        put: operations["updateAutomateSession"];
        post?: never;
        /**
         * Delete a session on the server
         * @description Delete a session on the server. Sessions once deleted cannot be recovered
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
         * @description Delete multiple sessions on the server. Sessions once deleted cannot be recovered.
         */
        delete: operations["deleteAutomateSessions"];
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
         * @description Fetches session logs. Whenever you execute a session on BrowserStack, a session log is generated. These logs are available to you in text format.
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
         * @description Upload terminal logs for your session.
         */
        post: operations["uploadAutomateSessionTerminalLogs"];
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
         * @description Fetches network logs for a session. Network Logs for each session are available to you in HAR (HTTP Archive) format.
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
    "/automate/sessions/{sessionId}/consolelogs": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Fetches console logs for a session
         * @description Fetches console logs for a session. Console logs are enabled by default and are set to errors. You can disable them or change verbosity options by using the browserstack.console capability to disabled, errors, warnings, info, verbose. Raw Console Logs for each session are available to you in text format.
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
    "/automate/sessions/{sessionId}/seleniumlogs": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Fetches Selenium logs for a session
         * @description Fetches Selenium logs for a session. Raw Selenium logs for each session are available to you in text format.
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
    "/automate/sessions/{sessionId}/appiumlogs": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Fetches Appium logs for a session
         * @description Fetches Appium logs for a session. Raw Appium Logs for each session are available to you in text format.
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
    "/automate/sessions/{sessionId}/telemetrylogs": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Fetches telemetry logs for a session
         * @description Fetches telemetry logs for a session. Telemetry logs for a session are available for tests run using Selenium 4. Telemetry logs are by default disabled for a session.
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
         * @description Upload a media file you want to use in your tests
         */
        post: operations["uploadAutomateMediaFile"];
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
         * @description Fetches list of recently uploaded media files
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
         * @description Delete a media file on the server. Media files once deleted cannot be recovered
         */
        delete: operations["deleteAutomateMediaFile"];
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
         * @description Fetches list of browsers supported by Screenshots API
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
         * @description Take a screenshot of a website on a particular browser
         */
        post: operations["createScreenshotsJob"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/screenshots/{jobId}.json": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Fetches a screenshot job
         * @description Fetches a screenshot job
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
    "/app-automate/plan.json": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get App Automate plan details
         * @description Fetches App Automate plan details
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
    "/app-automate/devices.json": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get a list of supported Android and iOS devices
         * @description Fetches list of devices supported by App Automate
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
    "/app-automate/projects.json": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Retrieve a list of recent projects for your BrowserStack group
         * @description Fetch the last 10 projects or your BrowserStack group. You can also limit the number of projects and paginate through your data
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
    "/app-automate/projects/{projectId}.json": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Fetches a project
         * @description Specific information about a particular project can be queried using the project ID
         */
        get: operations["getAppAutomateProject"];
        /**
         * Update the name of your project
         * @description Update the name of your project after the project is complete
         */
        put: operations["updateAppAutomateProject"];
        post?: never;
        /**
         * Delete your project
         * @description Delete a project on the server using the DELETE method. Please note that to delete a project, it needs to be empty of builds and sessions, and projects once deleted cannot be recovered
         */
        delete: operations["deleteAppAutomateProject"];
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
         * @description Fetches the badge key for sharing a public link for the Automate dashboard to view the latest build and sessions for that project
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
    "/app-automate/builds.json": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Fetches list of builds
         * @description Fetch the 10 recent test builds that have run on BrowserStack. You can also limit the number of builds and paginate through your data
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
    "/app-automate/builds/{buildId}.json": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Fetches a build
         * @description Fetches a build
         */
        get: operations["getAppAutomateBuild"];
        /**
         * Update the tag of your build
         * @description Update the tag of your build after the build is complete. To delete a build tag, simply pass an empty string as value for build_tag.
         */
        put: operations["updateAppAutomateBuild"];
        post?: never;
        /**
         * Delete a build on the server
         * @description Delete a build on the server. Please note that deleting a build will delete all the sessions contained within it. Builds once deleted cannot be recovered
         */
        delete: operations["deleteAppAutomateBuild"];
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
         * @description Upload terminal logs for your build.
         */
        post: operations["uploadAppAutomateBuildTerminalLogs"];
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
         * @description Get details of a test session including its status and debugging information such as Appium logs and test video recording
         */
        get: operations["getAppAutomateSession"];
        /**
         * Update session status
         * @description Set the status for a session. You can mark test status as passed or failed along with a reason.
         */
        put: operations["updateAppAutomateSession"];
        post?: never;
        /**
         * Delete a session on the server
         * @description Delete a session on the server. Sessions once deleted cannot be recovered
         */
        delete: operations["deleteAppAutomateSession"];
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
         * @description Upload terminal logs for your session.
         */
        post: operations["uploadAppAutomateSessionTerminalLogs"];
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
         * @description Access the logs for the session in textual format. It includes information about the test session’s desired capabilities and detailed information about every request and response. You can view all the steps executed in the test and troubleshoot errors for any failed steps.
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
    "/app-automate/builds/{buildId}/sessions/{sessionId}/devicelogs": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Fetches device logs
         * @description Access the device logs for your session. These are system logs specific to your application generated by the OS(Android/iOS) and can be helpful for debugging any application crashes during test execution.
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
    "/app-automate/builds/{buildId}/sessions/{sessionId}/appiumlogs": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Fetches Appium logs
         * @description Access the Appium logs for your session. These are logs generated by the Appium server and contain the details about your each Appium command execution in the test session. You can troubleshoot any errors in case your test session failed.
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
    "/app-automate/builds/{buildId}/sessions/{sessionId}/networklogs": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Fetches network logs
         * @description Access the network logs for your session. These logs capture network data such as network traffic, latency, HTTP requests/responses in the HAR (HTTP Archive) format. You can identify any performance bottlenecks or debug failed REST API responses. Network logs are disabled by default.
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
    "/app-automate/builds/{buildId}/sessions/{sessionId}/appprofiling": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Fetches app profiling data
         * @description Access the app profiling logs to view the resource consumption (CPU, memory, battery, and network) by your app on the device. The logs are only available for Android.
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
    "/app-automate/builds/{buildId}/sessions/{sessionId}/appprofiling/v2": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Fetches app profiling data v2
         * @description Access the detailed app profling metrics such as installed app size, UI rendering metrics, resource consumption metrics, etc.
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
         * @description Upload a media file you want to use in your tests
         */
        post: operations["uploadAppAutomateMediaFile"];
        delete?: never;
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
         * @description Fetches list of recently uploaded media files
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
    "/app-automate/recent_media_files/{customId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Fetches list of uploaded media files by custom ID
         * @description Fetches list of recently uploaded media files by custom ID
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
    "/app-automate/recent_group_media": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Fetches list of uploaded media files for the entire group
         * @description Fetches list of recently uploaded media files for the entire group
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
         * @description Fetches list of recently uploaded media files for the entire group
         */
        delete: operations["deleteAppAutomateMediaFile"];
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
         * @description Upload the application under test (AUT) for Appium testing.
         */
        post: operations["uploadAppAutomateApp"];
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
         * @description Fetches list of recently uploaded apps
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
    "/app-automate/recent_apps/{customId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Fetches list of uploaded apps by custom ID
         * @description Fetches list of uploaded apps by custom ID
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
    "/app-automate/recent_group_apps": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Fetches list of uploaded apps for the entire group
         * @description Fetches list of recently uploaded apps for the entire group
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
         * @description Delete an app that was previously uploaded to BrowserStack. Note that apps once deleted cannot be recovered.
         */
        delete: operations["deleteAppAutomateApp"];
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
         * @description Upload the application under test (AUT) for Flutter testing.
         */
        post: operations["uploadAppAutomateFlutterAndroidApp"];
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
         * @description Fetches list of recently uploaded Flutter apps
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
    "/app-automate/flutter-integration-tests/v2/android/apps/{appId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get details of an uploaded Flutter app
         * @description Get details of an uploaded Flutter app
         */
        get: operations["getAppAutomateFlutterAndroidApp"];
        put?: never;
        post?: never;
        /**
         * Delete a Flutter app that was previously uploaded to BrowserStack
         * @description Delete an app that was previously uploaded to BrowserStack. Note that apps once deleted cannot be recovered.
         */
        delete: operations["deleteAppAutomateFlutterAndroidApp"];
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
         * @description Upload the application under test (AUT) for Flutter iOS testing in .zip format.
         */
        post: operations["uploadAppAutomateFlutteriOSApp"];
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
         * @description Fetches list of recently uploaded Flutter iOS test packages
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
    "/app-automate/flutter-integration-tests/v2/ios/test-package/{appId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get details of an uploaded Flutter iOS test package
         * @description Get details of an uploaded Flutter iOS test package
         */
        get: operations["getAppAutomateFlutteriOSApp"];
        put?: never;
        post?: never;
        /**
         * Delete a Flutter iOS test package that was previously uploaded to BrowserStack
         * @description Delete a Flutter iOS test package that was previously uploaded to BrowserStack. Note that apps once deleted cannot be recovered.
         */
        delete: operations["deleteAppAutomateFlutteriOSApp"];
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
         * @description Upload the application under test (AUT) for Detox Android testing.
         */
        post: operations["uploadAppAutomateDetoxAndroidApp"];
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
         * @description Upload the app client under test for Detox Android testing.
         */
        post: operations["uploadAppAutomateDetoxAndroidAppClient"];
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
         * @description Upload the application under test (AUT) for Espresso testing.
         */
        post: operations["uploadAppAutomateEspressoApp"];
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
         * @description Fetches list of recently uploaded Espresso apps
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
    "/app-automate/espresso/v2/apps/{appId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get details of an uploaded Espresso app
         * @description Get details of an uploaded Espresso app
         */
        get: operations["getAppAutomateEspressoApp"];
        put?: never;
        post?: never;
        /**
         * Delete a Espresso app that was previously uploaded to BrowserStack
         * @description Delete an app that was previously uploaded to BrowserStack. Note that apps once deleted cannot be recovered.
         */
        delete: operations["deleteAppAutomateEspressoApp"];
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
         * @description Upload the application under test (AUT) for XCUITest testing.
         */
        post: operations["uploadAppAutomateXCUITestApp"];
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
         * @description Fetches list of recently uploaded XCUITest apps
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
    "/app-automate/xcuitest/v2/apps/{appId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get details of an uploaded XCUITest app
         * @description Get details of an uploaded XCUITest app
         */
        get: operations["getAppAutomateXCUITestApp"];
        put?: never;
        post?: never;
        /**
         * Delete a XCUITest app that was previously uploaded to BrowserStack
         * @description Delete an app that was previously uploaded to BrowserStack. Note that apps once deleted cannot be recovered.
         */
        delete: operations["deleteAppAutomateXCUITestApp"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/local/v1/list": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Fetches list of recent binary instances
         * @description Fetches list of recent binary instances for local testing. Note that the binary should have been started with the --enable-logging-for-api parameter.
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
         * @description Fetches details of a Local binary instance used for local testing. Note that the binary should have been started with the --enable-logging-for-api parameter.
         */
        get: operations["getLocalBinaryInstance"];
        put?: never;
        post?: never;
        /**
         * Disconnect a Local binary instance
         * @description Disconnect a Local binary instance
         */
        delete: operations["disconnectLocalBinaryInstance"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/browserstack-local/BrowserStackLocal-{osArch}.zip": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Download the BrowserStackLocal binary zip file
         * @description Download the BrowserStackLocal binary zip file
         */
        get: operations["downloadLocalBinary"];
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
        /** Browser */
        Browser: {
            /** @example Chrome */
            browser: string;
            /** @example 80.0 */
            browser_version: string;
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
        /** BrowserDevice */
        BrowserDevice: components["schemas"]["Browser"] & {
            /** @example Android Browser */
            browser?: string;
            devices: string[];
            real_devices: string[];
        };
        /** BrowserRealDevice */
        BrowserRealDevice: components["schemas"]["Browser"] & {
            /** @example Android Browser */
            browser?: string;
            devices: string[];
            real_devices: string[];
        };
        /** BrowserMap */
        BrowserMap: {
            Windows?: {
                7: components["schemas"]["BrowserPlatform"][];
                8: components["schemas"]["BrowserPlatform"][];
                10: components["schemas"]["BrowserPlatform"][];
                11: components["schemas"]["BrowserPlatform"][];
                XP: components["schemas"]["BrowserPlatform"][];
                8.1: components["schemas"]["BrowserPlatform"][];
            } & {
                [key: string]: components["schemas"]["BrowserPlatform"][];
            };
            "OS X"?: {
                "Snow Leopard": components["schemas"]["BrowserPlatform"][];
                Lion: components["schemas"]["BrowserPlatform"][];
                "Mountain Lion": components["schemas"]["BrowserPlatform"][];
                Mavericks: components["schemas"]["BrowserPlatform"][];
                Yosemite: components["schemas"]["BrowserPlatform"][];
                "El Capitan": components["schemas"]["BrowserPlatform"][];
                Sierra: components["schemas"]["BrowserPlatform"][];
                "High Sierra": components["schemas"]["BrowserPlatform"][];
                Mojave: components["schemas"]["BrowserPlatform"][];
                Catalina: components["schemas"]["BrowserPlatform"][];
                "Big Sur": components["schemas"]["BrowserPlatform"][];
                Monterey: components["schemas"]["BrowserPlatform"][];
                Ventura: components["schemas"]["BrowserPlatform"][];
                Sonoma: components["schemas"]["BrowserPlatform"][];
                additionalProperties?: components["schemas"]["BrowserPlatform"][];
            };
            winphone?: {
                8.1: components["schemas"]["BrowserDevice"][];
            };
            android?: {
                "14.0": components["schemas"]["BrowserRealDevice"][];
                "13.0": components["schemas"]["BrowserRealDevice"][];
                "12.0": components["schemas"]["BrowserRealDevice"][];
                "11.0": components["schemas"]["BrowserRealDevice"][];
                "10.0": components["schemas"]["BrowserRealDevice"][];
                "9.0": components["schemas"]["BrowserRealDevice"][];
                8.1: components["schemas"]["BrowserRealDevice"][];
                "8.0": components["schemas"]["BrowserRealDevice"][];
                7.1: components["schemas"]["BrowserRealDevice"][];
                "7.0": components["schemas"]["BrowserRealDevice"][];
                "6.0": components["schemas"]["BrowserRealDevice"][];
                "5.0": components["schemas"]["BrowserDevice"][];
                4.4: components["schemas"]["BrowserDevice"][];
                4.3: components["schemas"]["BrowserDevice"][];
                4.2: components["schemas"]["BrowserDevice"][];
                4.1: components["schemas"]["BrowserDevice"][];
                "4.0": components["schemas"]["BrowserDevice"][];
                2.3: components["schemas"]["BrowserDevice"][];
                2.2: components["schemas"]["BrowserDevice"][];
                additionalProperties?: (components["schemas"]["BrowserRealDevice"] | components["schemas"]["BrowserDevice"])[];
            };
        };
        /** BrowserList */
        BrowserList: components["schemas"]["BrowserPlatform"][];
        /** AutomatePlan */
        AutomatePlan: {
            /**
             * @description Specifies your Automate plan name
             * @example Automate Mobile
             */
            automate_plan: string;
            /**
             * @description Number of parallel sessions currently running
             * @example 0
             */
            parallel_sessions_running: number;
            /**
             * @description Maximum number of parallel sessions you can run
             * @example 0
             */
            parallel_sessions_max_allowed: number;
            /**
             * @description Maximum number of parallel sessions allowed in a team
             * @example 250
             */
            team_parallel_sessions_max_allowed: number;
            /**
             * @description Number of sessions currently queued
             * @example 10
             */
            queued_sessions: number;
            /**
             * @description Maximum number of sessions that can be queued
             * @example 240
             */
            queued_sessions_max_allowed: number;
        };
        /** AutomateProject */
        AutomateProject: {
            /**
             * @description ID of your project
             * @example 866256
             */
            id: number;
            /**
             * @description Name of your project
             * @example pricing_project
             */
            name: string;
            /**
             * @description Identifier for the user
             * @example 256454
             */
            user_id: number;
            /**
             * @description Identifier for your account or group
             * @example 2
             */
            group_id: number;
            /**
             * @description Identifier for a team in a group
             * @example 0
             */
            sub_group_id: number;
            /**
             * @description Time at which the project was created on BrowserStack servers
             * @example 2020-03-11T10:14:36.000Z
             */
            created_at: string;
            /**
             * @description Time at which the project was updated on BrowserStack servers
             * @example 2020-09-18T09:45:57.000Z
             */
            updated_at: string;
        };
        /** AutomateBuild */
        AutomateBuild: {
            /**
             * @description Name of your build
             * @example pricing_project_build
             */
            name: string;
            /**
             * @description Duration of build execution
             * @example 10
             */
            duration: number;
            /** @enum {string} */
            status: "running" | "timeout" | "failed" | "done";
            /**
             * @description Identifier for the user
             * @example 256454
             */
            user_id?: number;
            /**
             * @description Identifier for your account or group
             * @example 2
             */
            group_id?: number;
            /**
             * @description Identifier for a team in a group
             * @example 0
             */
            sub_group_id?: number;
            /**
             * @description ID of your project
             * @example 866256
             */
            automation_project_id?: number;
            /**
             * @description Hashed ID of the build
             * @example 4207442b2b0567368956dba064c22a3235a76214
             */
            hashed_id: string;
            /**
             * @description Tag for the build
             * @example pricing_project_build
             */
            build_tag: string;
            /**
             * @description Indicates whether the build is a delta build
             * @example false
             */
            delta?: boolean;
            /**
             * @description Framework used for the build
             * @example selenium
             */
            framework?: string;
            /** @description Test data used for the build */
            test_data?: Record<string, never>;
            /**
             * @description Time at which the project was created on BrowserStack servers
             * @example 2020-03-11T10:14:36.000Z
             */
            created_at?: string;
            /**
             * @description Time at which the project was updated on BrowserStack servers
             * @example 2020-09-18T09:45:57.000Z
             */
            updated_at?: string;
        };
        /** AutomateSession */
        AutomateSession: components["schemas"]["BrowserPlatform"] & {
            /**
             * @description Hashed ID of the session
             * @example 4207442b2b0567368956dba064c22a3235a76214
             */
            hashed_id: string;
            /**
             * @description Name of your session
             * @example pricing_project_build
             */
            name: string;
            /**
             * @description Duration of session execution
             * @example 10
             */
            duration: number;
            /**
             * @description Status of the session
             * @enum {string}
             */
            status: "running" | "timeout" | "failed" | "done";
            /** @description Execution status of the session */
            browserstack_status: string;
            /**
             * @description Reason for test status
             * @example CLIENT_STOPPED_SESSION
             */
            reason: string;
            /**
             * @description Name of the build
             * @example pricing_project_build
             */
            build_name: string;
            /**
             * @description Name of the project
             * @example pricing_project
             */
            project_name: string;
            /**
             * @description Link to the session logs
             * @example https://automate.browserstack.com/builds/5343932818f9330c5d2b5c72aaf9dd8fde77b428/sessions/550709149fe79e949363b581e774d5ebffa1b8fe/logs
             */
            logs: string;
            /**
             * @description URL to view the session on Automate dashboard
             * @example https://automate.browserstack.com/builds/5343932818f9330c5d2b5c72aaf9dd8fde77b428/sessions/550709149fe79e949363b581e774d5ebffa1b8fe
             */
            browser_url: string;
            /**
             * @description URL to view the session publicly
             * @example https://automate.browserstack.com/builds/5343932818f9330c5d2b5c72aaf9dd8fde77b428/sessions/550709149fe79e949363b581e774d5ebffa1b8fe?auth_token=01df4e51ba67eb743484a08b024a44601a2ae0399c5c011a68d9564147be1387
             */
            public_url: string;
            /**
             * @description URL to view the Appium logs
             * @example https://api.browserstack.com/automate/builds/5343932818f9330c5d2b5c72aaf9dd8fde77b428/sessions/550709149fe79e949363b581e774d5ebffa1b8fe/appiumlogs
             */
            appium_logs_url: string;
            /**
             * @description URL to view session video
             * @example https://automate.browserstack.com/sessions/550709149fe79e949363b581e774d5ebffa1b8fe/video?token=V3pFcVdqdzJNTnNjMzJxeXNBU3FSMUtYU3lnUGsvSTMwbmhEWlRxWUNnRlJ1eHBzTUE0TXd5Z0o0R2lya25jendNaldoQldtbGJTaUtsTTRYQmdIYkE9PS0tNmVXSW91N25yNERzeWRLRnUya2xvQT09--77b9f745d91d9b99572a9e3c98dd001347f1b62c&source=rest_api&diff=860746.273516167
             */
            video_url: string;
            /**
             * @description URL to view browser console logs
             * @example https://automate.browserstack.com/s3-upload/bs-selenium-logs-aps/s3.ap-south-1/550709149fe79e949363b581e774d5ebffa1b8fe/550709149fe79e949363b581e774d5ebffa1b8fe-console-logs-v2.txt?X-Amz-Algorithm=AWS4-HMAC-SHA256&...
             */
            browser_console_logs_url: string;
            /**
             * @description URL to view browser logs
             * @example https://automate.browserstack.com/s3-upload/bs-selenium-logs-euw/s3.eu-west-1/550709149fe79e949363b581e774d5ebffa1b8fe/550709149fe79e949363b581e774d5ebffa1b8fe-har-logs.txt?X-Amz-Algorithm=AWS4-HMAC-SHA256&...
             */
            har_logs_url: string;
            /**
             * @description URL to view selenium logs
             * @example https://automate.browserstack.com/s3-upload/bs-selenium-logs-euw/s3.eu-west-1/550709149fe79e949363b581e774d5ebffa1b8fe/550709149fe79e949363b581e774d5ebffa1b8fe-selenium-logs.txt?X-Amz-Algorithm=AWS4-HMAC-SHA256&...
             */
            selenium_logs_url: string;
            /**
             * @description URL to view telemetry logs if it is enabled in your Selenium 4 session
             * @example https://automate.browserstack.com/s3-upload/bs-selenium-logs-euw/s3.eu-west-1/550709149fe79e949363b581e774d5ebffa1b8fe/550709149fe79e949363b581e774d5ebffa1b8fe-selenium-logs.txt?X-Amz-Algorithm=AWS4-HMAC-SHA256&...
             */
            selenium_telemetry_logs_url: string;
            /**
             * @description Timestamp at which the session started executing
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
        /** AutomateMediaFile */
        AutomateMediaFile: {
            /**
             * @description Name of the uploaded media file.
             * @example profile.png
             */
            media_name: string;
            /**
             * @description Unique identifier returned upon successful upload of your media file on BrowserStack. This value is used to specify the media files to be used in your tests.
             * @example media://90c7a8h8dc82308108734e9a46c24d8f01de12881
             */
            media_url: string;
            /**
             * @description Unique ID returned on successful upload of your media file on BrowserStack.
             * @example 90c7a8h8dc82308108734e9a46c24d8f01de12881
             */
            media_id: string;
            /**
             * @description Media upload timestamp.
             * @example 2021-10-13T10:30:00.000Z
             */
            uploaded_at: string;
        };
        /** AppAutomateMediaFile */
        AppAutomateMediaFile: {
            /**
             * @description Unique ID returned on successful upload of your media file on BrowserStack.
             * @example 90c7a8h8dc82308108734e9a46c24d8f01de12881
             */
            media_id: string;
            /**
             * @description Unique identifier returned upon successful upload of your media file on BrowserStack. This value is used to specify the media files to be used in your tests.
             * @example media://90c7a8h8dc82308108734e9a46c24d8f01de12881
             */
            media_url: string;
            /**
             * @description Name of the media file uploaded.
             * @example media.jpg
             */
            media_name?: string;
            /**
             * @description Timestamp of the media file upload.
             * @example 2021-09-30T10:00:00.000Z
             */
            uploaded_at?: string;
            /**
             * @description Custom ID of the media file uploaded. Accepted characters are A-Z, a-z, 0-9, ., -, _. All other characters are ignored. Character limit is 100.
             * @example media_1
             */
            custom_id?: string;
            /**
             * @description Shareable ID allows members of other teams to use the media files in their tests.
             * @example steve/SampleMedia
             */
            shareable_id?: string;
        };
        /** AppAutomateApp */
        AppAutomateApp: {
            /**
             * @description Unique ID returned on successful upload of your app on BrowserStack.
             * @example 90c7a8h8dc82308108734e9a46c24d8f01de12881
             */
            app_id?: string;
            /**
             * @description Unique identifier returned upon successful upload of your app on BrowserStack. This value can be used later to specify the application under test in your Appium test scripts.
             * @example media://90c7a8h8dc82308108734e9a46c24d8f01de12881
             */
            app_url: string;
            /**
             * @description Name of the app file uploaded.
             * @example app-release.apk
             */
            app_name?: string;
            /**
             * @description Version of the app.
             * @example 1.0.0
             */
            app_version?: string;
            /**
             * @description Timestamp of the app file upload.
             * @example 2021-09-30T10:00:00.000Z
             */
            uploaded_at?: string;
            /**
             * @description Timestamp of the app file expiry.
             * @example 2021-09-30T10:00:00.000Z
             */
            expiry?: string;
            /**
             * @description Custom ID defined for the uploaded app. Accepted characters are A-Z, a-z, 0-9, ., -, _. All other characters are ignored. Character limit is 100.
             * @example media_1
             */
            custom_id?: string;
            /**
             * @description Shareable ID allows other users in your organization to test an app you uploaded.
             * @example steve/SampleApp
             */
            shareable_id?: string;
        };
        /** AppAutomateTestPackage */
        AppAutomateTestPackage: {
            /**
             * @description Unique ID returned on successful upload of your app on BrowserStack.
             * @example 90c7a8h8dc82308108734e9a46c24d8f01de12881
             */
            test_package_id?: string;
            /**
             * @description Unique identifier returned upon successful upload of your app on BrowserStack. This value can be used later to specify the application under test in your Appium test scripts.
             * @example media://90c7a8h8dc82308108734e9a46c24d8f01de12881
             */
            test_package_url: string;
            /**
             * @description Name of the media file uploaded.
             * @example media.zip
             */
            test_package_name?: string;
            /**
             * @description Timestamp of the media file upload.
             * @example 2021-09-30T10:00:00.000Z
             */
            uploaded_at?: string;
            /**
             * @description Custom ID defined for the uploaded app. Accepted characters are A-Z, a-z, 0-9, ., -, _. All other characters are ignored. Character limit is 100.
             * @example media_1
             */
            custom_id?: string;
            /**
             * @description Shareable ID allows other users in your organization to test an app you uploaded.
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
        /** AppAutomateSession */
        AppAutomateSession: components["schemas"]["AutomateSession"] & {
            app_details: {
                /**
                 * @description Package name of the app.
                 * @example com.sample.loginapplication
                 */
                app_name?: string;
                /**
                 * @description Version of the app.
                 * @example 1.0
                 */
                app_version?: string;
                /**
                 * @description Unique identifier returned upon successful upload of your app on BrowserStack. This value can be used later to specify the application under test in your Appium test scripts."
                 * @example media://90c7a8h8dc82308108734e9a46c24d8f01de12881
                 */
                app_url?: string;
                /**
                 * @description Custom ID defined for the uploaded app.
                 * @example LoginApp
                 */
                app_custom_id?: string;
                /**
                 * @description Timestamp of the app upload.
                 * @example 2021-09-30T10:00:00.000Z
                 */
                uploaded_at?: string;
            };
        };
        /** AppAutomateAppProfilingV1 */
        AppAutomateAppProfilingV1: {
            /**
             * @description Timestamp of the profiling data. Epoch time.
             * @example 1600264609
             */
            ts: number;
            /**
             * @description Percentage of CPU utilisation of overall device.
             * @example 0
             */
            cpu: number;
            /**
             * @description RAM utilisation of overall device in MB.
             * @example 5633
             */
            mem: number;
            /**
             * @description RAM available in device in MB.
             * @example 3063
             */
            mema: number;
            /**
             * @description Battery percentage.
             * @example 100
             */
            batt: number;
            /**
             * @description Temperature of the device in degree Celsius.
             * @example 22
             */
            temp: number;
            /** @description Additional properties */
            additionalProperties?: Record<string, never>;
        };
        /** AppAutomateAppProfilingV2 */
        AppAutomateAppProfilingV2: {
            metadata: {
                [key: string]: unknown;
            };
            data: {
                units?: {
                    [key: string]: unknown;
                };
            } & {
                [key: string]: unknown;
            };
        };
        /** NewWorker */
        NewWorker: {
            /**
             * @description URL to be opened in the browser
             * @example https://www.google.com/ncr
             */
            url: string;
            /**
             * @description Time in seconds before the worker is terminated. The default value is 300 seconds and the minimum value is 60 seconds. IMPORTANT: Irrespective of the timeout parameter, a browser worker is alive for a maximum time of 1800 seconds.
             * @example 300
             */
            timeout?: number;
            /**
             * @description Operating system name.
             * @example Windows
             */
            os: string;
            /**
             * @description Operating system version.
             * @example 10
             */
            os_version: string;
            /**
             * @description Name of the worker.
             * @example qunit-test-pricing
             */
            name?: string;
            /**
             * @description Name of the build the session is running under.
             * @example staging-build
             */
            build?: string;
            /**
             * @description Name of the project the build is organized under.
             * @example pricing-project
             */
            project?: string;
            /**
             * @description Enable video recording for the session. The default value is false.
             * @example true
             */
            "browserstack.video"?: boolean;
            /**
             * @description Set the resolution of VM before the beginning of your test. Available for Desktop only. The default value is 1024x768.
             * @example 1024x768
             */
            resolution?: string;
        } & ({
            /**
             * @description Browser name.
             * @example Chrome
             */
            browser: string;
            /**
             * @description Browser version.
             * @example 80.0
             */
            browser_version: string;
        } | {
            /**
             * @description Device name. If a device is not provided it defaults to the first device available for that os version.
             * @example iPhone 11 Pro
             */
            device?: string;
            /**
             * @description Browser name.
             * @example Chrome
             */
            browser?: string;
            /**
             * @description Browser version.
             * @example 80.0
             */
            browser_version?: string;
        });
        /** Worker */
        Worker: components["schemas"]["BrowserPlatform"] & {
            /**
             * @description ID of the worker.
             * @example 122326697
             */
            id: number;
            /**
             * @description ID of the session.
             * @example 550709149fe79e949363b581e774d5ebffa1b8fe
             */
            sessionId?: unknown;
            /**
             * @description Current status of the worker.
             * @example running
             * @enum {string}
             */
            status?: "queue" | "running";
            /**
             * @description Dashboard URL of the session
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
                 * @description Required if you want to test on a mobile device.
                 * @example null
                 */
                device?: string;
            }[];
            /**
             * @description Screen orientation for a mobile device. Default: portrait
             * @enum {string}
             */
            orientation?: "portrait" | "landscape";
            /** @example https://nextjs-template.vercel.app/ */
            url: string;
            /** @description Public URL to which the screenshot will be posted. */
            callback_url?: string;
            /**
             * @description Sceen resolution of the Windows machine. Values: 1024x768, 1280x1024. Default: 1024x768
             * @example 1024x768
             */
            win_res?: string;
            /**
             * @description Sceen resolution of the Mac machine. Values: 1024x768, 1280x960, 1280x1024, 1600x1200, 1920x1080. Default: 1024x768
             * @example 1024x768
             */
            mac_res?: string;
            /**
             * @description Quality of the screenshot. Default: Compressed
             * @enum {string}
             */
            quality?: "Compressed" | "Original";
            /** @description Set to true if URL is local and a Local Testing connection has been set up. Default: false */
            local?: boolean;
            /**
             * @description Time in seconds to wait before taking the screenshot. Default: 5
             * @example 5
             */
            wait_time?: number;
        };
        /** ScreenshotsJobBase */
        ScreenshotsJobBase: {
            /**
             * @description Unique identifier for the screenshot job.
             * @example 4207442b2b0567368956dba064c22a3235a76214
             */
            job_id?: string;
            /**
             * @description Public URL to which the screenshot will be posted.
             * @example https://callback.example.com
             */
            callback_url?: string;
            /**
             * @description Sceen resolution of the Windows machine. Values: 1024x768, 1280x1024. Default: 1024x768
             * @example 1024x768
             */
            win_res?: string;
            /**
             * @description Sceen resolution of the Mac machine. Values: 1024x768, 1280x960, 1280x1024, 1600x1200, 1920x1080. Default: 1024x768
             * @example 1024x768
             */
            mac_res?: string;
            /**
             * @description Quality of the screenshot. Default: Compressed
             * @enum {string}
             */
            quality?: "Compressed" | "Original";
            /**
             * @description Time in seconds to wait before taking the screenshot. Default: 5
             * @example 5
             */
            wait_time?: number;
            /**
             * @description Screen orientation for a mobile device. Default: portrait
             * @enum {string}
             */
            orientation?: "portrait" | "landscape";
            screenshots?: components["schemas"]["Screenshot"][];
        };
        /** NewScreenshotsJob */
        NewScreenshotsJob: components["schemas"]["ScreenshotsJobBase"] & {
            /**
             * @description Unique identifier for the screenshot job.
             * @example 4207442b2b0567368956dba064c22a3235a76214
             */
            job_id: string;
        };
        /** ScreenshotsJob */
        ScreenshotsJob: components["schemas"]["ScreenshotsJobBase"] & {
            /**
             * @description Unique identifier for the screenshot job.
             * @example 4207442b2b0567368956dba064c22a3235a76214
             */
            id: string;
            /**
             * @description State of the screenshot job.
             * @example done
             * @enum {string}
             */
            state?: "queued_all" | "done";
        };
        /** ScreenshotBase */
        ScreenshotBase: {
            /**
             * @description ID for the screenshot
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
             * @description URL to view the screenshot
             * @example https://www.browserstack.com/screenshots/13b93a14db22872fcb5fd1c86b730a51197db319/winxp_ie_7.0.png
             */
            image_url?: string;
            /**
             * @description URL to view the thumbnail of the screenshot
             * @example https://www.browserstack.com/screenshots/13b93a14db22872fcb5fd1c86b730a51197db319/thumb_winxp_ie_7.0.jpg
             */
            thumb_url?: string;
            /**
             * @description Timestamp at which the screenshot was taken
             * @example 2013-03-14 16:25:45 UTC
             */
            created_at?: string;
        };
        /** LocalBinaryInstance */
        LocalBinaryInstance: {
            /**
             * @description Unique identifier for the Local instance.
             * @example QUERTY1
             */
            id: string;
            /**
             * @description User account that started the Local instance.
             * @example john@browserstack.com
             */
            email: string;
            /**
             * @description Hostname for the machine running the Local instance.
             * @example my-local-box
             */
            hostname?: string;
            /**
             * @description Timestamp at which the Local instance was last active.
             * @example 2013-03-14 16:25:45 UTC
             */
            lastActiveOn: string;
            /**
             * @description Timestamp at which the Local instance was started.
             * @example 2013-03-14 16:25:45 UTC
             */
            startTime: string;
            /**
             * @description Timestamp at which the Local instance was terminated.
             * @example 2013-03-14 16:25:45 UTC
             */
            endTime?: string;
            /**
             * @description Reason for termination of the Local instance.
             * @example User terminated the instance.
             */
            disconnectReason?: string;
            /**
             * @description Command line parameters used to start the Local instance.
             * @example --key <access_key> --enable-logging-for-api --local-identifier <local_identifier>
             */
            commandLineParams?: string;
            /**
             * @description Identifier for the Local instance.
             * @example 4207442b2b0567368956dba064c22a3235a76214
             */
            localIdentifier: string;
            /**
             * @description Public IP address of the machine running the Local instance.
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
        /** @description Bad request. */
        "400.BadRequest": unknown;
        /** @description Your BrowserStack access credentials are invalid. */
        "401.Unauthorized": unknown;
        /** @description Authorized user is not the owner of the resource. */
        "403.Forbidden": unknown;
        /** @description The requested resource could not be found. */
        "404.NotFound": unknown;
        /** @description Request is well-formed but has semantic errors. The response will provide more details about error. */
        "422.UnprocessableEntity": unknown;
        /** @description Indicates an error with BrowserStack servers. */
        "5xx.InternalServerError": unknown;
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    getBrowsers: {
        parameters: {
            query?: {
                /** @description If true, returns a flat list of all available browsers. If false, returns a nested list of browsers grouped by OS and OS version. */
                flat?: boolean;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BrowserList"] | components["schemas"]["BrowserMap"];
                };
            };
            400: components["schemas"]["400.BadRequest"];
            401: components["schemas"]["401.Unauthorized"];
            404: components["schemas"]["404.NotFound"];
            422: components["schemas"]["422.UnprocessableEntity"];
            500: components["schemas"]["5xx.InternalServerError"];
        };
    };
    getStatus: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Status"];
                };
            };
            400: components["schemas"]["400.BadRequest"];
            401: components["schemas"]["401.Unauthorized"];
            404: components["schemas"]["404.NotFound"];
            422: components["schemas"]["422.UnprocessableEntity"];
            500: components["schemas"]["5xx.InternalServerError"];
        };
    };
    createWorker: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["NewWorker"];
            };
        };
        responses: {
            /** @description Successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /**
                         * @description ID of the worker
                         * @example 122326697
                         */
                        id: number;
                        /**
                         * @description URL of the worker
                         * @example https://www.google.com/ncr
                         */
                        url?: string;
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
    getWorkers: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Worker"][];
                };
            };
            400: components["schemas"]["400.BadRequest"];
            401: components["schemas"]["401.Unauthorized"];
            404: components["schemas"]["404.NotFound"];
            422: components["schemas"]["422.UnprocessableEntity"];
            500: components["schemas"]["5xx.InternalServerError"];
        };
    };
    getWorker: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of the worker */
                workerId: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Worker"];
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
    deleteWorker: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of the worker */
                workerId: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /**
                         * @description Status of the termination operation
                         * @example worker is running for 19.405956957 secs, minimum life is 30 sec
                         */
                        message: string;
                        /**
                         * @description Duration of the worker
                         * @example 45.786373558
                         */
                        time?: number;
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
    updateWorkerURL: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of the worker */
                workerId: number;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /**
                     * @description New URL for the worker
                     * @example https://www.google.com/ncr
                     */
                    url: string;
                };
            };
        };
        responses: {
            /** @description Successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /**
                         * @description Status of the update URL operation
                         * @example Browser updated with new url
                         */
                        message: string;
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
    getWorkerScreenshot: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of the worker */
                workerId: number;
                /** @description Format of the screenshot */
                format: "png" | "json" | "xml";
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "image/png": string;
                    "application/json": {
                        /**
                         * @description Link to the captured screenshot
                         * @example https://s3.amazonaws.com/testautomation/efe4b6a63529d2b8ff64909db1a60fa473f1d8bf/js-screenshot-1708342782.png
                         */
                        url: string;
                    };
                    "application/xml": string;
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
    getAutomatePlan: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful operation */
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
            /** @description Successful operation */
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
    getAutomateBrowsers: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful operation */
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
    getAutomateProjects: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful operation */
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
    getAutomateProject: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of your project */
                projectId: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        project: components["schemas"]["AutomateProject"] & {
                            builds: components["schemas"]["AutomateBuild"][];
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
    updateAutomateProject: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of your project */
                projectId: number;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /**
                     * @description Name of your project
                     * @example pricing_project
                     */
                    name: string;
                };
            };
        };
        responses: {
            /** @description Successful operation */
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
                /** @description ID of your project */
                projectId: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /**
                         * @description Status of the operation
                         * @example ok
                         */
                        status?: string;
                        /**
                         * @description Message indicating the status of the operation
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
    getAutomateProjectBadgeKey: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of your project */
                projectId: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful operation */
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
    getAutomateBuilds: {
        parameters: {
            query?: {
                /** @description ID of your project */
                projectId?: number;
                /** @description Specify the number of results to be displayed. The default value is 10, and the maximum value is 100 */
                limit?: number;
                /** @description Retrieve builds from a specific point using the offset parameter */
                offset?: number;
                /** @description Status of the build */
                status?: "running" | "timeout" | "failed" | "done";
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful operation */
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
    getAutomateBuild: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of your build */
                buildId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        build: {
                            automation_build: components["schemas"]["AutomateBuild"];
                            sessions: {
                                automation_session: components["schemas"]["AutomateSession"];
                            }[];
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
                /** @description ID of your build */
                buildId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /**
                     * @description The new build name that you want to set. Accepted characters are A-Z, a-z, 0-9, ., :, -, [], /, @, &, ', _. Character limit is 255.
                     * @example Selenium test
                     */
                    name?: string;
                    /**
                     * @description The new build tag that you want to set
                     * @example registration
                     */
                    build_tag?: string;
                } | unknown | unknown;
            };
        };
        responses: {
            /** @description Successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        automation_build: components["schemas"]["AutomateBuild"];
                    } | {
                        /**
                         * @description Error message
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
                /** @description ID of your build */
                buildId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /**
                         * @description Status of deletion
                         * @example ok
                         */
                        status?: string;
                        /**
                         * @description Message indicating the deletion of the build
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
    deleteAutomateBuilds: {
        parameters: {
            query: {
                /** @description IDs of your builds */
                "buildId[]": string[];
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /**
                         * @description Message indicating the deletion of the builds
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
    uploadAutomateBuildTerminalLogs: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of your build */
                buildId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "multipart/form-data": {
                    /**
                     * Format: binary
                     * @description Path to the terminal log file on your machine. The max allowed file size is 2MB
                     */
                    file: string;
                };
            };
        };
        responses: {
            /** @description Successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /**
                         * @description Message indicating upload result.
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
    getAutomateSessions: {
        parameters: {
            query?: {
                /** @description Specify the number of results to be displayed. The default value is 10, and the maximum value is 100 */
                limit?: number;
                /** @description Retrieve sessions from a specific point using the offset parameter */
                offset?: number;
                /** @description Status of the session */
                status?: "running" | "timeout" | "failed" | "done";
            };
            header?: never;
            path: {
                /** @description ID of your build */
                buildId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        automation_session: components["schemas"]["AutomateSession"];
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
    getAutomateSession: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of your session */
                sessionId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful operation */
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
                /** @description ID of your session */
                sessionId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /**
                     * @description Status of the session
                     * @example passed
                     * @enum {string}
                     */
                    status: "passed" | "failed";
                    /**
                     * @description Reason for marking the session as failed
                     * @example Test failed because of assertion error
                     */
                    reason: string;
                } | {
                    /**
                     * @description Name of the session
                     * @example Pricing Demo
                     */
                    name: string;
                };
            };
        };
        responses: {
            /** @description Successful operation */
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
                /** @description ID of your session */
                sessionId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /**
                         * @description Status of deletion
                         * @example ok
                         */
                        status?: string;
                        /**
                         * @description Message indicating the deletion of the session
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
                /** @description IDs of your sessions */
                "sessionId[]": string[];
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /**
                         * @description Message indicating the deletion of the sessions
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
    getAutomateSessionLogs: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of your session */
                sessionId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful operation */
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
                /** @description ID of your session */
                sessionId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "multipart/form-data": {
                    /**
                     * Format: binary
                     * @description Path to the terminal log file on your machine. The max allowed file size is 2MB
                     */
                    file: string;
                };
            };
        };
        responses: {
            /** @description Successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /**
                         * @description Message indicating upload result.
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
    getAutomateSessionNetworkLogs: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of your session */
                sessionId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful operation */
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
    getAutomateSessionConsoleLogs: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of your session */
                sessionId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful operation */
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
    getAutomateSessionSeleniumLogs: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of your session */
                sessionId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful operation */
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
    getAutomateSessionAppiumLogs: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of your session */
                sessionId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful operation */
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
                /** @description ID of your session */
                sessionId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful operation */
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
                     * @description Path to the media file on your machine. Note: You can upload up to 10 media files on the BrowserStack server. By default, we delete the uploaded files after 30 days from the date of upload.
                     */
                    file: string;
                };
            };
        };
        responses: {
            /** @description Successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /**
                         * @description Unique identifier returned upon successful upload of your media file on BrowserStack. This value is used to specify the media files to be used in your tests.
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
    getAutomateMediaFiles: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful operation */
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
    deleteAutomateMediaFile: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of your media file */
                mediaId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /**
                         * @description Status of deletion
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
    getScreenshotsBrowsers: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful operation */
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
            /** @description Successful operation */
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
    getScreenshotsJob: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of your screenshot job */
                jobId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful operation */
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
    getAppAutomatePlan: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful operation */
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
    getAppAutomateDevices: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful operation */
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
    getAppAutomateProjects: {
        parameters: {
            query?: {
                /** @description Specify the number of results to be displayed. The default value is 10, and the maximum value is 100 */
                limit?: number;
                /** @description Retrieve projects from a specific point using the offset parameter */
                offset?: number;
                /** @description Status of the build */
                status?: "running" | "timeout" | "failed" | "done";
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful operation */
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
    getAppAutomateProject: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of your project */
                projectId: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        project: components["schemas"]["AutomateProject"] & {
                            builds: components["schemas"]["AutomateBuild"][];
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
    updateAppAutomateProject: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of your project */
                projectId: number;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /**
                     * @description Name of your project
                     * @example pricing_project
                     */
                    name: string;
                };
            };
        };
        responses: {
            /** @description Successful operation */
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
                /** @description ID of your project */
                projectId: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /**
                         * @description Status of the operation
                         * @example ok
                         */
                        status?: string;
                        /**
                         * @description Message indicating the status of the operation
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
    getAppAutomateProjectBadgeKey: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of your project */
                projectId: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful operation */
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
    getAppAutomateBuilds: {
        parameters: {
            query?: {
                /** @description ID of your project */
                projectId?: number;
                /** @description Specify the number of results to be displayed. The default value is 10, and the maximum value is 100 */
                limit?: number;
                /** @description Retrieve builds from a specific point using the offset parameter */
                offset?: number;
                /** @description Status of the build */
                status?: "running" | "timeout" | "failed" | "done";
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful operation */
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
    getAppAutomateBuild: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of your build */
                buildId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        build: {
                            automation_build: components["schemas"]["AutomateBuild"];
                            sessions: {
                                automation_session: components["schemas"]["AutomateSession"];
                            }[];
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
    updateAppAutomateBuild: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of your build */
                buildId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /**
                     * @description The new build tag that you want to set
                     * @example registration
                     */
                    build_tag: string;
                };
            };
        };
        responses: {
            /** @description Successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        automation_build: components["schemas"]["AutomateBuild"];
                    } | {
                        /**
                         * @description Error message
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
                /** @description ID of your build */
                buildId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /**
                         * @description Status of deletion
                         * @example ok
                         */
                        status?: string;
                        /**
                         * @description Message indicating the deletion of the build
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
    uploadAppAutomateBuildTerminalLogs: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of your build */
                buildId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "multipart/form-data": {
                    /**
                     * Format: binary
                     * @description Path to the terminal log file on your machine. The max allowed file size is 2MB
                     */
                    file: string;
                };
            };
        };
        responses: {
            /** @description Successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /**
                         * @description Message indicating upload result.
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
    getAppAutomateSession: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of your session */
                sessionId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful operation */
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
                /** @description ID of your session */
                sessionId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /**
                     * @description Status of the session
                     * @example passed
                     * @enum {string}
                     */
                    status: "passed" | "failed";
                    /**
                     * @description Reason for marking the session as failed
                     * @example Test failed because of assertion error
                     */
                    reason: string;
                };
            };
        };
        responses: {
            /** @description Successful operation */
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
                /** @description ID of your session */
                sessionId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /**
                         * @description Status of deletion
                         * @example ok
                         */
                        status?: string;
                        /**
                         * @description Message indicating the deletion of the session
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
    uploadAppAutomateSessionTerminalLogs: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of your session */
                sessionId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "multipart/form-data": {
                    /**
                     * Format: binary
                     * @description Path to the terminal log file on your machine. The max allowed file size is 2MB
                     */
                    file: string;
                };
            };
        };
        responses: {
            /** @description Successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /**
                         * @description Message indicating upload result.
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
    getAppAutomateSessionLogs: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of your build */
                buildId: string;
                /** @description ID of your session */
                sessionId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful operation */
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
    getAppAutomateDeviceLogs: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of your build */
                buildId: string;
                /** @description ID of your session */
                sessionId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful operation */
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
    getAppAutomateAppiumLogs: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of your build */
                buildId: string;
                /** @description ID of your session */
                sessionId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful operation */
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
    getAppAutomateNetworkLogs: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of your build */
                buildId: string;
                /** @description ID of your session */
                sessionId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful operation */
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
    getAppAutomateAppProfilingDataV1: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of your build */
                buildId: string;
                /** @description ID of your session */
                sessionId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful operation */
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
    getAppAutomateAppProfilingDataV2: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of your build */
                buildId: string;
                /** @description ID of your session */
                sessionId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful operation */
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
                     * @description Path to the media file on your machine. Note: You can upload up to 10 media files on the BrowserStack server. By default, we delete the uploaded files after 30 days from the date of upload.
                     */
                    file: string;
                    /**
                     * @description Custom ID for the media file. This ID is used to specify the media files to be used in your tests.
                     * @example media_1
                     */
                    custom_id?: string;
                };
            };
        };
        responses: {
            /** @description Successful operation */
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
    getAppAutomateMediaFiles: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful operation */
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
    getAppAutomateMediaFilesByCustomId: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Filter recently uploaded media files by custom ID. */
                customId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful operation */
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
    getAppAutomateGroupMediaFiles: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful operation */
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
    deleteAppAutomateMediaFile: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of your media file */
                mediaId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @description Indicates whether deletion was success or a failure. */
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
                     * @description Custom ID for the app. Accepted characters are A-Z, a-z, 0-9, ., -, _. All other characters are ignored. Character limit is 100.
                     * @example app_1
                     */
                    custom_id?: string;
                } & ({
                    /**
                     * Format: binary
                     * @description Path to the app file on your machine. Supported file formats are .apk and .aab files for Android and .ipa file for iOS
                     */
                    file: string;
                } | {
                    /**
                     * @description URL of the app file. Ensure that its a publicly accessible URL as BrowserStack will attempt to download the app from this location. Supported file formats are .apk and .aab files for Android and .ipa file for iOS
                     * @example https://example.com/app.ipa
                     */
                    url: string;
                });
            };
        };
        responses: {
            /** @description Successful operation */
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
    getAppAutomateApps: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful operation */
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
    getAppAutomateAppsByCustomId: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Custom ID of your app */
                customId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful operation */
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
    getAppAutomateGroupApps: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful operation */
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
    deleteAppAutomateApp: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of your uploaded app */
                appId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @description Indicates whether deletion was success or a failure. */
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
                     * @description Custom ID for the app. Accepted characters are A-Z, a-z, 0-9, ., -, _. All other characters are ignored. Character limit is 100.
                     * @example app_1
                     */
                    custom_id?: string;
                } & ({
                    /**
                     * Format: binary
                     * @description Path to the app file on your machine. Supported file formats are .apk and .aab files for Android and .ipa file for iOS
                     */
                    file: string;
                } | {
                    /**
                     * @description URL of the app file. Ensure that its a publicly accessible URL as BrowserStack will attempt to download the app from this location. Supported file formats are .apk and .aab files for Android and .ipa file for iOS
                     * @example https://example.com/app.ipa
                     */
                    url: string;
                });
            };
        };
        responses: {
            /** @description Successful operation */
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
    getAppAutomateFlutterAndroidApps: {
        parameters: {
            query?: {
                /** @description Show recent apps at a group level or user level. */
                scope?: "group" | "user";
                /** @description Filter recently uploaded apps by custom ID. Accepted characters are A-Z, a-z, 0-9, ., -, _. All other characters are ignored. Character limit is 100. */
                custom_id?: string;
                /** @description Number of recent apps to be fetched. Default is 10. */
                limit?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        apps: components["schemas"]["AppAutomateApp"][];
                    } | {
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
    getAppAutomateFlutterAndroidApp: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description App ID of your app */
                appId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful operation */
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
                /** @description ID of your uploaded app */
                appId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        success: {
                            /**
                             * @description Indicates whether deletion was success or a failure.
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
                     * @description Custom ID for the app. Accepted characters are A-Z, a-z, 0-9, ., -, _. All other characters are ignored. Character limit is 100.
                     * @example app_1
                     */
                    custom_id?: string;
                } & ({
                    /**
                     * Format: binary
                     * @description Path to the app file on your machine. Supported file formats are .apk and .aab files for Android and .ipa file for iOS
                     */
                    file: string;
                } | {
                    /**
                     * @description URL of the app file. Ensure that its a publicly accessible URL as BrowserStack will attempt to download the app from this location. Supported file formats are .apk and .aab files for Android and .ipa file for iOS
                     * @example https://example.com/app.ipa
                     */
                    url: string;
                });
            };
        };
        responses: {
            /** @description Successful operation */
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
    getAppAutomateFlutteriOSApps: {
        parameters: {
            query?: {
                /** @description Show recent apps at a group level or user level. */
                scope?: "group" | "user";
                /** @description Filter recently uploaded apps by custom ID. Accepted characters are A-Z, a-z, 0-9, ., -, _. All other characters are ignored. Character limit is 100. */
                custom_id?: string;
                /** @description Number of recent apps to be fetched. Default is 10. */
                limit?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        test_packages: components["schemas"]["AppAutomateTestPackage"][];
                    } | {
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
    getAppAutomateFlutteriOSApp: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Test package ID of your app */
                appId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful operation */
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
                /** @description Test package ID of your app */
                appId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        success: {
                            /**
                             * @description Indicates whether deletion was success or a failure.
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
                     * @description Custom ID for the app. Accepted characters are A-Z, a-z, 0-9, ., -, _. All other characters are ignored. Character limit is 100.
                     * @example app_1
                     */
                    custom_id?: string;
                } & ({
                    /**
                     * Format: binary
                     * @description Path to the app file on your machine. Supported file formats are .apk and .aab files for Android and .ipa file for iOS
                     */
                    file: string;
                } | {
                    /**
                     * @description URL of the app file. Ensure that its a publicly accessible URL as BrowserStack will attempt to download the app from this location. Supported file formats are .apk and .aab files for Android and .ipa file for iOS
                     * @example https://example.com/app.ipa
                     */
                    url: string;
                });
            };
        };
        responses: {
            /** @description Successful operation */
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
                     * @description Custom ID for the app. Accepted characters are A-Z, a-z, 0-9, ., -, _. All other characters are ignored. Character limit is 100.
                     * @example app_1
                     */
                    custom_id?: string;
                } & ({
                    /**
                     * Format: binary
                     * @description Path to the app file on your machine. Supported file formats are .apk and .aab files for Android
                     */
                    file: string;
                } | {
                    /**
                     * @description URL of the app file. Ensure that its a publicly accessible URL as BrowserStack will attempt to download the app from this location. Supported file formats are .apk and .aab files for Android
                     * @example https://example.com/app.apk
                     */
                    url: string;
                });
            };
        };
        responses: {
            /** @description Successful operation */
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
                     * @description Custom ID for the app. Accepted characters are A-Z, a-z, 0-9, ., -, _. All other characters are ignored. Character limit is 100.
                     * @example app_1
                     */
                    custom_id?: string;
                } & ({
                    /**
                     * Format: binary
                     * @description Path to the app file on your machine. Supported file formats are .apk and .aab files for Android and .ipa file for iOS
                     */
                    file: string;
                } | {
                    /**
                     * @description URL of the app file. Ensure that its a publicly accessible URL as BrowserStack will attempt to download the app from this location. Supported file formats are .apk and .aab files for Android and .ipa file for iOS
                     * @example https://example.com/app.ipa
                     */
                    url: string;
                });
            };
        };
        responses: {
            /** @description Successful operation */
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
    getAppAutomateEspressoApps: {
        parameters: {
            query?: {
                /** @description Show recent apps at a group level or user level. */
                scope?: "group" | "user";
                /** @description Filter recently uploaded apps by custom ID. Accepted characters are A-Z, a-z, 0-9, ., -, _. All other characters are ignored. Character limit is 100. */
                custom_id?: string;
                /** @description Number of recent apps to be fetched. Default is 10. */
                limit?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        apps: components["schemas"]["AppAutomateApp"][];
                    } | {
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
    getAppAutomateEspressoApp: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description App ID of your app */
                appId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful operation */
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
                /** @description ID of your uploaded app */
                appId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        success: {
                            /**
                             * @description Indicates whether deletion was success or a failure.
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
                     * @description Custom ID for the app. Accepted characters are A-Z, a-z, 0-9, ., -, _. All other characters are ignored. Character limit is 100.
                     * @example app_1
                     */
                    custom_id?: string;
                } & ({
                    /**
                     * Format: binary
                     * @description Path to the app file on your machine. Supported file formats are .apk and .aab files for Android and .ipa file for iOS
                     */
                    file: string;
                } | {
                    /**
                     * @description URL of the app file. Ensure that its a publicly accessible URL as BrowserStack will attempt to download the app from this location. Supported file formats are .apk and .aab files for Android and .ipa file for iOS
                     * @example https://example.com/app.ipa
                     */
                    url: string;
                });
            };
        };
        responses: {
            /** @description Successful operation */
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
                /** @description Show recent apps at a group level or user level. */
                scope?: "group" | "user";
                /** @description Filter recently uploaded apps by custom ID. Accepted characters are A-Z, a-z, 0-9, ., -, _. All other characters are ignored. Character limit is 100. */
                custom_id?: string;
                /** @description Number of recent apps to be fetched. Default is 10. */
                limit?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        apps: components["schemas"]["AppAutomateApp"][];
                    } | {
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
                /** @description App ID of your app */
                appId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful operation */
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
                /** @description ID of your uploaded app */
                appId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        success: {
                            /**
                             * @description Indicates whether deletion was success or a failure.
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
            /** @description Successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /**
                         * @description API version
                         * @example v1
                         */
                        api_version: string;
                        /** @description Metadata */
                        meta_data: {
                            /** @description Parameters */
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
            /** @description Successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /**
                         * @description API version
                         * @example v1
                         */
                        api_version: string;
                        /** @description Metadata */
                        meta_data: {
                            /** @description Parameters */
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
            /** @description Successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /**
                         * @description API version
                         * @example v1
                         */
                        api_version: string;
                        /** @description Metadata */
                        meta_data: {
                            /** @description Parameters */
                            params?: {
                                [key: string]: unknown;
                            };
                        } & {
                            [key: string]: unknown;
                        };
                        /** @description QUERTY1 successfully disconnected */
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
    downloadLocalBinary: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                osArch: "darwin-x64" | "linux-x64" | "linux-ia32" | "win32" | "alpine";
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/zip": string;
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
