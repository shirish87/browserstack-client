export interface paths {
    "/projects": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get Project List */
        get: operations["getTestReportingProjects"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/projects/{projectId}/builds": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get Build List for Project */
        get: operations["getTestReportingProjectBuilds"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/builds/start": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Start Build (ingestion) */
        post: operations["startTestReportingBuild"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/builds/latest": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get Latest Build */
        get: operations["getTestReportingLatestBuild"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/builds/{buildId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get Build Details */
        get: operations["getTestReportingBuild"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /** Update Build Metadata */
        patch: operations["updateTestReportingBuild"];
        trace?: never;
    };
    "/builds/{buildHashedId}/finish": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /** Finish Build (ingestion) */
        put: operations["finishTestReportingBuild"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/builds/{buildHashedId}/tests/start": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Start Test Run (ingestion) */
        post: operations["startTestReportingTestRun"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/builds/{buildHashedId}/tests/{testRunUuid}/finish": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /** Finish Test Run (ingestion) */
        put: operations["finishTestReportingTestRun"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/builds/{buildHashedId}/hooks/start": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Start Hook Run (ingestion) */
        post: operations["startTestReportingHookRun"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/builds/{buildHashedId}/hooks/{hookRunUuid}/finish": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /** Finish Hook Run (ingestion) */
        put: operations["finishTestReportingHookRun"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/builds/{buildHashedId}/logs": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Add Build Logs (ingestion) */
        post: operations["addTestReportingBuildLogs"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/builds/{buildId}/testRuns": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get Test List */
        get: operations["getTestReportingTestRuns"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/builds/{buildUuid}/selfHealingReport": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get Self-Healing Report */
        get: operations["getTestReportingSelfHealingReport"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/quality-gates/{buildUuid}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get Quality Gate Status */
        get: operations["getTestReportingQualityGateStatus"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/quality-gates/{projectName}/settings": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get Quality Gate Settings */
        get: operations["getTestReportingQualityGateSettings"];
        /** Update Quality Gate Settings */
        put: operations["updateTestReportingQualityGateSettings"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/quality-gates/{projectName}/profiles": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Create Quality Gate Profile */
        post: operations["createTestReportingQualityGateProfile"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/quality-gates/{projectName}/profiles/{profileUuid}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get Quality Gate Profile */
        get: operations["getTestReportingQualityGateProfile"];
        /** Update Quality Gate Profile */
        put: operations["updateTestReportingQualityGateProfile"];
        post?: never;
        /** Delete Quality Gate Profile */
        delete: operations["deleteTestReportingQualityGateProfile"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/quality-gates/{projectName}/profiles/{profileUuid}/toggle": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /** Toggle Quality Gate Profile */
        put: operations["toggleTestReportingQualityGateProfile"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/upload": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Upload Test Reports (JUnit or Allure) */
        post: operations["uploadTestReportingReport"];
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
            /**
             * Null for App Automate sessions, which have no browser.
             * @example Chrome
             */
            browser: string | null;
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
            device?: string | null;
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
        /** AutomateBuildSessionContainer */
        AutomateBuildSessionContainer: {
            automation_session: components["schemas"]["AutomateBuildSession"];
        };
        /**
         * AutomateBuildSession
         * The lighter session summary embedded in a build's detail response. It has no log or video URLs; fetch the full session with getAutomateSession.
         */
        AutomateBuildSession: {
            hashed_id?: string;
            name?: string;
            status?: string;
            reason?: string;
            duration?: number;
            os?: string;
            os_version?: string;
            browser?: string;
            browser_version?: string;
            device?: string | null;
            build_name?: string;
            project_name?: string;
            build_hashed_id?: string;
            test_priority?: string | null;
        };
        /**
         * AutomateSessionBase
         * Fields common to Automate and App Automate sessions. Each product extends it with its own (AutomateSession, AppAutomateSession).
         */
        AutomateSessionBase: components["schemas"]["BrowserPlatform"] & {
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
             * Outcome of the session. Observed live on Automate and App Automate: passed, failed. `running` and `timeout` are documented but not yet observed; `done` is a browserstack_status value, not a status.
             * @enum {string}
             */
            status: "running" | "timeout" | "failed" | "done" | "passed";
            /** Execution status of the session. Observed live: done, failed, passed. */
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
            appium_logs_url?: string;
            /**
             * URL to view session video
             * @example https://automate.browserstack.com/sessions/550709149fe79e949363b581e774d5ebffa1b8fe/video
             */
            video_url: string;
            /**
             * URL to view browser console logs
             * @example https://automate.browserstack.com/s3-upload/bs-selenium-logs-aps/s3.ap-south-1/550709149fe79e949363b581e774d5ebffa1b8fe/550709149fe79e949363b581e774d5ebffa1b8fe-console-logs-v2.txt
             */
            browser_console_logs_url?: string;
            /**
             * URL to view browser logs
             * @example https://automate.browserstack.com/s3-upload/bs-selenium-logs-euw/s3.eu-west-1/550709149fe79e949363b581e774d5ebffa1b8fe/550709149fe79e949363b581e774d5ebffa1b8fe-har-logs.txt
             */
            har_logs_url?: string;
            /**
             * URL to view selenium logs
             * @example https://automate.browserstack.com/s3-upload/bs-selenium-logs-euw/s3.eu-west-1/550709149fe79e949363b581e774d5ebffa1b8fe/550709149fe79e949363b581e774d5ebffa1b8fe-selenium-logs.txt
             */
            selenium_logs_url?: string;
            /**
             * URL to view telemetry logs if it is enabled in your Selenium 4 session
             * @example https://automate.browserstack.com/s3-upload/bs-selenium-logs-euw/s3.eu-west-1/550709149fe79e949363b581e774d5ebffa1b8fe/550709149fe79e949363b581e774d5ebffa1b8fe-selenium-logs.txt
             */
            selenium_telemetry_logs_url?: string;
            /**
             * Timestamp at which the session started executing
             * @example 2020-03-11T10:14:36.000Z
             */
            created_at: string;
            /**
             * Hashed ID of the Automate build this session belongs to. This is the Automate build id, not the Test Reporting build id.
             * @example 5a2325a471c829812cd32ed5e63fdc5f8d2c0250
             */
            build_hashed_id?: string;
            /** Presigned URL of the session's terminal logs. */
            session_terminal_logs_url?: string;
            /** Presigned URL of the build's terminal logs. */
            build_terminal_logs_url?: string;
            /** Priority label set on the session, if any. */
            test_priority?: string | null;
            /** Time breakdown for the session (totals, BrowserStack vs user time, and optimisation links). */
            insights?: {
                [key: string]: unknown;
            };
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
        /** Cursor pagination. `next_page` is an opaque cursor and is present even when `has_next` is false. Test lists paginate per file/platform, so a response with `has_next: true` can be followed by an empty final page. */
        Pagination: {
            has_next?: boolean;
            next_page?: string | null;
        };
        ProjectListResponse: {
            projects?: components["schemas"]["Project"][];
            pagination?: components["schemas"]["Pagination"];
        };
        BuildListResponse: {
            /** Project id. */
            id?: number;
            /** Project name. */
            name?: string;
            builds?: components["schemas"]["BuildSummary"][];
            pagination?: components["schemas"]["Pagination"];
        };
        Project: {
            id?: number;
            name?: string;
            group_id?: number;
            created_by?: number;
            /** Format: date-time */
            created_at?: string;
            /** Format: date-time */
            updated_at?: string;
            observability_url?: string;
        };
        /** Test counts by status. Live responses also include the keys below that contain spaces or are TCM-style statuses; a running build may report `in progress` rather than `pending`. */
        StatusStats: {
            passed?: number;
            failed?: number;
            pending?: number;
            skipped?: number;
            unknown?: number;
            "in progress"?: number;
            retest?: number;
            blocked?: number;
            untested?: number;
            /** Present in a build's test summary when a test timed out. The same result can show as `unknown` in the build list until TRA finishes processing it. */
            timeout?: number;
        };
        BuildSummary: {
            name?: string;
            /** Observed values: passed, failed, running, skipped, unknown. */
            status?: string;
            /** Build duration in milliseconds. */
            duration?: number;
            user?: string;
            tags?: string[];
            /** TRA build id (an opaque 40-character id). It is not the Automate build `hashed_id`; use a test's `details.session_id` to reach Automate. */
            build_id?: string;
            original_name?: string;
            /** Format: date-time */
            finished_at?: string | null;
            /** Format: date-time */
            started_at?: string;
            status_stats?: components["schemas"]["StatusStats"];
            is_manually_overridden?: boolean;
            build_number?: number;
            is_archived?: boolean;
            observability_url?: string;
            /** Returned in camelCase by the API (the only camelCase key in this response). */
            tcmTestRunIdentifier?: string;
        };
        BuildDetailsSmartTags: {
            is_flaky?: number;
            is_always_failing?: number;
            is_performance_anomaly?: number;
            is_new_failure?: number;
        };
        BuildDetailsVcsInfo: {
            name?: string | null;
            sha?: string | null;
            branch?: string | null;
            remotes?: {
                [key: string]: unknown;
            } | null;
            url?: string | null;
        };
        BuildDetailsCiInfo: {
            job_name?: string | null;
            name?: string | null;
            build_number?: string | null;
            build_url?: string | null;
            url?: string | null;
        };
        BuildDetailsHostInfo: {
            hostname?: string | null;
            os?: string | null;
        };
        /** Framework and SDK versions that reported the build. Values are strings, including "null" and "false". */
        BuildObservabilityVersion: {
            framework_name?: string;
            framework_version?: string;
            sdk_version?: string;
            cli_version?: string;
            outdated_sdk_version?: string;
            outdated_cli_version?: string;
            is_sdk?: string;
        };
        BuildRunInformation: {
            id?: string;
            passed?: number;
            failed?: number;
            skipped?: number;
            unknown?: number;
            meta?: {
                [key: string]: unknown;
            } | null;
            /** Returned in camelCase by the API. */
            buildSdkLogs?: {
                [key: string]: unknown;
            }[];
        };
        BuildDetails: {
            name?: string;
            description?: string;
            status?: string;
            /** Build duration in milliseconds. */
            duration?: number;
            user?: string;
            user_id?: number;
            tags?: string[];
            /** TRA build id; not the Automate build hashed_id. */
            build_id?: string;
            /** Numeric build id. */
            id?: number;
            created_at?: string | null;
            project_id?: number | null;
            project_name?: string | null;
            build_number?: number;
            original_name?: string;
            /** Format: date-time */
            finished_at?: string | null;
            /** Format: date-time */
            started_at?: string;
            is_manually_overridden?: boolean;
            re_run?: {
                [key: string]: unknown;
            } | null;
            build_error?: {
                [key: string]: unknown;
            } | null;
            observability_version?: components["schemas"]["BuildObservabilityVersion"];
            run_information?: components["schemas"]["BuildRunInformation"][];
            /** Returned in camelCase by the API. */
            tcmTestRunIdentifier?: string;
            app_details?: {
                [key: string]: unknown;
            } | null;
            status_stats?: components["schemas"]["StatusStats"];
            failure_categories?: {
                [key: string]: number;
            };
            smart_tags?: components["schemas"]["BuildDetailsSmartTags"];
            is_archived?: boolean;
            observability_url?: string;
            vcs_info?: components["schemas"]["BuildDetailsVcsInfo"];
            ci_info?: components["schemas"]["BuildDetailsCiInfo"];
            host_info?: components["schemas"]["BuildDetailsHostInfo"];
        };
        TestRunsResponse: {
            /** Project name. */
            name?: string;
            project_id?: number;
            group_id?: number;
            build_id?: string;
            build_name?: string;
            build_number?: number;
            original_name?: string;
            test_summary?: components["schemas"]["StatusStats"];
            is_manually_overridden?: boolean;
            is_archived?: boolean;
            app_details?: {
                [key: string]: unknown;
            } | null;
            hierarchy?: components["schemas"]["TestRunNode"][];
            pagination?: components["schemas"]["Pagination"];
        };
        /** A node of the test tree: `ROOT` (one per file and platform) → optional `DESCRIBE` groups → `TEST` or `HOOK` leaves. Only `ROOT` and `TEST`/`HOOK` nodes carry `details`; `DESCRIBE` nodes have `details: null`. Leaves have an empty `children` array. */
        TestRunNode: {
            /**
             * Observed values: ROOT, DESCRIBE, TEST. HOOK is documented.
             * @enum {string}
             */
            type?: "ROOT" | "DESCRIBE" | "TEST" | "HOOK";
            /** Name to show; nodes have no separate `name` field. */
            display_name?: string;
            rank?: number;
            summary?: components["schemas"]["TestRunNodeSummary"];
            details?: components["schemas"]["TestRunNodeDetails"];
            children?: components["schemas"]["TestRunNode"][];
            is_before_all_hook?: boolean | null;
            is_after_all_hook?: boolean | null;
        };
        /** Roll-up of leaf statuses under a node, plus `aggregate` (the leaf count). Null on leaves. */
        TestRunNodeSummary: (components["schemas"]["StatusStats"] & {
            aggregate?: number;
        }) | null;
        /** Shape depends on the node type. `TEST` nodes carry the execution fields (status, duration, retries, session_id, ...); `ROOT` nodes carry the platform fields (file_path, os, browser, device, ...). */
        TestRunNodeDetails: {
            /** Observed values: passed, failed, skipped. */
            status?: string;
            /** Test duration in milliseconds. */
            duration?: number;
            started_at?: string;
            /** Automate session `hashed_id` for the session this test ran in (empty for sessionless runs). Sessions are per worker/file, so every test in a file shares one `session_id`; use it with the Automate API (`getSession`, `getSessionLogs`, `getSessionNetworkLogs`, ...). */
            session_id?: string | null;
            observability_url?: string;
            is_flaky?: boolean;
            is_always_failing?: boolean;
            is_new_failure?: boolean;
            is_muted?: boolean;
            is_performance_anomaly?: boolean;
            is_auto_analyzed?: boolean | null;
            is_auto_analyzer_running?: boolean;
            is_latest?: boolean;
            run_count?: number;
            tags?: string[];
            last_executed_by?: string;
            last_executed_by_id?: number;
            pm_tool_details?: {
                [key: string]: unknown;
            }[];
            /** Linked Test Management cases. Returned in camelCase by the API. */
            testCases?: components["schemas"]["TestRunLinkedTestCase"][];
            /** One entry per attempt, oldest first. */
            retries?: components["schemas"]["TestRunRetry"][];
            file_path?: string;
            vc_file_url?: string;
            os?: components["schemas"]["TestRunPlatformEntry"];
            browser?: components["schemas"]["TestRunPlatformEntry"];
            device?: string | null;
            /** Returned in camelCase by the API. */
            isRealDevice?: boolean;
            middle_scopes?: {
                [key: string]: unknown;
            } | null;
            finished_at?: string | null;
        } | null;
        TestRunPlatformEntry: {
            name?: string;
            version?: string;
            /** Comma-joined name and version, e.g. "Chrome,154.0". */
            key?: string;
        };
        TestRunLinkedTestCase: {
            id?: number;
            identifier?: string;
            folderId?: number;
            projectId?: number;
            thirdPartyIdentifier?: string | null;
            name?: string;
            isShared?: boolean;
        };
        TestRunRetry: {
            uuid?: string;
            status?: string;
            /** Attempt duration in milliseconds. */
            duration?: number;
            /** Returned in camelCase by the API. */
            workflowStatus?: string;
            logs?: components["schemas"]["TestRunRetryLogs"];
        };
        /** Log content for an attempt. Keys are upper-case and left untouched by the client's camelCase conversion. Empty (`{}`) for passing attempts. Raw Selenium/Playwright/console/network logs are not here: fetch them with the Automate session API using `details.session_id`. */
        TestRunRetryLogs: {
            /** Error message and stack trace, one string per line. */
            TEST_FAILURE?: string[];
            /** Presigned URLs of uploaded log files. */
            TEST_LOG?: string[];
        };
        ApplicableBuilds: {
            all_builds?: boolean;
            build_tags?: string[];
            build_names?: string[];
        };
        StartBuildFramework: {
            name: string;
            version: string;
        };
        StartBuildHostInfo: {
            hostname?: string;
            platform?: string;
            type?: string;
            version?: string;
            arch?: string;
        };
        StartBuildCiInfo: {
            name?: string;
            build_url?: string;
            url?: string;
            build_number?: string;
            job_name?: string;
        };
        StartBuildVersionControl: {
            name?: string;
            sha?: string;
            branch?: string;
            tag?: string;
            commit_message?: string;
            committer_email?: string;
            committer_name?: string;
        };
        StartBuildRequest: {
            name: string;
            project_name: string;
            /** Format: date-time */
            started_at: string;
            tags?: string[];
            build_run_identifier?: string;
            host_info?: components["schemas"]["StartBuildHostInfo"];
            ci_info?: components["schemas"]["StartBuildCiInfo"];
            version_control?: {
                [key: string]: unknown;
            };
            framework: components["schemas"]["StartBuildFramework"];
        };
        StartTestRunRequest: {
            name: string;
            file_name: string;
            scopes: string[];
            /** Format: date-time */
            started_at: string;
            tags?: string[];
            location?: string;
            result?: string;
            custom_metadata?: {
                [key: string]: unknown;
            };
            environment?: {
                [key: string]: unknown;
            };
        };
        FinishTestRunRequest: {
            /** @enum {string} */
            result: "passed" | "failed" | "skipped" | "timeout";
            /** Format: date-time */
            finished_at: string;
            file_name: string;
            scopes: string[];
            duration_in_ms?: number;
            failure?: {
                error?: string;
                backtrace?: string;
            }[];
            custom_metadata?: {
                [key: string]: unknown;
            };
            environment?: {
                [key: string]: unknown;
            };
        };
        StartHookRunRequest: {
            hook_type: string;
            name: string;
            file_name: string;
            scopes: string[];
            /** Format: date-time */
            started_at: string;
            test_run_id?: string;
            tags?: string[];
            location?: string;
            custom_metadata?: {
                [key: string]: unknown;
            };
        };
        FinishHookRunRequest: {
            hook_type: string;
            /** @enum {string} */
            result: "passed" | "failed" | "skipped" | "timeout";
            /** Format: date-time */
            finished_at: string;
            file_name: string;
            scopes: string[];
            duration_in_ms?: number;
            failure?: {
                [key: string]: unknown;
            }[];
            custom_metadata?: {
                [key: string]: unknown;
            };
            environment?: {
                [key: string]: unknown;
            };
        };
        BuildLog: {
            /** @enum {string} */
            kind: "TEST_LOG" | "HTTP" | "TEST_SCREENSHOT" | "HOOK_LOG" | "TEST_STEP" | "TEST_ATTACHMENT";
            test_run_uuid?: string;
            hook_run_uuid?: string;
            /** Format: date-time */
            timestamp: string;
            /** @enum {string} */
            level?: "DEBUG" | "INFO" | "WARN" | "ERROR";
            message?: string;
            duration?: number;
            failure?: boolean;
            file_name?: string;
            file_size?: number;
        };
        QualityGateStatus: {
            status?: string;
            build_uuid?: string;
            build_url?: string;
            /** @enum {string} */
            quality_gate_result?: "passed" | "failed" | "unknown" | "skipped" | "running";
            quality_profiles?: {
                id?: string;
                name?: string;
                type?: string;
                result?: string;
                rules?: {
                    [key: string]: unknown;
                }[];
            }[];
        };
        QualityGateSettings: {
            enabled?: boolean;
            should_override_build_status?: boolean;
            quality_profiles?: {
                id?: string;
                name?: string;
                rules_count?: number;
                enabled?: boolean;
                is_global_profile?: boolean;
            }[];
        };
        QualityGateProfileRequest: {
            name: string;
            enabled: boolean;
            is_global_profile: boolean;
            rules: {
                [key: string]: unknown;
            }[];
            applicable_builds?: components["schemas"]["ApplicableBuilds"];
            /** @enum {string} */
            rule_status?: "pass" | "fail";
            /** @enum {string} */
            hooks_visibility?: "failed" | "none" | "beforeFailed" | "all";
        };
        QualityGateProfile: {
            id?: string;
            name?: string;
            enabled?: boolean;
            is_global_profile?: boolean;
            rules?: {
                [key: string]: unknown;
            }[];
            applicable_builds?: {
                [key: string]: unknown;
            };
            rule_status?: string;
            hooks_visibility?: string;
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
    getTestReportingProjects: {
        parameters: {
            query?: {
                next_page?: string;
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
                    "application/json": components["schemas"]["ProjectListResponse"];
                };
            };
        };
    };
    getTestReportingProjectBuilds: {
        parameters: {
            query?: {
                unique_build_names?: string;
                build_tags?: string;
                build_status?: "passed" | "failed" | "unknown" | "skipped" | "running";
                users?: string;
                frameworks?: string;
                is_archived?: boolean;
                /** Start and end as epoch milliseconds, comma-separated: `startMs,endMs`. Anything else is rejected with a 400. Verified against the live API. */
                date_range?: string;
                next_page?: string;
            };
            header?: never;
            path: {
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
                    "application/json": components["schemas"]["BuildListResponse"];
                };
            };
        };
    };
    startTestReportingBuild: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["StartBuildRequest"];
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
                        success?: boolean;
                        build_hashed_id?: string;
                    };
                };
            };
        };
    };
    getTestReportingLatestBuild: {
        parameters: {
            query: {
                project_name: string;
                build_name?: string;
                user_name?: string;
                build_tags?: string;
                framework?: string;
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
                    "application/json": components["schemas"]["BuildDetails"];
                };
            };
        };
    };
    getTestReportingBuild: {
        parameters: {
            query?: never;
            header?: never;
            path: {
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
                    "application/json": components["schemas"]["BuildDetails"];
                };
            };
        };
    };
    updateTestReportingBuild: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                buildId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    build_tags?: string[];
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
                        success?: boolean;
                        message?: string;
                    };
                };
            };
        };
    };
    finishTestReportingBuild: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                buildHashedId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /** Format: date-time */
                    finished_at: string;
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
                        success?: boolean;
                        message?: string;
                    };
                };
            };
        };
    };
    startTestReportingTestRun: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                buildHashedId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["StartTestRunRequest"];
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
                        success?: boolean;
                        uuid?: string;
                    };
                };
            };
        };
    };
    finishTestReportingTestRun: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                buildHashedId: string;
                testRunUuid: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["FinishTestRunRequest"];
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
                        success?: boolean;
                        message?: string;
                    };
                };
            };
        };
    };
    startTestReportingHookRun: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                buildHashedId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["StartHookRunRequest"];
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
                        success?: boolean;
                        uuid?: string;
                    };
                };
            };
        };
    };
    finishTestReportingHookRun: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                buildHashedId: string;
                hookRunUuid: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["FinishHookRunRequest"];
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
                        success?: boolean;
                        message?: string;
                    };
                };
            };
        };
    };
    addTestReportingBuildLogs: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                buildHashedId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    logs: components["schemas"]["BuildLog"][];
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
                        success?: boolean;
                        message?: string;
                    };
                };
            };
        };
    };
    getTestReportingTestRuns: {
        parameters: {
            query?: {
                /** Comma-separated re-run numbers (integers). Returns only tests from those re-runs, so it is empty for a build without re-runs. Verified against the live API. */
                re_runs?: string;
                test_statuses?: string;
                /** Smart-tag filter. Needs a plan with smart tags; otherwise the API answers 4xx with: Smart tag filters cannot be used due to plan restrictions on your group. */
                is_flaky?: boolean;
                /** Smart-tag filter. Needs a plan with smart tags; otherwise the API answers 4xx with: Smart tag filters cannot be used due to plan restrictions on your group. */
                is_new_failure?: boolean;
                sort?: "EXECUTION_ORDER" | "TOP_LEVEL_NAME" | "DURATION" | "FAILED_TEST" | "PLATFORM";
                order?: "Asc" | "Desc";
                next_page?: string;
                /** Comma-separated CI build numbers. Verified against the live API. */
                ci_build_numbers?: string;
                /** Comma-separated host names. Verified against the live API. */
                host_names?: string;
                /** Smart-tag filter. Needs a plan with smart tags; otherwise the API answers 4xx with: Smart tag filters cannot be used due to plan restrictions on your group. */
                has_performance_anomaly?: boolean;
                /** Smart-tag filter. Needs a plan with smart tags; otherwise the API answers 4xx with: Smart tag filters cannot be used due to plan restrictions on your group. */
                is_always_failing?: boolean;
                /** Verified against the live API. */
                is_muted?: boolean;
                /** Comma-separated failure categories. Verified against the live API. */
                failure_categories?: string;
                /** Comma-separated devices. Verified against the live API. */
                devices?: string;
                /** Comma-separated operating systems. Verified against the live API. */
                os?: string;
            };
            header?: never;
            path: {
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
                    "application/json": components["schemas"]["TestRunsResponse"];
                };
            };
        };
    };
    getTestReportingSelfHealingReport: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                buildUuid: string;
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
                        presigned_url?: string;
                        /** Format: date-time */
                        expires_at?: string;
                    };
                };
            };
        };
    };
    getTestReportingQualityGateStatus: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                buildUuid: string;
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
                    "application/json": components["schemas"]["QualityGateStatus"];
                };
            };
        };
    };
    getTestReportingQualityGateSettings: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                projectName: string;
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
                    "application/json": components["schemas"]["QualityGateSettings"];
                };
            };
        };
    };
    updateTestReportingQualityGateSettings: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                projectName: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    enabled: boolean;
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
                        message?: string;
                    };
                };
            };
        };
    };
    createTestReportingQualityGateProfile: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                projectName: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["QualityGateProfileRequest"];
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
                        success?: boolean;
                        uuid?: string;
                    };
                };
            };
        };
    };
    getTestReportingQualityGateProfile: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                projectName: string;
                profileUuid: string;
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
                    "application/json": components["schemas"]["QualityGateProfile"];
                };
            };
        };
    };
    updateTestReportingQualityGateProfile: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                projectName: string;
                profileUuid: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["QualityGateProfileRequest"];
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
                        success?: boolean;
                        uuid?: string;
                    };
                };
            };
        };
    };
    deleteTestReportingQualityGateProfile: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                projectName: string;
                profileUuid: string;
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
                        message?: string;
                    };
                };
            };
        };
    };
    toggleTestReportingQualityGateProfile: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                projectName: string;
                profileUuid: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    enabled: boolean;
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
                        message?: string;
                    };
                };
            };
        };
    };
    uploadTestReportingReport: {
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
                     * JUnit XML file or zip archive containing multiple XML files (max 100 MB)
                     */
                    file: Blob;
                    /** Override the uploaded file's name */
                    file_name?: string;
                    /** Project name to associate this build with */
                    project_name: string;
                    /** Build name for this test run */
                    build_name: string;
                    /**
                     * Report format
                     * @default junit
                     * @enum {string}
                     */
                    format?: "junit" | "allure";
                    /** Unique identifier to correlate split or re-run uploads (expires after 6 hours) */
                    build_identifier?: string;
                    /** Comma-separated tags (e.g. 'regression, nightly') */
                    tags?: string;
                    /** CI job URL (e.g. 'https://ci.example.com/builds/42') */
                    ci?: string;
                    /** Framework name and version (e.g. 'junit, 5.8') */
                    framework_version?: string;
                    /** Git/version-control metadata for this build */
                    version_control?: {
                        /** Commit SHA */
                        sha?: string;
                        /** Short commit SHA */
                        short_sha?: string;
                        /** Branch name */
                        branch?: string;
                        /** Git tag */
                        tag?: string;
                        /** Commit message */
                        commit_message?: string;
                        /** Committer name */
                        committer_name?: string;
                        /** Committer email */
                        committer_email?: string;
                        /** Author name */
                        author_name?: string;
                        /** Author email */
                        author_email?: string;
                        /** Commit timestamp */
                        committed_at?: string;
                        /** Remote repository URL */
                        remote_url?: string;
                    };
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
                        status?: string;
                        message?: string;
                    };
                };
            };
        };
    };
}
