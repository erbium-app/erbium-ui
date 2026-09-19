# Client directive policy

- Do not add `"use client"` directives. This monorepo uses Vite, Astro, and native React runtimes rather than React Server Components.
- Do not inject `"use client"` through bundler banners or generated output.
- React hooks and browser APIs do not require a client directive in this repository.
