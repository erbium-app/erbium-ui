# Client directive policy

- Do not add `"use client"` directives. This monorepo uses Vite, TanStack Start, and native React runtimes rather than React Server Components.
- Do not inject `"use client"` through bundler banners or generated output.
- Exception: `packages/react` (`@erbium-ui/react`) is published to npm for any React framework, including the Next.js App Router. Its source has no directives; `scripts/finalize-dist.mjs` adds `"use client"` to the built client entries listed in `packages/react/entries.json`, and fails if a server entry has one. Add each new entry point to that file.
- React hooks and browser APIs do not require a client directive in this repository.
