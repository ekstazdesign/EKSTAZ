---
name: ship-ekstaz
description: Use when a change is ready to go out: pre-push checks, commit, push, draft PR, preview, and (only when Haris says "merge it") merge and confirm ekstaz.art serves the new build.
---

1. **Sync:** `git fetch origin`; merge or rebase onto the latest `origin/main` on your own branch. If `main` moved under you, re-run the checks after syncing.
2. **Checks:** run the five suites (`CLAUDE.md` Commands). Compare any failure with a clean `origin/main` worktree. Known pre-existing failure: artwork `JavaScript disabled: completes`.
3. **Docs:** delegate to `handover-scribe` (HANDOVER entry, STATUS tables). Then `verify-gate`.
4. **Commit and push** to the session's assigned branch: `git push -u origin <branch>`. Network errors: retry with 2, 4, 8, 16 s. On GitHub 500 errors (it has had outages) wait and retry; do not try another route.
5. **PR:** draft, to `main`, plain title, body states what changed and what was **not** verified. Subscribe to its activity. Read the Vercel preview comment; the preview is behind Vercel login so headless checks cannot open it.
6. **Merge only when Haris asks.** Mark ready, merge with a merge commit, then poll `https://ekstaz.art` until a string you added appears (loop with `curl -s | grep -c`, 10 s apart, up to about 3 minutes). Report what you checked live and what you could not (real-phone sound and touch).
7. Cancel any retry trigger you scheduled for this work.

Never force-push `main`; never merge unasked; never bypass a hook or a failing check.
