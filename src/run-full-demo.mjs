import {writeFile} from 'node:fs/promises';
import {runtimeConfigFromEnv,runFullLifecycle} from './orchestrator.mjs';
try {
  const proof=await runFullLifecycle({
    runtime:runtimeConfigFromEnv(),
    issueUrl:process.env.COMMITLEDGER_ISSUE_URL || 'https://github.com/Saidur-droid/CommitLedger/issues/5',
    prNumber:Number(process.env.COMMITLEDGER_PR_NUMBER || 6),
    contributorGithub:process.env.COMMITLEDGER_CONTRIBUTOR_GITHUB || 'Saidur-droid',
    rewardAmount:Number(process.env.COMMITLEDGER_REWARD_AMOUNT || 100),
    baseBranch:process.env.COMMITLEDGER_BASE_BRANCH || 'main',
    githubToken:process.env.GITHUB_TOKEN || ''
  });
  proof.sourceCommit=process.env.GITHUB_SHA || 'local-working-tree';
  const json=JSON.stringify(proof,null,2)+'\n';
  console.log(json);
  if(process.env.COMMITLEDGER_EVIDENCE_FILE) await writeFile(process.env.COMMITLEDGER_EVIDENCE_FILE,json);
} catch(error) {
  console.error(`CommitLedger full demo failed: ${error.message}`);
  process.exitCode=1;
}
