# CommitLedger — 2–3 Minute Pitch Script

Target length: about 2 minutes 30 seconds.

## 0:00–0:25 — Problem

Open-source bounties look transparent because the work happens on GitHub, but the payment decision is still mostly manual. A merged pull request proves code landed. It does not prove who was allowed to approve the bounty, whether the exact issue was satisfied, or whether the same work was settled twice.

## 0:25–0:55 — Product

CommitLedger turns that workflow into a verifiable settlement lifecycle.

A maintainer starts from a real GitHub issue. A contributor claims the bounty and submits a pull request. CommitLedger independently reads canonical GitHub state and binds the repository, issue, PR, branch, commit SHA and merge time into evidence.

That evidence then enters a role-separated Daml workflow on Canton.

## 0:55–1:25 — Why blockchain

Canton is not a database added for the hackathon.

The maintainer, contributor and verifier have different authorities. The application server cannot simply award itself a successful settlement. Unauthorized actions fail at the contract layer, and the verified contract is consumed when settlement occurs, preventing replay.

The final output is an auditable `SettlementReceipt` bound to the exact GitHub evidence.

## 1:25–1:55 — Why this matters

The first market is crypto protocols, foundations and developer programs that already pay contributors for GitHub work. Today they combine issues, spreadsheets, multisigs and manual review.

CommitLedger gives them a path from public work evidence to controlled settlement without asking them to replace GitHub.

## 1:55–2:20 — Business and wedge

The wedge is verified open-source bounties. A production product can monetize through per-settlement fees and organization subscriptions for policy, analytics and treasury integrations.

The same evidence-to-authorization pattern can later support grants, audits and milestone-based contributor programs.

## 2:20–2:35 — Close

The core insight is simple:

**GitHub proves the work event. Daml defines who may act. Canton records the authorized settlement proof.**

That is CommitLedger.
