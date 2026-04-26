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

type AppAutomateSession struct {
	AppDetails map[string]any `json:"app_details"`
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

type GetAppAutomateBuildResponse struct {
	Build map[string]any `json:"build"`
}

type UpdateAppAutomateBuildRequest struct {
	BuildTag string `json:"build_tag"`
}

type DeleteAppAutomateBuildResponse struct {
	Status *string `json:"status"`
	Message *string `json:"message"`
}

type GetAppAutomateXCUITestAppResponse struct {
	App AppAutomateApp `json:"app"`
}

type DeleteAppAutomateXCUITestAppResponse struct {
	Success map[string]any `json:"success"`
}

type GetAppAutomateNetworkLogsResponse struct {

}

type GetAppAutomateProjectResponse struct {
	Project any `json:"project"`
}

type UpdateAppAutomateProjectRequest struct {
	Name string `json:"name"`
}

type DeleteAppAutomateProjectResponse struct {
	Status *string `json:"status"`
	Message *string `json:"message"`
}

type DeleteAppAutomateAppResponse struct {
	Success bool `json:"success"`
}

type GetAppAutomateFlutterAndroidAppResponse struct {
	App AppAutomateApp `json:"app"`
}

type DeleteAppAutomateFlutterAndroidAppResponse struct {
	Success map[string]any `json:"success"`
}

type GetAppAutomateSessionResponse struct {
	AutomationSession AppAutomateSession `json:"automation_session"`
}

type UpdateAppAutomateSessionResponse struct {
	AutomationSession AppAutomateSession `json:"automation_session"`
}

type UpdateAppAutomateSessionRequest struct {
	Status string `json:"status"`
	Reason string `json:"reason"`
}

type DeleteAppAutomateSessionResponse struct {
	Status *string `json:"status"`
	Message *string `json:"message"`
}

type DeleteAppAutomateMediaFileResponse struct {
	Success bool `json:"success"`
}

type GetAppAutomateEspressoAppResponse struct {
	App AppAutomateApp `json:"app"`
}

type DeleteAppAutomateEspressoAppResponse struct {
	Success map[string]any `json:"success"`
}

type GetAppAutomateFlutteriOSAppResponse struct {
	TestPackage AppAutomateTestPackage `json:"test_package"`
}

type DeleteAppAutomateFlutteriOSAppResponse struct {
	Success map[string]any `json:"success"`
}
