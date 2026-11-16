import path from "node:path";
import { parseEnv } from "node:util";
import * as Schema from "effect/Schema";
import { atomicWrite, readText, safePath } from "./project.ts";
import { parseJson } from "./revision.ts";

const configFile = "erbium.config.json";

const decodeConfig = Schema.decodeUnknownSync(
  Schema.Struct({
    registry: Schema.Union([
      Schema.String,
      Schema.Struct({
        url: Schema.String,
        headers: Schema.optionalKey(Schema.Record(Schema.String, Schema.String)),
      }),
    ]),
  }),
);

const http = /^https?:\/\//iu;
const variable = /\$\{(?<key>[a-z_][a-z\d_]*)\}/giu;
const isString = Schema.is(Schema.String);

export const defaultRegistry = "https://ui.erbium.app/r/erbium";

const resolveLocation = (root: string, location: string) => {
  if (!http.test(location)) {
    if (location.trim() === "" || location.includes("://")) {
      throw new Error("Use a registry directory or an HTTP(S) URL.");
    }

    return path.resolve(root, location);
  }

  const url = new URL(location);

  if (url.username || url.password || url.search || url.hash) {
    throw new Error("Registry URLs cannot contain credentials, query parameters, or fragments.");
  }

  return url.href.replace(/\/+$/u, "");
};

const validateHeaders = (location: string, headers: Record<string, string>) => {
  if (Object.keys(headers).length === 0) {
    return;
  }

  const url = http.test(location) ? new URL(location) : undefined;

  if (
    url === undefined ||
    (url.protocol !== "https:" && !["localhost", "127.0.0.1", "[::1]"].includes(url.hostname))
  ) {
    throw new Error("Registry headers require HTTPS or a loopback HTTP URL.");
  }

  for (const [name, template] of Object.entries(headers)) {
    if (!/^[!#$%&'*+.^_`|~\w-]+$/u.test(name) || [...template.matchAll(variable)].length === 0) {
      throw new Error(`Use a valid header name and a value containing a \${VARIABLE} placeholder.`);
    }
  }
};

const loadConfig = async (root: string) => {
  const content = await readText(await safePath(root, configFile));

  if (content === undefined) {
    return null;
  }

  const { registry } = decodeConfig(parseJson(content));

  return isString(registry) ? { url: registry } : registry;
};

export const saveRegistryConfig = async (
  root: string,
  location: string,
  headers: readonly string[],
) => {
  const entries = headers.map((header) => {
    const separator = header.indexOf(":");

    if (separator < 1) {
      throw new Error("Use --header 'Name: value' with an environment placeholder.");
    }

    return [header.slice(0, separator).trim(), header.slice(separator + 1).trim()] as const;
  });

  const templates = Object.fromEntries(entries);
  validateHeaders(resolveLocation(root, location), templates);

  const registry = entries.length === 0 ? location : { url: location, headers: templates };
  const file = await safePath(root, configFile);
  const content = `${JSON.stringify({ registry }, null, 2)}\n`;

  if ((await readText(file)) === content) {
    return [];
  }

  await atomicWrite(file, content);

  return [configFile];
};

export const hasRegistryConfig = async (root: string) => (await loadConfig(root)) !== null;

export const registryRequest = async (root: string, override: string) => {
  const config = await loadConfig(root);
  const location = resolveLocation(root, override || (config?.url ?? defaultRegistry));

  const templates =
    config?.headers !== undefined && location === resolveLocation(root, config.url)
      ? config.headers
      : {};

  validateHeaders(location, templates);

  if (!http.test(location)) {
    return { location, headers: undefined };
  }

  const url = new URL(location);
  const headers = new Headers();

  if (Object.keys(templates).length > 0) {
    const [env, local] = await Promise.all(
      [".env", ".env.local"].map(async (file) =>
        parseEnv((await readText(path.join(root, file))) ?? ""),
      ),
    );

    const fileEnv = new Map(Object.entries({ ...env, ...local }));

    for (const [name, template] of Object.entries(templates)) {
      const value = template.replaceAll(variable, (_match, key: string) => {
        const secret = process.env[key] ?? fileEnv.get(key);

        if (secret === undefined || secret.length === 0) {
          throw new Error(`Set ${key} to authenticate with the registry.`);
        }

        return secret;
      });

      try {
        headers.set(name, value);
      } catch {
        throw new Error("Invalid value for an authenticated registry header.");
      }
    }
  } else if (
    url.origin !== new URL(defaultRegistry).origin &&
    (process.env.ERBIUM_REGISTRY_TOKEN ?? "") !== ""
  ) {
    validateHeaders(location, { Authorization: `Bearer \${ERBIUM_REGISTRY_TOKEN}` });

    try {
      headers.set("Authorization", `Bearer ${process.env.ERBIUM_REGISTRY_TOKEN}`);
    } catch {
      throw new Error("Invalid ERBIUM_REGISTRY_TOKEN value.");
    }
  }

  return { location, headers: [...headers].length === 0 ? undefined : headers };
};
