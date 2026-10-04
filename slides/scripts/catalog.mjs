import { readFile } from 'node:fs/promises';

export function validateDecks(decks) {
  if (!Array.isArray(decks)) throw new Error('decks.json must contain an array');
  const slugs = new Set();
  for (const deck of decks) {
    if (!deck || typeof deck.slug !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(deck.slug))
      throw new Error('Each deck needs a lowercase URL slug (letters, numbers, hyphens)');
    if (slugs.has(deck.slug)) throw new Error(`Duplicate deck slug: ${deck.slug}`);
    slugs.add(deck.slug);
    if (typeof deck.title !== 'string' || !deck.title.trim()) throw new Error(`Missing title: ${deck.slug}`);
    if (typeof deck.description !== 'string') throw new Error(`Missing description: ${deck.slug}`);
    if (typeof deck.publish !== 'boolean') throw new Error(`Set publish explicitly: ${deck.slug}`);
  }
  return decks;
}
export async function readDecks(root) {
  return validateDecks(JSON.parse(await readFile(new URL('decks.json', root), 'utf8')));
}
export function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
}
export function renderIndex(decks) {
  const cards = decks.filter(deck => deck.publish).map(deck => `<a class="card" href="./${deck.slug}/"><span class="tag">SLIDEV DECK</span><h2>${escapeHtml(deck.title)}</h2><p>${escapeHtml(deck.description)}</p><span class="open">打开演示 <span aria-hidden="true">↗</span></span></a>`).join('\n');
  return `<!doctype html>
<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="description" content="Windrise 的 Slidev 演示集合"><title>Slides · Windrise</title><style>
:root{color-scheme:light;font-family:Inter,"Noto Sans CJK SC","Microsoft YaHei",system-ui,sans-serif;color:#193535;background:#f3f6f2}*{box-sizing:border-box}body{margin:0}main{max-width:1040px;margin:auto;padding:54px 24px 90px}nav{display:flex;justify-content:space-between;gap:16px;font-size:14px}nav a{color:inherit;text-decoration:none}header{margin:94px 0 52px}.eyebrow,.tag{font-size:11px;letter-spacing:2px;font-weight:700;color:#517867}h1{font-size:clamp(46px,9vw,90px);letter-spacing:-4px;line-height:1.05;margin:18px 0 24px}header p{max-width:550px;color:#536961;font-size:18px;line-height:1.8}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr));gap:20px}.card{border:1px solid #cbdad0;border-radius:18px;padding:32px;background:#fff;color:inherit;text-decoration:none;transition:transform .15s,box-shadow .15s}.card:hover,.card:focus-visible{transform:translateY(-3px);box-shadow:0 14px 35px #19353515}.card h2{font-size:28px;margin:30px 0 16px}.card p{color:#536961;line-height:1.8;min-height:58px}.open{display:flex;justify-content:space-between;border-top:1px solid #e2e9e4;padding-top:22px;margin-top:30px;font-weight:650;font-size:14px}footer{margin-top:54px;font-size:12px;color:#66776c;line-height:1.8}
</style></head><body><main><nav><span>WINDRISE / PRESENTATIONS</span><a href="/">返回主页 ↗</a></nav><header><div class="eyebrow">IDEAS, ONE SLIDE AT A TIME</div><h1>Slides.</h1><p>用 Markdown 写想法，用浏览器讲清楚。<br>这里收录可直接打开、分享与演示的 Slidev 幻灯片。</p></header><section class="grid" aria-label="演示文稿">${cards || '<p>暂无公开演示。</p>'}</section><footer>Powered by Slidev · 用方向键切换幻灯片<br>所有已发布演示和本仓库源码均公开可见。</footer></main></body></html>`;
}
