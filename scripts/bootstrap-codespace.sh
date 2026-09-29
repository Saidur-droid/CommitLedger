#!/usr/bin/env bash
set -euo pipefail

echo "[CommitLedger] Preparing cloud development environment"
node --version
java -version
python3 --version

bash scripts/bootstrap-dpm.sh

if ! grep -Fq '.dpm/bin' "$HOME/.bashrc" 2>/dev/null; then
  printf '\nexport PATH="$HOME/.dpm/bin:$PATH"\n' >> "$HOME/.bashrc"
fi
export PATH="$HOME/.dpm/bin:$PATH"

echo "[CommitLedger] Running Node verification"
npm test

echo
echo "[CommitLedger] Environment ready."
echo "For the real proof run:"
echo "  export GITHUB_TOKEN=<repository-read-token-if-required>"
echo "  bash scripts/run-local-proof.sh"
echo
echo "To keep the verified UI open afterward:"
echo "  COMMITLEDGER_SERVE_AFTER_PROOF=true bash scripts/run-local-proof.sh"
