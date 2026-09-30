#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
bash scripts/bootstrap-dpm.sh
export PATH="${DPM_HOME:-$HOME/.dpm}/bin:$PATH"

if ! command -v java >/dev/null 2>&1; then
  JAVA_ROOT="$HOME/.local/temurin-21"
  mkdir -p "$JAVA_ROOT"
  curl --fail --show-error --location --retry 3     "https://api.adoptium.net/v3/binary/latest/21/ga/linux/x64/jre/hotspot/normal/eclipse"     -o "$JAVA_ROOT/temurin-jre.tar.gz"
  tar -xzf "$JAVA_ROOT/temurin-jre.tar.gz" -C "$JAVA_ROOT"
  rm -f "$JAVA_ROOT/temurin-jre.tar.gz"
  JAVA_HOME=$(find "$JAVA_ROOT" -mindepth 1 -maxdepth 1 -type d | head -n 1)
  export JAVA_HOME
  export PATH="$JAVA_HOME/bin:$PATH"
fi

java -version
# Provider/bootstrap tooling may touch tracked metadata. Restore the exact checked-out commit before evidence generation.
git reset --hard HEAD
bash scripts/prove-and-report.sh
