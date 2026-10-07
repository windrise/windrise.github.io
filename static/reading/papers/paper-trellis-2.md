# Native and Compact Structured Latents for 3D Generation

Jianfeng Xiang, Xiaoxue Chen, Sicheng Xu, Ruicheng Wang, Zelong Lv, Yu Deng, Hongyuan Zhu, Yue Dong, Hao Zhao, Nicholas Jing Yuan, Jiaolong Yang

原始发表：2025-12-16 · 版本：v1 · 入库：2026-10-07
[固定版本原文](https://arxiv.org/html/2512.14692v1)

作者报告与本页分析分开；未本地复现，未记录用户人工复核。

这篇论文把原生 3D 表征、潜空间压缩与生成组织在同一框架中。阅读重点是：紧凑表征解决了什么问题，以及论文的重建证据能支持哪些结论。

## 01 · 先确定要回答的问题

<a id="problem-question"></a>
我们的阅读问题：更少的表示单元是否足以描述复杂几何与材质？需要分别检查表示能力、压缩误差、生成质量和实际使用成本，不能只看最终渲染图。



<a id="problem-scope"></a>
本页是一份可继续补充的深读初稿。引用固定在 v1；来源核对由 Codex 完成，用户阅读状态为空。没有本地复现，也没有人工科学复核。



## 02 · 把相关工作放在合适的位置

<a id="related-map"></a>
TRELLIS 是直接相关的前作；LDM 与 Flow Matching 是背景阅读；3DGS 提供另一种观察表示与渲染问题的视角。后三者在此不是同任务性能基线，四篇关联论文目前仅收录元信息。



<a id="related-question"></a>
下一次读前作时，优先记录它们各自的输入、输出和评估对象，再判断哪些差异来自表示，哪些来自数据或训练预算。



## 03 · 表征、压缩、生成

<a id="method-fact"></a>
原文采用 O-Voxel 描述几何与材质，以 SC-VAE 压缩原生 3D，并按结构、形状、材质的顺序生成。

[§3.1–3.3](https://arxiv.org/html/2512.14692v1#S3)

<a id="method-flow"></a>
1. 表征：哪些几何与材质信息被存入 O-Voxel？
2. 压缩：编码—解码本身损失了什么？
3. 生成：固定前序条件后，后一个阶段改变什么？

[§3.1–3.3](https://arxiv.org/html/2512.14692v1#S3)

<a id="method-inference"></a>
我们的分析：先把重建和生成拆开阅读，才能避免把“能编码复杂资产”直接解释为“能可靠生成所有复杂资产”。阶段分解也为日后设计消融提供了检查位置，但尚未转化为已执行实验。



## 04 · 数据、指标与关键比较

<a id="evaluation-scope"></a>
重建评估在附录 D.1 列出 Toys4K-PBR 473 个、Sketchfab Featured 90 个资产。附录 C 的可用资产总数不是最终测试数。

[App.D.1](https://arxiv.org/html/2512.14692v1#A4.SS1)

<a id="comparison-table"></a>
| 方法 | Token 数 | Toys4K 全表面 F1 |
| --- | --- | --- |
| TRELLIS | 9.6K | 0.074 |
| SparseFlex | 225K | 0.845 |
| TRELLIS 2 | 9.6K | 0.971 |

条件：同为 1024³；表 1 全表面 F1 门限 1e-8。原文解码计时使用 A100；这里没有展示耗时，也不把训练用 H100 写成计时硬件。

[§4 · Tab.1](https://arxiv.org/html/2512.14692v1#S4.T1) · [App.D.1](https://arxiv.org/html/2512.14692v1#A4.SS1)

<a id="evaluation-inference"></a>
我们的判断：这些行支持特定协议下的表示重建对比，不能直接证明多视图材质一致性改善。若要用于 05 项目，需要另列固定几何、视角、光照、样本与材质指标，比较同一任务下的结果。



## 05 · 作者局限与我们的追问

<a id="limitations-fact"></a>
附录 F 提到有限体素分辨率的混叠、小孔，以及未显式表示部件语义。

[App.F](https://arxiv.org/html/2512.14692v1#A6)

<a id="limitations-question"></a>
我们的追问：平均指标会不会掩盖薄结构的失败？结果对输入遮挡、形状复杂度和材质类别是否同样稳定？哪些问题可用重建对照检查，哪些必须看真实生成？目前这些问题没有本地实验答案。



## 06 · 回到自己的研究

<a id="takeaways-cvpr"></a>
给 05 的候选启发：把几何重建和材质一致性拆成两个评估问题；先明确哪一种观察能反驳方案，再选基线与预算。这里记录的是提议，不是对现有实验的修改。



<a id="takeaways-medical"></a>
给 04 的边界：通用物体重建论文不能提供 CT 增强生成的医学有效性证据。优先阅读 LDM / Flow Matching 的建模背景；任何医学用途仍需本项目自己的数据与评价。



<a id="takeaways-next"></a>
下一次深读：核查 TRELLIS 的同任务设置，补充本页尚未整理的训练目标、生成评估与消融。保留原文版本和引用位置，再决定是否形成实验计划。



## 关联项目

- [05 · CVPR2027](https://wind-rise-projects.fuxueming595.chatgpt.site/#project/codex-cvpr2027-texture/overview)：背景阅读：怎样把几何重建能力与材质一致性证据分开？
- [06 · 科研工作台](https://wind-rise-projects.fuxueming595.chatgpt.site/#project/rise-research-workbench/overview)：作为阅读→证据→研究问题→汇报的试用案例。
