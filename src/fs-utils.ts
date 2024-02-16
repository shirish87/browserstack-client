import { currentArch, currentPlatform } from "@/env.ts";
import { BrowserStackError } from "@/error.ts";
import { operations } from "@/generated/openapi.ts";
import { spawnSync } from "node:child_process";
import {
  chmod,
  constants,
  lstat,
  mkdir,
  unlink,
  readFile,
} from "node:fs/promises";
import { join, resolve } from "node:path";
import writeFileAtomic from "write-file-atomic";

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

  const fileStat = await lstat(filePath).catch((err) =>
    err.code === "ENOENT" ? null : err
  );

  const flags = fileFlags & 0o700;

  if (!fileStat || !fileStat.isFile() || (fileStat.mode & flags) !== 0) {
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

  const dirStat = await lstat(dirPath).catch((err) =>
    err.code === "ENOENT" ? null : err
  );

  const flags = dirFlags & 0o700;

  if (!dirStat || !dirStat.isDirectory() || (dirStat.mode & flags) !== 0) {
    return false;
  }

  return true;
}

export async function ensureDirExists(
  binHome: string,
  dirMode: number = 0o755,
  dirFlags?: number
): Promise<string> {
  try {
    const dirPath = resolve(binHome);
    const dirStat = await lstat(dirPath).catch(async (err) => {
      if (err.code === "ENOENT") {
        await mkdir(dirPath, { recursive: true, mode: dirMode });
        return lstat(dirPath);
      }

      throw err;
    });

    const flags = (dirFlags ?? constants.R_OK | constants.W_OK) & 0o700;

    if (dirStat && (dirStat.mode & flags) !== 0) {
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
          // const { spawnSync } = await import("node:child_process");
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
  const filePath = join(resolve(dirPath), filename);

  try {
    await writeFileAtomic(filePath, Buffer.from(content), { mode: fileMode });
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

export async function findPackageId(
  includeVersion = false,
  maxDepth = 3
): Promise<string | undefined> {

  let dir = process.cwd();
  let pkgPath: string | undefined;
  let cnt = Math.max(1, maxDepth);

  while (!dir.match(/^(\w:\\|\/)$/) && cnt > 0) {
    pkgPath = join(dir, "package.json");
    dir = resolve(dir, "..");
    cnt--;

    try {
      const contents = await readFile(pkgPath, "utf-8");
      const data =
        contents.charCodeAt(0) === 0xfeff ? contents.slice(1) : contents;

      const pkg = JSON.parse(data);

      if (pkg && "name" in pkg) {
        const name = pkg.name?.trim?.();
        const version =
          includeVersion && "version" in pkg
            ? pkg?.version?.trim?.()
            : undefined;

        if (name && name.length) {
          return `${name}${version ? `@${version}` : ""}`;
        }
      }
    } catch {
      pkgPath = undefined;
    }
  }
}
