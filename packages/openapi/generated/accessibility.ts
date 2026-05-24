export interface paths {
    "/api/workflow-analyzer/v1/reports": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List Workflow Analyzer reports
         * Returns a paginated list of all Workflow Analyzer accessibility reports for your account.
         */
        get: operations["getAccessibilityWorkflowAnalyzerReports"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/workflow-analyzer/v1/reports/{report_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Workflow Analyzer report summary
         * Returns the summary for a specific Workflow Analyzer report, including score, issue counts, and scan metadata.
         */
        get: operations["getAccessibilityWorkflowAnalyzerReportSummary"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/workflow-analyzer/v1/reports/issues": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Workflow Analyzer report issues
         * Returns the paginated list of accessibility issues for a specific Workflow Analyzer report, optionally filtered by task.
         */
        get: operations["getAccessibilityWorkflowAnalyzerReportIssues"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/assisted-test/v1/reports": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List Assisted Test reports
         * Returns a paginated list of all Assisted Test accessibility reports for your account.
         */
        get: operations["getAccessibilityAssistedTestReports"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/assisted-test/v1/reports/{report_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Assisted Test report summary
         * Returns the summary for a specific Assisted Test report, including score, issue counts, and scan metadata.
         */
        get: operations["getAccessibilityAssistedTestReportSummary"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/assisted-test/v1/reports/issues": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Assisted Test report issues
         * Returns the paginated list of accessibility issues for a specific Assisted Test report, optionally filtered by task.
         */
        get: operations["getAccessibilityAssistedTestReportIssues"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/website-scanner/v1/auth_configs": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List Website Scanner auth configs
         * Returns all saved authentication configurations used by the Website Scanner for login-protected pages.
         */
        get: operations["getAccessibilityWebsiteScannerAuthConfigs"];
        put?: never;
        /**
         * Create Website Scanner auth config
         * Creates a new authentication configuration for the Website Scanner to access login-protected pages during scans.
         */
        post: operations["createAccessibilityWebsiteScannerAuthConfig"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/website-scanner/v1/scans": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List Website Scanner scans
         * Returns a paginated list of all configured Website Scanner scans for your account.
         */
        get: operations["getAccessibilityWebsiteScannerScans"];
        put?: never;
        /**
         * Create Website Scanner scan
         * Creates and triggers a new Website Scanner accessibility scan for the specified URL.
         */
        post: operations["createAccessibilityWebsiteScannerScan"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/website-scanner/v1/scans/{scan_id}/overview": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Website Scanner scan overview
         * Returns the configuration overview for a specific Website Scanner scan, including URL list and scan settings.
         */
        get: operations["getAccessibilityWebsiteScannerScanOverview"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/website-scanner/v1/scans/{scan_id}/scan_runs": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List Website Scanner scan runs
         * Returns a paginated list of all scan runs for a specific Website Scanner scan, including status and issue counts.
         */
        get: operations["getAccessibilityWebsiteScannerScanRuns"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/website-scanner/v1/scans/{scan_id}/scan_runs/{scan_run_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Website Scanner scan run summary
         * Returns a detailed summary for a specific scan run, including score, issue counts, and changes since the last run.
         */
        get: operations["getAccessibilityWebsiteScannerScanRunSummary"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/website-scanner/v1/scans/{scan_id}/scan_runs/{scan_run_id}/status": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Website Scanner scan run status
         * Returns the current execution status of a specific Website Scanner scan run.
         */
        get: operations["getAccessibilityWebsiteScannerScanRunStatus"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/website-scanner/v1/scans/{scan_id}/scan_runs/issues": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Website Scanner scan run issues
         * Returns paginated accessibility issues found during a specific Website Scanner scan run, optionally filtered by task.
         */
        get: operations["getAccessibilityWebsiteScannerScanRunIssues"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/website-scanner/v1/scans/{scan_id}/scan_runs/{scan_run_id}/scan_logs": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Website Scanner scan run logs
         * Returns the crawl logs for a specific Website Scanner scan run, including per-URL status, redirects, and errors.
         */
        get: operations["getAccessibilityWebsiteScannerScanRunLogs"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/automated-tests/v1/projects": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List Automated Test projects
         * Returns a paginated list of all Automated Test accessibility projects for your account.
         */
        get: operations["getAccessibilityAutomatedTestProjects"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/automated-tests/v1/builds": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List Automated Test builds
         * Returns a paginated list of Automated Test accessibility builds, optionally filtered by project.
         */
        get: operations["getAccessibilityAutomatedTestBuilds"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/automated-tests/v1/builds/{thBuildId}/test-cases": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List test cases for an Automated Test build
         * Returns the paginated list of test cases and their accessibility results for a specific Automated Test build.
         */
        get: operations["getAccessibilityAutomatedTestBuildTestCases"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/automated-tests/v1/builds/{thBuildId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Automated Test build summary
         * Returns the summary for a specific Automated Test build, including score, health stats, and issue counts.
         */
        get: operations["getAccessibilityAutomatedTestBuildSummary"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/automated-tests/v1/builds/issues": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Automated Test build issues
         * Returns paginated accessibility issues for a specific Automated Test build, optionally filtered by task.
         */
        get: operations["getAccessibilityAutomatedTestBuildIssues"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/automated-tests/v1/builds/{thBuildId}/test-cases/{test_case_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Automated Test case summary
         * Returns the accessibility summary for a specific test case within an Automated Test build.
         */
        get: operations["getAccessibilityAutomatedTestBuildTestCaseSummary"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/automated-tests/v1/builds/{thBuildId}/issues": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Automated Test case issues
         * Returns paginated accessibility issues for a specific test case within an Automated Test build.
         */
        get: operations["getAccessibilityAutomatedTestBuildTestCaseIssues"];
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
        Pagination: {
            has_next?: boolean;
            next_page?: string;
        };
        EngineInfo: {
            name?: string;
            version?: string;
        };
        IssueSummary: {
            componentCount?: number;
            issueCount?: number;
            pageCount?: number;
        };
        IssueSummaryFull: {
            issueCount?: number;
            pageCount?: number;
            componentCount?: number;
            needsReview?: number;
            hidden?: number;
        };
        IssueCountBySeverity: {
            minor?: number;
            serious?: number;
            critical?: number;
            moderate?: number;
        };
        IssueCount: {
            issueCountBySeverity?: components["schemas"]["IssueCountBySeverity"];
            issueCountByURL?: components["schemas"]["IssueCountByURL"][];
            issueCountByComponent?: components["schemas"]["IssueCountByComponent"][];
            issueCountByCategory?: components["schemas"]["IssueCountByCategory"][];
        };
        IssueCountSeverity: {
            critical?: number;
            serious?: number;
            moderate?: number;
            minor?: number;
        };
        IssueCountSeverityDetailed: {
            critical?: number;
            criticalPassed?: number;
            criticalFailed?: number;
            serious?: number;
            seriousPassed?: number;
            seriousFailed?: number;
            moderate?: number;
            moderatePassed?: number;
            moderateFailed?: number;
            minor?: number;
            minorPassed?: number;
            minorFailed?: number;
        };
        ScoreData: {
            score?: number;
            impact?: components["schemas"]["IssueCountSeverity"];
        };
        ScoreDataDetailed: {
            score?: number;
            impact?: components["schemas"]["IssueCountSeverityDetailed"];
        };
        ChangesSinceLastRun: {
            newIssues?: number;
            retainedIssues?: number;
            resolvedIssues?: number;
        };
        OsData: {
            name?: string;
            version?: string | null;
            logo?: string;
        };
        BrowserData: {
            name?: string;
            version?: string;
            logo?: string;
        };
        SessionDataFramework: {
            name?: string;
            version?: string;
        };
        SessionData: {
            browser?: components["schemas"]["BrowserData"][];
            os?: components["schemas"]["OsData"][];
            framework?: components["schemas"]["SessionDataFramework"];
        };
        HealthSummary: {
            failed?: number;
            passed?: number;
            skipped?: number;
            total?: number;
        };
        TestCaseSummaryBreakdown: {
            minor?: number;
            serious?: number;
            critical?: number;
            moderate?: number;
        };
        TestCaseSummary: {
            pageCount?: number;
            componentCount?: number;
            issueCount?: number;
            severityBreakdown?: components["schemas"]["TestCaseSummaryBreakdown"];
        };
        ScanConfigCreatedBy: {
            id?: number;
            name?: string;
        };
        ScanConfigInfo: {
            name?: string;
            scanConfigId?: number;
            createdBy?: components["schemas"]["ScanConfigCreatedBy"];
            wcagVersion?: string;
            needsReview?: boolean;
            bestPractices?: boolean;
            recurring?: boolean;
            advanced?: boolean;
            pageCount?: number;
            nextScanDate?: string;
            active?: boolean;
            isProcessing?: boolean;
            authEnabled?: boolean;
            localTestingEnabled?: boolean;
        };
        ScanEngineInfo: {
            testEngine?: components["schemas"]["ScanEngineInfo"];
        };
        AuthConfigData: {
            url?: string;
            username?: string;
            password?: string;
            usernameSelector?: string;
            passwordSelector?: string;
            submitSelector?: string;
        };
        WorkflowAnalyzerCreatedBy: {
            id?: number;
            name?: string;
            email?: string;
        };
        AuthConfig: {
            id?: number;
            name?: string;
            type?: string;
            authData?: components["schemas"]["AuthConfigData"];
        };
        WorkflowAnalyzerReportItem: {
            id?: number;
            name?: string;
            createdBy?: components["schemas"]["WorkflowAnalyzerCreatedBy"];
            wcagVersion?: string;
            status?: string;
            needsReview?: boolean;
            bestPractices?: boolean;
            advanced?: boolean;
            scanType?: string;
            engineInfo?: components["schemas"]["ScanEngineInfo"];
            issueSummary?: components["schemas"]["IssueSummary"];
        };
        WorkflowAnalyzerReportList: {
            reports?: components["schemas"]["WorkflowAnalyzerReportItem"][];
            pagination?: components["schemas"]["Pagination"];
        };
        WorkflowAnalyzerReportSummary: {
            id?: number;
            name?: string;
            createdBy?: components["schemas"]["WorkflowAnalyzerCreatedBy"];
            time?: string;
            wcagVersion?: string;
            status?: string;
            needsReview?: boolean;
            bestPractices?: boolean;
            advanced?: boolean;
            scanType?: string;
            engineInfo?: components["schemas"]["ScanEngineInfo"];
            scoreData?: components["schemas"]["ScoreData"];
            issueSummary?: components["schemas"]["IssueSummary"];
            issueCount?: components["schemas"]["IssueCount"];
        };
        WorkflowAnalyzerReportIssues: {
            id?: number;
            name?: string;
            time?: string;
            wcagVersion?: string;
            status?: string;
            needsReview?: boolean;
            bestPractices?: boolean;
            advanced?: boolean;
            scanType?: string;
            engineInfo?: components["schemas"]["ScanEngineInfo"];
            report_link?: string;
            pagination?: components["schemas"]["Pagination"];
        };
        AssistedTestReportItem: {
            id?: number;
            name?: string;
            createdBy?: components["schemas"]["WorkflowAnalyzerCreatedBy"];
            wcagVersion?: string;
            status?: string;
            needsReview?: boolean;
            bestPractices?: boolean;
            advanced?: boolean;
            scanType?: string;
            engineInfo?: components["schemas"]["ScanEngineInfo"];
            issueSummary?: components["schemas"]["IssueSummary"];
            assistedTestType?: string;
        };
        AssistedTestReportList: {
            reports?: components["schemas"]["AssistedTestReportItem"][];
            pagination?: components["schemas"]["Pagination"];
        };
        AssistedTestReportSummary: {
            id?: number;
            name?: string;
            createdBy?: components["schemas"]["WorkflowAnalyzerCreatedBy"];
            time?: string;
            wcagVersion?: string;
            status?: string;
            needsReview?: boolean;
            bestPractices?: boolean;
            advanced?: boolean;
            scanType?: string;
            engineInfo?: components["schemas"]["ScanEngineInfo"];
            scoreData?: components["schemas"]["ScoreData"];
            issueSummary?: components["schemas"]["IssueSummary"];
            issueCount?: components["schemas"]["IssueCount"];
            assistedTestType?: string;
        };
        AssistedTestReportIssues: {
            id?: number;
            name?: string;
            time?: string;
            wcagVersion?: string;
            status?: string;
            needsReview?: boolean;
            bestPractices?: boolean;
            advanced?: boolean;
            scanType?: string;
            engineInfo?: components["schemas"]["ScanEngineInfo"];
            report_link?: string;
            pagination?: components["schemas"]["Pagination"];
            assistedTestType?: string;
        };
        WebsiteScannerScanCreated: {
            id?: number;
            scanRunId?: number;
            urlCount?: number;
        };
        WebsiteScannerScanList: {
            scans?: {
                id?: number;
                name?: string;
                createdBy?: number;
                wcagVersion?: string;
                recurring?: boolean;
                active?: boolean;
                nextScanDate?: string;
                status?: string;
                advanced?: boolean;
                localTestingEnabled?: boolean;
                authEnabled?: boolean;
                pageCount?: number;
                scan_url?: string;
                lastScanDetails?: {
                    reportId?: number;
                    lastScanDate?: string;
                    scanStatus?: string;
                    issues?: number;
                    reportSummary?: {
                        failure?: number;
                        success?: number;
                        redirect?: number;
                    };
                    error?: string | null;
                };
            }[];
            pagination?: components["schemas"]["Pagination"];
        };
        WebsiteScannerScanOverview: {
            scanConfigInfo?: components["schemas"]["ScanConfigInfo"];
            urlList?: string[];
        };
        WebsiteScannerScanRunList: {
            scan_runs?: {
                id?: number;
                scanDate?: string;
                issues?: number;
                componentCount?: number;
                reportSummary?: {
                    failure?: number;
                    success?: number;
                    redirect?: number;
                };
                issueSummary?: {
                    minor?: number;
                    serious?: number;
                    critical?: number;
                    moderate?: number;
                };
                error?: string | null;
            }[];
            pagination?: components["schemas"]["Pagination"];
        };
        WebsiteScannerScanRunSummary: {
            scan_id?: number;
            scan_run_id?: number;
            time?: string;
            needsReview?: boolean;
            bestPractices?: boolean;
            advanced?: boolean;
            wcagVersion?: string;
            engineInfo?: components["schemas"]["ScanEngineInfo"];
            authEnabled?: boolean;
            localTestingEnabled?: boolean;
            status?: string;
            changesSinceLastRun?: components["schemas"]["ChangesSinceLastRun"];
            scoreData?: components["schemas"]["ScoreData"];
            issueSummary?: components["schemas"]["IssueSummaryFull"];
            issueCount?: components["schemas"]["IssueCount"];
            pagination?: components["schemas"]["Pagination"];
        };
        WebsiteScannerScanRunStatus: {
            scan_id?: number;
            scan_run_id?: number;
            status?: string;
        };
        WebsiteScannerScanRunIssues: {
            scan_id?: number;
            scan_run_id?: number;
            time?: string;
            needsReview?: boolean;
            bestPractices?: boolean;
            advanced?: boolean;
            engineInfo?: components["schemas"]["ScanEngineInfo"];
            wcagVersion?: string;
            report_link?: string;
        };
        WebsiteScannerScanRunLogs: {
            urlCount?: number;
            scanLogs?: {
                time?: string;
                pageUrl?: string;
                description?: string;
                finalRedirectUrl?: string;
                status?: string;
            }[];
        };
        AutomatedTestsProjectList: {
            projects?: {
                id?: number;
                name?: string;
                createdAt?: string;
            }[];
            pagination?: components["schemas"]["Pagination"];
        };
        AutomatedTestsBuildItem: {
            id?: number;
            buildNumber?: number;
            name?: string;
            startedAt?: string;
            wcagVersion?: string;
            recurring?: boolean;
            active?: boolean;
            status?: string;
            advanced?: boolean;
            localTestingEnabled?: boolean;
            authEnabled?: boolean;
            pageCount?: number;
            createdBy?: components["schemas"]["WorkflowAnalyzerCreatedBy"];
            projectId?: number;
            thBuildId?: string;
        };
        AutomatedTestsBuildList: {
            builds?: components["schemas"]["AutomatedTestsBuildItem"][];
            pagination?: components["schemas"]["Pagination"];
        };
        AutomatedTestsBuildTestCaseItem: {
            id?: number;
            name?: string;
            status?: string;
            time?: string;
            summary?: components["schemas"]["TestCaseSummary"];
            file?: string;
            osData?: components["schemas"]["OsData"];
            browserData?: components["schemas"]["BrowserData"];
            tags?: string | null;
            testRecordingTags?: string[];
            error?: string | null;
            pages?: string[];
        };
        AutomatedTestsBuildTestCases: {
            testCases?: components["schemas"]["AutomatedTestsBuildTestCaseItem"][];
            pagination?: components["schemas"]["Pagination"];
        };
        AutomatedTestsBuildSummary: {
            id?: number;
            buildNumber?: number;
            wcagVersion?: string;
            testEngine?: components["schemas"]["ScanEngineInfo"];
            changesSinceLastRun?: components["schemas"]["ChangesSinceLastRun"];
            scoreData?: components["schemas"]["ScoreDataDetailed"];
            createdAt?: string;
            advanced?: boolean;
            needsReview?: boolean;
            bestPractice?: boolean;
            sessionData?: components["schemas"]["SessionData"];
            healthSummary?: components["schemas"]["HealthSummary"];
            issueSummary?: components["schemas"]["IssueSummaryFull"];
            issueCount?: components["schemas"]["IssueCount"];
            pagination?: components["schemas"]["Pagination"];
        };
        AutomatedTestsBuildIssues: {
            buildNumber?: number;
            buildUId?: string;
            wcagVersion?: string;
            testEngine?: components["schemas"]["ScanEngineInfo"];
            time?: string;
            advanced?: boolean;
            needsReview?: boolean;
            bestPractice?: boolean;
            report_link?: string;
            pagination?: components["schemas"]["Pagination"];
        };
        AutomatedTestsTestCaseSummary: {
            name?: string;
            tags?: string | null;
            file?: string;
            scopeList?: string[];
            osData?: components["schemas"]["OsData"];
            browserData?: components["schemas"]["BrowserData"];
            changesSinceLastRun?: components["schemas"]["ChangesSinceLastRun"];
            scoreData?: components["schemas"]["ScoreDataDetailed"];
            issueSummary?: components["schemas"]["IssueSummaryFull"];
            issueCount?: components["schemas"]["IssueCount"];
            pagination?: components["schemas"]["Pagination"];
        };
        AutomatedTestsTestCaseIssues: {
            name?: string;
            tags?: string | null;
            file?: string;
            scopeList?: string[];
            osData?: components["schemas"]["OsData"];
            browserData?: components["schemas"]["BrowserData"];
            report_link?: string;
            pagination?: components["schemas"]["Pagination"];
        };
        IssueCountByURL: {
            url?: string;
            count?: number;
        };
        IssueCountByComponent: {
            componentId?: string;
            count?: number;
        };
        IssueCountByCategory: {
            category?: string;
            count?: number;
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
    getAccessibilityWorkflowAnalyzerReports: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** Successful response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["WorkflowAnalyzerReportList"];
                };
            };
        };
    };
    getAccessibilityWorkflowAnalyzerReportSummary: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                report_id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** Successful response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["WorkflowAnalyzerReportSummary"];
                };
            };
        };
    };
    getAccessibilityWorkflowAnalyzerReportIssues: {
        parameters: {
            query?: {
                report_id?: number;
                task_id?: string;
                next_page?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** Successful response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["WorkflowAnalyzerReportIssues"];
                };
            };
        };
    };
    getAccessibilityAssistedTestReports: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** Successful response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AssistedTestReportList"];
                };
            };
        };
    };
    getAccessibilityAssistedTestReportSummary: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                report_id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** Successful response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AssistedTestReportSummary"];
                };
            };
        };
    };
    getAccessibilityAssistedTestReportIssues: {
        parameters: {
            query?: {
                report_id?: number;
                task_id?: string;
                next_page?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** Successful response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AssistedTestReportIssues"];
                };
            };
        };
    };
    getAccessibilityWebsiteScannerAuthConfigs: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** Successful response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** AuthConfigsData */
                        data?: {
                            authConfigs?: components["schemas"]["AuthConfig"][];
                        };
                    };
                };
            };
        };
    };
    createAccessibilityWebsiteScannerAuthConfig: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    name?: string;
                    type?: string;
                    authData?: components["schemas"]["AuthConfigData"];
                };
            };
        };
        responses: {
            /** Successful response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        data?: components["schemas"]["AuthConfig"];
                    };
                };
            };
        };
    };
    getAccessibilityWebsiteScannerScans: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** Successful response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["WebsiteScannerScanList"];
                };
            };
        };
    };
    createAccessibilityWebsiteScannerScan: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    scan_url?: string;
                };
            };
        };
        responses: {
            /** Successful response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        data?: components["schemas"]["WebsiteScannerScanCreated"];
                    };
                };
            };
        };
    };
    getAccessibilityWebsiteScannerScanOverview: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                scan_id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** Successful response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        data?: components["schemas"]["WebsiteScannerScanOverview"];
                    };
                };
            };
        };
    };
    getAccessibilityWebsiteScannerScanRuns: {
        parameters: {
            query?: {
                page?: number;
                page_size?: number;
            };
            header?: never;
            path: {
                scan_id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** Successful response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["WebsiteScannerScanRunList"];
                };
            };
        };
    };
    getAccessibilityWebsiteScannerScanRunSummary: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                scan_id: number;
                scan_run_id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** Successful response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["WebsiteScannerScanRunSummary"];
                };
            };
        };
    };
    getAccessibilityWebsiteScannerScanRunStatus: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                scan_id: number;
                scan_run_id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** Successful response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        data?: components["schemas"]["WebsiteScannerScanRunStatus"];
                    };
                };
            };
        };
    };
    getAccessibilityWebsiteScannerScanRunIssues: {
        parameters: {
            query?: {
                scan_run_id?: number;
                task_id?: string;
                next_page?: string;
            };
            header?: never;
            path: {
                scan_id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** Successful response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["WebsiteScannerScanRunIssues"];
                };
            };
        };
    };
    getAccessibilityWebsiteScannerScanRunLogs: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                scan_id: number;
                scan_run_id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** Successful response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        data?: components["schemas"]["WebsiteScannerScanRunLogs"];
                    };
                };
            };
        };
    };
    getAccessibilityAutomatedTestProjects: {
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
            /** Successful response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AutomatedTestsProjectList"];
                };
            };
        };
    };
    getAccessibilityAutomatedTestBuilds: {
        parameters: {
            query?: {
                next_page?: string;
                projectId?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** Successful response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AutomatedTestsBuildList"];
                };
            };
        };
    };
    getAccessibilityAutomatedTestBuildTestCases: {
        parameters: {
            query?: {
                next_page?: string;
            };
            header?: never;
            path: {
                thBuildId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** Successful response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        testCases?: components["schemas"]["AutomatedTestsBuildTestCases"];
                    };
                };
            };
        };
    };
    getAccessibilityAutomatedTestBuildSummary: {
        parameters: {
            query?: {
                next_page?: string;
            };
            header?: never;
            path: {
                thBuildId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** Successful response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        data?: components["schemas"]["AutomatedTestsBuildSummary"];
                    };
                };
            };
        };
    };
    getAccessibilityAutomatedTestBuildIssues: {
        parameters: {
            query?: {
                build_id?: string;
                task_id?: string;
                next_page?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** Successful response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AutomatedTestsBuildIssues"];
                };
            };
        };
    };
    getAccessibilityAutomatedTestBuildTestCaseSummary: {
        parameters: {
            query?: {
                next_page?: string;
            };
            header?: never;
            path: {
                thBuildId: string;
                test_case_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** Successful response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        data?: components["schemas"]["AutomatedTestsTestCaseSummary"];
                    };
                };
            };
        };
    };
    getAccessibilityAutomatedTestBuildTestCaseIssues: {
        parameters: {
            query?: {
                test_case?: string;
                task_id?: string;
                next_page?: string;
            };
            header?: never;
            path: {
                thBuildId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** Successful response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AutomatedTestsTestCaseIssues"];
                };
            };
        };
    };
}
