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
         * @description Returns a paginated list of all Workflow Analyzer accessibility reports for your account.
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
         * @description Returns the summary for a specific Workflow Analyzer report, including score, issue counts, and scan metadata.
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
         * @description Returns the paginated list of accessibility issues for a specific Workflow Analyzer report, optionally filtered by task.
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
         * @description Returns a paginated list of all Assisted Test accessibility reports for your account.
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
         * @description Returns the summary for a specific Assisted Test report, including score, issue counts, and scan metadata.
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
         * @description Returns the paginated list of accessibility issues for a specific Assisted Test report, optionally filtered by task.
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
         * @description Returns all saved authentication configurations used by the Website Scanner for login-protected pages.
         */
        get: operations["getAccessibilityWebsiteScannerAuthConfigs"];
        put?: never;
        /**
         * Create Website Scanner auth config
         * @description Creates a new authentication configuration for the Website Scanner to access login-protected pages during scans.
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
         * @description Returns a paginated list of all configured Website Scanner scans for your account.
         */
        get: operations["getAccessibilityWebsiteScannerScans"];
        put?: never;
        /**
         * Create Website Scanner scan
         * @description Creates and triggers a new Website Scanner accessibility scan for the specified URL.
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
         * @description Returns the configuration overview for a specific Website Scanner scan, including URL list and scan settings.
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
         * @description Returns a paginated list of all scan runs for a specific Website Scanner scan, including status and issue counts.
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
         * @description Returns a detailed summary for a specific scan run, including score, issue counts, and changes since the last run.
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
         * @description Returns the current execution status of a specific Website Scanner scan run.
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
         * @description Returns paginated accessibility issues found during a specific Website Scanner scan run, optionally filtered by task.
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
         * @description Returns the crawl logs for a specific Website Scanner scan run, including per-URL status, redirects, and errors.
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
         * @description Returns a paginated list of all Automated Test accessibility projects for your account.
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
         * @description Returns a paginated list of Automated Test accessibility builds, optionally filtered by project.
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
         * @description Returns the paginated list of test cases and their accessibility results for a specific Automated Test build.
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
         * @description Returns the summary for a specific Automated Test build, including score, health stats, and issue counts.
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
         * @description Returns paginated accessibility issues for a specific Automated Test build, optionally filtered by task.
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
         * @description Returns the accessibility summary for a specific test case within an Automated Test build.
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
         * @description Returns paginated accessibility issues for a specific test case within an Automated Test build.
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
        IssueCount: {
            issueCountBySeverity?: {
                minor?: number;
                serious?: number;
                critical?: number;
                moderate?: number;
            };
            issueCountByURL?: components["schemas"]["IssueCountByURL"][];
            issueCountByComponent?: components["schemas"]["IssueCountByComponent"][];
            issueCountByCategory?: components["schemas"]["IssueCountByCategory"][];
        };
        ScoreData: {
            score?: number;
            impact?: {
                critical?: number;
                serious?: number;
                moderate?: number;
                minor?: number;
            };
        };
        ScoreDataDetailed: {
            score?: number;
            impact?: {
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
        AuthConfig: {
            id?: number;
            name?: string;
            type?: string;
            authData?: {
                url?: string;
                username?: string;
                password?: string;
                usernameSelector?: string;
                passwordSelector?: string;
                submitSelector?: string;
            };
        };
        WorkflowAnalyzerReportItem: {
            id?: number;
            name?: string;
            createdBy?: {
                user_id?: number;
                name?: string;
            };
            wcagVersion?: string;
            status?: string;
            needsReview?: boolean;
            bestPractices?: boolean;
            advanced?: boolean;
            scanType?: string;
            engineInfo?: {
                testEngine?: {
                    name?: string;
                    version?: string;
                };
            };
            issueSummary?: {
                componentCount?: number;
                issueCount?: number;
                pageCount?: number;
            };
        };
        WorkflowAnalyzerReportList: {
            reports?: components["schemas"]["WorkflowAnalyzerReportItem"][];
            pagination?: components["schemas"]["Pagination"];
        };
        WorkflowAnalyzerReportSummary: {
            id?: number;
            name?: string;
            createdBy?: {
                user_id?: number;
                name?: string;
            };
            time?: string;
            wcagVersion?: string;
            status?: string;
            needsReview?: boolean;
            bestPractices?: boolean;
            advanced?: boolean;
            scanType?: string;
            engineInfo?: components["schemas"]["EngineInfo"];
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
            engineInfo?: components["schemas"]["EngineInfo"];
            report_link?: string;
            pagination?: components["schemas"]["Pagination"];
        };
        AssistedTestReportItem: {
            id?: number;
            name?: string;
            createdBy?: {
                user_id?: number;
                name?: string;
            };
            wcagVersion?: string;
            status?: string;
            needsReview?: boolean;
            bestPractices?: boolean;
            advanced?: boolean;
            scanType?: string;
            engineInfo?: {
                testEngine?: {
                    name?: string;
                    version?: string;
                };
            };
            issueSummary?: {
                componentCount?: number;
                issueCount?: number;
                pageCount?: number;
            };
            assistedTestType?: string;
        };
        AssistedTestReportList: {
            reports?: components["schemas"]["AssistedTestReportItem"][];
            pagination?: components["schemas"]["Pagination"];
        };
        AssistedTestReportSummary: {
            id?: number;
            name?: string;
            createdBy?: {
                user_id?: number;
                name?: string;
            };
            time?: string;
            wcagVersion?: string;
            status?: string;
            needsReview?: boolean;
            bestPractices?: boolean;
            advanced?: boolean;
            scanType?: string;
            engineInfo?: components["schemas"]["EngineInfo"];
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
            engineInfo?: components["schemas"]["EngineInfo"];
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
            scanConfigInfo?: {
                name?: string;
                scanConfigId?: number;
                createdBy?: {
                    id?: number;
                    name?: string;
                };
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
            engineInfo?: components["schemas"]["EngineInfo"];
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
            engineInfo?: components["schemas"]["EngineInfo"];
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
            createdBy?: {
                id?: number;
                name?: string;
            };
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
            summary?: {
                pageCount?: number;
                componentCount?: number;
                issueCount?: number;
                severityBreakdown?: {
                    minor?: number;
                    serious?: number;
                    critical?: number;
                    moderate?: number;
                };
            };
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
            testEngine?: components["schemas"]["EngineInfo"];
            changesSinceLastRun?: components["schemas"]["ChangesSinceLastRun"];
            scoreData?: components["schemas"]["ScoreDataDetailed"];
            createdAt?: string;
            advanced?: boolean;
            needsReview?: boolean;
            bestPractice?: boolean;
            sessionData?: {
                browser?: components["schemas"]["BrowserData"][];
                os?: components["schemas"]["OsData"][];
                framework?: {
                    name?: string;
                    version?: string;
                };
            };
            healthSummary?: {
                failed?: number;
                passed?: number;
                skipped?: number;
                total?: number;
            };
            issueSummary?: components["schemas"]["IssueSummaryFull"];
            issueCount?: components["schemas"]["IssueCount"];
            pagination?: components["schemas"]["Pagination"];
        };
        AutomatedTestsBuildIssues: {
            buildNumber?: number;
            buildUId?: string;
            wcagVersion?: string;
            testEngine?: components["schemas"]["EngineInfo"];
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
            /** @description Successful response */
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
            /** @description Successful response */
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
            /** @description Successful response */
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
            /** @description Successful response */
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
            /** @description Successful response */
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
            /** @description Successful response */
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
            /** @description Successful response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
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
                    authData?: {
                        url?: string;
                        username?: string;
                        password?: string;
                        usernameSelector?: string;
                        passwordSelector?: string;
                        submitSelector?: string;
                    };
                };
            };
        };
        responses: {
            /** @description Successful response */
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
            /** @description Successful response */
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
            /** @description Successful response */
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
            /** @description Successful response */
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
            /** @description Successful response */
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
            /** @description Successful response */
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
            /** @description Successful response */
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
            /** @description Successful response */
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
            /** @description Successful response */
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
            /** @description Successful response */
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
            /** @description Successful response */
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
            /** @description Successful response */
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
            /** @description Successful response */
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
            /** @description Successful response */
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
            /** @description Successful response */
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
            /** @description Successful response */
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
