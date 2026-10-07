---
theme: default
routerMode: hash
wakeLock: false
fonts:
  provider: none
  sans: system-ui
  serif: Georgia
---

# PixPerfect

PixPerfect: Seamless Latent Diffusion Local Editing with Discriminative Pixel-Space Refinement

v1 · 作者报告，未本地复现

[固定版本原文](https://arxiv.org/html/2512.03247v1)

---

# 问题

阅读结论：背景完全保留，并不意味着生成区域自然接上背景。局部色差、噪声颗粒、压缩纹理和结构断点可能很小，却恰好集中在人眼敏感的边界。PixPerfect把这些误差当作单独的学习目标。

<!-- source blocks: [problem-question] -->

[§1–2 / App.A · PDF p.1–3,11](https://arxiv.org/html/2512.03247v1#S1)

---

# 方法

x\_pred = G(x\_gen, m)
L = L\_pixel-space + L\_discriminative-space

条件：G接收图像与mask。两个空间中均组合L1、LPIPS和条件对抗损失；判别色调映射用于训练监督，不是把测试图像永久染成另一种颜色。

1. 训练配对：从干净图像合成人为伪影，获得可控的输入与目标。
2. 监督学习：RGB与自适应色调空间同时约束颜色、纹理和边界。
3. 部署精修：生成模型先完成内容，再由G精修；可选多次扰动与pooling，具体实现需核对。

<!-- source blocks: [method-core], [method-flow] -->

[§3.1 · Fig.1–2 · PDF p.3–5](https://arxiv.org/html/2512.03247v1#S3) · [§3.2 · Fig.3 · PDF p.5–6](https://arxiv.org/html/2512.03247v1#S3.SS2) · [§3.3–4.1 · PDF p.6–7](https://arxiv.org/html/2512.03247v1#S4.SS1)

---

# 主要结果

| 方法 | LPIPS ↓ | FID ↓ | PSNR dB ↑ |
| --- | --- | --- | --- |
| FLUX-Fill | 0.195 | 14.66 | 20.9 |
| + Asymmetric VQGAN | 0.202 | 15.99 | 20.91 |
| + DiffHarmony++ | 0.19 | 14.02 | 20.89 |
| + PixPerfect | 0.141 | 10.87 | 22.18 |

条件：MISATO 2000张，固定表1同任务比较。未给出置信区间；不能根据小差异断言统计显著性。

<!-- source blocks: [inpaint-results] -->

[Tab.1 · PDF p.7](https://arxiv.org/html/2512.03247v1#S4.T1)

---

# 消融

| 配置 | FID ↓ | LPIPS ↓ | L1 ↓ |
| --- | --- | --- | --- |
| FLUX-Fill | 14.6585 | 0.195 | 0.0621 |
| + paste-back | 14.4022 | 0.1701 | 0.0395 |
| + refiner | 13.9874 | 0.1698 | 0.0402 |
| + enhance loss (d=6) | 10.9014 | 0.1425 | 0.0365 |
| + pooling | 10.8675 | 0.1414 | 0.0363 |

条件：表4逐步配置；同为MISATO。数字保留原文精度，没有误差条。

<!-- source blocks: [ablation-table] -->

[§4.3 / Tab.4 · PDF p.9–10](https://arxiv.org/html/2512.03247v1#S4.T4)

---

# 研究启发

1. 收集失败：以现有固定样本记录颜色、纹理与结构问题，避免挑好例子。
2. 冻结条件：比较不精修、简单paste-back和候选精修，保留mask外差异图。
3. 验收细节：检查目标相关结构是否保留，再权衡感知收益与额外延迟。

<!-- source blocks: [takeaways-plan] -->


