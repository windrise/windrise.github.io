---
theme: default
routerMode: hash
wakeLock: false
fonts:
  provider: none
  sans: system-ui
  serif: Georgia
---

# TRELLIS 2

Native and Compact Structured Latents for 3D Generation

v1 · 作者报告，未本地复现

[固定版本原文](https://arxiv.org/html/2512.14692v1)

---

# 问题与阅读边界

我们的阅读问题：更少的表示单元是否足以描述复杂几何与材质？需要分别检查表示能力、压缩误差、生成质量和实际使用成本，不能只看最终渲染图。

本页是一份可继续补充的深读初稿。引用固定在 v1；来源核对由 Codex 完成，用户阅读状态为空。没有本地复现，也没有人工科学复核。

<!-- source blocks: [problem-question], [problem-scope] -->



---

# 相关工作与方法

TRELLIS 是直接相关的前作；LDM 与 Flow Matching 是背景阅读；3DGS 提供另一种观察表示与渲染问题的视角。后三者在此不是同任务性能基线，四篇关联论文目前仅收录元信息。

原文采用 O-Voxel 描述几何与材质，以 SC-VAE 压缩原生 3D，并按结构、形状、材质的顺序生成。

1. 表征：哪些几何与材质信息被存入 O-Voxel？
2. 压缩：编码—解码本身损失了什么？
3. 生成：固定前序条件后，后一个阶段改变什么？

<!-- source blocks: [related-map], [method-fact], [method-flow] -->

[§3.1–3.3](https://arxiv.org/html/2512.14692v1#S3)

---

# 条件明确的重建比较

重建评估在附录 D.1 列出 Toys4K-PBR 473 个、Sketchfab Featured 90 个资产。附录 C 的可用资产总数不是最终测试数。

| 方法 | Token 数 | Toys4K 全表面 F1 |
| --- | --- | --- |
| TRELLIS | 9.6K | 0.074 |
| SparseFlex | 225K | 0.845 |
| TRELLIS 2 | 9.6K | 0.971 |

条件：同为 1024³；表 1 全表面 F1 门限 1e-8。原文解码计时使用 A100；这里没有展示耗时，也不把训练用 H100 写成计时硬件。

<!-- source blocks: [evaluation-scope], [comparison-table] -->

[App.D.1](https://arxiv.org/html/2512.14692v1#A4.SS1) · [§4 · Tab.1](https://arxiv.org/html/2512.14692v1#S4.T1)

---

# 局限与开放问题

附录 F 提到有限体素分辨率的混叠、小孔，以及未显式表示部件语义。

我们的追问：平均指标会不会掩盖薄结构的失败？结果对输入遮挡、形状复杂度和材质类别是否同样稳定？哪些问题可用重建对照检查，哪些必须看真实生成？目前这些问题没有本地实验答案。

<!-- source blocks: [limitations-fact], [limitations-question] -->

[App.F](https://arxiv.org/html/2512.14692v1#A6)

---

# 研究启发与下一步

给 05 的候选启发：把几何重建和材质一致性拆成两个评估问题；先明确哪一种观察能反驳方案，再选基线与预算。这里记录的是提议，不是对现有实验的修改。

下一次深读：核查 TRELLIS 的同任务设置，补充本页尚未整理的训练目标、生成评估与消融。保留原文版本和引用位置，再决定是否形成实验计划。

<!-- source blocks: [takeaways-cvpr], [takeaways-next] -->


