import fs from "node:fs/promises";
import process from "node:process";
import { evaluateCompetitionReadiness } from "../src/competition-readiness.mjs";

const inputPath = process.argv[2] || process.env.COMMITLEDGER_READINESS_INPUT || "./evidence/readiness-input.json";

try {
  const input = JSON.parse(await fs.readFile(inputPath, "utf8"));
  const result = evaluateCompetitionReadiness(input);
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  process.exitCode = result.status === "PASS" ? 0 : result.status === "BLOCKED" ? 2 : 1;
} catch (error) {
  process.stderr.write(`Competition readiness check failed: ${error.message}\n`);
  process.exitCode = 1;
}
