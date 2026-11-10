import type { CodeBlockTokens } from "@erbium/ui/blocks/code-block";
import { createRequestCache } from "@/content/request-cache";

export interface ExampleSourceFile {
  path: string;
  source: string;
  tokens?: CodeBlockTokens;
}

// The build writes these files; the check guards against a stale or partial response.
const isTokens = (value: unknown): value is CodeBlockTokens =>
  typeof value === "object" && value !== null && "tokens" in value && Array.isArray(value.tokens);

const isExampleSourceFile = (value: unknown): value is ExampleSourceFile =>
  typeof value === "object" &&
  value !== null &&
  "path" in value &&
  typeof value.path === "string" &&
  "source" in value &&
  typeof value.source === "string" &&
  (!("tokens" in value) || isTokens(value.tokens));

const isExampleSourceFileList = (value: unknown): value is ExampleSourceFile[] =>
  Array.isArray(value) && value.every(isExampleSourceFile);

const exampleSource = createRequestCache(async (key): Promise<ExampleSourceFile[]> => {
  const response = await fetch(`/examples/${encodeURIComponent(key)}.json`);

  if (!response.ok) {
    throw new Error("Example source unavailable");
  }

  const data: unknown = await response.json();

  if (!isExampleSourceFileList(data)) {
    throw new Error("Example source unavailable");
  }

  return data;
});

/** Source files for one example, highlighted at build time. Reads share one request. */
export const exampleSourceRequest = (name: string, slug: string) =>
  exampleSource(`${name}-${slug}`);
