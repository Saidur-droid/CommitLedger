#!/usr/bin/env bash
set -euo pipefail

: "${CANTON_JSON_API_URL:?Set CANTON_JSON_API_URL}"
: "${CANTON_TOKEN:?Set CANTON_TOKEN}"
: "${CANTON_ACT_AS:?Set CANTON_ACT_AS}"
: "${CANTON_PACKAGE_ID:?Set CANTON_PACKAGE_ID}"

TEMPLATE_ID="${CANTON_PACKAGE_ID}:CommitLedger:Bounty"
COMMAND_ID="commitledger-bounty-$(date +%s)"

curl -fsS -X POST "${CANTON_JSON_API_URL%/}/v2/commands/submit-and-wait" \
  -H "Authorization: Bearer ${CANTON_TOKEN}" \
  -H "Content-Type: application/json" \
  -d @- <<JSON
{
  "commands": [{
    "CreateCommand": {
      "templateId": "${TEMPLATE_ID}",
      "createArguments": {
        "maintainer": "${CANTON_ACT_AS}",
        "verifier": "${CANTON_ACT_AS}",
        "bountyId": "demo-bounty-001",
        "repository": "Saidur-droid/CommitLedger",
        "issueNumber": 1,
        "issueUrl": "https://github.com/Saidur-droid/CommitLedger/issues/1",
        "title": "CommitLedger deterministic Canton demo",
        "rewardAmount": "100.0",
        "rewardUnit": "DEMO_CREDIT"
      }
    }
  }],
  "workflowId": "commitledger-demo",
  "applicationId": "commit-ledger",
  "commandId": "${COMMAND_ID}",
  "actAs": ["${CANTON_ACT_AS}"],
  "readAs": [],
  "submissionId": "${COMMAND_ID}",
  "disclosedContracts": [],
  "domainId": "",
  "packageIdSelectionPreference": []
}
JSON

echo
echo "Bounty command submitted to Canton JSON Ledger API."
