// Vercel Function: POST /api/join
// Calls the Supabase RPC join_waitlist(email) -> {number, existing}.
// Env: SUPABASE_URL, SUPABASE_ANON_KEY (the anon key is public by design;
// the table is locked by RLS and only the RPC can write to it).

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' });

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  if (!url || !key) return res.status(503).json({ error: 'The list isn’t open yet. Try again soon.' });

  const data = typeof req.body === 'string' ? safeParse(req.body) : req.body;
  if (!data || typeof data !== 'object') return res.status(400).json({ error: 'Bad request.' });

  // Honeypot: real visitors never fill this field.
  if (data.website) return res.status(200).json({ number: 0, existing: false });

  if (data.consent !== true) return res.status(400).json({ error: 'Tick the box to agree to updates first.' });

  const email = String(data.email || '').trim().toLowerCase();
  if (!EMAIL.test(email) || email.length > 254) {
    return res.status(400).json({ error: 'That email doesn’t look right.' });
  }

  try {
    const r = await fetch(`${url}/rest/v1/rpc/join_waitlist`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', apikey: key, Authorization: `Bearer ${key}` },
      body: JSON.stringify({ p_email: email })
    });
    if (!r.ok) throw new Error(`supabase ${r.status} ${await r.text()}`);
    const rows = await r.json();
    const row = Array.isArray(rows) ? rows[0] : rows;
    return res.status(200).json({ number: Number(row.number), existing: Boolean(row.existing) });
  } catch (err) {
    console.error('waitlist write failed', err);
    return res.status(500).json({ error: 'Couldn’t save that. Try again in a minute.' });
  }
};

function safeParse(s) {
  try { return JSON.parse(s); } catch { return null; }
}
