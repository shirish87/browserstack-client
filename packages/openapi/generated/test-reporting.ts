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
        Pagination: {
            has_next?: boolean;
            next_page?: string;
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
        StatusStats: {
            passed?: number;
            failed?: number;
            pending?: number;
            skipped?: number;
            unknown?: number;
        };
        BuildSummary: {
            name?: string;
            status?: string;
            duration?: number;
            user?: string;
            tags?: string[];
            build_id?: string;
            original_name?: string;
            /** Format: date-time */
            finished_at?: string;
            /** Format: date-time */
            started_at?: string;
            status_stats?: components["schemas"]["StatusStats"];
            build_number?: number;
            is_archived?: boolean;
            observability_url?: string;
            tcm_test_run_identifier?: string;
        };
        BuildDetailsSmartTags: {
            is_flaky?: number;
            is_always_failing?: number;
            is_performance_anomaly?: number;
            is_new_failure?: number;
        };
        BuildDetailsVcsInfo: {
            name?: string;
            sha?: string;
            branch?: string;
        };
        BuildDetailsCiInfo: {
            job_name?: string;
            name?: string;
            build_number?: string;
            build_url?: string;
        };
        BuildDetailsHostInfo: {
            hostname?: string;
            os?: string;
        };
        BuildDetails: {
            name?: string;
            description?: string;
            status?: string;
            duration?: number;
            user?: string;
            tags?: string[];
            build_id?: string;
            build_number?: number;
            original_name?: string;
            /** Format: date-time */
            finished_at?: string;
            /** Format: date-time */
            started_at?: string;
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
            name?: string;
            project_id?: number;
            build_id?: string;
            build_name?: string;
            build_number?: number;
            test_summary?: components["schemas"]["StatusStats"];
            is_archived?: boolean;
            hierarchy?: {
                [key: string]: unknown;
            }[];
            pagination?: components["schemas"]["Pagination"];
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
            /** @description Successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        projects?: components["schemas"]["Project"][];
                        pagination?: components["schemas"]["Pagination"];
                    };
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
            /** @description Successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        builds?: components["schemas"]["BuildSummary"][];
                        pagination?: components["schemas"]["Pagination"];
                    };
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
            /** @description Successful operation */
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
            /** @description Successful operation */
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
            /** @description Successful operation */
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
            /** @description Successful operation */
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
            /** @description Successful operation */
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
            /** @description Successful operation */
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
            /** @description Successful operation */
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
            /** @description Successful operation */
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
            /** @description Successful operation */
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
            /** @description Successful operation */
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
                re_runs?: string;
                test_statuses?: string;
                is_flaky?: boolean;
                is_new_failure?: boolean;
                sort?: "EXECUTION_ORDER" | "TOP_LEVEL_NAME" | "DURATION" | "FAILED_TEST" | "PLATFORM";
                order?: "Asc" | "Desc";
                next_page?: string;
            };
            header?: never;
            path: {
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
            /** @description Successful operation */
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
            /** @description Successful operation */
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
            /** @description Successful operation */
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
            /** @description Successful operation */
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
            /** @description Successful operation */
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
            /** @description Successful operation */
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
            /** @description Successful operation */
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
            /** @description Successful operation */
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
            /** @description Successful operation */
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
                    /** Format: binary */
                    file: Blob;
                    file_name?: string;
                    project_name: string;
                    build_name: string;
                    /**
                     * @default junit
                     * @enum {string}
                     */
                    format?: "junit" | "allure";
                    build_identifier?: string;
                    tags?: string;
                    ci?: string;
                    framework_version?: string;
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
                        status?: string;
                        message?: string;
                    };
                };
            };
        };
    };
}
