# AGENTS.md

Guidance for OpenAI Codex and any other agent that reads `AGENTS.md`. `CLAUDE.md` is the single source of truth for how work is done here; read it first. It is not duplicated here so the two cannot drift.

1. Read `CLAUDE.md` (brand rules, where things live, commands, how work lands, working rules).
2. Read `BRAND.md` and `docs/SITE-DIRECTION.md` before changing copy, motion or artwork.
3. Read `docs/STATUS.md` (what is live, what is open) and the top of `docs/HANDOVER.md` (what shipped, most recent first).
4. Run `git fetch origin` and check `git log origin/main` before you start: Claude and people also push here.

Commands you will use most (from the repo root):

```bash
env -u SUPABASE_URL -u SUPABASE_ANON_KEY node dev/serve.mjs 8080 &
node dev/journey-checks.mjs http://localhost:8080 /tmp/shots
node dev/motion-checks.mjs  http://localhost:8080 /tmp/shots
```

Rules most often missed: no invented titles, dates, claims or scarcity; identity assets and Elton's letters are never recoloured or redrawn; sound is on by default; reduced motion keeps a composed still; add a `docs/HANDOVER.md` entry in the same PR. If you change a rule the checks encode, say so in the PR.
