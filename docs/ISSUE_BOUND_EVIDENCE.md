# Issue-bound settlement evidence fixture

This file exists only to create a real merged GitHub pull request that references **issue #5** without closing it.

CommitLedger uses this fixture to prove a stronger trust chain:

1. issue #5 remains a real open bounty source;
2. this pull request references issue #5 in canonical GitHub metadata;
3. the pull request is merged;
4. CommitLedger verifies repository, author, base branch, merged state and the #5 reference;
5. the resulting evidence hash includes issue number 5;
6. Daml rejects evidence whose issue number differs from the bounty contract.

This is competition/demo evidence only. It is not user traction, a customer claim, or real-money activity.
