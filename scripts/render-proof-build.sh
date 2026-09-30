#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
bash scripts/bootstrap-dpm.sh
export PATH="${DPM_HOME:-$HOME/.dpm}/bin:$PATH"
bash scripts/prove-and-report.sh
