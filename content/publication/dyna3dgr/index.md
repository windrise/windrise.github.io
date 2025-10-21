---
title: 'Dyna3DGR: 4D Cardiac Motion Tracking with Dynamic 3D Gaussian Representation'

authors:
  - admin
  - Pei Wu
  - Yingtai Li
  - Junhao Mei
  - Jian Lu
  - Gao-Jun Teng
  - S. Kevin Zhou

date: '2025-10-01T00:00:00Z'
doi: ''

publishDate: '2025-01-15T00:00:00Z'

publication_types: ['1']

publication: 'International Conference on Medical Image Computing and Computer-Assisted Intervention'
publication_short: 'MICCAI 2025 (CCF-B)'

abstract: 'Accurate 4D cardiac motion tracking from dynamic cardiac MRI is extremely challenging due to the homogeneous characteristics of myocardial tissue and lack of distinct anatomical landmarks. Image registration-based methods struggle to maintain topological consistency, while representation-based methods often lose important image-level details. We propose Dyna3DGR, a unified framework that introduces 3D Gaussians as representation space primitives and aligns them with image space through differentiable volumetric rendering, achieving topology-consistent and physically plausible cardiac motion estimation.'

summary: '4D cardiac motion tracking using dynamic 3D Gaussian representations with 17.73% Dice improvement and 12.63% SSIM improvement.'

tags:
  - 4D Cardiac Motion Tracking
  - 3D Gaussian Representation
  - Medical Imaging
  - Cardiac MRI

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

**Highlights:**

- **Control Point-based Motion Model**: Novel motion field model based on control nodes
- **3D Gaussian Representation**: Uses 3D Gaussians as representation space primitives
- **Differentiable Rendering**: Aligns representation space with image space through differentiable volumetric rendering
- **Topology Consistency**: Achieves topology-consistent and physically plausible cardiac motion estimation
- **Superior Performance**:
  - Dice score improvement: 17.73%
  - SSIM improvement: 12.63%
  - Evaluated on 4D dynamic cardiac MRI datasets

**Research Challenge**: The homogeneous characteristics of myocardial tissue and lack of distinct anatomical landmarks make accurate 4D cardiac motion tracking from dynamic cardiac MRI extremely difficult. Existing image registration methods struggle with topological consistency, while representation-based methods lose important image-level details.
