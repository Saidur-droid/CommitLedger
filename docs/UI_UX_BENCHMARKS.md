# CommitLedger UI/UX benchmark set

CommitLedger is a hybrid of four product categories:
1. developer workflow / source-of-truth tools;
2. bounty and contributor-workflow products;
3. audit/compliance and evidence systems;
4. on-chain / deployment operations dashboards.

The design should borrow interaction principles, not copy any single product.

## Benchmark products

### GitHub
Use for:
- source-of-truth issue/PR identity;
- close connection between work items and commits/merges;
- compact status and reference formatting;
- drill-down from summary to evidence.

Do not copy GitHub's repository chrome or exact issue layout.

### Linear
Use for:
- calm density;
- strong hierarchy with little decorative noise;
- predictable status language;
- fast scanning and keyboard-friendly mental model.

Do not copy Linear's sidebar, typography scale, or issue screen one-for-one.

### Stripe Dashboard
Use for:
- inspectable identifiers;
- event/log detail;
- clear distinction between successful business state and diagnostic state;
- copyable technical evidence.

Do not imitate Stripe branding or payment-specific visual metaphors.

### Vercel
Use for:
- deployment/runtime status clarity;
- environment/run separation;
- commit-bound evidence;
- logs/errors as first-class diagnostic material.

Do not copy Vercel's deployment page layout.

### Algora
Use for:
- GitHub-native bounty context;
- compact bounty state;
- issue-linked contributor workflow.

Do not copy its bounty list or payout presentation.

### Gitcoin
Use conceptually for:
- grants/bounty ecosystem framing;
- ecosystem/operator context;
- transparent program state.

Do not copy grant-round visual design.

## CommitLedger synthesis

The resulting product should feel like a **proof cockpit for developer settlements**:
- top summary rail: Source / Authorization / Settlement / Runtime;
- primary lifecycle: Issue → Bounty → Claim → PR → Verify → Settle → Receipt;
- exact IDs and hashes stay inspectable;
- runtime and competition readiness are visibly distinct;
- negative security proof is a first-class section;
- no runtime proof means BLOCKED, never decorative success;
- judge can understand the product in 10–15 seconds and verify it deeply in 60–90 seconds.

## Visual direction

- dark operational surface, high legibility;
- restrained accent color;
- borders and density inspired by developer tools, not finance marketing;
- large value statement, compact operational cards;
- no gradients or decoration that reduce evidence readability;
- mobile becomes a vertical proof narrative, not a squeezed desktop dashboard.
