#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

echo "== Node verifier tests =="
node --version
npm test

echo
echo "== Daml build =="
export PATH="$HOME/.dpm/bin:$PATH"
command -v dpm >/dev/null 2>&1 || {
  echo "DPM not found. Run: bash scripts/bootstrap-dpm.sh"
  exit 2
}
(
  cd daml
  DPM_SDK_VERSION=3.5.12 dpm build --all
)

echo
echo "== Daml tests =="
(
  cd daml
  DPM_SDK_VERSION=3.5.12 dpm test
)

echo
echo "All local verification gates passed."
