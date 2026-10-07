# HackCanton Season 3 Competition-Ready Design

**Status:** Design specification for CommitLedger delivery branch `fix/verified-delivery-20260929`.
**Rules snapshot:** HackCanton Season 3 live Rules/Timeline/Tracks/Materials checked 2026-09-29.
**Target track:** Track 1 — Real-World Assets (RWA) & Business Workflows.

## 1. Goal

Ship CommitLedger as a judge-runnable Canton application whose core value is provable end-to-end settlement of verified open-source work:

`GitHub Issue -> Daml Bounty -> Claim -> Pull Request -> GitHub Merge Verification -> Canton Settlement -> Auditable Receipt`.

The submission must satisfy the official Season 3 requirements and make the six judging criteria easy to verify: Value, ICP, Metrics/Validation, GTM, MVP, and Pitch.

## 2. Competition requirements that are binding

The final submission must:
- be built on Canton and make meaningful use of Daml, Canton nodes, or Canton APIs;
- submit to exactly one official track: Track 1;
- contain hackathon-period work from 2026-09-18 through 2026-10-09 that is clearly identifiable, with any pre-existing code disclosed;
- use a public repository with a README at final submission time;
- make every judging artifact publicly accessible without requesting access;
- provide a working prototype/live demo or recorded demo video of at most 5 minutes;
- provide concise pitch material covering problem, Canton use, target users/GTM, and validation/metrics;
- have a completed project profile, one selected track, at least one journal entry, and the submitting account's required 1,000 Mana / minimum 10 days platform activity;
- submit no later than 2026-10-09 23:59 UTC;
- avoid plagiarism, misrepresentation, artificial activity/Mana inflation, IP violations, and undisclosed AI assistance.

Account-level gates (Mana, activity days, project profile, journal) are real submission blockers but are outside repository code. They must be verified before final submission.

## 3. Product positioning for Track 1

CommitLedger is a business workflow for auditable contributor settlement. It maps cleanly to Track 1:
- **Create:** maintainer creates a bounty tied to a canonical GitHub issue.
- **Update status:** contributor claims and submits a pull request.
- **Fulfill:** verifier independently checks the merged pull request and evidence.
- **Audit/report:** Canton records the authorized settlement and final receipt.

The demo asset remains `DEMO_CREDIT`. The product must not claim fiat transfer, Canton Coin transfer, MainNet usage, real users, production custody, or traction without evidence.

## 4. Roles and trust boundaries

### Maintainer
Creates the bounty, accepts the contributor claim, and performs settlement after verification.

### Contributor
Claims the bounty and submits the GitHub pull request reference.

### Verifier
Checks canonical GitHub evidence and advances only valid merged work.

### Canton/Daml
Enforces role authorization, state transitions, and exactly-once settlement semantics.

### GitHub
Provides the external source of truth for repository, issue, pull request, merge status, merge commit SHA, base branch, author policy, and merge timestamp.

The browser is never trusted to self-report GitHub merge state or ledger success.

## 5. Security and correctness requirements

The MVP must fail closed.

Required positive proof:
1. canonical issue is fetched;
2. bounty is created on Canton;
3. contributor claim is accepted;
4. real pull request is bound to that bounty;
5. canonical merged PR evidence is independently fetched;
6. merge commit is validated and reachable from the expected base branch;
7. verifier authorization succeeds;
8. maintainer settlement succeeds;
9. active SettlementReceipt is found and exported;
10. full contract/update identifiers are preserved.

Required negative proof:
- cross-repository issue lookalikes are rejected;
- wrong issue evidence is rejected;
- unmerged or malformed merge evidence is rejected;
- unauthorized settlement is rejected;
- replay/duplicate settlement is rejected;
- network, authentication, timeout, rate-limit, and unknown infrastructure errors never count as Daml authorization/replay evidence.

## 6. Runtime proof

The final technical proof must run on a real Canton environment, not a mocked transport.

Required evidence from one coherent run:
- Node test log;
- Daml build success;
- Daml Script test success;
- DAR/package deployment;
- distinct maintainer, contributor, verifier parties;
- six lifecycle ledger transitions;
- update IDs and contract IDs;
- final SettlementReceipt;
- exact negative-rejection responses;
- evidence JSON tied to the source commit;
- logs sufficient to distinguish ledger enforcement from infrastructure failure.

Local sandbox proof is acceptable as engineering evidence unless the organizers explicitly require a different network. If HackCanton DevNet access is available, the final judge package should prefer it because it reduces judge setup friction.

## 7. Judge-facing product flow

The UI should make the value understandable in 60–90 seconds.

### Screen hierarchy
1. **Problem/value statement** — merged work should not settle without independently verifiable evidence.
2. **Live Canton lifecycle** — one primary action runs the full proof.
3. **Role separation** — Maintainer / Contributor / Verifier responsibilities.
4. **Canonical GitHub evidence** — issue, PR, author, base branch, head SHA, merge commit SHA, merged timestamp.
5. **Ledger timeline** — human-readable state name plus full update ID and contract ID.
6. **Security failures** — wrong evidence, unauthorized settlement, and replay are visibly rejected.
7. **Settlement receipt** — final receipt, evidence hash, merge commit, settlement reference, and export.
8. **Why Canton** — multi-party authorization, privacy-compatible workflow semantics, and auditable state transitions.

No fake sample transaction IDs or simulated success states may appear as if they were runtime evidence.

## 8. Judging-criteria evidence

### Value / Problem Statement
Explain the coordination problem: GitHub proves code events, but it does not by itself enforce who may verify or settle a bounty.

### ICP / Audience
Primary ICP: open-source maintainers, foundations, ecosystem grant programs, and organizations running contributor bounty workflows.

### Metrics / Validation
Use only evidence we possess:
- real GitHub issue/PR fixture;
- deterministic positive and negative tests;
- runtime Canton proof when captured;
- judge walkthrough completion.
Do not fabricate user, wallet, transaction, or revenue metrics.

### GTM
Pilot path:
1. one repository/maintainer workflow;
2. one ecosystem or foundation bounty program;
3. integrate additional repositories and settlement adapters after validation.

### MVP
Show real code, Daml lifecycle, GitHub verification, Canton writes/reads, role authorization, replay prevention, and evidence export.

### Pitch
Keep the submission/demo narrative concise:
`problem -> why GitHub alone is insufficient -> live workflow -> rejected attacks -> Canton receipt -> business use -> pilot path`.

## 9. Track 1 submission package

Create:
- role-based working MVP;
- one-page business brief with ICP, use case, who pays, and why Canton;
- short 2–3 step pilot plan and required integrations;
- concise pitch deck/document;
- ≤5-minute recorded demo;
- public README/repository at final release;
- publicly accessible demo/project page and evidence package.

Repository visibility changes and public publishing are intentionally deferred until the owner requests the final submission/publishing phase.

## 10. Automation

The delivery workflow should automate everything that can be truthfully automated:
- Node tests;
- Daml build/tests;
- Canton local proof where runner support exists;
- evidence validation;
- repository safety/compliance gates;
- artifact retention;
- browser/judge-flow smoke checks when a browser is available.

Automation must never convert a missing real runtime into a green "submission ready" state.

A single competition readiness check should report three categories:
- **PASS:** verified with evidence;
- **BLOCKED:** requires account, network, browser, visibility, or external state;
- **FAIL:** implementation/evidence is incorrect.

## 11. Figma/design system

The judge UI should be refined in Figma before final implementation polish:
- high-contrast dark interface aligned with existing code;
- one primary action per proof stage;
- clear success/rejection semantics that do not rely on color alone;
- readable full identifiers with copy affordances;
- desktop judge layout plus mobile fallback;
- no marketing-heavy decorative screens that hide evidence;
- consistent components/tokens that map directly to the web implementation.

## 12. Delivery tracking

Linear should track only evidence-backed work. Each competition requirement gets an issue with:
- official rule/criterion;
- implementation task;
- verification command;
- evidence artifact;
- status: Todo / In Progress / Blocked / Verified.

Do not mark a task verified from source inspection alone when the requirement is runtime or account dependent.

## 13. Scope exclusions until the core is verified

Do not add:
- token/DAO/reputation systems;
- general freelance marketplace features;
- paid hosting dependencies;
- production custody;
- MainNet claims;
- fake traction;
- optional sponsor integrations that distract from the Track 1 core flow.

Optional integrations are considered only after core compliance, runtime proof, judge UX, and submission materials are green.

## 14. Definition of done

CommitLedger is product-ready when:
- full Node suite is green;
- Daml build/test is green;
- a real Canton lifecycle reaches SettlementReceipt;
- the named negative cases produce specific ledger/Daml rejection evidence;
- browser judge flow passes desktop/mobile QA;
- Track 1 business brief and pilot plan are complete;
- pitch/demo material is complete and truthful;
- hackathon-period work and pre-existing work are disclosed;
- no secrets are committed;
- competition readiness checker has no implementation FAILs.

CommitLedger is **submission-ready** only after the additional external gates pass:
- repository/public artifacts are accessible to a logged-out judge;
- 1,000 Mana requirement is satisfied;
- minimum 10 days platform activity is satisfied;
- journal is non-empty;
- project profile is complete;
- final track is Track 1;
- all links work in a private browser window;
- final submission is delivered before 2026-10-09 23:59 UTC.

## 15. Source of truth

Official Season 3 sources used for this spec:
- https://hackathon.appsfactory.cc/season-3
- https://www.youtube.com/watch?v=_PesNP65N7I

If organizers change the live rules, the newer official rule controls. Re-run the compliance check before final submission.
