---
title: "iScore: Visual Analytics for Interpreting How Language Models Automatically Score Summaries"
short: iScore
authors: [Adam Coscia, Langdon Holmes, Wesley Morris, Joon Suh Choi, Scott Crossley, Alex Endert]
venue: IUI 2024
venueFull: ACM Conference on Intelligent User Interfaces (IUI), 2024
year: 2024
month: 3 
type: conference
themes: [ai-in-education]
builds_on: [knowledgevis]
featured: true
teaserAlt: iScore views comparing summaries, LLM scores, and model weights
links:
  pdf: https://arxiv.org/abs/2403.04760
  doi: https://doi.org/10.1145/3640543.3645142
  slides: /papers/iscore/Coscia_iScore_IUI_Mar2024.pdf
  poster: /papers/iscore/iScore_CRIDC_2024.pdf
  video: https://youtu.be/EYJX-_fQPf0
  code: https://github.com/AdamCoscia/iScore
bibtex: |
  @inproceedings{Coscia:2024:iScore,
    author = {Coscia, Adam and Holmes, Langdon and Morris, Wesley and Choi, Joon S. and Crossley, Scott and Endert, Alex},
    title = {iScore: Visual Analytics for Interpreting How Language Models Automatically Score Summaries},
    year = {2024},
    publisher = {Association for Computing Machinery},
    address = {New York, NY, USA},
    url = {https://doi.org/10.1145/3640543.3645142},
    doi = {10.1145/3640543.3645142},
    booktitle = {Proceedings of the 2024 IUI Conference on Intelligent User Interfaces},
    location = {Greenville, SC, USA},
    series = {IUI '24}
  }
---

The recent explosion in popularity of large language models (LLMs) has inspired learning engineers to incorporate them into adaptive educational tools that automatically score summary writing. Understanding and evaluating LLMs is vital before deploying them in critical learning environments, yet their unprecedented size and expanding number of parameters inhibits transparency and impedes trust when they underperform. Through a collaborative user-centered design process with several learning engineers building and deploying summary scoring LLMs, we characterized fundamental design challenges and goals around interpreting their models, including aggregating large text inputs, tracking score provenance, and scaling LLM interpretability methods. To address their concerns, we developed iScore, an interactive visual analytics tool for learning engineers to upload, score, and compare multiple summaries simultaneously. Tightly integrated views allow users to iteratively revise the language in summaries, track changes in the resulting LLM scores, and visualize model weights at multiple levels of abstraction. To validate our approach, we deployed iScore with three learning engineers over the course of a month. We present a case study where interacting with iScore led a learning engineer to improve their LLM's score accuracy by three percentage points. Finally, we conducted qualitative interviews with the learning engineers that revealed how iScore enabled them to understand, evaluate, and build trust in their LLMs during deployment.
