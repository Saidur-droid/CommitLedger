# Demo script - evidence first

Status: script prepared; actual verified-runtime video NOT yet recorded. Suggested internal length: about three minutes, adjustable to the official portal requirement, which is not yet verified.

## Preparation

Run the entire automated runbook on the delivery commit. Do not film a simulated lifecycle or reuse old IDs. Keep the successful real Canton session open. Hide tokens, terminals containing secrets and unrelated private information. Make GitHub fixture access available to the authorized judge without publishing credentials.

## Storyboard and narration

**Problem (opening):** "A merged pull request proves that code was accepted, but it does not by itself provide an auditable bounty settlement workflow. CommitLedger connects canonical GitHub evidence to role-authorized Daml transitions on Canton."

**Real source:** Show issue #5 and merged PR #6, including the explicit issue reference. Explain that this is an internal demo fixture, not external traction. Show the canonical merge commit SHA. Explain that issue mention verification does not evaluate whether the code solves the issue.

**Roles:** Show Maintainer, Contributor and Verifier. Explain who creates, claims, accepts, submits, verifies and settles. Clearly label this as a local test ledger with DEMO_CREDIT, not money or Canton Coin.

**Live flow:** Click "Run live Canton lifecycle". Wait for the real backend response. Expand a full contract/update ID and the final settlement receipt. Match its merge SHA and evidence hash to the GitHub proof. Download the JSON proof.

**Failures:** Expand the three rejection responses: wrong issue evidence, contributor attempting settlement, and replay of the consumed verified contract. Explain the exact error code and relevant assertion/contract ID. Do not count a network error as a rejected unauthorized transaction.

**Reproducibility:** Show the tested commit, Node/Daml logs and automated runbook. Say only what the retained logs actually prove.

**Close:** "GitHub supplies external work state; the verifier is a trusted oracle; Daml restricts the recorded transitions; Canton provides the inspectable receipt. Production custody, identity management and payment rails remain outside this demo."

## Before publishing

Confirm the official duration, file format and hosting rules. Watch the complete video, check IDs against the proof file, remove secrets, verify judge access, and keep the unedited technical capture alongside the final video. Do not present a storyboard or silent capture as an already accepted submission.
