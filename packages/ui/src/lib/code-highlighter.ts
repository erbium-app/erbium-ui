import type { HighlighterCore, TokensResult } from "shiki/core";

const languages = {
  ts: () => import("shiki/langs/typescript.mjs"),
  tsx: () => import("shiki/langs/tsx.mjs"),
  js: () => import("shiki/langs/javascript.mjs"),
  jsx: () => import("shiki/langs/jsx.mjs"),
  json: () => import("shiki/langs/json.mjs"),
  css: () => import("shiki/langs/css.mjs"),
  html: () => import("shiki/langs/html.mjs"),
  shell: () => import("shiki/langs/shellscript.mjs"),
  yaml: () => import("shiki/langs/yaml.mjs"),
  python: () => import("shiki/langs/python.mjs"),
  sql: () => import("shiki/langs/sql.mjs"),
  markdown: () => import("shiki/langs/markdown.mjs"),
};
const aliases: Record<string, string> = {
  typescript: "ts",
  javascript: "js",
  bash: "shell",
  sh: "shell",
  shellscript: "shell",
  yml: "yaml",
  py: "python",
  md: "markdown",
};
type Language = keyof typeof languages;
const names: Record<Language, string> = {
  ts: "typescript",
  tsx: "tsx",
  js: "javascript",
  jsx: "jsx",
  json: "json",
  css: "css",
  html: "html",
  shell: "shellscript",
  yaml: "yaml",
  python: "python",
  sql: "sql",
  markdown: "markdown",
};
let highlighter: Promise<HighlighterCore> | undefined;
const languageRequests = new Map<Language, Promise<void>>();

export function normalizeCodeLanguage(language: string) {
  const name = language.trim().toLowerCase();
  return aliases[name] ?? name;
}

function getHighlighter() {
  highlighter ??= Promise.all([
    import("shiki/core"),
    import("shiki/engine/javascript"),
    import("shiki/themes/vitesse-light.mjs"),
    import("shiki/themes/vitesse-dark.mjs"),
  ])
    .then(([core, engine, light, dark]) =>
      core.createHighlighterCore({
        engine: engine.createJavaScriptRegexEngine(),
        langs: [],
        themes: [light.default, dark.default],
      }),
    )
    .catch((error: unknown) => {
      highlighter = undefined;
      throw error;
    });
  return highlighter;
}

// One runtime and one in-flight grammar load per language, shared by every block.
async function tokenizeCode(code: string, language: string) {
  const instance = await getHighlighter();
  const normalized = normalizeCodeLanguage(language);
  let lang = "text";
  if (Object.hasOwn(languages, normalized)) {
    const key = normalized as Language;
    lang = names[key];
    if (!instance.getLoadedLanguages().includes(lang)) {
      let request = languageRequests.get(key);
      if (!request) {
        request = languages[key]()
          .then((module) => instance.loadLanguage(module.default))
          .finally(() => languageRequests.delete(key));
        languageRequests.set(key, request);
      }
      await request;
    }
  }
  return instance.codeToTokens(code, {
    lang,
    themes: { light: "vitesse-light", dark: "vitesse-dark" },
    defaultColor: false,
  });
}

const cache = new Map<string, { result: TokensResult; size: number }>();
const requests = new Map<string, Promise<TokensResult>>();
let cacheSize = 0;
const maxCacheSize = 2 * 1024 * 1024;

export function highlightCode(code: string, language: string): Promise<TokensResult> {
  const normalized = normalizeCodeLanguage(language);
  const key = `${normalized}\u0000${code}`;
  const cached = cache.get(key);
  if (cached) {
    cache.delete(key);
    cache.set(key, cached);
    return Promise.resolve(cached.result);
  }
  const pending = requests.get(key);
  if (pending) return pending;
  const request = tokenizeCode(code, normalized)
    .then((result) => {
      const size = code.length * 2 + JSON.stringify(result.tokens).length * 2;
      if (size <= maxCacheSize) {
        cache.set(key, { result, size });
        cacheSize += size;
        while (cache.size > 100 || cacheSize > maxCacheSize) {
          const oldest = cache.keys().next().value;
          if (oldest === undefined) break;
          cacheSize -= cache.get(oldest)?.size ?? 0;
          cache.delete(oldest);
        }
      }
      return result;
    })
    .finally(() => requests.delete(key));
  requests.set(key, request);
  return request;
}
