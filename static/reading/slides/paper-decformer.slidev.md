---
theme: default
routerMode: hash
wakeLock: false
fonts:
  provider: none
  sans: system-ui
  serif: Georgia
---

# DecFormer / PELC

Your Latent Mask is Wrong: Pixel-Equivalent Latent Compositing for Diffusion Models

v1 · 作者报告，未本地复现

[固定版本原文](https://arxiv.org/html/2512.05198v1)

---

# 问题与等价原则

阅读结论：应先定义希望在像素域实现的操作，再学习它在特定 VAE 潜空间中的对应算子。潜变量的空间网格只能提供粗略对应，不能保证掩码外像素不变。

D(C\_F(z)) = F(D(z))
C\_F(E(x)) = E(F(x))

条件：E / D 是冻结的编码器 / 解码器，F 是目标像素操作，C\_F 是待学习的潜空间操作。训练只能逼近这一目标；名称中的 equivalent 不意味着每个样本严格零误差。

<!-- source blocks: [problem-question], [equivalence] -->

[§1–2 · Eq.1–3](https://arxiv.org/html/2512.05198v1#S1)

---

# 方法

ẑ = (1 − α) ⊙ z\_A + α ⊙ z\_B + s
α ∈ \[0,1\]^(C×h×w)

条件：α 保留稳定的凸组合先验；s 负责两端连线之外的修正。与一个 m 广播 C 次不同，每个通道都有自己的 α。

1. 掩码先验：轻量 CNN 每个掩码运行一次，输出 α 初值与 mask tokens。
2. 多尺度合成：\[4,2,1,1\] patch 逐级细化，反复注入当前合成误差；FiLM 提供掩码与边缘 halo 条件。
3. 精细修正：末端 patch=1 的 cross-attention 对齐细边界，局部卷积抑制残留光晕。

<!-- source blocks: [method-equation], [method-flow] -->

[§3 · Fig.3 · PDF p.4–6](https://arxiv.org/html/2512.05198v1#S3)

---

# 可比实验

| 方法 | PSNR均值 dB ↑ | PSNR 95%CI | LPIPS ↓ | Halo L1 ↓ |
| --- | --- | --- | --- | --- |
| Heuristic | 32.9 | ±1.1 | 0.088 | 0.05 |
| DecFormer | 41.3 | ±0.8 | 0.027 | 0.018 |

条件：n=50；COCO2017验证图与Compositions-1k掩码；本表显示部分指标，LPIPS与Halo L1的CI请见原表。柱长表示PSNR，不能解释为画质的线性倍数。

<!-- source blocks: [soft-results] -->

[Tab.2 · PDF p.6](https://arxiv.org/html/2512.05198v1#S4.T2)

---

# 消融与边界

| 配置 | Halo L1 ↓ | LPIPS ↓ | MSE ↓ |
| --- | --- | --- | --- |
| 无 Halo L1 loss | 0.0973 ±0.0002 | 0.0299 ±0.0003 | 0.0297 ±0.0003 |
| 完整基线 | 0.0829 ±0.0018 | 0.0303 ±0.0015 | 0.0303 ±0.0003 |
| 无约束α、无shift | 0.1079 ±0.0012 | 0.0514 ±0.0012 | 0.0331 ±0.0003 |

条件：三种子，训练至80k steps；均值±95%CI。最后一行同时改变α约束与shift，不能视为严格单因素的“仅去掉shift”。

<!-- source blocks: [ablation-table] -->

[Tab.1 · PDF p.6](https://arxiv.org/html/2512.05198v1#S4.T1)

---

# 研究启发

1. 测量误差：冻结VAE与输入，对照像素合成、启发式latent合成和重复编解码。
2. 定位成因：按边界距离、mask宽度、mask内外分别统计，保留失败例。
3. 再谈迁移：只有基线确实显示该类误差，才评估学习合成器的成本和收益。

<!-- source blocks: [takeaways-plan] -->


