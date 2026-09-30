# NEXT SESSION HANDOFF — CommitLedger

**Read this first. Do not ask the owner to repeat the project history.**

## Where we stopped

Technical runtime work is green on the exact commit:

`722df9f69458cba0080d687105b4a0fb00f5c4d6`

Canonical Render service:

`commitledger-proof-final`

Public URL:

https://commitledger-proof-final.onrender.com

Successful Render deploy:

`dep-daucnqff3r2c73ep69u0`

Deploy status: **live**.

The similarly named `commitledger-proof` service is an older dummy/duplicate service. Ignore its failed status. It is not the canonical proof service.

## What was actually proven

- Node tests: 86/86 pass.
- DPM 3.5.12 works.
- Daml build passes.
- Daml Script tests pass.
- Temurin Java 21 is available in the proof environment.
- Fresh Canton sandbox starts and becomes ready.
- Built DAR package identity is derived from the DAR itself.
- Three distinct demo parties are allocated.
- Public real GitHub fixture passes preflight: MergeEarn issue #69 (open) + PR #73 (merged, references #69).
- Six-step Canton lifecycle completes through SettlementReceipt.
- Wrong-evidence rejection is captured.
- Unauthorized settlement rejection is captured.
- Duplicate/replay rejection is captured.
- Evidence is source-commit bound.
- Render build succeeds.
- Judge-facing web service deploys live on Render.

## Root causes already solved — do not re-debug these without new evidence

- GitHub hosted Actions jobs failing before steps started.
- Offline desktop execution dependency.
- missing Java in Render build image.
- brittle DAR package-ID extraction.
- duplicate package-ID env/file propagation.
- invalid closed GitHub issue fixture.
- Canton 3.5 error-envelope normalization.
- server binding to 127.0.0.1 instead of 0.0.0.0 on Render.
- forwarded HTTPS/public-host handling.
- brittle public-host regression test.

## What remains

This is now a **submission preparation** project, not a runtime debugging project.

Remaining mandatory work:
- desktop browser QA;
- mobile/narrow viewport QA;
- final secrets/publication review;
- final <=5-minute video;
- public repo access for judges at the final chosen time;
- public video/pitch/project/evidence links;
- logged-out/private-window verification of all links;
- AppsFactory Mana/activity/profile/journal/team/eligibility gates;
- final pre-existing-work/hackathon-period disclosure review;
- portal submission;
- retain final submission receipt.

## Exact next action

Next time, begin with **browser QA of https://commitledger-proof-final.onrender.com**.

If browser QA passes, move directly to the final video and submission package.

Do not change production/proof code unless QA finds a concrete defect. Any code change after the proven commit invalidates the exact-commit proof and requires a fresh proof run.

See:
- `docs/DELIVERY_STATUS.md`
- `docs/FINAL_CHECKLIST.md`
- `docs/SUBMISSION_DRAFT.md`
- `docs/DEMO_SCRIPT.md`
