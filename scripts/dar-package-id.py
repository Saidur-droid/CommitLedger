#!/usr/bin/env python3
"""Extract the main package ID from a built DAR using the Daml compiler's canonical inspect-dar output."""
import json
import re
import subprocess
import sys
from pathlib import Path

if len(sys.argv) != 2:
    raise SystemExit("usage: dar-package-id.py <dar>")

result = subprocess.run(
    ["dpm", "damlc", "inspect-dar", "--json", sys.argv[1]],
    check=False,
    capture_output=True,
    text=True,
)
if result.returncode != 0:
    sys.stderr.write(result.stderr or result.stdout)
    raise SystemExit(result.returncode or 1)

try:
    payload = json.loads(result.stdout)
except json.JSONDecodeError as exc:
    raise SystemExit(f"inspect-dar returned invalid JSON: {exc}") from exc

package_id = payload.get("main_package_id")
if not isinstance(package_id, str) or not re.fullmatch(r"[a-f0-9]{64}", package_id):
    raise SystemExit(f"inspect-dar returned invalid main_package_id: {package_id!r}")

Path('evidence').mkdir(exist_ok=True)
Path('evidence/dar-package-id.txt').write_text(package_id + '\n', encoding='utf-8')
print(package_id)
