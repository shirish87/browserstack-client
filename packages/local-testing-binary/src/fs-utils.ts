import { currentArch, currentPlatform } from "@dot-slash/browserstack-core";
import { BrowserStackError } from "@dot-slash/browserstack-core";
import { operations } from "@dot-slash/browserstack-openapi/local-testing-binary";
import { writeFileAtomic } from "./write-file-atomic.ts";
import { Buffer } from "node:buffer";
import {
  chmod,
  constants,
  lstat,
  mkdir,
  readFile,
  unlink,
} from "node:fs/promises";
import { join, resolve } from "node:path";
import process from "node:process";

function isRootDir(dir: string): boolean {
  return dir === "/" || (dir.length === 3 && dir[1] === ":" && dir[2] === "\\");
}

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

type OSArch = operations["downloadLocalBinary"]["parameters"]["path"]["osArch"];

/** @internal — exported for testing only */
export async function resolveOSArch(
  platform: string,
  arch: string,
  readMapsFile: () => Promise<string> = () => readFile("/proc/self/maps", "utf8")
): Promise<OSArch | undefined> {
  if (!["x64", "ia32", "arm64"].includes(arch)) {
    throw new BrowserStackError(`Unsupported platform/arch: ${platform}/${arch}`);
  }

  // BrowserStackLocal binaries: darwin-x64, win32, linux-x64, linux-ia32, alpine
  // No native arm64 binary exists; darwin/arm64 falls back to darwin-x64 (Rosetta 2)
  switch (platform) {
    case "darwin":
      return "darwin-x64";
    case "win32":
    case "cygwin":
      return "win32";
    case "linux":
      if (arch === "ia32") {
        return "linux-ia32";
      }
      try {
        const maps = await readMapsFile();
        if (maps.includes("musl")) {
          return "alpine";
        }
      } catch {
        /* ignore failed alpine/musl check */
      }
      return "linux-x64";
    default:
      throw new BrowserStackError(`Unsupported platform/arch: ${platform}/${arch}`);
  }
}

export async function currentOSArch(): Promise<OSArch | undefined> {
  return resolveOSArch(currentPlatform, currentArch);
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

/**
 * Finds the package ID by searching for the nearest package.json file in the current working directory and its parent directories.
 *
 * @param includeVersion Whether to include the version in the package ID.
 * @param maxDepth The maximum depth to search for the package.json file.
 * @returns A Promise that resolves to the package ID (name with optional version) if found, or undefined if not found.
 *
 * @internal
 */
async function readPackageId(
  pkgPath: string,
  includeVersion: boolean
): Promise<string | undefined> {
  const contents = await readFile(pkgPath, "utf-8");
  const data = contents.charCodeAt(0) === 0xfeff ? contents.slice(1) : contents;
  const pkg = JSON.parse(data);
  if (pkg && "name" in pkg) {
    const name = pkg.name?.trim?.();
    const version = includeVersion && "version" in pkg ? pkg?.version?.trim?.() : undefined;
    if (name && name.length) {
      return `${name}${version ? `@${version}` : ""}`;
    }
  }
  return undefined;
}

export async function findPackageId(
  includeVersion = false,
  maxDepth = 3
): Promise<string | undefined> {
  let dir = process.cwd();
  let cnt = Math.max(1, maxDepth);

  while (!isRootDir(dir) && cnt > 0) {
    const pkgPath = join(dir, "package.json");
    dir = resolve(dir, "..");
    cnt--;

    try {
      const id = await readPackageId(pkgPath, includeVersion);
      if (id) return id;
    } catch {
      // package.json not found at this level, continue upward
    }
  }
}
