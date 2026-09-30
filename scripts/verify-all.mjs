import { spawnSync } from "node:child_process";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(new URL("..", import.meta.url).pathname, "..");
process.chdir(root);
mkdirSync("evidence", { recursive: true });
rmSync("evidence/verification.json", { force: true });

const env = {
  ...process.env,
  PATH: `${process.env.DPM_HOME || `${process.env.HOME}/.dpm`}/bin:${process.env.PATH || ""}`,
  DPM_SDK_VERSION: "3.5.12"
};

function run(label, command, args, { cwd = root, logFile } = {}) {
  process.stdout.write(`=== ${label} ===\n`);
  const result = spawnSync(command, args, {
    cwd,
    env,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"]
  });
  const output = `${result.stdout || ""}${result.stderr || ""}`;
  if (logFile) writeFileSync(logFile, output);
  process.stdout.write(output);
  if (result.error) {
    process.stderr.write(`=== ${label}: FAILED to launch: ${result.error.message} ===\n`);
    process.exit(127);
  }
  if (result.status !== 0) {
    process.stderr.write(`=== ${label}: FAILED with status ${result.status} ===\n`);
    process.exit(result.status ?? 1);
  }
  process.stdout.write(`=== ${label}: PASS ===\n`);
}

const source = spawnSync("git", ["rev-parse", "HEAD"], { cwd: root, encoding: "utf8" });
if (source.status !== 0) {
  process.stderr.write(source.stderr || "Unable to resolve Git HEAD\n");
  process.exit(source.status ?? 1);
}
const sourceCommit = source.stdout.trim();

run("STAGE 1/4: Node", "npm", ["test"], { logFile: "evidence/node-tests.log" });

const dpmCheck = spawnSync("dpm", ["version", "--active"], {
  cwd: resolve(root, "daml"),
  env,
  encoding: "utf8"
});
if (dpmCheck.error?.code === "ENOENT") {
  const message = "BLOCKED: DPM is not installed. Run bash scripts/bootstrap-dpm.sh on an internet-connected development machine.\n";
  writeFileSync("evidence/daml-build.log", message);
  process.stderr.write(message);
  process.exit(2);
}
const dpmOutput = `${dpmCheck.stdout || ""}${dpmCheck.stderr || ""}`;
writeFileSync("evidence/dpm-version.log", dpmOutput);
process.stdout.write("=== STAGE 2/4: DPM ===\n");
process.stdout.write(dpmOutput);
if (dpmCheck.status !== 0) {
  process.stderr.write(`=== STAGE 2/4: DPM: FAILED with status ${dpmCheck.status} ===\n`);
  process.exit(dpmCheck.status ?? 1);
}
process.stdout.write("=== STAGE 2/4: DPM: PASS ===\n");

run("STAGE 3/4: Daml build", "dpm", ["build"], {
  cwd: resolve(root, "daml"),
  logFile: "evidence/daml-build.log"
});
run("STAGE 4/4: Daml tests", "dpm", ["test"], {
  cwd: resolve(root, "daml"),
  logFile: "evidence/daml-tests.log"
});

writeFileSync(
  "evidence/verification.json",
  JSON.stringify({
    node: true,
    damlBuild: true,
    damlTests: true,
    verifiedAt: new Date().toISOString(),
    commit: sourceCommit
  }, null, 2) + "\n"
);

process.stdout.write("=== BUILD/TEST VERIFICATION COMPLETE ===\n");
