package screenshots

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

type NewScreenshotsJob struct {
	JobId string `json:"job_id"`
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

type Screenshot struct {
	ImageUrl *string `json:"image_url"`
	ThumbUrl *string `json:"thumb_url"`
	CreatedAt *string `json:"created_at"`
}

type ScreenshotBase struct {
	Id string `json:"id"`
	State string `json:"state"`
	Url string `json:"url"`
	Os string `json:"os"`
	OsVersion string `json:"os_version"`
}

type ScreenshotsJob struct {
	Id string `json:"id"`
	State *string `json:"state"`
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

type Worker struct {
	Id float64 `json:"id"`
	SessionId any `json:"sessionId"`
	Status *string `json:"status"`
	BrowserUrl *string `json:"browser_url"`
}
