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
  const renderCards = items => items.map(deck => `<a class="card" href="./${deck.slug}/"><span class="tag">SLIDEV DECK</span><h2>${escapeHtml(deck.title)}</h2><p>${escapeHtml(deck.description)}</p><span class="open">打开演示 <span aria-hidden="true">↗</span></span></a>`).join('\n');
  const cards = renderCards(decks.filter(deck => deck.publish && deck.origin !== 'reading'));
  const readingCards = renderCards(decks.filter(deck => deck.publish && deck.origin === 'reading'));
  return `<!doctype html>
<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="description" content="Windrise 的论文阅读与 Slidev 汇报"><title>阅读与演示 · Windrise</title><style>
:root{color-scheme:light;font-family:system-ui,"PingFang SC",sans-serif;color:#172636;background:#f5f7fa}*{box-sizing:border-box}body{margin:0}main{max-width:1120px;margin:auto;padding:30px 24px 80px}nav{display:flex;justify-content:space-between;gap:18px;flex-wrap:wrap;font-size:14px;padding-bottom:24px;border-bottom:1px solid #dce2ea}a{color:#2456a6;text-underline-offset:4px}nav a{text-decoration:none}header{margin:48px 0 30px}.eyebrow,.tag{font-size:12px;letter-spacing:1.5px;font-weight:650;color:#617082}h1{font-family:Georgia,"Songti SC",serif;font-size:clamp(34px,6vw,58px);line-height:1.2;margin:14px 0 18px}header p{max-width:700px;color:#526273;font-size:18px;line-height:1.8}.reading{display:grid;grid-template-columns:1.35fr 1fr;background:white;border:1px solid #dce2ea;border-radius:8px;margin:32px 0 42px}.reading>div{padding:32px}.reading>div+div{border-left:1px solid #dce2ea}.reading h2{font-family:Georgia,"Songti SC",serif;font-size:28px;margin:14px 0}.reading p{line-height:1.8;color:#526273;font-size:16px}.primary{display:inline-block;text-decoration:none;color:#fff;background:#2456a6;border-radius:6px;padding:12px 18px;margin-top:12px;transition:transform .12s}.primary:active{transform:translateY(1px)}h3{font-size:18px}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr));gap:16px}.card{padding:24px;background:#fff;border:1px solid #dce2ea;border-radius:8px;color:inherit;text-decoration:none}.card h2{font-size:22px;margin:16px 0}.card p{color:#526273;line-height:1.8}.open{display:block;margin-top:22px;color:#2456a6;font-size:14px}details summary{font-size:20px;font-weight:650;cursor:pointer;padding:18px 0}details p{line-height:1.7;color:#526273}footer{margin-top:48px;font-size:14px;color:#617082;line-height:1.8}a:focus-visible,summary:focus-visible{outline:3px solid #2456a6;outline-offset:5px}@media(max-width:680px){main{padding:22px 18px}.reading{grid-template-columns:1fr}.reading>div{padding:24px}.reading>div+div{border-left:0;border-top:1px solid #dce2ea}}@media(prefers-reduced-motion:reduce){*{transition:none!important}}
</style></head><body><main><nav><strong>wind × Rise / READING</strong><div><a href="/">学术主页</a> · <a href="https://wind-rise-projects.fuxueming595.chatgpt.site/#project/rise-research-workbench/overview">科研工作台</a></div></nav><header><div class="eyebrow">论文 · 思考 · 汇报</div><h1>从读懂一篇，<br>到讲清一个问题。</h1><p>论文阅读与演示现在连在一起。先梳理方法、证据和问题，再把同一份内容整理成 Slidev 汇报。</p></header><section class="reading" aria-label="论文阅读入口"><div><span class="tag">PAPER READING</span><h2>打开你的论文阅读台</h2><p>按专题找论文，沿着原文证据深入阅读。方法步骤、实验条件和研究启发各自有清楚的位置。</p><a class="primary" href="/reading/reading.html">进入论文库</a></div><div><span class="tag">FROM READING TO SLIDES</span><h2>一份内容，多种表达</h2><p>阅读页提供 Markdown、BibTeX 和 Slidev 源码导出。旧演示保留原来的分享地址，可以随时继续使用。</p></div></section>${readingCards ? `<section aria-label="论文汇报"><h2>论文汇报</h2><div class="grid">${readingCards}</div></section>` : ""}<details><summary>此前的 Slidev 演示</summary><p>初始演示与已有分享链接保留；新的论文汇报从阅读台生成。</p><section class="grid" aria-label="演示文稿">${cards || '<p>暂无公开演示。</p>'}</section></details><footer>公开阅读快照与本机私人笔记分开保存。<br>Powered by Rise Research Workbench · Slidev</footer></main></body></html>`;
}
