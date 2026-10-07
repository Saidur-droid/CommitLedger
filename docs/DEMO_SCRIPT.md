# CommitLedger — Technical Demo Script

Maximum target: 3 minutes.

Use only a real configured Canton environment. If the runtime is not working, fix it before recording; do not fake green states.

## 0:00–0:20 — Setup

Show the CommitLedger home screen.

Say:
“CommitLedger converts a real GitHub work event into a role-authorized settlement proof on Canton. This demo uses a real issue and merged pull request.”

## 0:20–0:45 — Verify source issue

Open or show issue #5.

In CommitLedger, click **Verify issue & prepare bounty**.

Point out:
- repository;
- issue number;
- issue state;
- demo reward unit.

Say:
“The browser does not decide this state. The server reads GitHub directly.”

## 0:45–1:10 — Verify merged PR

Show PR #6 and its reference to issue #5.

Run **Verify canonical merge**.

Point out:
- PR number;
- base branch;
- head SHA;
- merged timestamp;
- SHA-256 evidence hash.

## 1:10–2:10 — Run Canton lifecycle

Click **Run live Canton lifecycle**.

Show the timeline:
- BOUNTY_ON_LEDGER
- CLAIM_REQUESTED
- CLAIMED
- PR_SUBMITTED
- VERIFIED
- SETTLED

Point out real contract IDs and update IDs.

Say:
“Three distinct parties control the workflow: maintainer, contributor and verifier.”

## 2:10–2:35 — Failure proof

Show the negative checks from the proof bundle.

Say:
“The same runtime also proves that wrong issue evidence is rejected, a contributor cannot settle the bounty, and a settled verified contract cannot be settled twice.”

## 2:35–2:55 — Receipt

Show the final `SettlementReceipt`.

Point out:
- bounty ID;
- repository;
- PR;
- reward unit;
- evidence hash;
- settlement reference.

## 2:55–3:00 — Close

Say:
“GitHub proves the work event. Daml controls authorization. Canton preserves the settlement proof.”
