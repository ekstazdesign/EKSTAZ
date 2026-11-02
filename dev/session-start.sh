#!/usr/bin/env bash
# SessionStart hook: puts the project's memory in front of the agent so a new session can
# pick up where the last one stopped. Read-only; never fails the session.
cd "${CLAUDE_PROJECT_DIR:-.}" 2>/dev/null || exit 0
echo "EKSTAZ session start. Run /resume-ekstaz first. Rules: CLAUDE.md. Map: docs/STATUS.md."
echo "Branch: $(git branch --show-current 2>/dev/null) | $(git status --short 2>/dev/null | wc -l | tr -d ' ') uncommitted file(s)"
git fetch -q origin main 2>/dev/null && echo "Behind origin/main by $(git rev-list --count HEAD..origin/main 2>/dev/null) commit(s); latest on main: $(git log -1 --format=%s origin/main 2>/dev/null)"
echo "--- docs/HANDOVER.md (latest entry) ---"
awk '/^### /{n++} n==1{print} n==2{exit}' docs/HANDOVER.md 2>/dev/null | head -20
echo "--- open decisions (docs/STATUS.md section 3) ---"
awk '/^## 3\./{f=1;next} /^## 4\./{f=0} f && /^\| D/{print}' docs/STATUS.md 2>/dev/null | cut -c1-140
exit 0
