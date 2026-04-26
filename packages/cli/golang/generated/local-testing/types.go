package localtesting

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

type LocalBinaryInstance struct {
	Id string `json:"id"`
	Email string `json:"email"`
	Hostname *string `json:"hostname"`
	LastActiveOn string `json:"lastActiveOn"`
	StartTime string `json:"startTime"`
	EndTime *string `json:"endTime"`
	DisconnectReason *string `json:"disconnectReason"`
	CommandLineParams *string `json:"commandLineParams"`
	LocalIdentifier string `json:"localIdentifier"`
	PublicIP *string `json:"public-IP"`
	PrivateIP []string `json:"privateIP"`
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

type GetLocalBinaryInstancesResponse struct {
	ApiVersion string `json:"api_version"`
	MetaData map[string]any `json:"meta_data"`
	Instances []any `json:"instances"`
}

type GetLocalBinaryInstanceResponse struct {
	ApiVersion string `json:"api_version"`
	MetaData map[string]any `json:"meta_data"`
	Instances []any `json:"instances"`
}

type DisconnectLocalBinaryInstanceResponse struct {
	ApiVersion string `json:"api_version"`
	MetaData map[string]any `json:"meta_data"`
	Message string `json:"message"`
}
