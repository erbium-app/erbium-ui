import { Resource } from "alchemy";
import { CloudflareEnvironment } from "alchemy/Cloudflare";
import { isResolved } from "alchemy/Diff";
import * as Provider from "alchemy/Provider";
import * as Effect from "effect/Effect";
import * as Redacted from "effect/Redacted";
import * as Schema from "effect/Schema";
import { remove, request } from "./api.ts";

const Token = Schema.Struct({
  build_token_uuid: Schema.String,
  cloudflare_token_id: Schema.String,
  build_token_name: Schema.String,
});

interface Props {
  tokenId: string;
  value: Redacted.Redacted<string>;
  name: string;
}

interface Attributes {
  accountId: string;
  uuid: string;
  tokenId: string;
  name: string;
}

export type BuildToken = Resource<"Erbium.Cloudflare.BuildToken", Props, Attributes>;
export const BuildToken = Resource<BuildToken>("Erbium.Cloudflare.BuildToken");

export const buildTokenProvider = () =>
  Provider.succeed(BuildToken, {
    stables: ["uuid", "accountId"],
    diff: ({ olds, news }) =>
      Effect.sync(() => {
        if (olds && isResolved(news) && olds.tokenId !== news.tokenId) {
          return { action: "replace" } as const;
        }
      }),
    read: Effect.fn(function* ({ output }) {
      if (!output) {
        return undefined;
      }
      const tokens = yield* request(output.accountId, "/builds/tokens", Schema.Array(Token));
      const token = tokens.find((item) => item.build_token_uuid === output.uuid);
      return token
        ? { ...output, tokenId: token.cloudflare_token_id, name: token.build_token_name }
        : undefined;
    }),
    reconcile: Effect.fn(function* ({ news }) {
      const { accountId } = yield* yield* CloudflareEnvironment;
      const tokens = yield* request(accountId, "/builds/tokens", Schema.Array(Token));
      const existing = tokens.find((token) => token.cloudflare_token_id === news.tokenId);
      const token =
        existing ??
        (yield* request(accountId, "/builds/tokens", Token, "POST", {
          build_token_name: news.name,
          build_token_secret: Redacted.value(news.value),
          cloudflare_token_id: news.tokenId,
        }));
      return {
        accountId,
        uuid: token.build_token_uuid,
        tokenId: token.cloudflare_token_id,
        name: token.build_token_name,
      };
    }),
    delete: ({ output }) => remove(output.accountId, `/builds/tokens/${output.uuid}`),
  });
