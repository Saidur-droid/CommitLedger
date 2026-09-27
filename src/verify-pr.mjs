import { fetchVerifiedPullRequest } from "./github-verifier.mjs";

const [repository, prNumberRaw, headSha = "", baseBranch = "", contributorGithub = ""] = process.argv.slice(2);
const prNumber = Number(prNumberRaw);

if (!repository || !Number.isInteger(prNumber) || prNumber <= 0) {
  console.error("Usage: npm run verify:pr -- owner/repo PR_NUMBER [HEAD_SHA] [BASE_BRANCH] [CONTRIBUTOR_GITHUB]");
  process.exit(2);
}

try {
  const evidence = await fetchVerifiedPullRequest({
    repository,
    prNumber,
    token: process.env.GITHUB_TOKEN,
    expected: { headSha, baseBranch, contributorGithub }
  });
  console.log(JSON.stringify(evidence, null, 2));
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
