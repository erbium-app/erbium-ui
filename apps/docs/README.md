# Documentation website

Astro 7.3.5 requires TypeScript 6 for `astro check`; TypeScript 7.0 is not supported
by that checker. The docs app uses `catalog:astro` (`^6.0.3`) independently of the
Showcase stable compiler and the workspace `next` compiler. Taze limits TypeScript
updates to minor releases so a dependency update cannot cross that compatibility
boundary. Revisit this catalog when Astro supports the newer compiler. The current
`docs:typecheck` script runs `tsc` and checks TypeScript/TSX files, not `.astro` files.

Every canonical HTML route has a 1200×630 JPEG social card. `src/build/seo/og-pages.ts`
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

Astro shell primitives live in `src/components/primitives/`, compositions in `src/components/shell/`, and page layouts in `src/layouts/`. The adapters share styling definitions with the React library; see [their API notes](src/components/primitives/README.md).

Introduction is the homepage at `/`, rendered directly by `src/pages/index.astro` from `@erbium/content/introduction.md`. There is no `/docs` index route or homepage redirect. Navigation, search, social metadata, and agent resources use `/` as its canonical route.

UI components use `/docs/components/{name}`, design tokens use `/docs/foundations/{name}`, providers use `/docs/providers/{name}`, helpers use `/docs/utilities/{name}`, and hooks use `/docs/hooks/{name}`. Only canonical page URLs are supported. `packages/content/src/sections.json` assigns each showcase exactly once. Components appear in one alphabetical section; foundations, hooks, utilities, providers, and guides have separate sections. Storybook titles are generated from the same taxonomy and sorted alphabetically. Documentation groups have individual pages without directory landing routes. Navigation, search, and adjacent-page links derive from this classification and `src/content/catalog.ts`; adjacent-page links stay within the same documentation section.

Preview/code tabs preserve the mounted React island when switching panels. Theme choice persists locally, search supports Cmd/Ctrl+K, and mobile navigation uses a native dialog with focus trapping and Escape dismissal.

`showcase-vite-plugin.mjs` preoptimizes the runtime dependencies of the docs, UI, and showcase workspaces in Astro's browser environment. Nested dependency IDs resolve from their owning package. Dev and build caches are separate, and the dev optimizer does not discover new dependencies while navigating lazy examples. Restart the dev server after adding a new npm import to a showcase.

Code highlighting uses `@tanstack/highlight` at build time for both Markdown fences and showcase source panels. Astro's built-in syntax highlighting is disabled. `src/build/markdown/highlight.ts` registers the supported languages; unknown languages render as escaped plaintext. `src/build/markdown/highlight-theme.mjs` maps the Vitesse Light and Dark palettes from `.reference` into semantic token colors. One class-based markup tree supports both themes, and source panel copying preserves the original whitespace.

## Agent documentation

The site publishes a Markdown mirror of every canonical page: append `.md` to
its URL (`/index.md` for the homepage). Component mirrors include the shared
Markdown documentation, every variant description, complete component source,
example helpers, and portable Storybook stories. The header's **Copy Markdown**
button fetches that same artifact; it does not scrape rendered HTML.

`src/build/agent/artifacts.ts` builds the shared page catalog from content, showcase and
UI registry sources. `src/pages/[...resource].ts` serves and statically emits:

- `/llms.txt`: grouped documentation and agent resource index.
- `/llms-full.txt`: complete Markdown and source for all pages.
- `/api/docs.json`: page catalog with canonical, Markdown and JSON URLs.
- `/api/docs/<page-path>.json`: page metadata and complete Markdown.
- `/openapi.json`: the read-only documentation API description.
- `/agent-readability.json`: discovery manifest with emitted resources.
- `/.well-known/agent-skills/index.json` and the Erbium UI usage `SKILL.md`.
- `/sitemap-index.xml` and `/robots.txt`: crawler discovery.

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

`DocumentLayout` owns the Astro client router. The inline `runtime/theme.ts` script applies
browser preferences before the initial paint and carries the theme into incoming
HTML before a swap. Delegated controls share that theme owner; showcase overrides
remain local to their preview. Theme icons are rendered on the server and selected
by CSS, without waiting for hydration. System changes follow the OS until a user
chooses a theme; storage events synchronize tabs and printing temporarily uses light mode.

`DocsLayout` composes `DocumentLayout`, `DocsShell`, and the replaceable page frame.
`DocsShell` persists the entire desktop sidebar, mobile header/navigation, and search
as three named regions. Never persist an ancestor containing the main article.
Astro fetches the destination HTML; persistence preserves shell DOM rather than introducing a partial-HTML API.
Page headings, TOC, metadata, pagination, and React previews belong to the destination
and are replaced on navigation. Persistence applies between docs routes; standalone
404 pages intentionally have no docs shell.

`runtime/navigation.client.ts` owns active links, sidebar scroll restoration,
dialog dismissal, and page focus. Feature custom elements attach listeners with
abortable controllers and clean up on disconnect. Persisted elements can reconnect
during a swap; connection must be idempotent. The shared client router manages
history, document announcements, and asset loading.

`runtime/prefetch.client.ts` warms adjacent and visible sidebar destinations during
idle time, with two background requests at a time. Pointer, keyboard focus, touch,
and search intent start warming immediately. Astro's separate prefetch is disabled
so it does not duplicate these requests. Speculative HTML is parsed once and kept
in a bounded in-memory cache (8 documents, approximately 8 MiB of source text,
three-minute lifetime). The `astro:before-preparation` loader reuses a clone and
preloads any new stylesheets, while Astro retains ownership of history, swaps,
focus, scripts, and announcements. Pages fetched on click are also cached before the swap, so revisits can reuse
pristine markup. Redirects, failures, expired entries, and forms use the normal
router loader. Data saver and offline connections disable speculative requests.
The browser's estimated connection class does not disable warming. HTML has a 60-second browser freshness window after deployment;
a prefetched document can remain available for up to three minutes in an open tab.

Search mounts alongside the shell, never reparents its dialog, and fetches
`/search-index.json` on first open. Successful index loads are reused; failed
requests can be retried by reopening. The search index contains metadata only,
with no document bodies or example source.

Repeated prose, code, navigation, showcase, and static button base recipes live in
cached CSS rather than repeated class attributes. The button base is derived from
the shared UI recipe into `.astro/button.css` when Astro starts; custom, size, and
variant utilities retain precedence. React previews hydrate within 200px of
visibility. The shared entry lists component-level lazy loaders; each component's
variant/dependency map loads separately. Navigation intent warms only the first
preview and its renderer, while viewport page warming fetches HTML only. Browser
previews never import the full story catalog, raw example source, content documents,
or registries. Catalogs supply controls and initial serializable arguments at build
time. Tabs retain the mounted island; route navigation replaces it. Toast examples
alone load the page-level toaster.

Open a page with `?navigation-debug=1` to enable timing diagnostics for that tab.
After each navigation, the root element exposes `data-docs-navigation-ms` (router
preparation through DOM swap) and `data-docs-navigation-cache` (`hit` or `miss`), plus preparation, native-transition,
and swap phase durations.
These measure the content transition, not demo hydration or the following paint.
The document root opts out of view-transition screenshots, and content has no
named transition. Disabling animation alone still incurred snapshot preparation
before Astro could swap cached pages.

Keep experimental client prerendering disabled with this client-router shell.

Component instances must remove listeners
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

## Search indexing

`src/config/site.ts` defines the production origin used by Astro, canonical metadata, structured data, and agent resources. The official `@astrojs/sitemap` integration discovers HTML pages at build time and excludes non-HTML resources. `robots.txt` allows crawling and advertises `/sitemap-index.xml`. Group landing routes stay absent.

Every documentation page includes a unique title, description, canonical URL, Open Graph/Twitter image metadata, and JSON-LD for the website, source-code project, page, and breadcrumbs. Breadcrumbs link directly from the homepage to the page, without linking removed group routes. The custom 404 is noindex and has no canonical pointing at the homepage.

`seo-integration.mjs` emits Cloudflare `_headers` to keep Markdown, JSON/API, registry, and agent discovery copies out of search results while allowing crawlers and agents to read them. Markdown and page JSON copies also advertise their HTML canonical through a `Link` header. Cloudflare workers.dev URLs receive noindex headers. Astro preview does not emulate Cloudflare header rules.

After deployment, verify live headers and 404 status, then submit `/sitemap-index.xml` in Google Search Console and Bing Webmaster Tools. Ownership verification belongs to the domain owner’s account; analytics alone does not verify ownership.

## Architecture boundaries

| Directory                | Responsibility                                                                |
| ------------------------ | ----------------------------------------------------------------------------- |
| `pages/`                 | Routes and static endpoints; delegate presentation to layouts/templates       |
| `layouts/`               | Document metadata and shared docs layout                                      |
| `components/primitives/` | Native Astro adapters; no content, feature, or navigation imports             |
| `components/shell/`      | Persistent navigation and shell composition                                   |
| `components/content/`    | Prose, headings, TOC, pagination                                              |
| `features/`              | Search, code/copy, and showcase components with colocated browser controllers |
| `content/`               | Build-time catalog, search metadata, reference-page assembly                  |
| `runtime/`               | Shared theme and navigation lifecycle                                         |
| `build/`                 | Markdown highlighting, SEO, theme extraction, agent artifacts                 |
| `styles/`                | Shared UI CSS entry and reusable content utility recipes                      |

`packages/ui` owns shared React primitives and tokens. `packages/content` owns
Markdown and classification. `packages/showcase` owns examples and Storybook catalogs.
Keep build-only modules out of runtime imports; type-only imports are allowed.
Primitives depend only on other primitives and shared UI styling helpers. Templates
receive page data from `content/` and compose features; they do not assemble registries.
