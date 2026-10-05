import * as Alchemy from "alchemy";
import * as Cloudflare from "alchemy/Cloudflare";
import { CloudflareEnvironment } from "alchemy/Cloudflare";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import { readFileSync } from "node:fs";
import { BuildToken, buildTokenProvider } from "./builds/build-token.ts";
import { BuildTrigger, buildTriggerProvider } from "./builds/build-trigger.ts";

export default Alchemy.Stack(
  "ErbiumUIBuilds",
  {
    providers: Layer.mergeAll(buildTokenProvider(), buildTriggerProvider()).pipe(
      Layer.provideMerge(Cloudflare.providers()),
    ),
    state: Cloudflare.state(),
  },
  Effect.gen(function* () {
    const { stage } = yield* Alchemy.Stack;
    if (stage !== "prod") {
      return yield* Effect.die(new Error("Workers Builds setup supports only the prod stage."));
    }
    const { accountId } = yield* yield* CloudflareEnvironment;
    const zoneId = yield* Cloudflare.Zone.resolveZoneId({
      accountId,
      zone: "erbium.app",
      hostname: "ui.erbium.app",
    }).pipe(Effect.orDie);
    const token = yield* Cloudflare.ApiToken.UserApiToken("DocsDeployToken", {
      name: "Erbium UI docs deployment",
      policies: [
        {
          effect: "allow",
          permissionGroups: [
            "Workers Scripts Write",
            "Workers KV Storage Write",
            "Secrets Store Write",
            "Account Settings Write",
          ],
          resources: { [`com.cloudflare.api.account.${accountId}`]: "*" },
        },
        {
          effect: "allow",
          permissionGroups: ["Zone Read", "DNS Write"],
          resources: { [`com.cloudflare.api.account.zone.${zoneId}`]: "*" },
        },
      ],
    });
    const buildToken = yield* BuildToken("DocsBuildToken", {
      name: "Erbium UI docs",
      tokenId: token.tokenId,
      value: token.value,
    });
    const trigger = yield* BuildTrigger("DocsMain", {
      workerStack: "ErbiumUI",
      workerResource: "Docs",
      owner: "erbium-app",
      ownerId: "309436128",
      repository: "erbium-ui",
      repositoryId: "1377085950",
      name: "Erbium UI docs main",
      tokenUuid: buildToken.uuid,
      apiToken: token.value,
      buildCommand: "bun install --frozen-lockfile && bun run build:docs",
      deployCommand: "bun run deploy:ci",
      bunVersion: "1.4.2",
      nodeVersion: readFileSync(new URL("../../.node-version", import.meta.url), "utf8").trim(),
    });
    return { triggerId: trigger.uuid, workerName: trigger.workerName };
  }),
);
