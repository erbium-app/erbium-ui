# Documentation website

The Astro site renders Markdown from `@erbium/content` and interactive React islands from `@erbium/showcase`. Every shared catalog variant appears on its component page, including playground controls, all source files and registry installation commands. Storybook consumes the same catalogs.

Run `bun run showcase` at the workspace root to start both sites. Authoring instructions are in [the showcase package](../../packages/showcase/README.md). Validate synchronization with `bun run showcase:check`.

The registry integration serves `/r/ui/{name}.json` and `/r/examples/{name}.json` locally and copies the canonical package artifacts into the static build. No app-specific copies of examples or Markdown are maintained.

The site shell takes its layout cues from coss ui: a compact header, independently scrolling sidebar, and a framed documentation page. Erbium's own tokens, forest-green accent, and surface styles drive the appearance. There is no table of contents.

Astro shell primitives live in `src/components/ui/`, compositions in `src/components/shell/`, and page layouts in `src/layouts/`. The adapters share styling definitions with the React library; see [their API notes](src/components/ui/README.md).

UI components use `/docs/components/{name}`, design tokens use `/docs/foundations/{name}`, providers use `/docs/providers/{name}`, helpers use `/docs/utilities/{name}`, and hooks use `/docs/hooks/{name}`. Legacy component URLs redirect to their canonical section. `src/data/documentation-sections.ts` assigns each showcase exactly once and defines the usage order. Navigation, search, directory pages, and adjacent-page links derive from this classification and `src/data/components.ts`; adjacent-page links stay within the same semantic group.

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
