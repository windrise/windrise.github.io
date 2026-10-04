---
theme: default
title: Slidev 起步
info: Markdown 驱动的演示工作台
routerMode: hash
colorSchema: light
fonts:
  sans: 'Noto Sans CJK SC, Microsoft YaHei, sans-serif'
  mono: 'DejaVu Sans Mono'
  provider: none
  local: 'Noto Sans CJK SC, Microsoft YaHei, DejaVu Sans Mono'
drawings:
  persist: false
transition: slide-left
mdc: true
---

<div class="kicker">WINDRISE · SLIDEV STARTER</div>

# 把想法<br>写成幻灯片。

<div class="subtitle">Markdown → 浏览器演示 → 一个可分享的链接</div>
<div class="cover-bottom">01 / 一个可复用的演示工作台 <span>按 → 开始</span></div>

<style>
.slidev-layout { font-family: 'Noto Sans CJK SC', 'Microsoft YaHei', sans-serif; color: #193535; background: #f3f6f2; }
.slidev-layout h1 { color: #193535; font-weight: 750; letter-spacing: -1px; }
.slidev-layout.cover h1 { font-size: 66px; line-height: 1.2; margin: 34px 0 24px; }
.kicker { font-size: 13px; color: #557966; letter-spacing: 3px; font-weight: 700; }
.subtitle { font-size: 22px; color: #536961; }
.cover-bottom { margin-top: 70px; display: flex; justify-content: space-between; font-size: 13px; color: #557966; border-top: 1px solid #cbdad0; padding-top: 18px; }
.slidev-layout h2 { color: #365e4f; }
</style>

---
layout: default
---

# 从内容开始

每一页只讲清一个重点。

<div class="grid grid-cols-3 gap-5 mt-12">
<div class="bg-white p-6 rounded-xl border border-green-100"><div class="text-green-700 text-sm mb-6">01 / WRITE</div><h2>写下来</h2><p class="text-lg">用 Markdown 写标题、论点和证据。</p></div>
<div class="bg-white p-6 rounded-xl border border-green-100"><div class="text-green-700 text-sm mb-6">02 / PREVIEW</div><h2>看效果</h2><p class="text-lg">保存文件，预览会自动更新。</p></div>
<div class="bg-white p-6 rounded-xl border border-green-100"><div class="text-green-700 text-sm mb-6">03 / SHARE</div><h2>分享它</h2><p class="text-lg">构建静态网页，用链接开始演示。</p></div>
</div>

---
layout: two-cols
---

# 代码与公式

技术表达可以保持原样。

```python
from statistics import mean

scores = [0.82, 0.87, 0.91]
print(f"Mean: {mean(scores):.3f}")
```

<div class="text-sm opacity-60 mt-5">示例数据，仅用于展示排版</div>

::right::

<div class="pl-10 pt-18">

## 一个目标函数

$$
\mathcal{L} = \frac{1}{N}\sum_{i=1}^{N}(y_i - \hat y_i)^2
$$

<div class="mt-8 text-xl leading-relaxed">语法高亮、数学公式和双栏布局<br>都在同一个 Markdown 文件里。</div>

</div>

---
layout: default
---

# 让信息逐步出现

按方向键 →，一次揭示一条。

<v-clicks>

- 先提出问题：听众需要理解什么？
- 再呈现证据：哪些信息能支持结论？
- 最后给出行动：下一步可以怎么做？

</v-clicks>

<div class="mt-14 p-5 bg-white rounded-xl text-lg">快捷键：← / → 翻页 · O 总览 · F 全屏</div>

---
layout: center
class: text-center
---

<div class="kicker">YOUR NEXT PRESENTATION</div>

# 现在，写你的第一份演示

<div class="text-xl leading-loose mt-6">复制模板 → 编辑内容 → 本地预览 → 确认公开发布</div>

<div class="mt-12 text-base"><a href="/slides/">回到演示目录 ↗</a> · <a href="/">回到个人主页 ↗</a></div>
