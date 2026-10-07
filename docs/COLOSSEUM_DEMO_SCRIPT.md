# Colosseum Product Demo Script — CommitLedger

Target: **2:15–2:45**, under the current <=3 minute FAQ limit.

## 0:00–0:15 — Start on proof summary

Show:
- product name;
- frozen proof commit;
- runtime verified state.

Say:
“CommitLedger turns canonical GitHub contribution evidence into a role-authorized Canton settlement receipt.”

## 0:15–0:40 — External work evidence

Show the real evidence fixture:
- repository `Saidur-droid/MergeEarn`;
- open issue `#69`;
- merged PR `#73`.

Say:
“This is a real GitHub evidence fixture, not a traction claim. CommitLedger verifies the canonical issue and merged pull request before settlement can advance.”

## 0:40–1:35 — Six-step lifecycle

Show the workflow:
1. Bounty created.
2. Claim created.
3. Claim accepted.
4. Pull request submitted.
5. Merge evidence verified.
6. Work settled.

Expand at least one real `updateId` and `contractId`.

End on the `SettlementReceipt`.

## 1:35–2:15 — Security proof

Show the three rejection cases:
- wrong issue/evidence;
- unauthorized settlement attempt;
- duplicate/replay settlement.

Say:
“These are application-level authorization and evidence failures captured from the proven run, not network errors presented as security proof.”

## 2:15–2:35 — Architecture

Show the boundary:
- GitHub = external work evidence;
- verifier = attestation boundary;
- Daml = allowed state transitions;
- Canton = workflow state and receipt.

## 2:35–2:45 — Close

“CommitLedger makes settlement decisions inspectable, role-aware and replay-safe.”

## Before upload

- keep <=3:00;
- English only;
- hide tokens/secrets;
- ensure every displayed proof element belongs to the frozen proof commit;
- do not imply DEMO_CREDIT is money;
- test video and proof links as a logged-out judge.
