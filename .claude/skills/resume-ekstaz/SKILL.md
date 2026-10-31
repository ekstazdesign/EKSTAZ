---
name: resume-ekstaz
description: Start of every EKSTAZ session, or when asked to "pick up where we left off", "catch me up" or "what's next". Rebuilds context from the repo and reports state, open decisions and the single next action.
---

Do this before any other work. It takes about two minutes and no questions.

1. `git fetch origin`; `git status -sb`; `git log --oneline -10 origin/main`. Note anything merged since `docs/HANDOVER.md` was last updated (Codex and people push to `main` between sessions). If the working branch is behind, sync it before building.
2. Read `CLAUDE.md`, then `docs/STATUS.md`, then the top 3 entries of `docs/HANDOVER.md`. If `BRAND.md` or `docs/SITE-DIRECTION.md` is relevant to the task, read it.
3. List open PRs for `Happy-Harris/EKSTAZ` with the GitHub tools (never `gh`); read any that are not yours.
4. Check the live site responds: `curl -sI https://ekstaz.art | head -1`.
5. Report to Haris in under 10 lines: where things stand (one sentence), what changed since the last handover, the open decisions that block the next work (from STATUS section 3), and **one next action doable in two minutes**.
6. Then do what Haris asked. If he asked nothing, propose the first item of STATUS section 4 and wait.

Rules: do not decide items in STATUS section 3; do not merge anything unasked; state what you could not verify. Delegate by area to the subagents listed in `CLAUDE.md`.
