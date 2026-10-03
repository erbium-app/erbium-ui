# Cloudflare infrastructure

This workspace owns the `ErbiumUI` Alchemy stack. Currently its only public surface
is `Docs` (`apps/docs`). The website playground and Storybook remain development
tools. `packages/infra/alchemy.run.ts` composes deployable surfaces in one stack,
following Alchemy's [single-stack monorepo example](https://alchemy.run/project-structure/monorepo-single-stack/).
App paths are anchored to `import.meta.dirname`, so resource resolution does not
depend on the directory where the CLI runs. Add future public surfaces to this
stack and return their typed URLs alongside `docsUrl`. Extract resource modules
when their configuration or bindings need to be shared with app code.

Alchemy and its frontend integration are pinned to `2.0.0-beta.80`. Update them
together. This uses the Effect-based Alchemy v2 API, not v1's Astro adapter.

## Deploy

Run commands from the repository root:

```sh
bun install
bun run infra:profile --add Cloudflare
bun run infra:plan --stage prod
bun run deploy:prod
```

The profile command supports OAuth or an API token. Select the Cloudflare account
that owns the `erbium.app` zone. Production attaches `ui.erbium.app` as a custom
domain; other stages use their isolated Workers URLs:

```sh
bun run infra:plan --stage staging
bun run deploy --stage staging
```

For CI, provide `CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_API_TOKEN` through the
runner's secret environment and run `bun run deploy:prod`. The token needs Workers
Scripts and the permissions needed for Alchemy's Cloudflare state backend and
custom domains (Workers KV Storage, Workers Custom Domains, Secrets Store Write,
Zone Read and DNS Edit). See [Cloudflare setup](https://alchemy.run/cloudflare/setup/) and
[CI configuration](https://alchemy.run/environments/ci/).

State is stored in Cloudflare through `Cloudflare.state()` so local and CI runs
share the same stack state. Always use the same stage and account when updating
an existing deployment. To remove a stage and its managed resources explicitly:

```sh
bun run infra:destroy --stage staging
```

## Astro assets

`Cloudflare.Website.Astro` loads the existing Astro config and builds the docs.
The explicit `astro.output: "static"` deploys only static assets, without a server
bundle or session KV namespace (Alchemy skips sessions for static output).
Node prerendering preserves the existing docs
build's filesystem-based content and registry generation. Cloudflare serves
extensionless HTML with trailing slashes removed; unknown paths return 404 rather
than falling back to the home page. The site keeps its production canonical URL
on all stages.

There is no Wrangler config or `@astrojs/cloudflare` adapter to maintain. The
frontend integration lives in the docs workspace where Alchemy resolves it.
Build memoization includes the docs, all three shared source workspaces and the
root lockfile, so shared component/content changes invalidate deployment builds.
The explicit workspace list includes filesystem inputs from the docs content and
registry plugins, which module-graph auto-detection alone cannot cover.

Validate with `bun run check`, `bun run infra:typecheck` and `bun run docs:build`.
Planning and deploying additionally require Cloudflare credentials.

Reference: [Alchemy Astro resource](https://alchemy.run/cloudflare/frontend/astro/).
