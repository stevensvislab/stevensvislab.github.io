---
title: "Lumos: Increasing Awareness of Analytic Behavior during Visual Data Analysis"
short: Lumos
authors: [Arpit Narechania, Adam Coscia, Emily Wall, Alex Endert]
venue: VIS 2021
venueFull: IEEE Transactions on Visualization and Computer Graphics (Proc. IEEE VIS 2021), 2022
year: 2021
month: 10 
type: journal
themes: [bias-aware-va]
builds_on: [biasfuture]
award: CRIDC Best Poster Award, 2021
teaserAlt: Lumos highlighting previously examined data points and comparing interaction distributions to the data
links:
  project: https://lumos-vis.github.io/
  pdf: https://arxiv.org/abs/2108.02909
  doi: https://doi.org/10.1109/TVCG.2021.3114827
  talk: https://youtu.be/G_pOu4OGtPI
  slides: /papers/lumos/lumos-presentation.pdf
  poster: /papers/lumos/lumos_cridc_2021.pdf
  code: https://github.com/lumos-vis
bibtex: |
  @article{Narechania:2022:Lumos,
    author = {Narechania, Arpit and Coscia, Adam and Wall, Emily and Endert, Alex},
    journal = {IEEE Transactions on Visualization and Computer Graphics},
    title = {Lumos: Increasing Awareness of Analytic Behavior during Visual Data Analysis},
    year = {2022},
    volume = {28},
    number = {1},
    pages = {1009-1018},
    doi = {10.1109/TVCG.2021.3114827}
  }
---

Visual data analysis tools provide people with the agency and flexibility to explore data using a variety of interactive functionalities. However, this flexibility may introduce potential consequences in situations where users unknowingly overemphasize or underemphasize specific subsets of the data or attribute space they are analyzing. For example, users may overemphasize specific attributes and/or their values (e.g., Gender is always encoded on the X axis), underemphasize others (e.g., Religion is never encoded), ignore a subset of the data (e.g., older people are filtered out), etc. In response, we present Lumos, a visual data analysis tool that captures and shows the interaction history with data to increase awareness of such analytic behaviors. Using in-situ (at the place of interaction) and ex-situ (in an external view) visualization techniques, Lumos provides real-time feedback to users for them to reflect on their activities. For example, Lumos highlights datapoints that have been previously examined in the same visualization (in-situ) and also overlays them on the underlying data distribution (i.e., baseline distribution) in a separate visualization (ex-situ). Through a user study with 24 participants, we investigate how Lumos helps users' data exploration and decision-making processes. We found that Lumos increases users' awareness of visual data analysis practices in real-time, promoting reflection upon and acknowledgement of their intentions and potentially influencing subsequent interactions.
