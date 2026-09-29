# HackCanton Season 3 Final Checklist

A source-code check is not runtime proof. A runtime proof is not an account/portal proof.

## Implementation gates
- [x] Repository-qualified issue matching implemented and Node-tested.
- [x] Merge commit SHA / branch reachability checks implemented and Node-tested.
- [x] Infrastructure errors excluded from security-rejection proof.
- [x] Competition-readiness PASS/BLOCKED/FAIL model implemented.
- [ ] Full current Node suite passes on final candidate commit.
- [ ] DPM 3.5.12 installs in the proof environment.
- [ ] Daml build passes and log is retained.
- [ ] Daml Script tests pass and log is retained.
- [ ] Current DAR is deployed to a real Canton runtime.
- [ ] Real Issue → Bounty → Claim → PR → Verify → Settle → Receipt flow succeeds.
- [ ] Wrong-evidence rejection is captured from Canton/Daml.
- [ ] Unauthorized settlement rejection is captured from Canton/Daml.
- [ ] Duplicate/replay settlement rejection is captured from Canton/Daml.
- [ ] Evidence bundle is coherent: one run ID + one source commit.
- [ ] Desktop/mobile judge flow passes browser QA.
- [ ] No secrets appear in tracked files, logs, screenshots, or video.
- [x] Track 1 business brief exists.
- [x] Pilot plan exists.
- [x] AI disclosure exists.
- [x] Hackathon work disclosure exists.
- [ ] Final ≤5-minute demo video is recorded and reviewed.

## Official competition gates
- [x] Target track is Track 1 — RWA & Business Workflows.
- [x] Meaningful Canton integration is an explicit hard requirement in the design.
- [x] Submission deadline recorded as 2026-10-09 23:59 UTC.
- [ ] Public repository available to a logged-out judge. **Deferred by owner until final phase.**
- [ ] Public demo/video/pitch/project page accessible without requesting access. **Deferred until final phase.**
- [ ] Submitting account has burned/accrued the required 1,000 Mana.
- [ ] At least 10 days of required platform activity is satisfied.
- [ ] Project profile is complete.
- [ ] Journal is non-empty.
- [ ] Team/eligibility information is valid.
- [ ] Pre-existing code is disclosed and qualifying delivery-period work is identifiable.
- [ ] All final links tested in a private/logged-out browser window.
- [ ] Participant reviews final submission and retains portal receipt.

Do not call CommitLedger submission-ready while any mandatory official gate above is unchecked.
