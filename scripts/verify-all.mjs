import { spawn } from "node:child_process";
import { mkdirSync, rmSync, writeFileSync, appendFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
process.chdir(root);
mkdirSync("evidence", { recursive: true });
rmSync("evidence/verification.json", { force: true });
rmSync("evidence/verifier-trace.log", { force: true });

const env = {
  ...process.env,
  PATH: `${process.env.DPM_HOME || `${process.env.HOME}/.dpm`}/bin:${process.env.PATH || ""}`,
  DPM_SDK_VERSION: "3.5.12"
};

function trace(message) {
  const line = `[${new Date().toISOString()}] ${message}\n`;
  appendFileSync("evidence/verifier-trace.log", line);
  process.stderr.write(line);
}

async function run(label, command, args, { cwd = root, logFile } = {}) {
  process.stdout.write(`=== ${label} ===\n`);
  trace(`START ${label}: ${command} ${args.join(" ")} cwd=${cwd}`);

  return await new Promise((resolveRun, rejectRun) => {
    const child = spawn(command, args, {
      cwd,
      env,
      stdio: ["ignore", "pipe", "pipe"]
    });

    let output = "";
    child.stdout.on("data", chunk => {
      const text = chunk.toString();
      output += text;
      process.stdout.write(text);
    });
    child.stderr.on("data", chunk => {
      const text = chunk.toString();
      output += text;
      process.stderr.write(text);
    });
    child.on("error", error => {
      if (logFile) writeFileSync(logFile, output);
      trace(`ERROR ${label}: ${error.message}`);
      rejectRun(error);
    });
    child.on("close", (code, signal) => {
      if (logFile) writeFileSync(logFile, output);
      trace(`CLOSE ${label}: code=${code} signal=${signal || "none"}`);
      if (code !== 0) {
        rejectRun(new Error(`${label} failed with status ${code}${signal ? ` signal ${signal}` : ""}`));
        return;
      }
      process.stdout.write(`=== ${label}: PASS ===\n`);
      resolveRun();
    });
  });
}

async function main() {
  const source = await new Promise((resolveGit, rejectGit) => {
    const child = spawn("git", ["rev-parse", "HEAD"], { cwd: root, env, stdio: ["ignore", "pipe", "pipe"] });
    let out = "", err = "";
    child.stdout.on("data", c => out += c.toString());
    child.stderr.on("data", c => err += c.toString());
    child.on("error", rejectGit);
    child.on("close", code => code === 0 ? resolveGit(out.trim()) : rejectGit(new Error(err || "Unable to resolve Git HEAD")));
  });

  trace(`SOURCE ${source}`);

  const testFiles = readdirSync(resolve(root, "tests"))
    .filter(name => name.endsWith(".test.mjs"))
    .sort()
    .map(name => resolve(root, "tests", name));
  trace(`NODE_TEST_FILES ${testFiles.length}`);
  await run("STAGE 1/4: Node", process.execPath, ["--test", ...testFiles], { logFile: "evidence/node-tests.log" });

  await run("STAGE 2/4: DPM", "dpm", ["version", "--active"], {
    cwd: resolve(root, "daml"),
    logFile: "evidence/dpm-version.log"
  });

  await run("STAGE 3/4: Daml build", "dpm", ["build"], {
    cwd: resolve(root, "daml"),
    logFile: "evidence/daml-build.log"
  });

  await run("STAGE 4/4: Daml tests", "dpm", ["test"], {
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
      commit: source
    }, null, 2) + "\n"
  );

  trace("COMPLETE verification");
  process.stdout.write("=== BUILD/TEST VERIFICATION COMPLETE ===\n");
}

main().catch(error => {
  trace(`FATAL ${error?.stack || error?.message || String(error)}`);
  process.stderr.write(`VERIFICATION FAILED: ${error?.message || String(error)}\n`);
  process.exitCode = 1;
});
