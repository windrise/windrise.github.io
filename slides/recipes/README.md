# DataMagic × Slidev：完整配方索引

本库以 DataMagic 提交 `3a66365b6dcab798efc76baf54a3039d0b273f2c` 为固定来源，逐项映射139张配方：30张叙事卡片、109张图表/文字卡片。137份主实现对应139配方；两组共享实现属于上游原有设计，不是本库用同一动画替代不同卡片。

- `catalog.json`：每张卡片的中英文名称、类别、独立样例、JSON Schema、画布、帧率、时长、源码路径。
- `upstream-audit.json`：139项原始来源、SHA256、依赖、素材、许可和共享实现关系。
- `ported/`：保留MIT标记的可编辑上游算法、布局和数据文件。
- `generated/`：用 TypeScript JSX factory 转换后的原生 Vue VNode 模块；由 `npm run port:datamagic` 重建。
- `runtime/`：原生 Vue 帧上下文、缓动/弹簧、SVG/CSS属性、静态图与视频适配。
- `DataMagicPlayer.vue`：播放、暂停、重播、逐帧拖动和 JSON 数据编辑器。

浏览入口 `/slides/design-recipes/`。首页可搜索/分类，后续139页各有独立深链接。数据编辑会按原始Schema校验，刷新恢复示例，不保存或发送个人数据。全部示例数据为演示用途，真实报告请替换内容、来源和结论。

## 在自己的 Slidev 中使用

在本仓库新演示的组件目录放一个包装组件，导入 `../../../recipes/DataMagicPlayer.vue`，再在 Markdown 中使用：

```vue
<DataMagicPlayer id="RankedReveal" />
<DataMagicPlayer id="ChartTimelineTravel" :data="myVerifiedData" />
```

完整复制到其他仓库时，复制 `recipes/`、`decks/design-recipes/public/datamagic/` 和许可文件，安装 Vue、AJV、d3-geo 与本仓库所列字体依赖。资源根路径应与播放器 `assetBase` 一致。不要只复制编译后的单个组件：每张卡片依赖的时间函数、图标和源数据也要保留。

## 原生实现与已知差异

没有 React、ReactDOM 或 Remotion 播放器被打包到公开页面；源码中的 `React.createElement` 名字是编译用的兼容工厂，实际生成 Vue VNode。没有使用完成的动画视频假装可编辑动画。原始逐项算法、几何、颜色、时序与参数保留；视频图层由原生浏览器视频逐帧寻址，不等同于 Remotion 的 FFmpeg 逐帧解码。

七份来源不足的背景被替换为本项目自制几何 SVG，详见 `assets-replacements/mapping.json`。若数据引用回收工厂 plate 背景视频，则改用静态图，该背景本身不再运动。该差异会影响涉及素材的视觉效果，不算完全一致。三个上游明确声明生成来源的主持人/场景示例保留其来源说明。图表和文字动画层仍可编辑。

移除了原作Studio的鼠标拖拽/选框编辑界面，保留JSON里的布局参数。字体、平台抗锯齿、浏览器视频解码可能产生差异。不能把成功构建或源代码映射视作逐帧视觉验收。

## 验证

- `npm test --prefix slides`：目录/数据/生成结构/运行时数值和Vue上下文测试。
- `npm run build --prefix slides`：全部现有演示。
- `node slides/scripts/check-build.mjs`：全部发布入口。
- `node slides/scripts/smoke.mjs`：演示导航和刷新回归。
- `node slides/scripts/datamagic-smoke.mjs`：139项开场、中段、终态实际渲染、媒体、帧变化、编辑、重播、减少动效。
- GitHub Actions `DataMagic source fidelity` 使用相同固定提交的原始React组件作独立参考，保存每项关键帧与差异图；参考中的七份背景也使用安全替代，因此素材原貌不在等价比较范围内。像素差异需审查，测试不自动声称所有细节忠实。

首次本机环境无法启动Chromium，浏览器验收由CI完成。最终检查状态以相应提交的CI报告为准。

## 向后兼容

旧版 `RecipePlayer.vue` / `motion.mjs` 两种简化示例仍保留给已有使用者，它们不是完整139卡片的实现，也不作为新库的视觉验收证据。

版权与第三方许可见 `THIRD_PARTY_LICENSES.md`、`LICENSES.md` 和 `ported/LICENSE`。个人/非商业使用不免除版权、商标或素材许可要求。

## 资源重建

为保证分批上传可恢复，五个原始二进制资源以 `asset-data/` 中的小型 base64 文本块保存。`scripts/materialize-datamagic.mjs` 在构建前检查字节数和 SHA256，再复原至 `public/datamagic/`，输出与来源字节完全一致。不是重新编码或降低清晰度。新机器开发前可先执行此脚本；公开参考目录不重复分发这些编码块。
