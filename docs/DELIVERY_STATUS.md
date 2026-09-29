# Delivery status - 29 September 2026

Base: `27bd415c862fd220994739a618c7bafc8e181bd5`. Delivery branch: `fix/verified-delivery-20260929`.

## Executed successfully

The original five Node test files were reconstructed from the GitHub connector and checked against their Git blob hashes. The full original suite passed: **16 tests, 0 failures**, Node.js 22.16.0. After the changes, the expanded suite passed: **65 tests, 0 failures**. The expanded suite includes real local HTTP server tests and mocked provider/ledger transport tests; it is NOT live Canton proof.

## Implemented and Node-tested

- Repository-qualified issue binding rejects foreign repository references, foreign URLs and misleading Markdown labels. References in code/comments are excluded. This proves an explicit issue mention, not semantic completion of the issue.
- Merge commit SHA is required, independently looked up through the GitHub commit endpoint, checked for reachability from the target branch, and included in the evidence hash.
- Structured Canton errors are required for negative proofs. Network, unknown, authentication, throttling and unrelated errors do not count as authorization/replay evidence.
- Unique demo-run bounty identities and unambiguous active-contract lookup prevent selecting a previous demo receipt.
- Canonical GitHub checks finish before any ledger write.
- HTTP server blocks arbitrary browser ledger-command submission, checks origins/content types, and keeps configuration separate from actual ledger health.
- Proof UI has readable steps, full identifiers, explicit negative responses and JSON export. Its browser-level visual validation is still pending.

## Implemented but not runtime-verified

Daml merge-SHA propagation and additional negative assertion; pinned DPM bootstrap; build/test/deploy/party/user allocation scripts; fail-closed evidence checker; push/PR/manual GitHub Actions jobs; optional real-browser recording script.

## Blocking evidence still missing

- DPM installation, current Daml build and Daml Script execution. The local execution environment has no DPM and cannot resolve the official SDK download host. `scripts/verify-all.sh` correctly exits 2 rather than inventing success.
- Actual Canton deployment, six ledger updates/contracts, final receipt and specific ledger rejection responses.
- Successful complete GitHub Actions run for this delivery commit. A configured workflow is not a successful run.
- Browser/mobile visual QA. The available browser rejected local navigation with `ERR_BLOCKED_BY_ADMINISTRATOR`; this restriction was not bypassed.
- Final recorded runtime demo video. Recording instructions and code are not a recorded video.
- Current official portal/rulebook verification and account registration/eligibility confirmation. Public portal retrieval did not expose the formal submission rules. Earlier deadline notes are historical, not a new official verification.

The GitHub connection works. Remote Desktop Commander was suggested as a way to use an authorized development machine; it was not confirmed connected. No paid service, production deployment, permission broadening or repository-publication change was made.

Do not close issue #4, claim 100% completion, or submit as runtime-verified until the missing evidence is produced. This status takes precedence over older implementation-only wording in other repository documents.
