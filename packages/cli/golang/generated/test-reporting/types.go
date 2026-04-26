package testreporting

type Pagination struct {
	HasNext *bool `json:"has_next"`
	NextPage *string `json:"next_page"`
}

type Project struct {
	Id *int `json:"id"`
	Name *string `json:"name"`
	GroupId *int `json:"group_id"`
	CreatedBy *int `json:"created_by"`
	CreatedAt *string `json:"created_at"`
	UpdatedAt *string `json:"updated_at"`
	ObservabilityUrl *string `json:"observability_url"`
}

type StatusStats struct {
	Passed *int `json:"passed"`
	Failed *int `json:"failed"`
	Pending *int `json:"pending"`
	Skipped *int `json:"skipped"`
	Unknown *int `json:"unknown"`
}

type BuildSummary struct {
	Name *string `json:"name"`
	Status *string `json:"status"`
	Duration *int `json:"duration"`
	User *string `json:"user"`
	Tags []string `json:"tags"`
	BuildId *string `json:"build_id"`
	OriginalName *string `json:"original_name"`
	FinishedAt *string `json:"finished_at"`
	StartedAt *string `json:"started_at"`
	StatusStats *StatusStats `json:"status_stats"`
	BuildNumber *int `json:"build_number"`
	IsArchived *bool `json:"is_archived"`
	ObservabilityUrl *string `json:"observability_url"`
	TcmTestRunIdentifier *string `json:"tcm_test_run_identifier"`
}

type BuildDetails struct {
	Name *string `json:"name"`
	Description *string `json:"description"`
	Status *string `json:"status"`
	Duration *int `json:"duration"`
	User *string `json:"user"`
	Tags []string `json:"tags"`
	BuildId *string `json:"build_id"`
	BuildNumber *int `json:"build_number"`
	OriginalName *string `json:"original_name"`
	FinishedAt *string `json:"finished_at"`
	StartedAt *string `json:"started_at"`
	StatusStats *StatusStats `json:"status_stats"`
	FailureCategories map[string]any `json:"failure_categories"`
	SmartTags map[string]any `json:"smart_tags"`
	IsArchived *bool `json:"is_archived"`
	ObservabilityUrl *string `json:"observability_url"`
	VcsInfo map[string]any `json:"vcs_info"`
	CiInfo map[string]any `json:"ci_info"`
	HostInfo map[string]any `json:"host_info"`
}

type TestRunsResponse struct {
	Name *string `json:"name"`
	ProjectId *int `json:"project_id"`
	BuildId *string `json:"build_id"`
	BuildName *string `json:"build_name"`
	BuildNumber *int `json:"build_number"`
	TestSummary *StatusStats `json:"test_summary"`
	IsArchived *bool `json:"is_archived"`
	Hierarchy []any `json:"hierarchy"`
	Pagination *Pagination `json:"pagination"`
}

type StartBuildRequest struct {
	Name string `json:"name"`
	ProjectName string `json:"project_name"`
	StartedAt string `json:"started_at"`
	Tags []string `json:"tags"`
	BuildRunIdentifier *string `json:"build_run_identifier"`
	HostInfo map[string]any `json:"host_info"`
	CiInfo map[string]any `json:"ci_info"`
	VersionControl map[string]any `json:"version_control"`
	Framework map[string]any `json:"framework"`
}

type StartTestRunRequest struct {
	Name string `json:"name"`
	FileName string `json:"file_name"`
	Scopes []string `json:"scopes"`
	StartedAt string `json:"started_at"`
	Tags []string `json:"tags"`
	Location *string `json:"location"`
	Result *string `json:"result"`
	CustomMetadata map[string]any `json:"custom_metadata"`
	Environment map[string]any `json:"environment"`
}

type FinishTestRunRequest struct {
	Result string `json:"result"`
	FinishedAt string `json:"finished_at"`
	FileName string `json:"file_name"`
	Scopes []string `json:"scopes"`
	DurationInMs *int `json:"duration_in_ms"`
	Failure []any `json:"failure"`
	CustomMetadata map[string]any `json:"custom_metadata"`
	Environment map[string]any `json:"environment"`
}

type StartHookRunRequest struct {
	HookType string `json:"hook_type"`
	Name string `json:"name"`
	FileName string `json:"file_name"`
	Scopes []string `json:"scopes"`
	StartedAt string `json:"started_at"`
	TestRunId *string `json:"test_run_id"`
	Tags []string `json:"tags"`
	Location *string `json:"location"`
	CustomMetadata map[string]any `json:"custom_metadata"`
}

type FinishHookRunRequest struct {
	HookType string `json:"hook_type"`
	Result string `json:"result"`
	FinishedAt string `json:"finished_at"`
	FileName string `json:"file_name"`
	Scopes []string `json:"scopes"`
	DurationInMs *int `json:"duration_in_ms"`
	Failure []any `json:"failure"`
	CustomMetadata map[string]any `json:"custom_metadata"`
	Environment map[string]any `json:"environment"`
}

type BuildLog struct {
	Kind string `json:"kind"`
	TestRunUuid *string `json:"test_run_uuid"`
	HookRunUuid *string `json:"hook_run_uuid"`
	Timestamp string `json:"timestamp"`
	Level *string `json:"level"`
	Message *string `json:"message"`
	Duration *int `json:"duration"`
	Failure *bool `json:"failure"`
	FileName *string `json:"file_name"`
	FileSize *int `json:"file_size"`
}

type QualityGateStatus struct {
	Status *string `json:"status"`
	BuildUuid *string `json:"build_uuid"`
	BuildUrl *string `json:"build_url"`
	QualityGateResult *string `json:"quality_gate_result"`
	QualityProfiles []any `json:"quality_profiles"`
}

type QualityGateSettings struct {
	Enabled *bool `json:"enabled"`
	ShouldOverrideBuildStatus *bool `json:"should_override_build_status"`
	QualityProfiles []any `json:"quality_profiles"`
}

type QualityGateProfileRequest struct {
	Name string `json:"name"`
	Enabled bool `json:"enabled"`
	IsGlobalProfile bool `json:"is_global_profile"`
	Rules []any `json:"rules"`
	ApplicableBuilds map[string]any `json:"applicable_builds"`
	RuleStatus *string `json:"rule_status"`
	HooksVisibility *string `json:"hooks_visibility"`
}

type QualityGateProfile struct {
	Id *string `json:"id"`
	Name *string `json:"name"`
	Enabled *bool `json:"enabled"`
	IsGlobalProfile *bool `json:"is_global_profile"`
	Rules []any `json:"rules"`
	ApplicableBuilds map[string]any `json:"applicable_builds"`
	RuleStatus *string `json:"rule_status"`
	HooksVisibility *string `json:"hooks_visibility"`
}

type GetTestReportingProjectsResponse struct {
	Projects []any `json:"projects"`
	Pagination *Pagination `json:"pagination"`
}

type GetTestReportingProjectBuildsResponse struct {
	Builds []any `json:"builds"`
	Pagination *Pagination `json:"pagination"`
}

type StartTestReportingBuildResponse struct {
	Success *bool `json:"success"`
	BuildHashedId *string `json:"build_hashed_id"`
}

type UpdateTestReportingBuildResponse struct {
	Success *bool `json:"success"`
	Message *string `json:"message"`
}

type UpdateTestReportingBuildRequest struct {
	BuildTags []string `json:"build_tags"`
}

type FinishTestReportingBuildResponse struct {
	Success *bool `json:"success"`
	Message *string `json:"message"`
}

type FinishTestReportingBuildRequest struct {
	FinishedAt string `json:"finished_at"`
}

type StartTestReportingTestRunResponse struct {
	Success *bool `json:"success"`
	Uuid *string `json:"uuid"`
}

type FinishTestReportingTestRunResponse struct {
	Success *bool `json:"success"`
	Message *string `json:"message"`
}

type StartTestReportingHookRunResponse struct {
	Success *bool `json:"success"`
	Uuid *string `json:"uuid"`
}

type FinishTestReportingHookRunResponse struct {
	Success *bool `json:"success"`
	Message *string `json:"message"`
}

type AddTestReportingBuildLogsResponse struct {
	Success *bool `json:"success"`
	Message *string `json:"message"`
}

type AddTestReportingBuildLogsRequest struct {
	Logs []any `json:"logs"`
}

type GetTestReportingSelfHealingReportResponse struct {
	PresignedUrl *string `json:"presigned_url"`
	ExpiresAt *string `json:"expires_at"`
}

type UpdateTestReportingQualityGateSettingsResponse struct {
	Message *string `json:"message"`
}

type UpdateTestReportingQualityGateSettingsRequest struct {
	Enabled bool `json:"enabled"`
}

type CreateTestReportingQualityGateProfileResponse struct {
	Success *bool `json:"success"`
	Uuid *string `json:"uuid"`
}

type UpdateTestReportingQualityGateProfileResponse struct {
	Success *bool `json:"success"`
	Uuid *string `json:"uuid"`
}

type DeleteTestReportingQualityGateProfileResponse struct {
	Message *string `json:"message"`
}

type ToggleTestReportingQualityGateProfileResponse struct {
	Message *string `json:"message"`
}

type ToggleTestReportingQualityGateProfileRequest struct {
	Enabled bool `json:"enabled"`
}

type UploadTestReportingReportResponse struct {
	Status *string `json:"status"`
	Message *string `json:"message"`
}
