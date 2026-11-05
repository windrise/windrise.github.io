# DataMagic × Slidev 动态设计配方

目标：以后生成 Slidev 时，先选择叙事配方，再填真实内容，而不是随机添加动画。

这是面向 Slidev 53 的精选 Vue / SVG 适配；不运行 DataMagic 的 React / Remotion 应用、不依赖 API key、不加载外部字体。展示数据全部为合成示例。

## 配方索引

|配方|适用问题|数据约束|实现|
|---|---|---|---|
|RankedReveal|比较少量方案的大小|2–5 行、有限非负值、共同零基线；揭晓顺序不等于排名|`RecipePlayer.vue` 默认 kind|
|ChartTimelineTravel|解释趋势中的转折|至少 2 个有限数值，按时间排列、等时间间隔；非等间隔须先扩展 x 轴映射|`kind="timeline"`|

上游：https://github.com/HKUSTDial/DataMagic/tree/main/cards/recipes
- https://github.com/HKUSTDial/DataMagic/blob/main/cards/recipes/RankedReveal.md
- https://github.com/HKUSTDial/DataMagic/blob/main/cards/recipes/ChartTimelineTravel.md
- 原始卡片库：https://datamagic.chat/cards/

上游 React/Remotion 代码不可直接作为 Vue 组件使用。本目录用独立纯函数和 Vue/SVG 表达相同的设计原则；范围不包括完整 139 张卡片。许可见 THIRD_PARTY_LICENSES.md。

## 复制到新演示

把 `RecipePlayer.vue`、`motion.mjs` 复制到 `decks/<slug>/components/`，保留相对位置与许可文件，然后在 slides.md 使用：

```vue
<RecipePlayer :rows="[{label:'基线',value:72},{label:'改进',value:90},{label:'消融',value:54}]" unit="分" />
<RecipePlayer kind="timeline" :points="[{label:'Q1',value:28},{label:'Q2',value:42},{label:'Q3',value:36},{label:'Q4',value:78}]" unit="分" />
```

真实数据必须传 `source-label="数据来源：……，采样日期：……"`，替换默认合成标签；确认公开权限并说明统计口径。SVG 无障碍标签从实际 points 派生。

Vue 组件默认静态终态，手动重播而非抢占讲述节奏。进度映射确定、暂停与拖动可重现；减少动态效果偏好下不自动播放。没有增加 npm 依赖。

## 未来生成 Slidev 的提示模板

> 先给出一页一句的结论与数据来源；按 slides/recipes/README.md 选择合适配方。每页最多一个动态焦点。数据、标签、数值和图形必须同源。禁止虚构实验结果；缺数据就标“合成示例”或留空。RankedReveal 保留零基线，不以揭晓顺序暗示排名。Timeline 保留全序列上下文，不把插值当观测。采用统一色板、充足留白和清楚层级；正文控制在 3–5 个要点。保留终态可读性、减少动态效果和键盘控制。最后检查构建、深链接、刷新、重播、拖动及原站回归。

## 视觉令牌与验收

- 背景 #f6f3ec，深色卡片 #122a3c，主强调 #73d7bd，次强调 #d78648。
- 中文标题约 39px，正文 20–24px，辅助信息至少 12–13px；使用系统字体。
- `node --test slides/scripts/recipes.test.mjs` 验证确定性、终态与边界。
- `npm test --prefix slides && npm run build --prefix slides`。
- `node slides/scripts/smoke.mjs` 保留原演示深链接与刷新回归。
- `node slides/scripts/recipes-smoke.mjs` 检查交互、减少动态效果与截图。
