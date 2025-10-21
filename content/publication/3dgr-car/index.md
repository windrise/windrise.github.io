---
title: '3DGR-CAR: Coronary Artery Reconstruction from Ultra-Sparse 2D X-ray Views with a 3D Gaussians Representation'

authors:
  - admin
  - Yingtai Li
  - Fenghe Tang
  - Jun Li
  - Mingyue Zhao
  - Gao-Jun Teng
  - S. Kevin Zhou

date: '2024-10-01T00:00:00Z'
doi: ''

publishDate: '2024-06-15T00:00:00Z'

publication_types: ['1']

publication: 'International Conference on Medical Image Computing and Computer-Assisted Intervention'
publication_short: 'MICCAI 2024 (CCF-B)'

abstract: 'Recovering 3D coronary artery structures from sparse 2D X-ray images is extremely challenging due to coronary arteries occupying only 0.1% of cardiac volume. We propose 3DGR-CAR, the first work to successfully apply 3D Gaussian representations to coronary artery reconstruction. Our two-stage framework includes a Gaussian center predictor that predicts depth maps and 3D offset parameters from single-view X-ray projections, significantly improving Gaussian initialization quality. The 3D Gaussian representation combined with composite optimization of projection loss and vessel centerline loss achieves superior reconstruction.'

summary: 'First work applying 3D Gaussians to coronary artery reconstruction with 70% DSC improvement over NeRF and 10× faster reconstruction speed.'

tags:
  - Coronary Artery Reconstruction
  - 3D Gaussian Representation
  - Sparse-view Reconstruction
  - X-ray Imaging

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

**Key Achievements:**

- **Novel Application**: First work to successfully apply 3D Gaussian representations to coronary artery reconstruction
- **Two-stage Framework**:
  - Gaussian center predictor for depth map and 3D offset prediction
  - Improved Gaussian initialization quality
- **Composite Optimization**: Combines projection loss and vessel centerline loss
- **Superior Performance on ImageCAS and ASOCA datasets**:
  - Novel view synthesis DSC: 56.24% and 59.79% (~70% improvement over NeRF)
  - Volume reconstruction DSC: 70.03% and 73.06%
  - SSIM: >97%
  - Speed: 10× faster than NeRF-based methods

**Research Challenge**: Coronary arteries occupy only 0.1% of cardiac volume, making it extremely difficult to recover 3D anatomical structures from sparse 2D X-ray images.
