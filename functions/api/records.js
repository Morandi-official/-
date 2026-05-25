const headers = {
  'content-type': 'application/json; charset=utf-8',
  'cache-control': 'no-store'
};

function json(data, init = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: { ...headers, ...(init.headers || {}) }
  });
}

function text(message, status = 400) {
  return new Response(message, {
    status,
    headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' }
  });
}

function normalizeDate(value) {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : null;
}

function normalizeMonth(value) {
  return typeof value === 'string' && /^\d{4}-\d{2}$/.test(value) ? value : null;
}

async function ensureTable(env) {
  if (!env.DB) {
    throw new Error('缺少 D1 绑定：请在 Pages Settings → Bindings 中添加 D1 database，变量名设为 DB。');
  }

  await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS work_records (
      day TEXT PRIMARY KEY,
      content TEXT NOT NULL DEFAULT '',
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `).run();
}

export async function onRequestGet({ request, env }) {
  try {
    await ensureTable(env);
    const url = new URL(request.url);
    const month = normalizeMonth(url.searchParams.get('month'));
    if (!month) return text('month 必须是 YYYY-MM 格式', 400);

    const result = await env.DB.prepare(`
      SELECT day, content, updated_at
      FROM work_records
      WHERE day >= ? AND day < ?
      ORDER BY day ASC
    `).bind(`${month}-01`, nextMonthKey(month)).all();

    return json(result.results || []);
  } catch (error) {
    return text(error.message || '读取失败', 500);
  }
}

export async function onRequestPost({ request, env }) {
  try {
    await ensureTable(env);
    const body = await request.json().catch(() => null);
    if (!body) return text('请求体必须是 JSON', 400);

    const day = normalizeDate(body.date);
    const content = typeof body.content === 'string' ? body.content.slice(0, 8000) : '';

    if (!day) return text('date 必须是 YYYY-MM-DD 格式', 400);

    await env.DB.prepare(`
      INSERT INTO work_records(day, content, updated_at)
      VALUES (?, ?, datetime('now'))
      ON CONFLICT(day) DO UPDATE SET
        content = excluded.content,
        updated_at = datetime('now')
    `).bind(day, content).run();

    return json({ ok: true, day, content });
  } catch (error) {
    return text(error.message || '保存失败', 500);
  }
}

function nextMonthKey(month) {
  const [year, monthNumber] = month.split('-').map(Number);
  const date = new Date(year, monthNumber, 1);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}-01`;
}
