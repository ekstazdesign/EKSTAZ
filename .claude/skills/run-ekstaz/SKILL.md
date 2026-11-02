---
name: run-ekstaz
description: Run, start, test, and screenshot the EKSTAZ site (ekstaz.art) locally. Use when asked to run the site, check it on mobile, take a screenshot, test the waitlist form or /api/join, or confirm a change to the front door (index.html, signal.js), work.html, styles.css or the magazine works.
---

The instructions, server and browser checks for this site are tool-neutral and live in `dev/` so any person or AI tool can use them. Read `dev/README.md` and follow it from the repo root. Quick version:

```bash
(node dev/serve.mjs 8080 > /tmp/ekstaz-serve.log 2>&1 &)
timeout 20 bash -c 'until curl -sf localhost:8080 >/dev/null; do sleep 0.5; done'
node dev/drive.mjs http://localhost:8080 /tmp/ekstaz-shots
lsof -ti:8080 -sTCP:LISTEN | xargs -r kill
```
