# CommitLedger — Dual-Program Final Checklist

Canonical active targets:
1. **Crypto World's Fair — Colosseum**
2. **Ideathon Bangladesh 2026**

Do not use the old HackCanton/AppsFactory checklist as the active plan.

## Frozen technical baseline

- [x] Product core implemented.
- [x] Node tests: 86/86 PASS on proven build.
- [x] DPM 3.5.12 PASS.
- [x] Daml build PASS.
- [x] Daml Script tests PASS.
- [x] Fresh Canton sandbox proof completed.
- [x] Six-step ledger lifecycle completed.
- [x] SettlementReceipt generated.
- [x] Wrong-issue rejection captured.
- [x] Unauthorized-settlement rejection captured.
- [x] Duplicate/replay rejection captured.
- [x] Public read-only proof endpoint exists.
- [x] Frozen technical proof commit: `26bd992787401f6458f6685d2ab76aacd05eab4e`.
- [x] Canonical Render service: `commitledger-proof-final`.

Documentation/planning commits after the proven commit are not automatically runtime-proven.

## Universal eligibility gate — must pass before coding

For each target:
- [ ] Registration is still open.
- [ ] Participant/team eligibility confirmed.
- [ ] Free participation path confirmed.
- [ ] Pre-existing-code/project rule confirmed.
- [ ] Competition build/judging window confirmed.
- [ ] Required chain/stack/track confirmed.
- [ ] Required deliverables confirmed.
- [ ] Deadline confirmed from live official source.
- [ ] Registration/application confirmation saved.

If any item above is unknown, do not start competition-specific engineering.

## Colosseum checklist

- [ ] Live rules re-verified.
- [ ] Registration completed.
- [ ] Confirmation/receipt retained.
- [ ] Pre-existing-work disclosure prepared.
- [ ] Competition-window work identified from Git history.
- [ ] Founder/market positioning finalized.
- [ ] Target-user validation collected.
- [ ] Market/GTM story finalized.
- [ ] Presentation video recorded and reviewed.
- [ ] Product demo recorded and reviewed.
- [ ] Repository/access requirement satisfied.
- [ ] Every submission link tested logged-out where applicable.
- [ ] Final portal review completed.
- [ ] Submission completed.
- [ ] Submission receipt retained.

## Ideathon Bangladesh 2026 checklist

- [ ] Live rules re-verified.
- [ ] Registration/application completed.
- [ ] Confirmation retained.
- [ ] Problem and customer segment finalized.
- [ ] Bangladesh relevance stated only with defensible evidence.
- [ ] Business model hypothesis finalized.
- [ ] Market sizing prepared.
- [ ] Validation evidence collected.
- [ ] Pitch/application materials completed.
- [ ] Required links/files tested.
- [ ] Final application review completed.
- [ ] Submission completed.
- [ ] Submission receipt retained.

## Code-change rule

Do not change product code merely to “refresh” the project for a new competition.

Only change executable code when:
- a verified competition requirement requires it; or
- a real product/QA defect is found.

If executable code changes, rerun the complete Render proof and bind evidence to the exact new code commit.

## Owner constraint

Use free tools/services only unless the owner explicitly approves otherwise.
