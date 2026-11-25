#!/usr/bin/env node
import { execFileSync, spawn } from "node:child_process";
import { mkdirSync, realpathSync } from "node:fs";

const dataDir = process.env.DATA_DIR || "/app/data";
mkdirSync(dataDir, { recursive: true });

// Hostless disks can be mounted root-owned, hiding the ownership baked into
// the Docker image. Repair the mounted directory before dropping to UID 1000.
const resolvedDataDir = realpathSync(dataDir);
execFileSync("chown", ["-R", "1000:1000", resolvedDataDir], { stdio: "inherit" });

const command = process.argv[2] || "node";
const args = process.argv.slice(3);
const child = spawn(command, args, {
  stdio: "inherit",
  env: {
    ...process.env,
    HOME: "/home/node",
    USER: "node",
    LOGNAME: "node",
  },
  uid: 1000,
  gid: 1000,
});

for (const signal of ["SIGTERM", "SIGINT", "SIGHUP"]) {
  process.on(signal, () => child.kill(signal));
}

child.on("error", (error) => {
  process.stderr.write(`OmniRoute start failed: ${error.message}\n`);
  process.exit(1);
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.exit(128);
  }
  process.exit(code ?? 1);
});
