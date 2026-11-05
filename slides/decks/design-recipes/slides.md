---
theme: default
title: 动态设计配方 · DataMagic × Slidev
routerMode: hash
wakeLock: false
transition: fade
colorSchema: light
fonts:
  provider: none
  sans: system-ui
drawings:
  persist: false
---
<div class="eyebrow">DESIGN RECIPES / 01</div>

# 把数据讲清楚，<br>让动画有理由。

<div class="intro">两种可重播、可拖动、可复制的动态配方。<br>从 DataMagic 的叙事方法，走到原生 Slidev / Vue。</div>

<div class="chips"><span>排名揭晓</span><span>趋势游标</span><span>可编辑源码</span></div>

<div class="foot">灵感与配方来源：HKUST Dial Lab · DataMagic（MIT）<br>本页所有数据均为合成示例，不代表实验结果。</div>

---

<div class="eyebrow">RECIPE 01 / RANKED REVEAL</div>

# 同一尺度，让比较一眼可见

<RecipePlayer />

<div class="caption">重播或拖动进度：条长和数值由同一进度驱动。顺序固定，不制造排名变化。</div>

---

<div class="eyebrow">RECIPE 02 / TIMELINE TRAVEL</div>

# 沿着时间，指出转折发生在哪里

<RecipePlayer kind="timeline" />

<div class="caption">保留全程上下文，移动游标只负责引导视线。固定纵轴，不用缩放夸大变化。</div>

---

<div class="eyebrow">CHOOSE WITH INTENT</div>

# 先选论点，再选配方

<div class="recipe-grid"><div><b>比较 2–5 个对象</b><h3>RankedReveal</h3><p>共同零基线、清楚单位。<br>适合方案比较与消融实验。</p></div><div><b>解释时间转折</b><h3>ChartTimelineTravel</h3><p>保留趋势、明确插值。<br>适合里程碑与训练进程。</p></div></div>

<div class="principle">一页一个结论 · 一次只引导一个焦点 · 动效不改变数据含义</div>

<div class="caption">不适合：负数排名、超过 5 行的长榜单、含缺失值却未解释的时间序列。先整理数据或选其他图。</div>

---

<div class="eyebrow">COPY / ADAPT / VERIFY</div>

# 下一份演示，直接从配方开始

1. 在源码的 slides/recipes/README.md 选择配方与数据约束。
2. 将 RecipePlayer.vue 和 motion.mjs 复制到新演示的 components/。
3. 在 Markdown 中传入 rows 或 points，写清单位、数据来源和结论。
4. 检查终态、重播、拖动、减少动效、深链接与刷新。

<div class="links"><a href="./reference/README.md" target="_blank">读取生成指南与示例 ↗</a><a href="./reference/index.json" target="_blank">Agent 配方索引 ↗</a><a href="https://datamagic.chat/cards/" target="_blank">浏览 DataMagic 原始配方库 ↗</a></div>

<div class="foot">这里是精选兼容实现，不是把 React / Remotion 项目直接塞入 Slidev。<br>上游版权与 MIT 许可见 slides/recipes/THIRD_PARTY_LICENSES.md。</div>

<style>
.slidev-layout{background:#f6f3ec;color:#172c3c;padding:42px 56px;font-family:system-ui!important}.slidev-layout h1{font-size:39px;font-weight:750;line-height:1.25;letter-spacing:-1px;margin:14px 0 24px}.eyebrow{font-size:12px;letter-spacing:2px;color:#557568;font-weight:700}.intro{font-size:24px;line-height:1.7;color:#48616d;margin-top:28px}.chips{display:flex;gap:12px;margin-top:28px}.chips span{border:1px solid #b7c9bf;border-radius:20px;padding:8px 18px;color:#355d4f;font-size:15px}.foot{font-size:13px;color:#627480;line-height:1.7;margin-top:30px}.caption{font-size:13px;color:#627480;margin-top:15px;line-height:1.7}.recipe-grid{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-top:34px}.recipe-grid>div{background:#fff;border:1px solid #d7ded6;border-radius:15px;padding:25px}.recipe-grid b{font-size:14px;color:#557568}.recipe-grid h3{font-size:24px;margin:14px 0}.recipe-grid p{font-size:18px;line-height:1.7;color:#627480}.principle{font-size:20px;margin-top:28px;color:#355d4f}.slidev-layout li{font-size:20px;line-height:1.7;margin-bottom:12px}.links{display:flex;gap:30px;margin-top:26px;font-size:16px}.links a{color:#22735b}
</style>
