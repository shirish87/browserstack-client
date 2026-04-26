package automate

type AutomateBuild struct {
	Name string `json:"name"`
	Duration float64 `json:"duration"`
	Status string `json:"status"`
	UserId *float64 `json:"user_id"`
	GroupId *float64 `json:"group_id"`
	SubGroupId *float64 `json:"sub_group_id"`
	AutomationProjectId *float64 `json:"automation_project_id"`
	HashedId string `json:"hashed_id"`
	BuildTag string `json:"build_tag"`
	Delta *bool `json:"delta"`
	Framework *string `json:"framework"`
	TestData map[string]any `json:"test_data"`
	CreatedAt *string `json:"created_at"`
	UpdatedAt *string `json:"updated_at"`
}

type AutomateMediaFile struct {
	MediaName string `json:"media_name"`
	MediaUrl string `json:"media_url"`
	MediaId string `json:"media_id"`
	UploadedAt string `json:"uploaded_at"`
}

type AutomatePlan struct {
	AutomatePlan string `json:"automate_plan"`
	ParallelSessionsRunning float64 `json:"parallel_sessions_running"`
	ParallelSessionsMaxAllowed float64 `json:"parallel_sessions_max_allowed"`
	TeamParallelSessionsMaxAllowed float64 `json:"team_parallel_sessions_max_allowed"`
	QueuedSessions float64 `json:"queued_sessions"`
	QueuedSessionsMaxAllowed float64 `json:"queued_sessions_max_allowed"`
}

type AutomateProject struct {
	Id float64 `json:"id"`
	Name string `json:"name"`
	UserId float64 `json:"user_id"`
	GroupId float64 `json:"group_id"`
	SubGroupId float64 `json:"sub_group_id"`
	CreatedAt string `json:"created_at"`
	UpdatedAt string `json:"updated_at"`
}

type AutomateSession struct {
	HashedId string `json:"hashed_id"`
	Name string `json:"name"`
	Duration float64 `json:"duration"`
	Status string `json:"status"`
	BrowserstackStatus string `json:"browserstack_status"`
	Reason string `json:"reason"`
	BuildName string `json:"build_name"`
	ProjectName string `json:"project_name"`
	Logs string `json:"logs"`
	BrowserUrl string `json:"browser_url"`
	PublicUrl string `json:"public_url"`
	AppiumLogsUrl string `json:"appium_logs_url"`
	VideoUrl string `json:"video_url"`
	BrowserConsoleLogsUrl string `json:"browser_console_logs_url"`
	HarLogsUrl string `json:"har_logs_url"`
	SeleniumLogsUrl string `json:"selenium_logs_url"`
	SeleniumTelemetryLogsUrl string `json:"selenium_telemetry_logs_url"`
	CreatedAt string `json:"created_at"`
}

type Browser struct {
	Browser string `json:"browser"`
	BrowserVersion string `json:"browser_version"`
}

type BrowserDevice struct {
	Browser *string `json:"browser"`
	Devices []string `json:"devices"`
	RealDevices []string `json:"real_devices"`
}

type BrowserList []BrowserPlatform

type BrowserMap struct {
	Windows map[string]any `json:"Windows"`
	OSX map[string]any `json:"OS X"`
	Winphone map[string]any `json:"winphone"`
	Android map[string]any `json:"android"`
}

type BrowserPlatform struct {
	Os string `json:"os"`
	OsVersion string `json:"os_version"`
	Device *string `json:"device"`
	RealMobile *bool `json:"real_mobile"`
}

type BrowserRealDevice struct {
	Browser *string `json:"browser"`
	Devices []string `json:"devices"`
	RealDevices []string `json:"real_devices"`
}

type NewWorker struct {
	Url string `json:"url"`
	Timeout *float64 `json:"timeout"`
	Os string `json:"os"`
	OsVersion string `json:"os_version"`
	Name *string `json:"name"`
	Build *string `json:"build"`
	Project *string `json:"project"`
	BrowserstackVideo *bool `json:"browserstack.video"`
	Resolution *string `json:"resolution"`
}

type Status struct {
	UsedTime float64 `json:"used_time"`
	RunningSessions float64 `json:"running_sessions"`
	SessionLimit float64 `json:"session_limit"`
	TotalAvailableTime string `json:"total_available_time"`
}

type Worker struct {
	Id float64 `json:"id"`
	SessionId any `json:"sessionId"`
	Status *string `json:"status"`
	BrowserUrl *string `json:"browser_url"`
}

type DeleteAutomateBuildsResponse struct {
	Message *string `json:"message"`
}

type GetAutomateSessionResponse struct {
	AutomationSession AutomateSession `json:"automation_session"`
}

type UpdateAutomateSessionResponse struct {
	AutomationSession AutomateSession `json:"automation_session"`
}

type UpdateAutomateSessionRequest struct {

}

type DeleteAutomateSessionResponse struct {
	Status *string `json:"status"`
	Message *string `json:"message"`
}

type DeleteAutomateSessionsResponse struct {
	Message *string `json:"message"`
}

type DeleteAutomateMediaFileResponse struct {
	Success bool `json:"success"`
}

type GetAutomateBuildResponse struct {
	Build map[string]any `json:"build"`
}

type UpdateAutomateBuildRequest struct {
	Name *string `json:"name"`
	BuildTag *string `json:"build_tag"`
}

type DeleteAutomateBuildResponse struct {
	Status *string `json:"status"`
	Message *string `json:"message"`
}

type UploadAutomateMediaFileResponse struct {
	MediaUrl string `json:"media_url"`
}

type RecycleAutomateKeyResponse struct {
	OldKey string `json:"old_key"`
	NewKey string `json:"new_key"`
}

type RecycleAutomateKeyRequest struct {

}

type GetAutomateProjectResponse struct {
	Project any `json:"project"`
}

type UpdateAutomateProjectRequest struct {
	Name string `json:"name"`
}

type DeleteAutomateProjectResponse struct {
	Status *string `json:"status"`
	Message *string `json:"message"`
}

type GetAutomateSessionNetworkLogsResponse struct {

}
