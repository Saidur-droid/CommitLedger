#!/usr/bin/env bash
set +e
set -uo pipefail
cd "$(dirname "$0")/.."

echo "=== COMMITLEDGER FULL PROOF ==="
echo "Commit: $(git rev-parse HEAD)"
echo

bash scripts/run-local-proof.sh
status=$?

echo
echo "=== EXIT STATUS: $status ==="

if [ "$status" -eq 0 ]; then
  echo "=== SUCCESS: VERIFIED EVIDENCE ==="
  test -f evidence/verification.json && cat evidence/verification.json
  echo
  test -f evidence/canton-proof.json && cat evidence/canton-proof.json
  echo
  echo "Evidence directory:"
  ls -lah evidence
else
  echo "=== FAILURE DIAGNOSTICS ==="
  for file in     evidence/canton-demo.log     evidence/canton-sandbox.log     evidence/daml-tests.log     evidence/daml-build.log     evidence/dpm-version.log     evidence/node-tests.log
  do
    if [ -f "$file" ]; then
      echo
      echo "--- $file ---"
      tail -n 120 "$file"
    fi
  done
fi

exit "$status"
