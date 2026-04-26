package localtesting

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

type Status struct {
	UsedTime float64 `json:"used_time"`
	RunningSessions float64 `json:"running_sessions"`
	SessionLimit float64 `json:"session_limit"`
	TotalAvailableTime string `json:"total_available_time"`
}
