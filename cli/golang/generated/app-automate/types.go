package appautomate

type AppAutomateApp struct {
	AppId *string `json:"app_id"`
	AppUrl string `json:"app_url"`
	AppName *string `json:"app_name"`
	AppVersion *string `json:"app_version"`
	UploadedAt *string `json:"uploaded_at"`
	Expiry *string `json:"expiry"`
	CustomId *string `json:"custom_id"`
	ShareableId *string `json:"shareable_id"`
}

type AppAutomateDevice struct {
	Os string `json:"os"`
	OsVersion string `json:"os_version"`
	Device string `json:"device"`
	RealMobile bool `json:"real_mobile"`
}

type AppAutomateMediaFile struct {
	MediaId string `json:"media_id"`
	MediaUrl string `json:"media_url"`
	MediaName *string `json:"media_name"`
	UploadedAt *string `json:"uploaded_at"`
	CustomId *string `json:"custom_id"`
	ShareableId *string `json:"shareable_id"`
}

type AppAutomateTestPackage struct {
	TestPackageId *string `json:"test_package_id"`
	TestPackageUrl string `json:"test_package_url"`
	TestPackageName *string `json:"test_package_name"`
	UploadedAt *string `json:"uploaded_at"`
	CustomId *string `json:"custom_id"`
	ShareableId *string `json:"shareable_id"`
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
