import { describe, it, expect } from "vitest";
import { resolveOSArch } from "../fs-utils.ts";
import { BrowserStackError } from "@dot-slash/browserstack-core";

const downloadBaseURL = "https://www.browserstack.com/browserstack-local";

function downloadURL(osArch: string): string {
  return `${downloadBaseURL}/BrowserStackLocal-${osArch}.zip`;
}

describe("resolveOSArch → download URL mapping", () => {
  describe("darwin", () => {
    it("darwin/x64 maps to darwin-x64", async () => {
      expect(await resolveOSArch("darwin", "x64")).toBe("darwin-x64");
    });

    it("darwin/arm64 maps to darwin-x64 (no arm64 binary; Rosetta 2 fallback)", async () => {
      const result = await resolveOSArch("darwin", "arm64");
      expect(result).toBe("darwin-x64");
      expect(result).not.toBe("darwin-arm64");
    });

    it("darwin/x64 produces the correct download URL", async () => {
      const osArch = await resolveOSArch("darwin", "x64");
      expect(downloadURL(osArch!)).toBe(
        `${downloadBaseURL}/BrowserStackLocal-darwin-x64.zip`
      );
    });

    it("darwin/arm64 never produces the non-existent darwin-arm64 download URL", async () => {
      const osArch = await resolveOSArch("darwin", "arm64");
      expect(downloadURL(osArch!)).not.toContain("darwin-arm64");
      expect(downloadURL(osArch!)).toBe(
        `${downloadBaseURL}/BrowserStackLocal-darwin-x64.zip`
      );
    });
  });

  describe("linux", () => {
    it("linux/x64 maps to linux-x64", async () => {
      expect(await resolveOSArch("linux", "x64")).toBe("linux-x64");
    });

    it("linux/arm64 maps to linux-x64", async () => {
      expect(await resolveOSArch("linux", "arm64")).toBe("linux-x64");
    });

    it("linux/ia32 maps to linux-ia32", async () => {
      expect(await resolveOSArch("linux", "ia32")).toBe("linux-ia32");
    });

    it("linux/x64 on musl (Alpine) maps to alpine", async () => {
      const result = await resolveOSArch("linux", "x64", async () => "ld-musl-x86_64.so.1");
      expect(result).toBe("alpine");
    });

    it("linux/x64 when /proc/self/maps is unreadable falls back to linux-x64", async () => {
      const result = await resolveOSArch("linux", "x64", async () => {
        throw new Error("ENOENT");
      });
      expect(result).toBe("linux-x64");
    });
  });

  describe("win32", () => {
    it("win32/x64 maps to win32", async () => {
      expect(await resolveOSArch("win32", "x64")).toBe("win32");
    });

    it("win32/ia32 maps to win32", async () => {
      expect(await resolveOSArch("win32", "ia32")).toBe("win32");
    });

    it("cygwin/x64 maps to win32", async () => {
      expect(await resolveOSArch("cygwin", "x64")).toBe("win32");
    });
  });

  describe("unsupported platforms", () => {
    it("throws BrowserStackError for unknown platform", async () => {
      await expect(resolveOSArch("freebsd", "x64")).rejects.toThrow(BrowserStackError);
    });

    it("throws BrowserStackError for unsupported arch", async () => {
      await expect(resolveOSArch("linux", "mips")).rejects.toThrow(BrowserStackError);
    });
  });
});
