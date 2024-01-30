import { name, version } from "@/../package.json";

const libVersion = [ name, version ].join("/");

const envVersion = [ "node", process.versions.node ].join("/");

const userAgent = [ libVersion, envVersion ].join(" ");

const pkginfo = {
  name,
  version,
  userAgent,
};

/**
 * @internal
 */
export default pkginfo;
