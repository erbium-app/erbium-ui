# Cloudflare infrastructure

This workspace owns the `ErbiumUI` Alchemy stack. Its public surface
is `Docs` (`apps/docs`, TanStack Start). The website playground and Storybook remain development
tools. `packages/infra/alchemy.run.ts` composes deployable surfaces in one stack,
following Alchemy's [single-stack monorepo example](https://alchemy.run/project-structure/monorepo-single-stack/).
App paths are anchored to `import.meta.dirname`, so resource resolution does not
depend on the directory where the CLI runs. Add future public surfaces to this
stack and return their typed URLs alongside `docsUrl`. Extract resource modules
when their configuration or bindings need to be shared with app code.

Alchemy, the Cloudflare provider (`@alchemy.run/cloudflare`) and the frontend
integration are pinned to `2.0.0-beta.84`. Since `2.0.0-beta.84` Cloudflare lives
in its own package: import `Cloudflare` from `@alchemy.run/cloudflare` and the
stack runtime from `alchemy`. Update all three together. This uses the
Effect-based Alchemy v2 API.

## Deploy

Run commands from the repository root:

```sh
bun install
bun run infra profile --add Cloudflare
bun run infra plan
bun run deploy
```

The production deployment is `prod` at `ui.erbium.app`. The root commands
explicitly select the `default` Alchemy profile. Configure that profile with the
Cloudflare account that owns the deployment domain.
The profile command supports OAuth or an API token. Direct production Alchemy commands must pass `--stage prod --profile default`.

For CI, provide `CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_API_TOKEN` through the
runner's secret environment and run `bun run deploy:ci`. Use your deployment
account's ID and a token with Workers Scripts and the
permissions needed for Alchemy's Cloudflare state backend and custom domains
(Workers KV Storage, Account Settings Write, Secrets Store Write, Zone Read and
DNS Edit). See [Cloudflare setup](https://alchemy.run/cloudflare/setup/) and
[CI configuration](https://alchemy.run/environments/ci/).

State is stored in Cloudflare through `Cloudflare.state()` so local and CI runs
share the same production stack state. To remove the production deployment and
its managed resources explicitly, run `bun run infra destroy`.

## Start site

`Cloudflare.Website.Vite` builds `apps/docs` (TanStack Start) and serves
`ui.erbium.app` from the Worker. Markdown, example sources and social images
compile in Node before deployment; documentation HTML renders in the Worker.
Cloudflare serves extensionless HTML with trailing slashes removed; unknown
paths are handled by the Start request handler, which returns 404 rather than
falling back to the home page. The site keeps its production canonical URL.

There is no Wrangler config to maintain. The
frontend integration lives in the docs workspace where Alchemy resolves it.
Build memoization includes the app, all three shared source workspaces and the
root lockfile, so shared component/content changes invalidate deployment builds.
The explicit workspace list includes filesystem inputs from the docs content and
registry plugins, which module-graph auto-detection alone cannot cover.

Validate with `bun run check`, `bun run infra:typecheck` and `bun run docs:build`.
Planning and deploying additionally require Cloudflare credentials.

Reference: [Alchemy Vite resource](https://alchemy.run/cloudflare/frontend/vite/).

## Static-site monitoring

The stack manages a Cloudflare Web Analytics site for `ui.erbium.app` through
`Cloudflare.Rum.Site("DocsAnalytics")`. Alchemy passes its public site token to
the Start build as `VITE_CLOUDFLARE_ANALYTICS_TOKEN`; the root route
embeds Cloudflare's deferred beacon in production HTML. Development and builds
without a token omit the beacon. Keep automatic beacon injection
disabled for this hostname to avoid duplicate measurement.

After deployment, view visits, page load performance and Core Web Vitals in
Cloudflare's **Web Analytics** dashboard. Creating the analytics resource requires
the account's **Account Settings Write** API permission (called **Account Settings
Edit** in the dashboard). If this hostname already has an analytics site, review
Alchemy's adoption plan before taking ownership of that existing resource.

Worker logs, invocation logs and traces are explicitly enabled for the
server-rendered Start site. Build errors appear in build output.

`.github/workflows/quality.yml` runs `bun run ready` and infrastructure typechecks
on pull requests and pushes to `main`. The oxlint anti-slop rules come vendored
inside Ultracite (`ultracite/oxlint/anti-slop`), so remote installations need no
separate plugin checkout or pinned commit.

Browser error reporting requires an error-reporting service project and its
public DSN, plus upload credentials for private source maps. Web Analytics does
not capture JavaScript exceptions. No error-reporting service is configured yet.

References: [Web Analytics setup](https://developers.cloudflare.com/web-analytics/get-started/)
and [RUM beacon](https://developers.cloudflare.com/speed/observatory/rum-beacon/).

## Workers Builds

Cloudflare Workers Builds runs installation and deployment remotely for
pushes to `main`. Connect `erbium-app/erbium-ui` to the existing docs Worker in
**Settings > Builds** and authorize the Cloudflare GitHub App for that repository.
Use root directory `/` and these commands:

```sh
# Build command
bun install --frozen-lockfile

# Deploy command (Alchemy builds the Start site and deploys it)
bun run deploy:ci
```

The CI and preview deploy commands fetch missing Git history from `origin` before Alchemy builds the site. The registry uses that history to retain published revisions. The checkout stays on the commit selected by Workers Builds.

Set `BUN_VERSION=1.4.2`, `NODE_VERSION=26.10.0`, and
`SKIP_DEPENDENCY_INSTALL=1`. Configure `CLOUDFLARE_ACCOUNT_ID` and a secret
`CLOUDFLARE_API_TOKEN` with the deployment permissions above. Do not provide a
token-admin credential to the build runner.

Everything `alchemy.run.ts` imports at deploy time (`alchemy`,
`@alchemy.run/cloudflare`, `effect`, `@distilled.cloud/cloudflare` and the Effect
platform peers) is a production dependency of `packages/infra`. Keep it that way:
the deploy runner installs without dev dependencies, so a runtime import declared
in `devDependencies` fails with `Cannot find package 'alchemy'` before the stack
loads.

The Git connection, build trigger and build variables are managed in the Cloudflare
dashboard. Alchemy owns the production Worker, domain, analytics and shared remote
state through `alchemy.run.ts`. Updating this repository does not change dashboard
build settings. No custom Workers Builds providers or token-admin credential are
needed for this pipeline.

Use `bun run infra <command>` for infrastructure operations: `profile`, `plan`,
`deploy`, `deploy:ci`, `typecheck` or `destroy`. The root `deploy` and `deploy:ci`
shortcuts remain available. `bun run infra destroy` removes the production docs
resources; manage the Git connection separately in Cloudflare.

## TanStack Start preview

`bun run deploy:preview:plan` and `bun run deploy:preview` select the separate `preview` stage and `default` profile. Refresh credentials before deployment:

```sh
cd packages/infra
bunx --no-install alchemy profile refresh --profile default --provider Cloudflare
```

Grant Workers Scripts write and Account Settings write for the Worker and Web Analytics site, together with the state backend permissions described above.

The preview uses `Cloudflare.Website.Vite` for `apps/docs`, the existing account workers.dev subdomain, and a separate analytics site. Deployment returns both origins for comparison. Markdown, example sources and social images compile in Node before deployment; documentation HTML renders in the Worker. Invocation logs and traces are enabled for the preview. Browser Web Analytics measures visits and Core Web Vitals; it does not report JavaScript exceptions.

Preview robots and metadata disable indexing while canonical URLs retain the production origin. Local Worker validation uses `bun run docs:build` followed by `bun run docs:preview`.
