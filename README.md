# Stevens Visualization Lab Website

The official website of the Visualization Lab at Stevens Institute of Technology: <https://stevensvislab.github.io/>

Built with [Astro](https://astro.build). Read on to learn how to update the site!

## Run it locally

```bash
npm install
npm run dev       # http://localhost:4321, with live reload
npm run build     # production build into dist/ + image optimization + link check
npm run preview   # serve the built site
```

Pushing to `main` deploys automatically through `.github/workflows/deploy.yml`.

## Making an edit

Small text fixes can be done entirely on GitHub:

1. Open the file.
2. Click the ✏️ pencil icon.
3. Choose **Propose changes** and make your edits.
4. GitHub forks the repo and opens the PR for you.

For major edits, changes go through a pull request (PR):

1. **Fork** the repo: click **Fork** at the top right of the page.
2. **Clone your fork and create a branch** named after your change:

```bash
git clone https://github.com/<your-username>/stevensvislab.github.io.git
cd stevensvislab.github.io
git checkout -b add-my-paper
```

3. **Make your edit** using the sections below, then check that it builds:

```bash
npm install
npm run build    # must end with "✓ Link check passed"
npm run dev      # optional: preview at http://localhost:4321
```

4. **Commit and push** to your fork:

```bash
git add .
git commit -m "Add <paper name>"
git push -u origin add-my-paper
```

5. **Open a PR:** on your fork's GitHub page, click **Compare & pull request**. The base should be `stevensvislab/stevensvislab.github.io` → `main`. Make a short list of edits you made.
6. **Review:** a lab admin reviews the PR and requests changes or approves it. Once it's merged into `main`, the site redeploys in about 2 minutes.

## Editing content

| To add or change...                     | Edit                                                             |
| --------------------------------------- | ---------------------------------------------------------------- |
| A paper                                 | `src/content/papers/<slug>.md` (copy an existing one)            |
| A paper's teaser, PDFs, slides, demos   | `public/papers/<slug>/` (`teaser.png`, `teaser-mini.png`)        |
| Paper tags (domains, methods, partners) | `src/data/paper-tags.yaml` (each tag lists its papers)           |
| People                                  | `src/data/people.yaml` + photo in `public/people/`               |
| News                                    | `src/data/news.yaml`                                             |
| Press                                   | `src/data/press.yaml`                                            |
| Photos (Fun page)                       | image in `public/photos/` + entry in `src/data/photos.yaml`      |
| Blog post                               | `src/content/blog/YYYY-MM-DD-slug.md` + images in `public/blog/` |

Every YAML file starts with a commented example item, making it easy to copy it, uncomment it, and fill it in!

Every file is checked against a schema when the site builds (`src/content.config.ts`). If a field is missing, a slug or tag is misspelled, or an image file can't be found, `npm run build` stops and says where. Please check your work!

### Where files live

- **`src/content/`**: writing, as Markdown (papers, blog posts, prospectus, and lab culture).
- **`src/data/`**: lists and settings, as YAML.
- **`public/`**: every image and file, served as-is at the same path (`public/people/jane.jpg` → `/people/jane.jpg`):
  - `public/papers/<slug>/`: a paper's teaser, mini teaser, PDFs, slides, posters, and demos
  - `public/people/`: lab member photos
  - `public/photos/`: Fun page photos
  - `public/blog/`: blog images
  - `public/logos/`: partner, sponsor, and Stevens logos
  - `public/og/default.png`: the default link-preview card (see [Search and sharing](#search-and-sharing))

Big images are fine: `npm run build` makes smaller WebP copies of teasers, people photos, and blog images automatically (`scripts/optimize-images.mjs`).

The topographic background lines are not files you edit. They're built from `src/graphics/contourSets.ts` into small cached SVGs at `/contours/`.

### Adding/editing a paper

1. Go to: `src/content/papers/`.
2. Create `<slug>.md`, where the slug is short, lowercase, and hyphenated (e.g. `ongoal`); it becomes the page URL `/papers/<slug>/`.
3. Add the paper content to the markdown file (see below).
4. Make the folder `public/papers/<slug>/`. Put a teaser image in it as `teaser.png` (used on paper page and carousel), a smaller, cropped version as `teaser-mini.png` (used on paper cards and lists), plus any PDFs or slides.
5. Tag the paper: add its slug to the right tags in `src/data/paper-tags.yaml` (see [Tagging a paper](#tagging-a-paper)).

```yaml
---
title: "Full Paper Title"
short: ShortName # cards and carousel
authors: [Adam Coscia, Jane Doe] # names in people.yaml are underlined + linked automatically
venue: CHI XXXX # short label
venueFull: ACM Conference on Human Factors in Computing Systems (CHI), XXXX
year: XXXX
month: 4 # optional: publication month (1-12); sorts papers within a year
type: conference # journal | conference | workshop | poster | thesis
themes: [human-ai-collaboration] # ids from research-themes.yaml (first = primary); may be []
builds_on: [ongoal] # optional: draws a dashed trail on the Research Map (currently hidden)
award: Best Paper Award # optional
featured: true # optional: show in the home-page carousel
teaserAlt: What the teaser shows # describes the teaser for screen readers
# teaser: overview.jpg # optional: only if the teaser isn't named teaser.png/.jpg/.webp
links: # all optional
  pdf: https://arxiv.org/abs/...
  doi: https://doi.org/...
  demo: /papers/shortname/demo/
  video: https://youtu.be/...
  slides: /papers/shortname/slides.pdf
  code: https://github.com/stevensvislab/...
bibtex: |
  @inproceedings{...}
---
Abstract goes here (Markdown).
```

#### Tagging a paper

Each tag lists the papers it applies to and are used site-wide. All tags live in `src/data/paper-tags.yaml`, grouped into `domains`, `methods`, and `partners`.

1. Go to: `src/data/paper-tags.yaml`.
2. Add the paper's slug to each tag that fits: `papers: [ongoal, my-new-paper]`.
3. To make a new tag, copy the example at the top of the file. Partner logos go in `public/logos/`.

### Adding/editing a lab member

1. Go to: `src/data/people.yaml`.
2. Add/edit the lab member in the file.
3. Add a square photo to `public/people/` (JPG or PNG, about 500×500 px).

```yaml
- id: jane-doe # used in links: /people/#jane-doe
  name: Jane Doe # must match the spelling in paper author lists
  first: Jane # shown on the photo
  group: core # page section: faculty | core | visiting | alumni | pet
  degree: phd # sorts within a section: postdoc | phd | ms | undergrad
  position: Engineer@Company # optional: company position or research program
  education: CS BS, University # degree, university
  photo: jane-doe.jpg # optional: file in public/people/; a contour placeholder is shown if missing
  interests: Visual analytics, Knowledge graphs, Rock climbing
  links: # all optional; allowed: site, email, scholar, github, linkedin, bluesky, x
    site: https://janedoe.com
    email: jdoe@stevens.edu
    scholar: https://scholar.google.com/citations?user=...
    github: https://github.com/janedoe
    linkedin: https://www.linkedin.com/in/janedoe/
    bluesky: https://bsky.app/profile/janedoe.bsky.social
    x: https://x.com/janedoe
  start: XXXX
```

When someone graduates:

1. Set `group: alumni`
2. Add `end: XXXX` and `now_at: Company or University`.

### Adding/editing a blog post

1. Go to: `src/content/blog/`.
2. Create `YYYY-MM-DD-slug.md`; it's published at `/blog/YYYY/MM/DD/slug/` and in the RSS feed.
3. Add the blog content to the markdown file.
4. Optional: put a lead image in `public/blog/`.

```yaml
---
title: "Trail report: ShortName"
date: 2027-05-01
author: adam-coscia # id from people.yaml
lede: One or two sentences shown on the listing and as the italic lede.
paper: shortname # optional: links the post to a paper
image: shortname-lead.png # optional: file in public/blog/
imageAlt: What the image shows
draft: true # optional: hides the post until you remove this line
---
Post body in Markdown.
```

### Adding/editing photos (Fun page)

1. Go to: `src/data/photos.yaml`.
2. Add/edit the data in the file.
3. Put the image file in `public/photos/`.

```yaml
- file: 2027-09-lab-hike.jpg
  caption: Lab hike · September 2027
  alt: Lab members at the summit of Bear Mountain
  date: 2027-09-20
```

### Adding/editing news and press

1. Go to: `src/data/news.yaml` (news) or `src/data/press.yaml` (press).
2. Add an entry anywhere in the file. Both lists are sorted by date automatically. The home page shows the latest 7 news items.

```yaml
# src/data/news.yaml
- date: 2027-04-15
  text: "[OnGoal](/papers/ongoal/) won a **Best Paper Award** at CHI 2027! 🎉"

# src/data/press.yaml
- date: 2027-03-01
  title: Headline of the Article
  outlet: Stevens News
  url: https://...
  papers: [ongoal, vispile] # optional: each paper gets a mini card under the article
```

News `text` supports `**bold**`, `*italic*`, and `[links](url)`.

### Search and sharing

Most of this is automatic:

- **Page titles and descriptions** come from the content. A paper's page title is its full title, and its description is the start of its abstract (about 150 characters), so write a clear first sentence. Other pages' descriptions are set at the top of each page file (the `description=` on `<Base>`).
- **Link previews** (Slack, LinkedIn, X, iMessage) show a card: each paper with a teaser gets one built automatically from it; everything else uses `public/og/default.png` (1200×630). Replace that file when the lab has a logo.
- **Google Scholar and search engines** get structured data (citation tags and schema.org) on every paper page, built from the paper's front matter.
- `public/robots.txt` points crawlers to the sitemap, which is generated automatically.

## Credits

The Stevens logo and partner organization logos are trademarks of their respective owners.

### Libraries

| Library                                                                                    | Use                                           | License    |
| ------------------------------------------------------------------------------------------ | --------------------------------------------- | ---------- |
| [Astro](https://astro.build) with `@astrojs/sitemap`, `@astrojs/rss`, `@astrojs/check`     | Site framework, sitemap, RSS feed, type check | MIT        |
| [d3-contour](https://github.com/d3/d3-contour), [d3-shape](https://github.com/d3/d3-shape) | Contours, research map, and footer ridge      | ISC        |
| [yaml](https://github.com/eemeli/yaml)                                                     | Reading the data files                        | ISC        |
| [TypeScript](https://www.typescriptlang.org)                                               | Type checking                                 | Apache-2.0 |
| [Fontsource](https://fontsource.org)                                                       | Self-hosting the web fonts                    | MIT        |
| [sharp](https://sharp.pixelplumbing.com)                                                   | WebP copies and link-preview cards at build   | Apache-2.0 |

### Fonts and icons

- **[National Park](https://github.com/benhoepner/National-Park)** (display type). © 2024 The National Park Project Authors. SIL Open Font License 1.1.
- **[Nunito Sans](https://github.com/Fonthausen/NunitoSans)** (body text). © 2016 The Nunito Sans Project Authors. SIL Open Font License 1.1.
- **[IBM Plex Mono](https://github.com/IBM/plex)** (labels and dates). © 2017 IBM Corp. SIL Open Font License 1.1.
- **[NPS map symbol library](https://github.com/nationalparkservice/symbol-library)** (preferred pictograph icons: maps, information, visitor center, trailhead, and more). BSD license, © Mapbox and the National Park Service.
- **[NPS Symbols](https://github.com/national-park-service/fonts)** (fallback pictograph icons). © 2026 NPS Fonts contributors. SIL Open Font License 1.1; full text in `public/fonts/NPSSymbols-OFL.txt`. An independent project not affiliated with the U.S. National Park Service.
- **[Font Awesome Free 5.9](https://fontawesome.com)** (paper link icons, the same ones as adamcoscia.com). Icons CC BY 4.0. All three icon sets are stored as SVG in `src/lib/icons.ts`.
- **GitHub mark:** from [Octicons](https://github.com/primer/octicons) (MIT). **Bluesky butterfly:** the Bluesky logo, used as a link icon. The other small icons (YouTube, LinkedIn, X, Scholar, email, website) are simplified marks drawn for this site. The brands belong to their owners.

### Design inspiration ❤️

We greatly appreciate these amazing visualization lab websites for providing inspirations for our site layout and content :) Go check them out!

- [Georgia Tech Visual Analytics Lab](https://gtvalab.github.io/)
- [Polo Club of Data Science](https://poloclub.github.io/)
- [DataVisards](https://datavisards.com/)
- [UW Interactive Data Lab](https://idl.uw.edu/)
- [Visualization Design Lab](https://www.visdesignlab.net/)
- [CMU Data Interaction Group](https://dig.cmu.edu/)
- [Data & Design Group](https://data-and-design.org/)
- [Data Semantics Lab](https://www.datasemanticslab.org/)
- [Qianwen Wang's Lab Website @ UMN](https://qianwen.info/)

## License

The site's code is released under the [MIT License](LICENSE).
