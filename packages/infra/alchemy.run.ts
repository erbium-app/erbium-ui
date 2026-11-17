import * as Cloudflare from "@alchemy.run/cloudflare";
import * as Alchemy from "alchemy";
import * as Effect from "effect/Effect";
import { Path } from "effect/Path";
import { getSubdomain } from "@distilled.cloud/cloudflare/workers";

export default Alchemy.Stack(
  "ErbiumUI",
  {
    providers: Cloudflare.providers(),
    state: Cloudflare.state(),
    // Later entries win: the shell and CI runner override packages/infra/.env.
    // Read values with Config.Redacted; add a secrets manager here when one is needed.
    secrets: [Alchemy.Secrets.DotEnv(), Alchemy.Secrets.ProcessEnv()],
  },
  Effect.gen(function* erbiumStack() {
    const { stage } = yield* Alchemy.Stack;
    const path = yield* Path;

    if (stage === "preview") {
      const { accountId } = yield* yield* Cloudflare.CloudflareEnvironment;
      const { subdomain } = yield* getSubdomain({ accountId }).pipe(Effect.orDie);
      const name = "erbium-docs-start-preview";
      const host = `${name}.${subdomain}.workers.dev`;
      const analytics = yield* Cloudflare.Rum.Site("StartAnalytics", { autoInstall: false, host });

      const start = yield* Cloudflare.Website.Vite("DocsStart", {
        assets: { htmlHandling: "drop-trailing-slash", notFoundHandling: "none" },
        compatibility: { date: "2026-08-31" },
        env: {
          VITE_CLOUDFLARE_ANALYTICS_TOKEN: analytics.siteToken,
          VITE_DOCS_PREVIEW: "true",
        },
        memo: {
          workspaces: [
            { cwd: "../../packages/ui" },
            { cwd: "../../packages/showcase" },
            { cwd: "../../packages/content" },
            { cwd: "../../packages/cli" },
          ],
        },
        name,
        observability: {
          enabled: true,
          logs: { enabled: true, headSamplingRate: 1, invocationLogs: true, persist: true },
          traces: { enabled: true, headSamplingRate: 1, persist: true },
        },
        rootDir: path.resolve(import.meta.dirname, "../../apps/docs"),
      });

      return {
        analyticsSiteId: analytics.siteTag,
        prodUrl: "https://ui.erbium.app",
        startUrl: start.url.as<string>(),
      };
    }

    if (stage !== "prod") {
      return yield* Effect.die(
        new Error("This stack deploys only to prod. Run bun run deploy from the repository root."),
      );
    }

    const analytics = yield* Cloudflare.Rum.Site("DocsAnalytics", {
      autoInstall: false,
      host: "ui.erbium.app",
    });

    const docs = yield* Cloudflare.Website.Vite("Docs", {
      assets: { htmlHandling: "drop-trailing-slash", notFoundHandling: "none" },
      compatibility: { date: "2026-08-31" },
      domain: "ui.erbium.app",
      env: { VITE_CLOUDFLARE_ANALYTICS_TOKEN: analytics.siteToken },
      // Docs also reads content and registry sources from disk, outside the module graph.
      memo: {
        workspaces: [
          { cwd: "../../packages/ui" },
          { cwd: "../../packages/showcase" },
          { cwd: "../../packages/content" },
          { cwd: "../../packages/cli" },
        ],
      },
      observability: {
        enabled: true,
        logs: { enabled: true, headSamplingRate: 1, invocationLogs: true, persist: true },
        traces: { enabled: true, headSamplingRate: 1, persist: true },
      },
      rootDir: path.resolve(import.meta.dirname, "../../apps/docs"),
    });

    return { analyticsSiteId: analytics.siteTag, docsUrl: docs.url.as<string>() };
  }),
);
