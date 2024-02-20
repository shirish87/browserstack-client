import { BrowserStack as B } from "@/index.ts";
import { LocalTestingBinary } from "@/local-testing-binary.ts";

export * from "@/index.ts";
export { LocalTestingBinary } from "@/local-testing-binary.ts";

export type {
  LocalBinaryFlags,
  LocalBinaryFolderTestingFlags,
  LocalBinaryServerTestingFlags,
  LocalTestingBinaryOptions,
  ProxyParams,
} from "@/local-testing-binary.ts";

/**
 * Represents the BrowserStack API namespace.
 * @namespace
 * @public
 */
export const BrowserStack = {
  ...B,
  LocalTestingBinary: LocalTestingBinary,
};
