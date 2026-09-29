# Demo script — evidence first

**Official Season 3 limit: 5 minutes maximum.**
Target runtime: **3:30–4:15**, leaving safety margin.

Status: script prepared; actual verified-runtime video NOT yet recorded.

## Preparation

Run the automated proof on the exact delivery commit. Do not film a simulated lifecycle or reuse IDs from another commit/run. Keep the successful Canton session open. Hide tokens, terminals containing secrets and unrelated private information.

## Suggested timeline

### 0:00–0:25 — Problem
"A merged pull request proves that code was accepted, but it does not by itself provide a multi-party settlement workflow. CommitLedger connects canonical GitHub evidence to role-authorized Daml transitions on Canton."

Show the top proof summary:
**Source / Authorization / Settlement / Runtime**.

### 0:25–0:55 — Real source
Show GitHub issue #5 and merged PR #6, including the explicit issue reference and canonical merge commit SHA.

State clearly:
- this is a reproducible demo fixture;
- it is not external traction;
- issue-reference validation does not claim semantic proof that the code solved the issue.

### 0:55–1:20 — Roles
Show Maintainer, Contributor and Verifier.

Explain:
- Maintainer creates/accepts/settles;
- Contributor claims/submits;
- Verifier attests canonical merge evidence;
- Canton/Daml controls authorized transitions.

DEMO_CREDIT is test value, not money or Canton Coin.

### 1:20–2:30 — Live lifecycle
Click **Run live Canton lifecycle** only after health reports the real ledger reachable.

Show:
Issue → Bounty → Claim → PR → Verify → Settle → Receipt.

Expand at least one complete update ID and contract ID. Show the final SettlementReceipt, merge commit SHA and evidence hash. Export the proof JSON.

### 2:30–3:15 — Negative security proof
Show all three exact rejections:
1. wrong issue evidence;
2. contributor attempting settlement;
3. replay/duplicate settlement.

Explain the actual Daml/Canton code/assertion. A network error, 401/403, timeout or rate-limit response is never presented as authorization proof.

### 3:15–3:45 — Why Canton
"GitHub supplies external work state. The verifier is the evidence oracle. Daml controls the permitted state transitions. Canton provides the inspectable workflow state and final receipt."

### 3:45–4:15 — Track 1 / business close
Primary users: maintainers, foundations and bounty programs.

Pilot:
one repository → one ecosystem/foundation program → production settlement adapter after validation.

End on the receipt/proof summary, not a marketing screen.

## Before publishing

- confirm every displayed ID belongs to the final source commit/run;
- remove secrets and unrelated private information;
- verify audio and legibility;
- keep total length ≤5:00;
- verify judge-accessible links in a logged-out/private browser;
- retain the unedited technical capture and evidence bundle.

Do not present this storyboard as an already recorded or accepted submission.
