---
title: "Less Is More: Balancing Positive and Negative Space in Visual Concept Blending"
short: Less Is More
authors: [Shishi Xiao, Adam Coscia, David H. Laidlaw]
venue: UIST 2026
venueFull: ACM Symposium on User Interface Software and Technology (UIST), 2026
year: 2026
month: 11
type: conference
themes: []
links:
  pdf: https://arxiv.org/abs/2609.00476
bibtex: |
  @inproceedings{Xiao:2026:LessIsMore,
    author = {Xiao, Shishi and Coscia, Adam and Laidlaw, David H.},
    title = {Less Is More: Balancing Positive and Negative Space in Visual Concept Blending},
    year = {2026},
    booktitle = {Proceedings of the 39th Annual ACM Symposium on User Interface Software and Technology},
    location = {Detroit, MI, USA},
    series = {UIST '26}
  }
---

Graphic designers often blend visual concepts to communicate multiple ideas within a single image, leveraging positive and negative space to create balance, emphasis, and aesthetic appeal. While computational methods have begun to support automatic concept blending, they largely overlook the role of spatial composition in the design. To address this gap, we present an automatic pipeline that explicitly applies positive and negative space throughout the blending process. Our approach first identifies plausible regions for concept integration by combining semantic reasoning from vision-language models with geometric constraints derived from real-world examples. Conditioned on these regions, the system generates blended compositions using a hybrid pixel-vector pipeline: diffusion-based inpainting produces a fast, coarse initialization, which is then refined through vector-based optimization at the point level to ensure structural coherence and balanced semantic expression. A multimodal agent orchestrates this process as a planner and evaluator, enabling iterative improvement and interpretable control. Through an evaluation using both baseline comparisons and a user study, we demonstrate greater expressiveness, creativity, and concept recognizability by effectively leveraging positive and negative space. We further demonstrate the generalizability of our approach across diverse applications, including controllable image and infographic generation.
