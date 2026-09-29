# Final release and submission checklist

A checked source-code item is not a checked runtime-evidence item. Keep proof attached to the exact delivery commit.

## Completed in the delivery work

- [x] Original Node suite executed (16 passed).
- [x] Expanded Node suite executed (65 passed).
- [x] Repository-bound issue references and regression cases implemented.
- [x] Canonical merge commit lookup, branch reachability and evidence binding implemented.
- [x] Network/auth/unknown errors excluded from ledger rejection proof.
- [x] Full lifecycle transport and local HTTP endpoint tests implemented/executed.
- [x] CI, local proof scripts, setup runbook, proof UI code and submission/video drafts prepared.

## Technical release gates still open

- [ ] Review and merge the delivery branch only after required checks succeed.
- [ ] Pinned DPM bundle installs in the actual runner environment.
- [ ] Current Daml compilation and Daml Script tests pass; retain logs.
- [ ] Fresh Canton starts, current DAR deploys, actual package ID is captured.
- [ ] Six real successful ledger transitions produce a matching final receipt.
- [ ] Wrong issue, unauthorized settlement and duplicate settlement return the expected ledger rejections.
- [ ] Reproduce from clean setup and check retries/failure cleanup.
- [ ] Review Daml authorization beyond happy-path source tests, including direct intermediate-template creation.
- [ ] Browser/mobile visual and interaction QA passes on actual permitted browser.
- [ ] No secrets in tracked files, logs, screenshots or video.
- [ ] Actual final video recorded and reviewed against retained proof.

## Organizer/account gates still open

- [ ] Registration and eligibility, solo/team status and prize eligibility confirmed from the actual account/portal.
- [ ] Deadline and timezone reverified from the official current rulebook.
- [ ] Required repository visibility, judge access and license checked.
- [ ] Pre-existing-code/build-period rules checked.
- [ ] Required network, sponsor technology and chosen-track rules checked.
- [ ] Video duration/format/hosting and live deployment requirements checked.
- [ ] Submission fields, intellectual-property terms and any identity/KYC requirements checked.
- [ ] Final submission reviewed by the participant and portal receipt retained.

Do not close the live-Canton completion issue or mark final submission ready with any critical box still open. Repeated workflow attempts cannot override account restrictions or replace real evidence.
