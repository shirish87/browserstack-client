package screenshots

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

type NewScreenshot struct {
	Browsers []any `json:"browsers"`
	Orientation *string `json:"orientation"`
	Url string `json:"url"`
	CallbackUrl *string `json:"callback_url"`
	WinRes *string `json:"win_res"`
	MacRes *string `json:"mac_res"`
	Quality *string `json:"quality"`
	Local *bool `json:"local"`
	WaitTime *float64 `json:"wait_time"`
}

type ScreenshotBase struct {
	Id string `json:"id"`
	State string `json:"state"`
	Url string `json:"url"`
	Os string `json:"os"`
	OsVersion string `json:"os_version"`
}

type ScreenshotsJobBase struct {
	JobId *string `json:"job_id"`
	CallbackUrl *string `json:"callback_url"`
	WinRes *string `json:"win_res"`
	MacRes *string `json:"mac_res"`
	Quality *string `json:"quality"`
	WaitTime *float64 `json:"wait_time"`
	Orientation *string `json:"orientation"`
	Screenshots []any `json:"screenshots"`
}

type Status struct {
	UsedTime float64 `json:"used_time"`
	RunningSessions float64 `json:"running_sessions"`
	SessionLimit float64 `json:"session_limit"`
	TotalAvailableTime string `json:"total_available_time"`
}
