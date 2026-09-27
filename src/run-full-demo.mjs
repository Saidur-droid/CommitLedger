import { writeFile } from "node:fs/promises";
import { runtimeConfigFromEnv, runFullLifecycle } from "./orchestrator.mjs";

const issueUrl = process.env.COMMITLEDGER_ISSUE_URL || "https://github.com/Saidur-droid/CommitLedger/issues/1";
const prNumber = Number(process.env.COMMITLEDGER_PR_NUMBER || "2");
const contributorGithub = process.env.COMMITLEDGER_CONTRIBUTOR_GITHUB || "Saidur-droid";
const rewardAmount = Number(process.env.COMMITLEDGER_REWARD_AMOUNT || "100");
const baseBranch = process.env.COMMITLEDGER_BASE_BRANCH || "main";

try {
  const proof = await runFullLifecycle({
    runtime: runtimeConfigFromEnv(),
    issueUrl,
    rewardAmount,
    contributorGithub,
    prNumber,
    baseBranch,
    githubToken: process.env.GITHUB_TOKEN || ""
  });

  const json = JSON.stringify(proof, null, 2);
  console.log(json);

  if (process.env.COMMITLEDGER_EVIDENCE_FILE) {
    await writeFile(process.env.COMMITLEDGER_EVIDENCE_FILE, json + "\n", "utf8");
    console.error(`Evidence written to ${process.env.COMMITLEDGER_EVIDENCE_FILE}`);
  }
} catch (error) {
  console.error(`CommitLedger full demo failed: ${error.message}`);
  process.exit(1);
}
