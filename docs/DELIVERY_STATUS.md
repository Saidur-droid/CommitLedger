# Delivery status — 30 September 2026

Delivery branch: `fix/verified-delivery-20260929`.

## Current candidate

- Exact current head: `722df9f69458cba0080d687105b4a0fb00f5c4d6`.
- PR #8 is still open and draft. Keep it draft until submission-side gates below are completed.
- Canonical Render service: `commitledger-proof-final`.
- Canonical public service URL: https://commitledger-proof-final.onrender.com
- Render deploy `dep-daucnqff3r2c73ep69u0` for the exact head above is **live**.
- The older Render service `commitledger-proof` is a discarded/dummy duplicate and is not evidence of final delivery status.

## Verified technical proof

The exact current candidate has completed the provider-side proof path on Render.

Verified from the successful Render build/deploy:

- Node suite passes: **86/86**.
- DPM **3.5.12** installs/runs.
- Daml build passes and a fresh DAR is created.
- Daml Script tests pass, including happy path and rejection/replay cases.
- Java 21 runtime is bootstrapped for Daml Script execution.
- A fresh local Canton sandbox starts and reports ready.
- The DAR package ID is derived canonically from the built DAR using `dpm damlc inspect-dar --json`.
- Three distinct local demo parties are allocated.
- Real GitHub evidence fixture used by the proof is:
  - open issue: `Saidur-droid/MergeEarn#69`
  - merged PR: `Saidur-droid/MergeEarn#73`
  - contributor: `Saidur-droid`
  - target branch: `main`
- The full Issue -> Bounty -> Claim -> PR -> Verify -> Settle -> SettlementReceipt lifecycle completes on Canton.
- Wrong-evidence rejection is captured.
- Unauthorized settlement rejection is captured.
- Duplicate/replay settlement rejection is captured as a structured Canton `CONTRACT_NOT_FOUND` rejection.
- The proof contains a real settlement receipt using clearly labelled non-production `DEMO_CREDIT`.
- Verification and Canton proof are bound to one exact source commit.
- Render build completes successfully.
- The web service binds to Render correctly and the final deploy is live.

This closes the technical runtime blocker that previously depended on a desktop/Codespace/GitHub Actions runner.

## Important architecture notes

- The proof backend is Render provider-side execution, not GitHub Actions and not the user's desktop.
- Render is authorized directly against the private CommitLedger repository; no other project repository is used as a runner or mirror.
- The proof uses a local ephemeral Canton sandbox during the Render build. The public web service is the judge-facing web service; it does not claim a persistent production Canton deployment.
- `DEMO_CREDIT` is test value only. No fiat, Canton Coin, MainNet, custody, revenue, customer traction, or organizer endorsement is claimed.
- The old duplicate Render service `commitledger-proof` should be ignored and manually removed later if desired. The available Render connector cannot delete/suspend it.

## Remaining work — do this next

The coding/runtime-debugging phase is effectively complete. Do not reopen architecture work unless a new concrete regression appears.

### 1. Evidence/status cleanup
- Update PR #8 body so it no longer says the real Canton proof is missing.
- Keep the exact successful commit/deploy IDs in the PR and submission notes.
- Confirm no new code changes have invalidated the proof commit before recording the final video. If code changes after `722df9f...`, rerun the full proof on the new exact head.

### 2. Judge browser QA
- Test the canonical Render URL on desktop.
- Test the same judge flow on a narrow/mobile viewport.
- Confirm the page loads without credentials.
- Confirm IDs/evidence are legible and no secret/private data is exposed.
- Test all final links in a logged-out/private browser window.

### 3. Final <=5-minute demo video
Record only after browser QA passes. The video should show:
1. problem + three roles;
2. real GitHub issue/PR evidence;
3. verified Canton six-step lifecycle;
4. wrong-evidence / unauthorized / replay rejection;
5. SettlementReceipt and `DEMO_CREDIT` disclaimer;
6. why Canton is necessary;
7. Track 1 business/pilot angle.

Review the full exported video before publishing.

### 4. Public/submission materials
Before submission:
- make the repository accessible to a logged-out judge when ready;
- publish/verify the demo video;
- verify pitch/project page;
- populate final repository/demo/video/pitch/evidence links in `docs/SUBMISSION_DRAFT.md`;
- verify every URL from a private/logged-out browser.

### 5. AppsFactory / competition account gates
Still require human/account verification:
- required 1,000 Mana;
- minimum required platform activity;
- project profile complete;
- journal non-empty;
- team/eligibility valid;
- pre-existing code disclosure accurate;
- hackathon-period work identifiable.

### 6. Final submission
- Review the final submission wording against actual evidence only.
- Submit through the competition portal.
- Retain the submission/portal receipt.
- Only after all mandatory gates pass should PR #8 be marked ready/merged and the project be called submission-ready.

## Resume instruction for the next session

Start here, in this order:

1. Read this file and `docs/FINAL_CHECKLIST.md`.
2. Confirm Render service `commitledger-proof-final` is still live on the current exact Git head.
3. Do **not** repeat the old desktop/GitHub Actions debugging unless Render is unusable.
4. Complete browser QA.
5. Record/review the <=5-minute video.
6. Complete public links and AppsFactory gates.
7. Finish portal submission and retain receipt.

Do not ask the owner to restate the technical history; this document is the handoff.
