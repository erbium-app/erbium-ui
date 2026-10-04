# Documentation website

Astro 7.3.5 requires TypeScript 6 for `astro check`; TypeScript 7.0 is not supported
by that checker. The docs app uses `catalog:astro` (`^6.0.3`) independently of the
Showcase stable compiler and the workspace `next` compiler. Taze limits TypeScript
updates to minor releases so a dependency update cannot cross that compatibility
boundary. Revisit this catalog when Astro supports the newer compiler. The current
`docs:typecheck` script runs `tsc` and checks TypeScript/TSX files, not `.astro` files.

Every canonical HTML route has a 1200×630 JPEG social card. `src/lib/og-pages.ts`
derives titles, descriptions, and section labels from the shared page catalog;
`src/pages/og/[...path].jpg.ts` generates the images at build time with Satori and
Sharp. The renderer uses the official Erbium mark and bundled OFL-licensed Geist
fonts, with no build-time font downloads. The shared site layout emits absolute
Open Graph and Twitter card URLs. Image paths include a content hash; increment
the design version in `og-pages.ts` when changing the card's appearance. Redirects
share their destination's metadata, and machine-readable resources do not need
social cards.

The Astro site renders Markdown from `@erbium/content` and interactive React islands from `@erbium/showcase`. Every shared catalog variant appears on its component page, including playground controls, all source files and registry installation commands. Storybook consumes the same catalogs.

Run `bun run showcase` at the workspace root to start both sites. Authoring instructions are in [the showcase package](../../packages/showcase/README.md). Validate synchronization with `bun run showcase:check`.

The registry integration serves `/r/ui/{name}.json` and `/r/examples/{name}.json` locally and copies the canonical package artifacts into the static build. No app-specific copies of examples or Markdown are maintained.

The site shell uses an independently scrolling sidebar with the brand and search above navigation and GitHub and theme controls below it. Documentation pages share a consistent content column, reserving space for an optional table of contents on wide screens. Erbium's own tokens, forest-green accent, and surface styles drive the appearance.

Astro shell primitives live in `src/components/ui/`, compositions in `src/components/shell/`, and page layouts in `src/layouts/`. The adapters share styling definitions with the React library; see [their API notes](src/components/ui/README.md).

Introduction is the homepage at `/`, rendered directly by `src/pages/index.astro` from `@erbium/content/introduction.md`. There is no `/docs` index route or homepage redirect. Navigation, search, social metadata, and agent resources use `/` as its canonical route.

UI components use `/docs/components/{name}`, design tokens use `/docs/foundations/{name}`, providers use `/docs/providers/{name}`, helpers use `/docs/utilities/{name}`, and hooks use `/docs/hooks/{name}`. Legacy component URLs redirect to their canonical section. `packages/content/src/sections.json` assigns each showcase exactly once. Components appear in one alphabetical section; foundations, hooks, utilities, providers, and guides have separate sections. Storybook titles are generated from the same taxonomy and sorted alphabetically. Documentation groups have individual pages without directory landing routes. Navigation, search, and adjacent-page links derive from this classification and `src/data/components.ts`; adjacent-page links stay within the same documentation section.

Preview/code tabs preserve the mounted React island when switching panels. Theme choice persists locally, search supports Cmd/Ctrl+K, and mobile navigation uses a native dialog with focus trapping and Escape dismissal.

`showcase-vite-plugin.mjs` preoptimizes the runtime dependencies of the docs, UI, and showcase workspaces in Astro's browser environment. Nested dependency IDs resolve from their owning package. Dev and build caches are separate, and the dev optimizer does not discover new dependencies while navigating lazy catalogs. Restart the dev server after adding a new npm import to a showcase.

Code highlighting uses `@tanstack/highlight` at build time for both Markdown fences and showcase source panels. Astro's built-in syntax highlighting is disabled. `src/lib/highlight.ts` registers the supported languages; unknown languages render as escaped plaintext. `src/lib/highlight-theme.mjs` maps the Vitesse Light and Dark palettes from `.reference` into semantic token colors. One class-based markup tree supports both themes, and source panel copying preserves the original whitespace.

## Agent documentation

The site publishes a Markdown mirror of every canonical page: append `.md` to
its URL (`/index.md` for the homepage). Component mirrors include the shared
Markdown documentation, every variant description, complete component source,
example helpers, and portable Storybook stories. The header's **Copy Markdown**
button fetches that same artifact; it does not scrape rendered HTML.

`src/lib/agent-pages.ts` builds the shared page catalog from content, showcase and
UI registry sources. `src/pages/[...resource].ts` serves and statically emits:

- `/llms.txt`: grouped documentation and agent resource index.
- `/llms-full.txt`: complete Markdown and source for all pages.
- `/api/docs.json`: page catalog with canonical, Markdown and JSON URLs.
- `/api/docs/<page-path>.json`: page metadata and complete Markdown.
- `/openapi.json`: the read-only documentation API description.
- `/agent-readability.json`: discovery manifest with emitted resources.
- `/.well-known/agent-skills/index.json` and the Erbium UI usage `SKILL.md`.
- `/sitemap.xml` and `/robots.txt`: crawler discovery.

HTML pages advertise their Markdown mirror through an alternate link. All
artifacts work in Astro development and on a static host without a backend.
Source files are build inputs and are not bundled into browser islands. New
standalone routes must be added to the shared page catalog; component routes are
included automatically through the showcase manifest and navigation taxonomy.

Base UI reference sections are authored once in
`packages/content/references/<component>.md`. The docs render their links with
shared buttons; Storybook includes the same section in its component description.
Agent exports and generated portable Storybook stories also consume these files.
After editing references, run `bun run showcase:registry` to refresh portable stories.

## Navigation stability

`SiteLayout` owns the Astro client router. The inline `theme-init.ts` script applies
browser preferences before the initial paint and carries the theme into incoming
HTML before a swap. Delegated controls share that theme owner; showcase overrides
remain local to their preview. Theme icons are rendered on the server and selected
by CSS, without waiting for hydration. System changes follow the OS until a user
chooses a theme; storage events synchronize tabs and printing temporarily uses light mode.

The sidebar navigation and search island persist across routes. Navigation updates
active links after each swap and restores the sidebar offset after Astro restores
focus. Initial loads and destinations reached outside the sidebar reveal an
otherwise hidden active link; ordinary sidebar clicks preserve the exact offset.
Documentation links prefetch on hover. Component instances must remove listeners
on disconnect, or delegate through a single document listener.

When changing the shell, verify in development and with `bun run docs:build` plus
`bun run --cwd apps/docs preview`:

- Open a deep component URL and confirm its active sidebar link is visible.
- Scroll the sidebar, click nearby links, and confirm its position stays unchanged.
- Use search, Previous/Next, and Back/Forward; confirm active links and titles update.
- Navigate in both themes; confirm controls and preview icons never flash the other theme.
- Override a showcase theme, then change the site theme; the local override should hold.
- Open and dismiss search repeatedly with Cmd/Ctrl+K, including after navigation.
- Open mobile navigation, follow a link, dismiss with Escape, and resize to desktop.
- Check thin scrollbars and fades at the top, middle, and bottom in the built preview.
- Check OS theme following, cross-tab preference updates, and light-mode print preview.

Keep scroll timelines separate from animation shorthand in production CSS. The docs
use Tailwind optimization without minification and esbuild for final CSS minification
to avoid Lightning CSS folding the shadcn fade timeline into an unsupported shorthand.
