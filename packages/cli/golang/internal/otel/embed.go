package otel

import _ "embed"

//go:embed assets/register.cjs
var bundleBytes []byte

// BundleBytes returns the embedded register.cjs content.
func BundleBytes() []byte {
	return bundleBytes
}
