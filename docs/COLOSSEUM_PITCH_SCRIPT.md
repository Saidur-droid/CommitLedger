# Colosseum Presentation Script — CommitLedger

Target: **about 2 minutes**, comfortably inside the current 2–3 minute FAQ guidance.

## 0:00–0:15 — Hook

“Open-source programs can prove that a pull request merged. What they often cannot prove is who was authorized to verify the work, who was authorized to settle it, and whether the same contribution was paid twice. CommitLedger is the control layer between merged work and authorized settlement.”

## 0:15–0:40 — Product

“CommitLedger binds a canonical GitHub issue and merged pull request to a role-authorized workflow: Bounty, Claim, Pull Request, Verification, Settlement, and a final SettlementReceipt. The maintainer, contributor, and verifier have different permissions, and the workflow only advances when the evidence and authorization are correct.”

## 0:40–1:05 — Why blockchain / why Canton

“GitHub is the source of truth for the work event. Canton and Daml are the source of truth for settlement workflow state. Daml defines the allowed transitions, consumed contracts block replay, and the ledger gives us inspectable contract and update identifiers. If you remove the ledger layer, the core authorization and replay protection disappear.”

## 1:05–1:30 — Proof

“We executed the full workflow on a fresh Canton sandbox. The Node suite passed 86 out of 86 tests, Daml built and tested successfully, all six ledger transitions completed, and the final SettlementReceipt was generated. We also captured three negative proofs: wrong evidence, unauthorized settlement, and duplicate settlement.”

## 1:30–1:50 — Market

“Our first customers are organizations running contributor and bounty programs: open-source companies, foundations, ecosystem funds, and engineering organizations. The wedge is one repository and one bounty campaign, then expand into organization policy, audit controls, and approved production settlement adapters.”

## 1:50–2:00 — Close

“CommitLedger separates evidence from authority: GitHub proves what happened; the verifier attests it; and Canton controls what each party is allowed to do next.”

## Recording rules

- English only.
- Do not claim revenue, customers, MainNet, Canton Coin or fiat settlement.
- Mention that pre-existing development is disclosed in the submission.
- Keep the product and founder reasoning clear; avoid a long technical walkthrough here.
