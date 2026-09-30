#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
bash scripts/bootstrap-dpm.sh
export PATH="${DPM_HOME:-$HOME/.dpm}/bin:$PATH"
# Provider/bootstrap tooling may touch tracked metadata. Restore the exact checked-out commit before evidence generation.
git reset --hard HEAD
bash scripts/prove-and-report.sh
