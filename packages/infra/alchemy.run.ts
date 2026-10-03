import * as Alchemy from "alchemy";
import * as Cloudflare from "alchemy/Cloudflare";
import * as Effect from "effect/Effect";
import { Path } from "effect/Path";

export default Alchemy.Stack(
  "ErbiumUI",
  {
    providers: Cloudflare.providers(),
    state: Cloudflare.state(),
  },
  Effect.gen(function* () {
    const { stage } = yield* Alchemy.Stack;
    if (stage !== "prod") {
      return yield* Effect.die(
        new Error("This stack deploys only to prod. Run bun run deploy from the repository root."),
      );
    }
    const path = yield* Path;
    const analytics = yield* Cloudflare.Rum.Site("DocsAnalytics", {
      host: "ui.erbium.app",
      autoInstall: false,
    });
    const docs = yield* Cloudflare.Website.Astro("Docs", {
      rootDir: path.resolve(import.meta.dirname, "../../apps/docs"),
      astro: { output: "static" },
      prerenderEnvironment: "node",
      assets: { htmlHandling: "drop-trailing-slash" },
      domain: "ui.erbium.app",
      env: { PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN: analytics.siteToken },
      observability: {
        enabled: true,
        logs: { enabled: true, invocationLogs: true, headSamplingRate: 1, persist: true },
        traces: { enabled: false },
      },
      // Docs also reads content and registry sources from disk, outside the module graph.
      memo: {
        workspaces: [
          { cwd: "../../packages/ui" },
          { cwd: "../../packages/showcase" },
          { cwd: "../../packages/content" },
        ],
      },
    });

    return { docsUrl: docs.url.as<string>(), analyticsSiteId: analytics.siteTag };
  }),
);
