# Documentation rendering improvements

- [x] Compile variant descriptions once; omit raw Markdown from browser page data.
- [x] Replace the document server function with lazy per-page modules and Router caching.
- [x] Remove the preview loader waterfall and defer offscreen playground controls.
- [ ] Enable and verify TanStack prerendering with Cloudflare.
- [ ] Verify checks, builds, navigation, previews, controls, source tabs, and missing pages.
- [ ] Document the resulting content and deployment flow.

Each implementation stage is committed after its relevant checks pass. Existing unrelated changes are excluded.
