# CommitLedger — Winning Standard

_Last updated: 2026-09-27_

## Non-negotiable goal #2

Build the strongest judgeable Canton-native product we can within the deadline.

This is an **internal quality bar**, not a claim or guarantee of winning.

## Winning thesis

CommitLedger should not look like a Web2 bounty app with a blockchain attached.

The judge should be able to understand in under 30 seconds why Canton is necessary:

**GitHub proves the work event. Daml defines who may move the bounty state. Canton records the authorized settlement state and proof.**

## Judge-visible product loop

1. Maintainer selects a real GitHub issue.
2. CommitLedger creates a bounty contract.
3. A contributor claims/accepts the work under the Daml authorization model.
4. Contributor submits a real pull request.
5. CommitLedger independently verifies repository, branch, PR and merge state through GitHub.
6. Only valid evidence unlocks the settlement choice.
7. Canton records the settlement.
8. The UI exposes a compact proof package: issue, PR, verification result, contract/transaction reference, settlement state.

## Mandatory differentiators

### 1. Canton is indispensable
If Canton is removed, the trusted authorization/settlement/provenance model must break.

### 2. Multi-party authorization is visible
The demo must show who is allowed to perform each state transition and one unauthorized attempt that fails.

### 3. Real external evidence
GitHub state is independently checked. Browser-submitted claims are never trusted for money-sensitive transitions.

### 4. Exactly-once settlement
A completed bounty cannot settle twice.

### 5. Failure recovery
At least one realistic failure is demonstrated: invalid PR, unmerged PR, wrong repository/base branch, unauthorized actor, or duplicate settlement.

### 6. Reproducibility
A judge can run the model locally/devnet without paid services.

### 7. Evidence over marketing
Every major claim has test output, ledger evidence, or a reproducible path.

## Quality gates

The project is not competition-ready until all are true:

- Daml contracts build.
- Contract tests pass.
- Canton local/dev ledger starts from documented commands.
- Ledger API create/exercise/read path works.
- GitHub verification path uses real API state.
- Happy-path E2E works.
- Invalid PR path fails safely.
- Unauthorized actor path fails.
- Duplicate settlement path fails.
- No secret/private key is committed.
- Setup is deterministic.
- README can get a technical judge to the demo quickly.
- Architecture diagram matches the actual implementation.
- Demo script contains no fake production claims.
- Competition compliance gate is complete.

## Scope rule

Do not spend deadline time on:
- a custom token,
- DAO/governance,
- generalized freelancing marketplace,
- speculative reputation system,
- MainNet integration merely for prestige,
- paid infrastructure.

Those are inferior to a flawless core settlement proof.

## Final judge story

**Problem:** open-source bounty payments depend on manual trust between maintainers and contributors.

**Product:** CommitLedger converts verified GitHub work into an authorization-controlled settlement lifecycle on Canton.

**Proof:** real issue + real PR + independent verification + Daml authorization + Canton settlement + reproducible ledger evidence.
