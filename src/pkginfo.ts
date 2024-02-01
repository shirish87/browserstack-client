import pkg from "../package.json" assert { type: "json" };
import { versions } from "@/env.ts"

const libVersion = [ pkg?.name, pkg?.version ].filter(Boolean).join("/");

const envVersion = [ "node", versions.node ].filter(Boolean).join("/");

const userAgent = [ libVersion, envVersion ].filter(Boolean).join(" ");

const pkginfo = {
  name: pkg?.name,
  version: pkg?.version,
  userAgent,
};

/**
 * @internal
 */
export default pkginfo;
