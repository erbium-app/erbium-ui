# Documentation rendering improvements

- [x] Compile variant descriptions once; omit raw Markdown from browser page data.
- [x] Replace the document server function with lazy per-page modules and Router caching.
- [x] Remove the preview loader waterfall and defer offscreen playground controls.
- [x] Enable and verify TanStack prerendering with Cloudflare.
- [x] Verify checks, builds, navigation, previews, controls, source tabs, and missing pages.
- [x] Document the resulting content and deployment flow.

Each implementation stage is committed after its relevant checks pass. Existing unrelated changes are excluded.

Validation: both docs build modes prerender 92 pages. Browser checks cover guide and component pages, adjacent-page navigation, previews, source tabs, controls/reset, and missing pages. Build scripts verify referenced assets. Changed-file checks and commit hooks pass.

Repository-wide validation remains blocked by existing diagnostics: `bun run check` reports lint errors outside this work, and `bun run docs:typecheck` reports the existing `packages/ui/src/components/kbd.tsx:21` hotkey type incompatibility. No checks or hooks were disabled.
