# HackCanton Season 3 Final Checklist

A source-code check is not runtime proof. A runtime proof is not an account/portal proof.

## Implementation gates
- [x] Repository-qualified issue matching implemented and Node-tested.
- [x] Merge commit SHA / branch reachability checks implemented and Node-tested.
- [x] Infrastructure errors excluded from security-rejection proof.
- [x] Competition-readiness PASS/BLOCKED/FAIL model implemented.
- [x] Full current Node suite passes on the proven candidate commit `722df9f69458cba0080d687105b4a0fb00f5c4d6` (**86/86**).
- [x] DPM 3.5.12 installs in the Render proof environment.
- [x] Daml build passes in the Render proof run.
- [x] Daml Script tests pass in the Render proof run.
- [x] Current DAR is deployed to a fresh real local Canton sandbox during the proof run.
- [x] Real Issue → Bounty → Claim → PR → Verify → Settle → Receipt flow succeeds.
- [x] Wrong-evidence rejection is captured from Canton/Daml.
- [x] Unauthorized settlement rejection is captured from Canton/Daml.
- [x] Duplicate/replay settlement rejection is captured from Canton/Daml.
- [x] Evidence bundle is coherent: one source commit and one proof run.
- [ ] Desktop/mobile judge flow passes browser QA.
- [ ] No secrets appear in final tracked/public files, screenshots, published evidence, or video. **Final publication review still required.**
- [x] Track 1 business brief exists.
- [x] Pilot plan exists.
- [x] AI disclosure exists.
- [x] Hackathon work disclosure exists.
- [ ] Final ≤5-minute demo video is recorded and reviewed.

### Proven deployment
- Canonical service: `commitledger-proof-final`
- URL: https://commitledger-proof-final.onrender.com
- Proven source commit: `722df9f69458cba0080d687105b4a0fb00f5c4d6`
- Successful Render deploy: `dep-daucnqff3r2c73ep69u0`
- Status verified: **live**
- Ignore the older duplicate service `commitledger-proof`; it is not the canonical delivery.

## Official competition gates
- [x] Target track is Track 1 — RWA & Business Workflows.
- [x] Meaningful Canton integration is an explicit hard requirement in the design and is now runtime-proven on the candidate above.
- [x] Submission deadline recorded as 2026-10-09 23:59 UTC.
- [ ] Public repository available to a logged-out judge. **Deferred by owner until final phase.**
- [ ] Public demo/video/pitch/project page accessible without requesting access. **Final logged-out verification pending.**
- [ ] Submitting account has burned/accrued the required 1,000 Mana.
- [ ] At least 10 days of required platform activity is satisfied.
- [ ] Project profile is complete.
- [ ] Journal is non-empty.
- [ ] Team/eligibility information is valid.
- [ ] Pre-existing code is disclosed and qualifying delivery-period work is identifiable.
- [ ] All final links tested in a private/logged-out browser window.
- [ ] Participant reviews final submission and retains portal receipt.

## Next session order
1. Browser QA (desktop + mobile).
2. Final publication/secrets review.
3. Record and review the ≤5-minute video.
4. Make repository/materials judge-accessible at the chosen final moment.
5. Complete AppsFactory account/profile/journal/Mana/activity/eligibility gates.
6. Populate and test every final submission link.
7. Submit and retain the receipt.

Do not call CommitLedger fully submission-ready while any mandatory official gate above is unchecked.
