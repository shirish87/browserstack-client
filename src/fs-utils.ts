import { currentArch, currentPlatform } from "@/env.ts";
import { operations } from "@/generated/openapi.ts";
import { spawnSync } from "node:child_process";
import {
  chmod,
  constants,
  lstat,
  mkdir,
  writeFile,
  unlink,
} from "node:fs/promises";
import { join, resolve } from "node:path";
import { BrowserStackError } from "@/error.ts";

export async function binaryPath(
  binHome: string,
  filename: string = "BrowserStackLocal"
): Promise<string> {
  const binDirPath = await ensureDirExists(binHome);

  const osArch = await currentOSArch();
  const binFilename = osArch === "win32" ? `${filename}.exe` : filename;

  const binFilePath = join(binDirPath, binFilename);
  if (!(await fileExists(binFilePath, constants.R_OK | constants.X_OK))) {
    throw new BrowserStackError(`Missing or inaccessible file: ${binFilePath}`);
  }

  // exists and accessible file but could still be corrupt/partial/invalid
  // but no point running version check to verify
  // since it wastes an operation and the binary will fail to run anyway
  return binFilePath;
}

export async function fileExists(
  filePath: string,
  fileFlags: number = constants.R_OK
): Promise<boolean> {
  if (typeof filePath !== "string" || !filePath.trim().length) {
    return false;
  }

  const fileStat = await lstat(filePath);
  if (!fileStat.isFile() || (fileStat.mode & fileFlags) !== fileFlags) {
    return false;
  }

  return true;
}

export async function dirExists(
  dirPath: string,
  dirFlags: number = constants.R_OK
): Promise<boolean> {
  if (typeof dirPath !== "string" || !dirPath.trim().length) {
    return false;
  }

  const dirStat = await lstat(dirPath);
  if (!dirStat.isDirectory() || (dirStat.mode & dirFlags) !== dirFlags) {
    return false;
  }

  return true;
}

export async function ensureDirExists(
  binHome: string,
  dirMode: number = 0o755,
  dirFlags: number = constants.R_OK | constants.W_OK
): Promise<string> {
  try {
    const dirPath = resolve(binHome);
    const dirStat = await lstat(dirPath);

    if (!dirStat.isDirectory()) {
      await mkdir(dirPath, { recursive: true, mode: dirMode });
    }

    if ((dirStat.mode & dirFlags) !== dirFlags) {
      await chmod(dirPath, dirMode);
    }

    return dirPath;
  } catch (err) {
    if (err instanceof Error) {
      throw new BrowserStackError(
        `Missing or inaccessible directory: ${binHome}`,
        err
      );
    }

    throw err;
  }
}

export async function currentOSArch(): Promise<
  operations["downloadLocalBinary"]["parameters"]["path"]["osArch"] | undefined
> {
  if (["x64", "ia32"].includes(currentArch)) {
    // at the moment, only darwin-x64, win32, linux-x64, linux-ia32, alpine binaries are listed

    switch (currentPlatform) {
      case "darwin":
        if (currentArch === "x64") {
          return "darwin-x64";
        }
        break;
      case "win32":
      case "cygwin":
        return "win32";
      case "linux":
        if (currentArch === "ia32") {
          return "linux-ia32";
        }

        try {
          if (
            spawnSync("ldd", ["--version"])
              .stderr.toString("utf8")
              .indexOf("musl") !== -1
          ) {
            return "alpine";
          }
        } catch {
          /* ignore failed alpine/musl check */
        }

        return "linux-x64";
    }
  }

  throw new BrowserStackError(
    `Unsupported platform/arch: ${currentPlatform}/${currentArch}`
  );
}

export async function saveFile(
  dirPath: string,
  filename: string,
  content: Uint8Array,
  fileMode: number
): Promise<string> {
  const filePath = join(dirPath, filename);

  try {
    await writeFile(filePath, content, { mode: fileMode });
    return filePath;
  } catch (err) {
    try {
      if ((await lstat(filePath)).isFile()) {
        await unlink(filePath);
      }
    } catch {
      /* ignore best-effort cleanup error */
    }

    throw err;
  }
}
