#!/usr/bin/env node
import { execFileSync, spawn } from "node:child_process";
import { mkdirSync, realpathSync } from "node:fs";

const dataDir = process.env.DATA_DIR || "/app/data";
mkdirSync(dataDir, { recursive: true });

// Hostless disks can be mounted root-owned, hiding image-layer ownership.
// Fix the mounted directory before dropping privileges.
const resolvedDataDir = realpathSync(dataDir);
execFileSync("chown", ["-R", "1000:1000", resolvedDataDir], { stdio: "inherit" });

// Keep OmniRoute's upstream permission guard: it applies NODE_OPTIONS and
// the configured base-path check, then execs the actual server as UID 1000.
const args = [
  "--reuid=1000",
  "--regid=1000",
  "--init-groups",
  "/app/check-permissions.sh",
  ...process.argv.slice(2),
];
const child = spawn("setpriv", args, {
  stdio: "inherit",
  env: {
    ...process.env,
    HOME: "/home/node",
    USER: "node",
    LOGNAME: "node",
  },
});

for (const signal of ["SIGTERM", "SIGINT", "SIGHUP"]) {
  process.on(signal, () => child.kill(signal));
}

child.on("error", (error) => {
  process.stderr.write(`OmniRoute start failed: ${error.message}\n`);
  process.exit(1);
});

child.on("exit", (code, signal) => {
  process.exit(signal ? 128 : (code ?? 1));
});
