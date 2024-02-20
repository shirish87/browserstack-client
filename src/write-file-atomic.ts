/**
 * This file is a modified version of the `write-file-atomic` package.
 * https://github.com/npm/write-file-atomic
 * https://github.com/npm/write-file-atomic/blob/b4a14e677267d3aea92eab11ea725c49fa37d66c/LICENSE.md
 *
 * Copyright (c) 2015, Rebecca Turner
 *
 * Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and * this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 */

import fs from "fs";
import { randomBytes } from "node:crypto";
import path from "node:path";
import { promisify } from "node:util";
import { onExit } from "signal-exit";

interface ActiveFiles {
  [key: string]: (() => void)[];
}

const activeFiles: ActiveFiles = {};

function getTmpname(filename: string): string {
  return filename + "." + randomBytes(6).toString("hex");
}

function cleanupOnExit(
  tmpfile: string | (() => string | undefined)
): () => void {
  return () => {
    const path = typeof tmpfile === "function" ? tmpfile() : tmpfile;
    if (!path) return;

    try {
      fs.unlinkSync(path);
    } catch {
      // ignore errors
    }
  };
}

function serializeActiveFile(absoluteName: string): Promise<void> {
  return new Promise((resolve) => {
    // make a queue if it doesn't already exist
    if (!activeFiles[absoluteName]) {
      activeFiles[absoluteName] = [];
    }

    activeFiles[absoluteName].push(resolve); // add this job to the queue
    if (activeFiles[absoluteName].length === 1) {
      resolve();
    } // kick off the first one
  });
}

// https://github.com/isaacs/node-graceful-fs/blob/master/polyfills.js#L315-L342
function isChownErrOk(err: Error): boolean {
  const errCode =
    typeof err === "object" && err && "code" in err ? err.code : undefined;

  if (errCode === "ENOSYS") {
    return true;
  }

  const nonroot: boolean = !process.getuid || process.getuid() !== 0;
  if (nonroot) {
    if (errCode === "EINVAL" || errCode === "EPERM") {
      return true;
    }
  }

  return false;
}

export async function writeFileAtomic(
  filename: string,
  data: string | Buffer | null,
  options: {
    encoding?: BufferEncoding;
    mode?: number;
    chown?: { uid: number; gid: number };
    tmpfileCreated?: (tmpfile: string) => void | Promise<void>;
    fsync?: boolean;
  } = {}
): Promise<void> {
  if (typeof options === "string") {
    options = { encoding: options };
  }

  let fd: number | undefined;
  let tmpfile: string | undefined;
  /* istanbul ignore next -- The closure only gets called when onExit triggers */
  const removeOnExitHandler = onExit(cleanupOnExit(() => tmpfile));
  const absoluteName: string = path.resolve(filename);

  try {
    await serializeActiveFile(absoluteName);
    const truename: string = await promisify(fs.realpath)(filename).catch(
      () => filename
    );
    tmpfile = getTmpname(truename);

    if (!options.mode || !options.chown) {
      // Either mode or chown is not explicitly set
      // Default behavior is to copy it from original file
      const stats: fs.Stats | void = await promisify(fs.stat)(truename).catch(
        () => {}
      );
      if (stats) {
        if (options.mode == null) {
          options.mode = stats.mode;
        }

        if (options.chown == null && process.getuid) {
          options.chown = { uid: stats.uid, gid: stats.gid };
        }
      }
    }

    fd = await promisify(fs.open)(tmpfile, "w", options.mode);
    if (options.tmpfileCreated) {
      await options.tmpfileCreated(tmpfile);
    }
    if (Buffer.isBuffer(data)) {
      await promisify(fs.write)(fd, data, 0, data.length, 0);
    } else if (data != null) {
      await promisify(fs.write)(
        fd,
        String(data),
        0,
        options.encoding || "utf8"
      );
    }

    if (options.fsync !== false) {
      await promisify(fs.fsync)(fd);
    }

    await promisify(fs.close)(fd);
    fd = undefined;

    if (options.chown) {
      await promisify(fs.chown)(
        tmpfile,
        options.chown.uid,
        options.chown.gid
      ).catch((err) => {
        if (!isChownErrOk(err)) {
          throw err;
        }
      });
    }

    if (options.mode) {
      await promisify(fs.chmod)(tmpfile, options.mode).catch((err) => {
        if (!isChownErrOk(err)) {
          throw err;
        }
      });
    }

    await promisify(fs.rename)(tmpfile, truename);
  } finally {
    if (fd) {
      await promisify(fs.close)(fd).catch(
        /* istanbul ignore next */
        () => {}
      );
    }
    removeOnExitHandler();

    if (tmpfile) {
      await promisify(fs.unlink)(tmpfile).catch(() => {});
    }

    activeFiles[absoluteName].shift(); // remove the element added by serializeSameFile
    if (activeFiles[absoluteName].length > 0) {
      activeFiles[absoluteName][0](); // start next job if one is pending
    } else {
      delete activeFiles[absoluteName];
    }
  }
}
