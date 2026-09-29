#!/usr/bin/env python3
"""Read the main package hash from the actual built DAR, never from a placeholder."""
import re
import sys
import zipfile
with zipfile.ZipFile(sys.argv[1]) as dar:
    manifest = dar.read('META-INF/MANIFEST.MF').decode('utf-8')
manifest = re.sub(r'\r?\n ', '', manifest)
main = re.search(r'^Main-Dalf:\s*(.+)$', manifest, re.MULTILINE)
if not main:
    raise SystemExit('Main-Dalf missing from DAR manifest')
package = re.search(r'([a-f0-9]{64})\.dalf$', main.group(1).strip())
if not package:
    raise SystemExit('Cannot derive main package ID from DAR manifest')
print(package.group(1))
