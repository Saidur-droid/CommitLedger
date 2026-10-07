#!/usr/bin/env python3
"""Record only a successful real local UI run; no simulated responses or narration."""
import json
from pathlib import Path
import shutil
import tempfile
from playwright.sync_api import sync_playwright


def main() -> None:
    evidence = Path('evidence')
    evidence.mkdir(exist_ok=True)
    target = evidence / 'demo-runtime.webm'
    if target.exists():
        raise RuntimeError('Existing recording retained; rename it before capturing a new run')
    temp = Path(tempfile.mkdtemp(prefix='commitledger-video-'))
    context = browser = None
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch()
            context = browser.new_context(viewport={'width': 1440, 'height': 1000},
                                          record_video_dir=str(temp),
                                          record_video_size={'width': 1440, 'height': 1000})
            page = context.new_page()
            page.goto('http://127.0.0.1:4173', wait_until='networkidle')
            page.locator('#live-run').wait_for()
            if not page.locator('#live-run').is_enabled():
                raise RuntimeError('Real Canton lifecycle is not ready; no demo video retained')
            page.wait_for_timeout(3000)
            with page.expect_response(lambda r: r.url.endswith('/api/demo/run'), timeout=240000) as response:
                page.locator('#live-run').click()
            result = response.value
            data = result.json()
            proof = data.get('proof', {})
            if not result.ok or len(proof.get('steps', [])) != 6 or not proof.get('settlementReceipt'):
                raise RuntimeError('Actual lifecycle did not produce six steps and a receipt')
            checks = proof.get('negativeChecks', [])
            if len(checks) != 3 or not all(c.get('rejected') and c.get('code') for c in checks):
                raise RuntimeError('Actual negative-rejection evidence is missing')
            page.locator('#receipt-card').wait_for(state='visible')
            page.wait_for_timeout(4000)
            for detail in page.locator('#timeline details, #receipt-card details').all():
                detail.locator('summary').click()
                detail.scroll_into_view_if_needed()
                page.wait_for_timeout(2500)
            page.locator('#receipt-card').scroll_into_view_if_needed()
            page.wait_for_timeout(5000)
            video = page.video
            context.close()
            context = None
            video.save_as(str(target))
            browser.close()
            browser = None
            (evidence / 'video-proof.json').write_text(json.dumps(proof, indent=2) + '\n')
            print(f'Recorded a real local UI run: {target}; review before submission.')
    finally:
        if context:
            try:
                context.close()
            except Exception:
                pass
        if browser:
            try:
                browser.close()
            except Exception:
                pass
        shutil.rmtree(temp, ignore_errors=True)


if __name__ == '__main__':
    main()
