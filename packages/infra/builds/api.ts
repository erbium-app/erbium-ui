import { CloudflareEnvironment } from "alchemy/Cloudflare";
import * as Effect from "effect/Effect";
import * as Redacted from "effect/Redacted";
import * as Schema from "effect/Schema";

export class CloudflareBuildsError extends Error {
  constructor(
    readonly status: number,
    readonly path: string,
  ) {
    super(
      `Cloudflare Builds ${path} failed (HTTP ${status}). Check the GitHub App installation and Workers Builds permissions.`,
    );
  }
}

export const request = <A>(
  accountId: string,
  path: string,
  schema: Schema.ConstraintDecoder<A>,
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" = "GET",
  body?: object,
) =>
  Effect.gen(function* () {
    const credentials = yield* yield* CloudflareEnvironment;
    const headers = new Headers({ "Content-Type": "application/json" });
    if (credentials.type === "apiKey") {
      headers.set("X-Auth-Key", Redacted.value(credentials.apiKey));
      headers.set("X-Auth-Email", Redacted.value(credentials.email));
    } else {
      const token = credentials.type === "oauth" ? credentials.accessToken : credentials.apiToken;
      headers.set("Authorization", `Bearer ${Redacted.value(token)}`);
    }
    return yield* Effect.tryPromise(async () => {
      const options: RequestInit = {
        method,
        headers,
        signal: AbortSignal.timeout(30_000),
      };
      if (body !== undefined) {
        if (method === "GET") {
          throw new Error("GET requests cannot include a body.");
        }
        options.body = JSON.stringify(body);
      }
      const response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${accountId}${path}`,
        options,
      );
      // Never include response/request bodies: token and environment APIs contain secrets.
      if (!response.ok) {
        throw new CloudflareBuildsError(response.status, path);
      }
      const envelope = Schema.decodeUnknownSync(
        Schema.Struct({ success: Schema.Boolean, result: schema }),
      )(await response.json());
      if (!envelope.success) {
        throw new CloudflareBuildsError(response.status, path);
      }
      return envelope.result;
    });
  });

export const remove = (accountId: string, path: string) =>
  request(accountId, path, Schema.Unknown, "DELETE").pipe(
    Effect.catch((error) =>
      error.cause instanceof CloudflareBuildsError && error.cause.status === 404
        ? Effect.void
        : Effect.fail(error),
    ),
  );
