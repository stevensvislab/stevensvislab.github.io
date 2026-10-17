---
title: "Targeted and Traceable Investigation of Multi-Agent LLM Dialogue via Semantic Bundling of Knowledge Graphs"
short: AgentK
authors: [Zeyu Hua, Adam Coscia, Alex Endert]
venue: VAST Challenge 2026
venueFull: VAST Challenge at IEEE VIS, 2026
year: 2026
month: 11 
type: workshop
themes: [human-ai-collaboration]
builds_on: [vispile]
award: VAST Challenge Honorable Mention, 2026
links:
  pdf: https://arxiv.org/abs/2609.35786
bibtex: |
  @inproceedings{Hua:2026:AgentK,
    author = {Hua, Zeyu and Coscia, Adam and Endert, Alex},
    title = {Targeted and Traceable Investigation of Multi-Agent LLM Dialogue via Semantic Bundling of Knowledge Graphs},
    year = {2026},
    booktitle = {VAST Challenge at IEEE VIS},
    eprint = {2609.35786},
    archivePrefix = {arXiv}
  }
---

Multi-agent LLM systems today are increasingly automated, logging LLM-LLM interactions as conversational transcripts. Yet analyzing such dialogue for insights remains challenging, including attributing behaviors to the correct actor and summarizing interactions across a long exchange. We present a targeted and traceable approach to investigating multi-agent LLM dialogue, applied to the VAST Challenge 2026 MC1 dataset. The challenge asks participants to reconstruct and explain which internal communications among AI agents at TenantThread, a property tech company, led to an inappropriate information release. We first convert the dialogue into a knowledge graph (KG) and then investigate it with AgentK, a visual analytics system for interactive Semantic Bundling of nodes and edges. We found that our approach directly addresses two main challenges: (1) the KG structure enables users to identify actors worth investigating faster; and (2) summarizing only the region surrounding an actor of interest better supports per-actor attribution than reading raw conversations.
