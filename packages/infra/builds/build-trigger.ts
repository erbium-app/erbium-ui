import { Resource } from "alchemy";
import { Unowned } from "alchemy/AdoptPolicy";
import { CloudflareEnvironment } from "alchemy/Cloudflare";
import { isResolved } from "alchemy/Diff";
import * as Provider from "alchemy/Provider";
import * as Effect from "effect/Effect";
import * as Redacted from "effect/Redacted";
import * as Schema from "effect/Schema";
import { remove, request } from "./api.ts";

const Script = Schema.Struct({
  id: Schema.String,
  tag: Schema.String,
  tags: Schema.optional(Schema.NullOr(Schema.Array(Schema.String))),
});
const Connection = Schema.Struct({ repo_connection_uuid: Schema.String });
const Trigger = Schema.Struct({
  trigger_uuid: Schema.String,
  external_script_id: Schema.String,
  trigger_name: Schema.String,
  build_token_uuid: Schema.String,
  build_command: Schema.String,
  deploy_command: Schema.String,
  root_directory: Schema.String,
  branch_includes: Schema.Array(Schema.String),
  branch_excludes: Schema.Array(Schema.String),
  path_includes: Schema.Array(Schema.String),
  path_excludes: Schema.Array(Schema.String),
  build_caching_enabled: Schema.Boolean,
  repo_connection: Connection,
});

interface Props {
  workerStack: string;
  workerResource: string;
  owner: string;
  ownerId: string;
  repository: string;
  repositoryId: string;
  name: string;
  tokenUuid: string;
  apiToken: Redacted.Redacted<string>;
  buildCommand: string;
  deployCommand: string;
  bunVersion: string;
  nodeVersion: string;
}

interface Attributes {
  accountId: string;
  uuid: string;
  workerName: string;
  configuration: typeof Trigger.Type;
}

export type BuildTrigger = Resource<"Erbium.Cloudflare.BuildTrigger", Props, Attributes>;
export const BuildTrigger = Resource<BuildTrigger>("Erbium.Cloudflare.BuildTrigger");

const findWorker = (accountId: string, props: Props) =>
  Effect.gen(function* () {
    const scripts = yield* request(accountId, "/workers/scripts", Schema.Array(Script));
    const matches = scripts.filter(
      (script) =>
        script.tags?.includes(`alchemy:stack:${props.workerStack}`) &&
        script.tags.includes("alchemy:stage:prod") &&
        script.tags.includes(`alchemy:id:${props.workerResource}`),
    );
    if (matches.length !== 1 || !matches[0]) {
      return yield* Effect.fail(
        new Error(
          "Expected exactly one deployed production Docs Worker. Bootstrap the docs stack before configuring Builds.",
        ),
      );
    }
    return matches[0];
  });

export const buildTriggerProvider = () =>
  Provider.succeed(BuildTrigger, {
    stables: ["uuid", "accountId", "workerName"],
    diff: ({ olds, news }) =>
      Effect.sync(() => {
        if (
          olds &&
          isResolved(news) &&
          (olds.workerStack !== news.workerStack ||
            olds.workerResource !== news.workerResource ||
            olds.repositoryId !== news.repositoryId)
        ) {
          return { action: "replace" } as const;
        }
      }),
    read: Effect.fn(function* ({ output, olds }) {
      const { accountId } = yield* yield* CloudflareEnvironment;
      if (!olds) {
        return undefined;
      }
      const worker = yield* findWorker(output?.accountId ?? accountId, olds);
      const triggers = yield* request(
        accountId,
        `/builds/workers/${worker.tag}/triggers`,
        Schema.Array(Trigger),
      );
      const trigger = triggers.find((item) =>
        output ? item.trigger_uuid === output.uuid : item.trigger_name === olds.name,
      );
      if (!trigger) {
        return undefined;
      }
      const attributes = {
        accountId,
        uuid: trigger.trigger_uuid,
        workerName: worker.id,
        configuration: trigger,
      };
      return output ? attributes : Unowned(attributes);
    }),
    reconcile: Effect.fn(function* ({ news, output }) {
      const { accountId } = yield* yield* CloudflareEnvironment;
      const worker = yield* findWorker(accountId, news);
      // PUT is an upsert. The connection may be shared by other Workers, so we do not delete it.
      const connection = yield* request(accountId, "/builds/repos/connections", Connection, "PUT", {
        provider_type: "github",
        provider_account_id: news.ownerId,
        provider_account_name: news.owner,
        repo_id: news.repositoryId,
        repo_name: news.repository,
      });
      const triggers = yield* request(
        accountId,
        `/builds/workers/${worker.tag}/triggers`,
        Schema.Array(Trigger),
      );
      const existing = triggers.find(
        (trigger) =>
          trigger.trigger_uuid === output?.uuid ||
          (trigger.trigger_name === news.name && trigger.build_token_uuid === news.tokenUuid),
      );
      if (!existing && triggers.length > 0) {
        return yield* Effect.fail(
          new Error(
            "This Worker already has build triggers. Review and adopt the intended trigger instead of creating a second production pipeline.",
          ),
        );
      }
      const desired = {
        external_script_id: worker.tag,
        repo_connection_uuid: connection.repo_connection_uuid,
        build_token_uuid: news.tokenUuid,
        trigger_name: news.name,
        build_command: news.buildCommand,
        deploy_command: news.deployCommand,
        root_directory: "/",
        branch_includes: ["main"],
        branch_excludes: [],
        path_includes: ["*"],
        path_excludes: [],
        build_caching_enabled: false,
      };
      const configuration = yield* request(
        accountId,
        existing ? `/builds/triggers/${existing.trigger_uuid}` : "/builds/triggers",
        Trigger,
        existing ? "PATCH" : "POST",
        desired,
      );
      yield* request(
        accountId,
        `/builds/triggers/${configuration.trigger_uuid}/environment_variables`,
        Schema.Unknown,
        "PATCH",
        {
          BUN_VERSION: { value: news.bunVersion, is_secret: false },
          NODE_VERSION: { value: news.nodeVersion, is_secret: false },
          SKIP_DEPENDENCY_INSTALL: { value: "1", is_secret: false },
          CLOUDFLARE_ACCOUNT_ID: { value: accountId, is_secret: false },
          CLOUDFLARE_API_TOKEN: { value: Redacted.value(news.apiToken), is_secret: true },
        },
      );
      return { accountId, uuid: configuration.trigger_uuid, workerName: worker.id, configuration };
    }),
    delete: ({ output }) => remove(output.accountId, `/builds/triggers/${output.uuid}`),
  });
