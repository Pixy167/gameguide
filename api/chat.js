// Backend Pixy AI (Vercel Serverless Function).
// Meneruskan {messages, tools} dari halaman ke Anthropic Messages API + riset web.
const MODEL = process.env.ANTHROPIC_MODEL || 'claude-haiku-5-5';
const hits = new Map(); // pembatas sederhana per IP (best-effort)

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return res.status(500).json({ error: 'ANTHROPIC_API_KEY belum diisi' });

  const ip = String(req.headers['x-forwarded-for'] || 'x').split(',')[0].trim();
  const now = Date.now();
  const win = (hits.get(ip) || []).filter(t => now - t < 60000);
  if (win.length >= 30) return res.status(429).json({ error: 'rate_limited' });
  win.push(now); hits.set(ip, win);

  const { messages, tools } = req.body || {};
  if (!Array.isArray(messages) || !messages.length || messages.length > 40)
    return res.status(400).json({ error: 'messages tidak valid' });

  const body = {
    model: MODEL,
    max_tokens: 4096,
    tools: [...(Array.isArray(tools) ? tools : []), { type: 'web_search_20250305', name: 'web_search', max_uses: 3 }],
  };
  try {
    let msgs = messages, data;
    for (let i = 0; i < 3; i++) {
      const r = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
        body: JSON.stringify({ ...body, messages: msgs }),
      });
      data = await r.json();
      if (!r.ok) return res.status(r.status === 429 ? 429 : 502).json({ error: (data.error && data.error.message) || 'upstream error' });
      if (data.stop_reason !== 'pause_turn') break;
      msgs = [...msgs, { role: 'assistant', content: data.content }];
    }
    return res.status(200).json(data);
  } catch (e) {
    return res.status(502).json({ error: 'upstream failed' });
  }
};
