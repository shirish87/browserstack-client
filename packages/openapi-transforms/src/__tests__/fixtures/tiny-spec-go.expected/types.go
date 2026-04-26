package automate

type Envelope struct {
	Project *Project `json:"project"`
}

type Project struct {
	Id *int `json:"id"`
}

type Error struct {
	Message *string `json:"message"`
}
