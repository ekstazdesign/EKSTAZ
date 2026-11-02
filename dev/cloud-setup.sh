#!/usr/bin/env bash
# Paste into the cloud environment's "Setup script" (or run once per session).
# Everything EKSTAZ-specific already ships in this repo, so a new session only needs the
# one external piece: the i-have-adhd output-style plugin.
#   - /run-ekstaz            -> .claude/skills/run-ekstaz (in the repo)
#   - named workflows        -> .claude/workflows/ (audit lean/full, review-pr, launch-research)
#   - subagents, /resume-ekstaz, /ship-ekstaz, /process-assets -> .claude/agents and .claude/skills
#   - session memory         -> a SessionStart hook (.claude/settings.json) prints the latest handover
#   - site rules and context -> BRAND.md, docs/SITE-DIRECTION.md, docs/AUDIT-AND-PLAN.md
set -u
if command -v claude >/dev/null 2>&1; then
  claude plugin marketplace add ayghri/i-have-adhd || true
  claude plugin install i-have-adhd@i-have-adhd || true
fi
# Browser checks (dev/*.mjs) need Playwright; the cloud image already provides it at
# /opt/node-tools and Chromium at /opt/pw-browsers, so nothing to install there.
exit 0
