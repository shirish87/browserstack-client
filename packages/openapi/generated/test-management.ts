export interface paths {
    "/api/v2/projects": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get list of projects */
        get: operations["getTestManagementProjects"];
        put?: never;
        /** Create a project */
        post: operations["createTestManagementProject"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v2/projects/{projectId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get project details */
        get: operations["getTestManagementProject"];
        put?: never;
        post?: never;
        /** Delete a project */
        delete: operations["deleteTestManagementProject"];
        options?: never;
        head?: never;
        /** Update a project */
        patch: operations["updateTestManagementProject"];
        trace?: never;
    };
    "/api/v2/projects/{projectId}/folders": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get list of folders in a project */
        get: operations["getTestManagementFolders"];
        put?: never;
        /** Create a folder */
        post: operations["createTestManagementFolder"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v2/projects/{projectId}/folders/{folderId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get folder details */
        get: operations["getTestManagementFolder"];
        put?: never;
        post?: never;
        /** Delete a folder */
        delete: operations["deleteTestManagementFolder"];
        options?: never;
        head?: never;
        /** Update a folder */
        patch: operations["updateTestManagementFolder"];
        trace?: never;
    };
    "/api/v2/projects/{projectId}/folders/{folderId}/move": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Move a folder */
        post: operations["moveTestManagementFolder"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v2/projects/{projectId}/test-cases": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get list of test cases */
        get: operations["getTestManagementTestCases"];
        put?: never;
        post?: never;
        /** Bulk delete test cases */
        delete: operations["bulkDeleteTestManagementTestCases"];
        options?: never;
        head?: never;
        /** Bulk edit test cases */
        patch: operations["bulkEditTestManagementTestCases"];
        trace?: never;
    };
    "/api/v2/projects/{projectId}/test-cases/archive": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Bulk archive test cases */
        post: operations["bulkArchiveTestManagementTestCases"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v2/projects/{projectId}/test-cases/unarchive": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Bulk unarchive test cases */
        post: operations["bulkUnarchiveTestManagementTestCases"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v2/projects/{projectId}/test-cases/with-operations": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /** Bulk edit test cases with operations */
        patch: operations["bulkEditTestManagementTestCasesWithOperations"];
        trace?: never;
    };
    "/api/v2/projects/{projectId}/folders/{folderId}/test-cases": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Create a test case */
        post: operations["createTestManagementTestCase"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v2/projects/{projectId}/test-cases/{testCaseId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /** Delete a test case */
        delete: operations["deleteTestManagementTestCase"];
        options?: never;
        head?: never;
        /** Update a test case */
        patch: operations["updateTestManagementTestCase"];
        trace?: never;
    };
    "/api/v2/projects/{projectId}/test-cases/{testCaseId}/archive": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Archive a test case */
        post: operations["archiveTestManagementTestCase"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v2/projects/{projectId}/test-cases/{testCaseId}/unarchive": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Unarchive a test case */
        post: operations["unarchiveTestManagementTestCase"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v2/projects/{projectId}/test-cases/{testCaseId}/move": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Move a test case to a different folder */
        post: operations["moveTestManagementTestCase"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v2/projects/{projectId}/test-cases/{testCaseId}/attachments": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get attachments for a test case */
        get: operations["getTestManagementTestCaseAttachments"];
        put?: never;
        /** Add attachment to a test case */
        post: operations["addTestManagementTestCaseAttachment"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v2/projects/{projectId}/test-cases/{testCaseId}/attachments/{attachmentId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /** Delete attachment from a test case */
        delete: operations["deleteTestManagementTestCaseAttachment"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v2/projects/{projectId}/test-cases/{testCaseId}/results": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get test results for a test case across all test runs */
        get: operations["getTestManagementTestCaseResults"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v2/projects/{projectId}/test-runs": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get list of test runs */
        get: operations["getTestManagementTestRuns"];
        put?: never;
        /** Create a test run */
        post: operations["createTestManagementTestRun"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v2/projects/{projectId}/test-runs/{testRunId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get test run details */
        get: operations["getTestManagementTestRun"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v2/projects/{projectId}/test-runs/{testRunId}/test-cases": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get test cases of a test run */
        get: operations["getTestManagementTestRunTestCases"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v2/projects/{projectId}/test-runs/{testRunId}/update": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Fully update a test run (replaces test cases) */
        post: operations["updateTestManagementTestRun"];
        delete?: never;
        options?: never;
        head?: never;
        /** Partially update a test run */
        patch: operations["patchTestManagementTestRun"];
        trace?: never;
    };
    "/api/v2/projects/{projectId}/test-runs/{testRunId}/assign": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Update assignees of test cases within a test run */
        post: operations["assignTestManagementTestRunTestCases"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v2/projects/{projectId}/test-runs/{testRunId}/close": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Close a test run */
        post: operations["closeTestManagementTestRun"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v2/projects/{projectId}/test-runs/{testRunId}/delete": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Delete a test run */
        post: operations["deleteTestManagementTestRun"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v2/projects/{projectId}/test-runs/{testRunId}/results": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get all test results for a test run */
        get: operations["getTestManagementTestRunResults"];
        put?: never;
        /** Add test result(s) to a test run */
        post: operations["addTestManagementTestRunResults"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v2/projects/{projectId}/test-runs/{testRunId}/test-cases/{testCaseId}/results": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get test results for a specific test case in a test run */
        get: operations["getTestManagementTestRunTestCaseResults"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v2/projects/{projectId}/test-results/{testResultId}/attachments": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get attachments for a test result */
        get: operations["getTestManagementTestResultAttachments"];
        put?: never;
        /** Add attachment to a test result */
        post: operations["addTestManagementTestResultAttachment"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v2/projects/{projectId}/test-results/{testResultId}/attachments/{attachmentId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /** Delete attachment from a test result */
        delete: operations["deleteTestManagementTestResultAttachment"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v2/projects/{projectId}/test-plans": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get list of test plans */
        get: operations["getTestManagementTestPlans"];
        put?: never;
        /** Create a test plan */
        post: operations["createTestManagementTestPlan"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v2/projects/{projectId}/test-plans/{testPlanId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get test plan details */
        get: operations["getTestManagementTestPlan"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v2/projects/{projectId}/test-plans/{testPlanId}/update": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Update a test plan */
        post: operations["updateTestManagementTestPlan"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v2/projects/{projectId}/test-plans/{testPlanId}/test-runs": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get test runs linked to a test plan */
        get: operations["getTestManagementTestPlanTestRuns"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v2/configurations": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get all configurations */
        get: operations["getTestManagementConfigurations"];
        put?: never;
        /** Add a custom configuration */
        post: operations["createTestManagementConfiguration"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v2/configurations/{configurationId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get configuration by ID */
        get: operations["getTestManagementConfiguration"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v2/custom-fields": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get all custom fields */
        get: operations["getTestManagementCustomFields"];
        put?: never;
        /** Create a custom field */
        post: operations["createTestManagementCustomField"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v2/custom-fields/{customFieldId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /** Delete a custom field */
        delete: operations["deleteTestManagementCustomField"];
        options?: never;
        head?: never;
        /** Update a custom field */
        patch: operations["updateTestManagementCustomField"];
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        PaginationInfo: {
            page?: number;
            page_size?: number;
            count?: number;
            prev?: number | null;
            next?: number | null;
        };
        ProjectSummary: {
            name?: string;
            identifier?: string;
        };
        Project: {
            name?: string;
            identifier?: string;
            description?: string;
            created_at?: string;
            created_by?: string;
            team_id?: number[];
        };
        CustomFieldResponseData: {
            custom_field?: components["schemas"]["CustomField"];
        };
        TestCaseResponseData: {
            test_case?: components["schemas"]["TestCase"];
        };
        TestRunCount: {
            active?: number;
            closed?: number;
        };
        TestCaseFilter: {
            status?: string[];
            priority?: string[];
            case_type?: string[];
            owner?: string[];
            tags?: string[];
            custom_fields?: {
                [key: string]: unknown;
            };
        };
        IssueTracker: {
            name?: string;
            host?: string;
        };
        TestRunPlanSummary: {
            identifier?: string;
            name?: string;
        } | null;
        TestRunLinks: {
            [key: string]: unknown;
        };
        TestRunProgress: {
            [key: string]: unknown;
        };
        CreateTestRunInput: {
            name: string;
            plan_status?: string;
            description?: string;
            start_date?: string;
            end_date?: string | null;
        };
        FolderLinks: {
            sub_folders?: string;
        };
        FolderSummary: {
            id?: number;
            name?: string;
            parent_id?: number | null;
            sub_folders_count?: number;
            links?: components["schemas"]["FolderLinks"];
        };
        Folder: {
            id?: number;
            name?: string;
            description?: string;
            parent_id?: number | null;
            cases_count?: number;
            sub_folders_count?: number;
            links?: components["schemas"]["FolderLinks"];
        };
        TestCaseStep: {
            id?: number;
            order?: number;
            description?: string;
            result?: string;
        };
        TestCase: {
            identifier?: string;
            name?: string;
            description?: string;
            owner?: string;
            preconditions?: string;
            case_type?: string;
            priority?: string;
            status?: string;
            automation_status?: string;
            archived?: string;
            folder_id?: number;
            template?: string;
            tags?: string[];
            test_case_steps?: components["schemas"]["TestCaseStep"][];
            issues?: string[];
            custom_fields?: {
                [key: string]: unknown;
            };
            created_at?: string;
            updated_at?: string;
            feature?: string;
            scenario?: string;
            background?: string;
        };
        TestRunSummary: {
            identifier?: string;
            name?: string;
            active_state?: string;
            run_state?: string;
            assignee?: string;
            created_at?: string;
            project_id?: string;
            test_cases_count?: number;
            configurations?: number[];
        };
        TestRun: {
            identifier?: string;
            name?: string;
            description?: string;
            active_state?: string;
            run_state?: string;
            assignee?: string;
            created_at?: string;
            updated_at?: string;
            project_id?: string;
            test_cases_count?: number;
            tags?: string[];
            issues?: string[];
            test_plan?: components["schemas"]["TestRunPlanSummary"];
        };
        TestRunDetail: components["schemas"]["TestRun"] & {
            configurations?: number[];
            test_cases?: components["schemas"]["TestRunTestCase"][];
            links?: components["schemas"]["TestRunLinks"];
            passed_count?: number;
            failed_count?: number;
            overall_progress?: components["schemas"]["TestRunProgress"];
        };
        TestRunTestCase: {
            identifier?: string;
            name?: string;
            description?: string;
            case_type?: string;
            priority?: string;
            status?: string;
            assignee?: string;
            latest_status?: string;
            latest_result_id?: number;
            configuration_id?: number;
            folder_path?: number[];
            steps?: components["schemas"]["TestCaseStep"][];
            dataset?: {
                variable?: string;
                row?: string;
            }[];
            created_at?: string;
            last_updated_at?: string;
            created_by?: string;
            last_updated_by?: string;
        };
        TestRunInput: {
            name?: string;
            description?: string;
            run_state?: string;
            assignee?: string;
            test_case_assignee?: string;
            tags?: string[];
            issues?: string[];
            issue_tracker?: components["schemas"]["IssueTracker"];
            test_plan_id?: string;
            configurations?: number[];
            configuration_map?: {
                test_case_id?: string | string[];
                configuration_ids?: number[];
            }[];
            test_cases?: string[];
            folder_ids?: number[];
            include_all?: boolean;
            filter_test_cases?: components["schemas"]["TestCaseFilter"];
        };
        TestRunPatchInput: {
            name?: string;
            run_state?: string;
            tags?: string[];
            configurations?: number[];
            configuration_map?: {
                test_case_id?: string | string[];
                configuration_ids?: number[];
            }[];
            filter_test_cases?: components["schemas"]["TestCaseFilter"];
        };
        TestPlan: {
            identifier?: string;
            name?: string;
            description?: string;
            active_state?: string;
            plan_status?: string;
            project_id?: string;
            start_date?: string;
            end_date?: string | null;
            created_at?: string;
            test_runs_count?: components["schemas"]["TestRunCount"];
        };
        TestPlanDetail: components["schemas"]["TestPlan"] & {
            test_runs?: components["schemas"]["TestRunSummary"][];
        };
        TestResult: {
            id?: number;
            test_run_id?: string;
            test_case_id?: string;
            configuration_id?: number;
            status?: string;
            comment?: string;
            duration?: number;
            created_at?: string;
            created_by?: string;
            attachments?: components["schemas"]["Attachment"][];
            issues?: string[];
            custom_fields?: {
                [key: string]: unknown;
            };
        };
        TestResultInput: {
            status: string;
            comment?: string;
            duration?: number;
            issues?: string[];
            issue_tracker?: components["schemas"]["IssueTracker"];
            custom_fields?: {
                [key: string]: unknown;
            };
        };
        Attachment: {
            id?: number;
            filename?: string;
            file_size?: number;
            created_at?: string;
            created_by?: string;
            url?: string;
            inline?: boolean;
        };
        Configuration: {
            id?: number;
            name?: string;
            created_at?: string;
        };
        CustomField: {
            id?: string;
            field_name?: string;
            place_holder_text?: string;
            field_type?: string;
            is_required?: boolean;
            options?: {
                option_value?: string;
                is_default?: boolean;
            }[];
            applies_to_all_projects?: boolean;
            field_entity_type?: string;
            link_to_future_projects?: boolean;
            assigned_projects?: string[];
            created_at?: string;
        };
    };
    responses: {
        /** @description Unauthorized */
        Unauthorized: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": {
                    message?: string;
                };
            };
        };
        /** @description Not Found */
        NotFound: {
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
    parameters: {
        ProjectId: string;
        FolderId: number;
        TestCaseId: string;
        TestRunId: string;
        TestPlanId: string;
        TestResultId: number;
        AttachmentId: number;
        ConfigurationId: string;
        CustomFieldId: string;
    };
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    getTestManagementProjects: {
        parameters: {
            query?: {
                p?: number;
                page_size?: 30 | 300;
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
                        success?: boolean;
                        projects?: components["schemas"]["ProjectSummary"][];
                        info?: components["schemas"]["PaginationInfo"];
                    };
                };
            };
            401: components["responses"]["Unauthorized"];
        };
    };
    createTestManagementProject: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /** CreateProjectInput */
                    project?: {
                        name: string;
                        description?: string;
                    };
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
                        project?: components["schemas"]["Project"];
                    };
                };
            };
            401: components["responses"]["Unauthorized"];
        };
    };
    getTestManagementProject: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                projectId: components["parameters"]["ProjectId"];
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
                        success?: boolean;
                        project?: components["schemas"]["Project"];
                    };
                };
            };
            401: components["responses"]["Unauthorized"];
            404: components["responses"]["NotFound"];
        };
    };
    deleteTestManagementProject: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                projectId: components["parameters"]["ProjectId"];
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
                        success?: boolean;
                        message?: string;
                    };
                };
            };
            401: components["responses"]["Unauthorized"];
            404: components["responses"]["NotFound"];
        };
    };
    updateTestManagementProject: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                projectId: components["parameters"]["ProjectId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /** UpdateProjectInput */
                    project?: {
                        name?: string;
                        description?: string;
                    };
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
                        project?: components["schemas"]["Project"];
                    };
                };
            };
            401: components["responses"]["Unauthorized"];
            404: components["responses"]["NotFound"];
        };
    };
    getTestManagementFolders: {
        parameters: {
            query?: {
                p?: number;
                page_size?: 30 | 300;
            };
            header?: never;
            path: {
                projectId: components["parameters"]["ProjectId"];
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
                        success?: boolean;
                        folders?: components["schemas"]["FolderSummary"][];
                        info?: components["schemas"]["PaginationInfo"];
                    };
                };
            };
            401: components["responses"]["Unauthorized"];
        };
    };
    createTestManagementFolder: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                projectId: components["parameters"]["ProjectId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /** CreateFolderData */
                    folder?: {
                        name: string;
                        description: string;
                        parent_id?: number | null;
                    };
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
                        folder?: components["schemas"]["Folder"];
                    };
                };
            };
            401: components["responses"]["Unauthorized"];
        };
    };
    getTestManagementFolder: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                projectId: components["parameters"]["ProjectId"];
                folderId: components["parameters"]["FolderId"];
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
                        success?: boolean;
                        folder?: components["schemas"]["Folder"];
                    };
                };
            };
            401: components["responses"]["Unauthorized"];
            404: components["responses"]["NotFound"];
        };
    };
    deleteTestManagementFolder: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                projectId: components["parameters"]["ProjectId"];
                folderId: components["parameters"]["FolderId"];
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
                        success?: boolean;
                    };
                };
            };
            401: components["responses"]["Unauthorized"];
            404: components["responses"]["NotFound"];
        };
    };
    updateTestManagementFolder: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                projectId: components["parameters"]["ProjectId"];
                folderId: components["parameters"]["FolderId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /** UpdateFolderData */
                    folder?: {
                        name?: string;
                        description?: string;
                    };
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
                        folder?: components["schemas"]["Folder"];
                    };
                };
            };
            401: components["responses"]["Unauthorized"];
            404: components["responses"]["NotFound"];
        };
    };
    moveTestManagementFolder: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                projectId: components["parameters"]["ProjectId"];
                folderId: components["parameters"]["FolderId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    parent_id?: number | null;
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
                        folder?: components["schemas"]["Folder"];
                    };
                };
            };
            401: components["responses"]["Unauthorized"];
            404: components["responses"]["NotFound"];
        };
    };
    getTestManagementTestCases: {
        parameters: {
            query?: {
                p?: number;
                page_size?: 30 | 300;
                updated_after?: string;
                updated_before?: string;
                archived?: boolean;
                minify?: boolean;
                id?: string;
                status?: string;
                priority?: string;
                owner?: string;
                case_type?: string;
                folder_id?: number;
                tags?: string;
                issue_ids?: string;
                issue_type?: string;
            };
            header?: never;
            path: {
                projectId: components["parameters"]["ProjectId"];
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
                        success?: boolean;
                        test_cases?: components["schemas"]["TestCase"][];
                        info?: components["schemas"]["PaginationInfo"];
                    };
                };
            };
            401: components["responses"]["Unauthorized"];
        };
    };
    bulkDeleteTestManagementTestCases: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                projectId: components["parameters"]["ProjectId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    ids: string[];
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
                    };
                };
            };
            401: components["responses"]["Unauthorized"];
        };
    };
    bulkEditTestManagementTestCases: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                projectId: components["parameters"]["ProjectId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    ids: string[];
                    /** BulkEditTestCaseData */
                    test_case: {
                        preconditions?: string;
                        owner?: string;
                        tags?: string[];
                        custom_fields?: {
                            [key: string]: unknown;
                        };
                        automation_status?: string;
                        case_type?: string;
                        priority?: string;
                        status?: string;
                    };
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
                    };
                };
            };
            401: components["responses"]["Unauthorized"];
        };
    };
    bulkArchiveTestManagementTestCases: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                projectId: components["parameters"]["ProjectId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    ids: string[];
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
                    };
                };
            };
            401: components["responses"]["Unauthorized"];
        };
    };
    bulkUnarchiveTestManagementTestCases: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                projectId: components["parameters"]["ProjectId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    ids: string[];
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
                    };
                };
            };
            401: components["responses"]["Unauthorized"];
        };
    };
    bulkEditTestManagementTestCasesWithOperations: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                projectId: components["parameters"]["ProjectId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    ids: string[];
                    /** BulkEditTestCaseData */
                    test_case: Record<string, never>;
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
                    };
                };
            };
            401: components["responses"]["Unauthorized"];
        };
    };
    createTestManagementTestCase: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                projectId: components["parameters"]["ProjectId"];
                folderId: components["parameters"]["FolderId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /** CreateTestCaseData */
                    test_case?: {
                        name?: string;
                        template?: string;
                        description?: string;
                        owner?: string;
                        preconditions?: string;
                        test_case_steps?: {
                            description?: string;
                            result?: string;
                        }[];
                        issues?: string[];
                        issue_tracker?: components["schemas"]["IssueTracker"];
                        tags?: string[];
                        case_type?: string;
                        priority?: string;
                        custom_fields?: {
                            [key: string]: unknown;
                        };
                        feature?: string;
                        scenario?: string;
                        background?: string;
                    };
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
                        /** CreateTestCaseResponseData */
                        data?: {
                            test_case?: components["schemas"]["TestCase"];
                        };
                    };
                };
            };
            401: components["responses"]["Unauthorized"];
        };
    };
    deleteTestManagementTestCase: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                projectId: components["parameters"]["ProjectId"];
                testCaseId: components["parameters"]["TestCaseId"];
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
                        success?: boolean;
                    };
                };
            };
            401: components["responses"]["Unauthorized"];
            404: components["responses"]["NotFound"];
        };
    };
    updateTestManagementTestCase: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                projectId: components["parameters"]["ProjectId"];
                testCaseId: components["parameters"]["TestCaseId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /** UpdateTestCaseData */
                    test_case?: {
                        name?: string;
                        case_type?: string;
                        priority?: string;
                        status?: string;
                        description?: string;
                        owner?: string;
                        preconditions?: string;
                        test_case_steps?: {
                            description?: string;
                            result?: string;
                        }[];
                        issues?: string[];
                        issue_tracker?: components["schemas"]["IssueTracker"];
                        tags?: string[];
                        custom_fields?: {
                            [key: string]: unknown;
                        };
                        automation_status?: string;
                        feature?: string;
                        scenario?: string;
                        background?: string;
                    };
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
                        /** UpdateTestCaseResponseData */
                        data?: {
                            test_case?: components["schemas"]["TestCase"];
                        };
                    };
                };
            };
            401: components["responses"]["Unauthorized"];
            404: components["responses"]["NotFound"];
        };
    };
    archiveTestManagementTestCase: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                projectId: components["parameters"]["ProjectId"];
                testCaseId: components["parameters"]["TestCaseId"];
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
                        success?: boolean;
                        data?: components["schemas"]["TestCaseResponseData"];
                    };
                };
            };
            401: components["responses"]["Unauthorized"];
            404: components["responses"]["NotFound"];
        };
    };
    unarchiveTestManagementTestCase: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                projectId: components["parameters"]["ProjectId"];
                testCaseId: components["parameters"]["TestCaseId"];
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
                        success?: boolean;
                        data?: components["schemas"]["TestCaseResponseData"];
                    };
                };
            };
            401: components["responses"]["Unauthorized"];
            404: components["responses"]["NotFound"];
        };
    };
    moveTestManagementTestCase: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                projectId: components["parameters"]["ProjectId"];
                testCaseId: components["parameters"]["TestCaseId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    destination_folder_id: number;
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
                        data?: components["schemas"]["TestCaseResponseData"];
                    };
                };
            };
            401: components["responses"]["Unauthorized"];
            404: components["responses"]["NotFound"];
        };
    };
    getTestManagementTestCaseAttachments: {
        parameters: {
            query?: {
                p?: number;
            };
            header?: never;
            path: {
                projectId: components["parameters"]["ProjectId"];
                testCaseId: components["parameters"]["TestCaseId"];
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
                        success?: boolean;
                        attachments?: components["schemas"]["Attachment"][];
                        info?: components["schemas"]["PaginationInfo"];
                    };
                };
            };
            401: components["responses"]["Unauthorized"];
        };
    };
    addTestManagementTestCaseAttachment: {
        parameters: {
            query?: {
                inline?: boolean;
            };
            header?: never;
            path: {
                projectId: components["parameters"]["ProjectId"];
                testCaseId: components["parameters"]["TestCaseId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "multipart/form-data": {
                    /** Format: binary */
                    file: Blob;
                    file_name?: string;
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
                        attachment?: components["schemas"]["Attachment"];
                    };
                };
            };
            401: components["responses"]["Unauthorized"];
        };
    };
    deleteTestManagementTestCaseAttachment: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                projectId: components["parameters"]["ProjectId"];
                testCaseId: components["parameters"]["TestCaseId"];
                attachmentId: components["parameters"]["AttachmentId"];
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
                        success?: boolean;
                    };
                };
            };
            401: components["responses"]["Unauthorized"];
            404: components["responses"]["NotFound"];
        };
    };
    getTestManagementTestCaseResults: {
        parameters: {
            query?: {
                p?: number;
            };
            header?: never;
            path: {
                projectId: components["parameters"]["ProjectId"];
                testCaseId: components["parameters"]["TestCaseId"];
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
                        success?: boolean;
                        test_results?: components["schemas"]["TestResult"][];
                        info?: components["schemas"]["PaginationInfo"];
                    };
                };
            };
            401: components["responses"]["Unauthorized"];
        };
    };
    getTestManagementTestRuns: {
        parameters: {
            query?: {
                closed_before?: string;
                closed_after?: string;
                created_before?: string;
                created_after?: string;
                test_plan_id?: string;
                assignee?: string;
                include_closed?: boolean;
                run_state?: string;
            };
            header?: never;
            path: {
                projectId: components["parameters"]["ProjectId"];
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
                        success?: boolean;
                        test_runs?: components["schemas"]["TestRunSummary"][];
                    };
                };
            };
            401: components["responses"]["Unauthorized"];
        };
    };
    createTestManagementTestRun: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                projectId: components["parameters"]["ProjectId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    test_run?: components["schemas"]["TestRunInput"];
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
                        test_run?: components["schemas"]["TestRun"];
                    };
                };
            };
            401: components["responses"]["Unauthorized"];
        };
    };
    getTestManagementTestRun: {
        parameters: {
            query?: {
                minify?: boolean;
            };
            header?: never;
            path: {
                projectId: components["parameters"]["ProjectId"];
                testRunId: components["parameters"]["TestRunId"];
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
                        success?: boolean;
                        test_run?: components["schemas"]["TestRunDetail"];
                    };
                };
            };
            401: components["responses"]["Unauthorized"];
            404: components["responses"]["NotFound"];
        };
    };
    getTestManagementTestRunTestCases: {
        parameters: {
            query?: {
                p?: number;
                fetch_steps?: boolean;
                minify?: boolean;
            };
            header?: never;
            path: {
                projectId: components["parameters"]["ProjectId"];
                testRunId: components["parameters"]["TestRunId"];
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
                        success?: boolean;
                        test_cases?: components["schemas"]["TestRunTestCase"][];
                        info?: components["schemas"]["PaginationInfo"];
                    };
                };
            };
            401: components["responses"]["Unauthorized"];
            404: components["responses"]["NotFound"];
        };
    };
    updateTestManagementTestRun: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                projectId: components["parameters"]["ProjectId"];
                testRunId: components["parameters"]["TestRunId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    test_run?: components["schemas"]["TestRunInput"];
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
                        testrun?: components["schemas"]["TestRun"];
                    };
                };
            };
            401: components["responses"]["Unauthorized"];
            404: components["responses"]["NotFound"];
        };
    };
    patchTestManagementTestRun: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                projectId: components["parameters"]["ProjectId"];
                testRunId: components["parameters"]["TestRunId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    test_run?: components["schemas"]["TestRunPatchInput"];
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
                        testrun?: components["schemas"]["TestRun"];
                    };
                };
            };
            401: components["responses"]["Unauthorized"];
            404: components["responses"]["NotFound"];
        };
    };
    assignTestManagementTestRunTestCases: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                projectId: components["parameters"]["ProjectId"];
                testRunId: components["parameters"]["TestRunId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    assign_to: {
                        test_case_id?: string;
                        configuration_id?: number;
                        assignee?: string;
                    }[];
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
                    };
                };
            };
            401: components["responses"]["Unauthorized"];
            404: components["responses"]["NotFound"];
        };
    };
    closeTestManagementTestRun: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                projectId: components["parameters"]["ProjectId"];
                testRunId: components["parameters"]["TestRunId"];
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
                        success?: boolean;
                        testrun?: components["schemas"]["TestRun"];
                    };
                };
            };
            401: components["responses"]["Unauthorized"];
            404: components["responses"]["NotFound"];
        };
    };
    deleteTestManagementTestRun: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                projectId: components["parameters"]["ProjectId"];
                testRunId: components["parameters"]["TestRunId"];
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
                        success?: boolean;
                        message?: string;
                    };
                };
            };
            401: components["responses"]["Unauthorized"];
            404: components["responses"]["NotFound"];
        };
    };
    getTestManagementTestRunResults: {
        parameters: {
            query?: {
                p?: number;
                validate_tc?: boolean;
            };
            header?: never;
            path: {
                projectId: components["parameters"]["ProjectId"];
                testRunId: components["parameters"]["TestRunId"];
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
                        success?: boolean;
                        test_results?: components["schemas"]["TestResult"][];
                        info?: components["schemas"]["PaginationInfo"];
                    };
                };
            };
            401: components["responses"]["Unauthorized"];
        };
    };
    addTestManagementTestRunResults: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                projectId: components["parameters"]["ProjectId"];
                testRunId: components["parameters"]["TestRunId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    test_result: components["schemas"]["TestResultInput"];
                    test_case_id: string;
                    configuration_id?: number;
                } | {
                    results: {
                        test_result: components["schemas"]["TestResultInput"];
                        test_case_id: string;
                        configuration_id?: number;
                    }[];
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
                    };
                };
            };
            401: components["responses"]["Unauthorized"];
        };
    };
    getTestManagementTestRunTestCaseResults: {
        parameters: {
            query?: {
                p?: number;
            };
            header?: never;
            path: {
                projectId: components["parameters"]["ProjectId"];
                testRunId: components["parameters"]["TestRunId"];
                testCaseId: components["parameters"]["TestCaseId"];
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
                        success?: boolean;
                        test_results?: components["schemas"]["TestResult"][];
                        info?: components["schemas"]["PaginationInfo"];
                    };
                };
            };
            401: components["responses"]["Unauthorized"];
        };
    };
    getTestManagementTestResultAttachments: {
        parameters: {
            query?: {
                p?: number;
            };
            header?: never;
            path: {
                projectId: components["parameters"]["ProjectId"];
                testResultId: components["parameters"]["TestResultId"];
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
                        success?: boolean;
                        attachments?: components["schemas"]["Attachment"][];
                        info?: components["schemas"]["PaginationInfo"];
                    };
                };
            };
            401: components["responses"]["Unauthorized"];
        };
    };
    addTestManagementTestResultAttachment: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                projectId: components["parameters"]["ProjectId"];
                testResultId: components["parameters"]["TestResultId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "multipart/form-data": {
                    /** Format: binary */
                    file: Blob;
                    file_name?: string;
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
                        attachment?: components["schemas"]["Attachment"];
                    };
                };
            };
            401: components["responses"]["Unauthorized"];
        };
    };
    deleteTestManagementTestResultAttachment: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                projectId: components["parameters"]["ProjectId"];
                testResultId: components["parameters"]["TestResultId"];
                attachmentId: components["parameters"]["AttachmentId"];
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
                        success?: boolean;
                    };
                };
            };
            401: components["responses"]["Unauthorized"];
            404: components["responses"]["NotFound"];
        };
    };
    getTestManagementTestPlans: {
        parameters: {
            query?: {
                p?: number;
                page_size?: 30 | 300;
            };
            header?: never;
            path: {
                projectId: components["parameters"]["ProjectId"];
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
                        success?: boolean;
                        test_plans?: components["schemas"]["TestPlan"][];
                        info?: components["schemas"]["PaginationInfo"];
                    };
                };
            };
            401: components["responses"]["Unauthorized"];
        };
    };
    createTestManagementTestPlan: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                projectId: components["parameters"]["ProjectId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    test_plan?: components["schemas"]["CreateTestRunInput"];
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
                        test_plan?: components["schemas"]["TestPlan"];
                    };
                };
            };
            401: components["responses"]["Unauthorized"];
        };
    };
    getTestManagementTestPlan: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                projectId: components["parameters"]["ProjectId"];
                testPlanId: components["parameters"]["TestPlanId"];
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
                        success?: boolean;
                        test_plan?: components["schemas"]["TestPlanDetail"];
                    };
                };
            };
            401: components["responses"]["Unauthorized"];
            404: components["responses"]["NotFound"];
        };
    };
    updateTestManagementTestPlan: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                projectId: components["parameters"]["ProjectId"];
                testPlanId: components["parameters"]["TestPlanId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /** CreateTestPlanData */
                    test_plan?: {
                        name?: string;
                        plan_status?: string;
                        description?: string;
                        start_date?: string;
                        end_date?: string | null;
                    };
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
                        test_plan?: components["schemas"]["TestPlan"];
                    };
                };
            };
            401: components["responses"]["Unauthorized"];
            404: components["responses"]["NotFound"];
        };
    };
    getTestManagementTestPlanTestRuns: {
        parameters: {
            query?: {
                p?: number;
            };
            header?: never;
            path: {
                projectId: components["parameters"]["ProjectId"];
                testPlanId: components["parameters"]["TestPlanId"];
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
                        success?: boolean;
                        test_runs?: components["schemas"]["TestRunSummary"][];
                        info?: components["schemas"]["PaginationInfo"];
                    };
                };
            };
            401: components["responses"]["Unauthorized"];
            404: components["responses"]["NotFound"];
        };
    };
    getTestManagementConfigurations: {
        parameters: {
            query?: {
                p?: number;
                page_size?: 30 | 300;
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
                        success?: boolean;
                        configurations?: components["schemas"]["Configuration"][];
                        info?: components["schemas"]["PaginationInfo"];
                    };
                };
            };
            401: components["responses"]["Unauthorized"];
        };
    };
    createTestManagementConfiguration: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
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
                        success?: boolean;
                        id?: number;
                        name?: string;
                    };
                };
            };
            401: components["responses"]["Unauthorized"];
        };
    };
    getTestManagementConfiguration: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                configurationId: components["parameters"]["ConfigurationId"];
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
                        success?: boolean;
                        configuration?: components["schemas"]["Configuration"];
                    };
                };
            };
            401: components["responses"]["Unauthorized"];
            404: components["responses"]["NotFound"];
        };
    };
    getTestManagementCustomFields: {
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
                    "application/json": {
                        success?: boolean;
                        custom_fields?: components["schemas"]["CustomField"][];
                    };
                };
            };
            401: components["responses"]["Unauthorized"];
        };
    };
    createTestManagementCustomField: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    field_name: string;
                    place_holder_text?: string;
                    /** @enum {string} */
                    field_type: "string" | "dropdown" | "text" | "user" | "boolean" | "url" | "date" | "int";
                    is_required?: boolean;
                    options?: {
                        option_value?: string;
                        is_default?: boolean;
                    }[];
                    applies_to_all_projects?: boolean;
                    /** @enum {string} */
                    field_entity_type: "test_case" | "test_result";
                    link_to_future_projects?: boolean;
                    assigned_projects?: string[];
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
                        custom_field?: components["schemas"]["CustomField"];
                    };
                };
            };
            401: components["responses"]["Unauthorized"];
        };
    };
    deleteTestManagementCustomField: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                customFieldId: components["parameters"]["CustomFieldId"];
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
                        success?: boolean;
                    };
                };
            };
            401: components["responses"]["Unauthorized"];
            404: components["responses"]["NotFound"];
        };
    };
    updateTestManagementCustomField: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                customFieldId: components["parameters"]["CustomFieldId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    field_name?: string;
                    place_holder_text?: string;
                    field_type?: string;
                    is_required?: boolean;
                    options?: Record<string, never>[];
                    applies_to_all_projects?: boolean;
                    field_entity_type?: string;
                    link_to_future_projects?: boolean;
                    assigned_projects?: string[];
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
                        data?: components["schemas"]["CustomFieldResponseData"];
                    };
                };
            };
            401: components["responses"]["Unauthorized"];
            404: components["responses"]["NotFound"];
        };
    };
}
