---
title: 'MedGMAE: Gaussian Masked Autoencoders for Medical Volumetric Representation Learning'

authors:
  - admin
  - Fenghe Tang
  - Yingtai Li
  - Lixia Han
  - Jian Lu
  - Zihang Jiang
  - S. Kevin Zhou

date: '2026-02-01T00:00:00Z'
doi: ''

publishDate: '2026-02-01T00:00:00Z'

publication_types: ['1']

publication: 'AAAI Conference on Artificial Intelligence (Under Review)'
publication_short: 'AAAI 2026 (Under Review)'

abstract: 'Voxel-level masked reconstruction pre-training suffers from anatomical discontinuity and parameter inefficiency in medical 3D data. We propose MedGMAE, the first work to introduce 3D Gaussian representations into medical image self-supervised pre-training, achieving continuous and parameter-efficient representation. We design a hierarchical residual structure for coarse-to-fine reconstruction and implement sparse masked CUDA volumetric rendering acceleration. Our pre-trained Gaussian decoder demonstrates zero-shot capabilities and accelerates 3DGS-based CT reconstruction convergence by 1.39×, while reducing parameters by 99% compared to voxel-based methods.'

summary: 'First work introducing 3D Gaussian representations into medical image self-supervised pre-training with 99% parameter reduction and superior downstream task performance.'

tags:
  - Self-supervised Learning
  - 3D Gaussian Representation
  - Medical Imaging
  - Masked Autoencoder

featured: true

url_pdf: ''
url_code: ''
url_dataset: ''
url_poster: ''
url_project: ''
url_slides: ''
url_source: ''
url_video: ''

image:
  caption: ''
  focal_point: ''
  preview_only: false

projects: []
slides: ""
---

**Key Contributions:**

- **Novel Representation**: First work to introduce 3D Gaussian representations into medical image self-supervised pre-training
- **Parameter Efficiency**: 99% parameter reduction compared to voxel-based methods
- **Hierarchical Architecture**: Coarse-to-fine reconstruction with hierarchical residual structure
- **Computational Efficiency**: Sparse masked CUDA volumetric rendering acceleration
- **Superior Performance**: Outperforms SOTA methods on downstream tasks (segmentation, registration, classification)
- **Zero-shot Capability**: Pre-trained Gaussian decoder accelerates 3DGS-based CT reconstruction 1.39× faster

**Research Challenge**: Voxel-level masked reconstruction pre-training in medical 3D data suffers from anatomical discontinuity and parameter inefficiency.
