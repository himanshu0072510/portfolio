# Portfolio — Himanshu Agrahari

A portfolio site built with **Vite + React + TypeScript + Tailwind CSS v4**.
GitHub is wired in two ways, and Gmail is the contact channel.

| Feature | How it works |
| --- | --- |
| **GitHub profile & repos** | Fetched live from the public REST API in the browser, with a baked snapshot as fallback |
| **Contribution graph** | Fetched at build time over GraphQL (needs a token) and stored in `src/data/github.json` |
| **Repo counts, stars, languages** | Read from the live API — never hardcoded |
| **Contact form** | Posts to Formspree, which delivers straight to your Gmail inbox |
| **Contact fallback** | If no Formspree id is set, the form hands off to a prefilled `mailto:` |
| **Direct email** | `imhimanshu758@gmail.com` is linked from the nav, hero, contact and footer |

---

## Quick start

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck + production build into dist/
npm run preview    # serve the production build
npm run fetch:github   # refresh src/data/github.json
```

## Configuration

Copy the example env file and fill in what you need:

```bash
cp .env.example .env
```

| Variable | Needed? | Purpose |
| --- | --- | --- |
| `VITE_FORMSPREE_ID` | For the form | Your Formspree form id, e.g. `abcdwxyz` → the form posts to `https://formspree.io/f/abcdwxyz` |
| `VITE_GITHUB_TOKEN` | Optional | Raises the GitHub API rate limit from 60/hr to 5000/hr for the live stats fetch |
| `VITE_CONTACT_EMAIL` | Optional | Overrides the contact address (defaults to the one in `src/data/profile.ts`) |

### Setting up the Formspree form (5 minutes)

1. Sign up at [formspree.io](https://formspree.io) and create a new form.
2. Point it at `imhimanshu758@gmail.com` as the recipient — messages land in that Gmail inbox.
3. Copy the form id from the endpoint URL (`https://formspree.io/f/<FORM_ID>`).
4. Put it in `.env` as `VITE_FORMSPREE_ID=<FORM_ID>`.
5. Restart the dev server.

Until then the form still works: submitting opens the visitor's mail app with the
message prefilled, addressed to you.

### Refreshing the GitHub data

```bash
GITHUB_TOKEN=ghp_xxx npm run fetch:github   # or: gh auth login && npm run fetch:github
```

This rewrites `src/data/github.json` with the current profile, repos, language
breakdown and the last 52 weeks of contributions. The script falls back to
`gh auth token` if `$GITHUB_TOKEN` is not set.

---

## Editing the content

All hand-written content lives in one file:

```
src/data/profile.ts
```

| What | Where |
| --- | --- |
| Name, headline, bio, location, availability | `profile` |
| Social links | `profile.socials` |
| Skill groups and proficiency bars | `skillGroups` |
| Timeline entries | `experience` |
| Projects that are not public on GitHub | `extraProjects` |

The email address is exported as `EMAIL` from the same file and is used by the
nav, hero, contact form and footer.

---

## Deploying to GitHub Pages

The repo includes a workflow at `.github/workflows/deploy.yml`.

1. Push this folder to a GitHub repository.
2. In the repo, go to **Settings → Pages → Build and deployment → Source**, choose
   **GitHub Actions**.
3. Push to `main` — the workflow builds and publishes the site.

`vite.config.ts` uses `base: './'`, so the same build works from
`himanshu0072510.github.io` (user site), a project page like
`himanshu0072510.github.io/portfolio/`, or a custom domain.

### Keeping private projects in the build

The workflow's automatic `GITHUB_TOKEN` cannot list your private repositories,
so **InkNote** is carried over from the committed `src/data/github.json`
snapshot rather than being re-fetched. To refresh private projects too, add a
classic PAT as a repository secret:

**Settings → Secrets and variables → Actions → New repository secret**

| Secret | Value |
| --- | --- |
| `GITHUB_PAT` | A classic PAT with `repo` scope (needed to read private repos) |

The script then refreshes every repository, private ones included. It never
fails the build — if the API is rate-limited or unreachable, the existing
snapshot is kept and the deploy continues.

---

## Project structure

```
src/
├── components/
│   ├── About.tsx          # bio, spec table, revision history
│   ├── Contact.tsx        # Formspree form + direct channels
│   ├── Counter.tsx        # count-up with a growing transform
│   ├── Footer.tsx
│   ├── GitHubSection.tsx  # live stats, contribution graph, languages
│   ├── Hero.tsx
│   ├── Nav.tsx            # title-block rail, scroll-spy, theme toggle
│   ├── NibStroke.tsx      # the plotted stroke
│   ├── Projects.tsx       # public repos + additional work
│   ├── Section.tsx        # leader-line section heading
│   ├── Sheet.tsx          # bordered panel with registration marks
│   ├── Skills.tsx
│   ├── icons.tsx          # GitHub mark
│   └── stroke.generated.ts  # generated — do not hand-edit
├── data/
│   ├── github.json        # generated — do not hand-edit
│   └── profile.ts         # all hand-written content
├── hooks/
│   ├── useGitHub.ts       # live fetch + fallback
│   ├── useInView.ts       # one-shot "enters the frame" trigger
│   └── useTheme.ts        # theme + crossfade
├── lib/
│   ├── motion.ts          # reduced-motion helpers
│   ├── types.ts
│   └── utils.ts
├── index.css              # design tokens, light/dark themes
├── App.tsx
└── main.tsx
scripts/
├── fetch-github.mjs       # regenerates src/data/github.json
└── generate-stroke.mjs    # regenerates src/components/stroke.generated.ts
```

## Design

The site is a **technical drawing sheet**. That direction comes from the work itself —
InkNote is a stylus pen engine that lays down ink like ink, Gloss reads words in the
sentence you are in. Both are about the feel of a tool on your desk, not a product page.

| | |
| --- | --- |
| **Ground** | Matte black (`#0a0a0a`) with a fine fixed grain, so it reads as a surface rather than a void. Light mode is the same sheet as matte paper (`#e9e8e5`) |
| **Ink** | Chalk (`#ededed`) on black, near-black (`#16161a`) on paper |
| **Accent** | Chalk orange (`#ff7a4d`) — one colour, used only for marks: the stroke, registration ticks, focus rings |
| **Type** | Chivo (display and body) and Chivo Mono, used only where the content is genuinely a measurement |
| **Structure** | Hairline rules and leader lines instead of cards. A box appears only where something is really a container — a form input |

Nothing is glossy. Surfaces are solid rather than translucent, there are no blur or
gradient washes, and buttons are flat with a single ink colour.

### Motion

Motion follows the rules in the **HyperFrames animation skill** (installed at
`.agents/skills/hyperframes-animation`), adapted to a live page rather than a rendered
composition — CSS keyframes and the Web Animations API, no animation library:

- **The stroke in the hero is a real variable-width stroke.** `scripts/generate-stroke.mjs`
  samples a Bézier, offsets it along its normals by a pressure profile, and emits a filled
  outline. It is revealed by a wide stroke travelling the centreline inside an SVG mask.
  `pathLength="100"` normalises the dash units so the length is never guessed, and the
  dash runs on a linear ease — the same ease the nib rides — so the nib tip and the
  growing edge of the ink never drift apart. A pen does not bounce, so neither does this.
- **An arrival is not a fade.** The name rises out of a mask with a binary opacity flip,
  so nothing crossfades into place.
- **Stat bars are scaled, never sized.** The fill is `scaleX` from a left origin with a
  stagger capped so the group reads as one beat.
- **Figures count up while their transform grows**, with tabular digits so the numbers
  keep equal width while they run.
- **A press is tactile**: the dip is fast and linear, the release springs back with a
  little overshoot.
- **The theme toggle is a crossfade, not a per-property tween.** One opaque layer of the
  new ground washes over the page, the theme flips at the peak, and the wash lifts to
  reveal it — so everything that cannot interpolate, fonts and icons included, blends at
  the same instant.

Both palettes were checked against WCAG AA — body text sits at 13:1 or better on every
surface, the accent clears 4.8:1 on both grounds, and control boundaries clear 3:1.

## Notes

- **Themes** — dark by default, follows `prefers-color-scheme`, with a manual toggle in the
  nav. The choice is stored in `localStorage`.
- **Accessibility** — skip link, visible focus rings, per-field error messages wired with
  `aria-describedby`, `role="alert"` on errors, `prefers-reduced-motion` honoured, and a
  `?noanim=1` URL flag that renders everything statically (useful for screenshots).
- **No API key required to view the site** — the GitHub REST API is called anonymously, and
  the baked snapshot covers any rate-limit or network failure.
