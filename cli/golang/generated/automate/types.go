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

type Browser struct {
	Browser string `json:"browser"`
	BrowserVersion string `json:"browser_version"`
}

type BrowserMap struct {
	Windows map[string]any `json:"Windows"`
	OS X map[string]any `json:"OS X"`
	Winphone map[string]any `json:"winphone"`
	Android map[string]any `json:"android"`
}

type Status struct {
	UsedTime float64 `json:"used_time"`
	RunningSessions float64 `json:"running_sessions"`
	SessionLimit float64 `json:"session_limit"`
	TotalAvailableTime string `json:"total_available_time"`
}
