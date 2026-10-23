# Writing a document

Currently, the Join page text and the lab culture playbook are plain Markdown files in `src/content/documents/`.

1. Go to: `src/content/documents/prospectus.md` or `lab-culture.md`.
2. `## Heading` starts a major part and `### Heading` a section inside it. The Join page's "On this page" list is built from these headings, so it always matches.
3. An epigraph (the quotes in lab culture) is a quote whose last line starts with an em dash:

```md
> "All we have to decide is what to do with the time that is given us."
>
> — Gandalf, _The Fellowship of the Ring_
```

4. In the prospectus, put `<!-- lab-culture -->` on its own line where the lab culture document should appear. It nests under the heading above it.
5. Link a paper with `[Title](/papers/<slug>/)` and a research theme with `[Name](/#theme-id)`. The build checks that internal links work.
