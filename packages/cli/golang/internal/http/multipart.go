package bshttp

import (
	"bytes"
	"fmt"
	"io"
	"mime/multipart"
	"net/textproto"
	"path/filepath"
)

func buildMultipart(file []byte, fileName string, fields map[string]string) (io.Reader, string, error) {
	var buf bytes.Buffer
	w := multipart.NewWriter(&buf)

	h := make(textproto.MIMEHeader)
	h.Set("Content-Disposition", fmt.Sprintf(`form-data; name="file"; filename="%s"`, filepath.Base(fileName)))
	h.Set("Content-Type", "application/octet-stream")
	fw, err := w.CreatePart(h)
	if err != nil {
		return nil, "", err
	}
	if _, err := fw.Write(file); err != nil {
		return nil, "", err
	}

	for k, v := range fields {
		if err := w.WriteField(k, v); err != nil {
			return nil, "", err
		}
	}

	if err := w.Close(); err != nil {
		return nil, "", err
	}

	return &buf, w.FormDataContentType(), nil
}
