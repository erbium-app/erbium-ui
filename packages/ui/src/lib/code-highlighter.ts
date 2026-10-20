import type { HighlighterCore, TokensResult } from "shiki/core";

const languages = {
  css: async () => await import("shiki/langs/css.mjs"),
  html: async () => await import("shiki/langs/html.mjs"),
  js: async () => await import("shiki/langs/javascript.mjs"),
  json: async () => await import("shiki/langs/json.mjs"),
  jsx: async () => await import("shiki/langs/jsx.mjs"),
  markdown: async () => await import("shiki/langs/markdown.mjs"),
  python: async () => await import("shiki/langs/python.mjs"),
  shell: async () => await import("shiki/langs/shellscript.mjs"),
  sql: async () => await import("shiki/langs/sql.mjs"),
  ts: async () => await import("shiki/langs/typescript.mjs"),
  tsx: async () => await import("shiki/langs/tsx.mjs"),
  yaml: async () => await import("shiki/langs/yaml.mjs"),
};

const aliases: Record<string, string> = {
  bash: "shell",
  javascript: "js",
  md: "markdown",
  py: "python",
  sh: "shell",
  shellscript: "shell",
  typescript: "ts",
  yml: "yaml",
};

type Language = keyof typeof languages;

const names: Record<Language, string> = {
  css: "css",
  html: "html",
  js: "javascript",
  json: "json",
  jsx: "jsx",
  markdown: "markdown",
  python: "python",
  shell: "shellscript",
  sql: "sql",
  ts: "typescript",
  tsx: "tsx",
  yaml: "yaml",
};

let highlighter: Promise<HighlighterCore> | undefined;
const languageRequests = new Map<Language, Promise<void>>();

export const normalizeCodeLanguage = (language: string) => {
  const name = language.trim().toLowerCase();

  return aliases[name] ?? name;
};

const getHighlighter = async () => {
  highlighter ??= Promise.all([
    import("shiki/core"),
    import("shiki/engine/javascript"),
    import("shiki/themes/vitesse-light.mjs"),
    import("shiki/themes/vitesse-dark.mjs"),
  ])
    .then(
      async ([core, engine, light, dark]) =>
        await core.createHighlighterCore({
          engine: engine.createJavaScriptRegexEngine(),
          langs: [],
          themes: [light.default, dark.default],
        }),
    )
    .catch((error: unknown) => {
      highlighter = undefined;
      throw error;
    });

  return await highlighter;
};

// One runtime and one in-flight grammar load per language, shared by every block.
const tokenizeCode = async (code: string, language: string) => {
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
          .then(async (module) => {
            await instance.loadLanguage(module.default);
          })
          .finally(() => languageRequests.delete(key));
        languageRequests.set(key, request);
      }

      await request;
    }
  }

  return instance.codeToTokens(code, {
    defaultColor: false,
    lang,
    themes: { dark: "vitesse-dark", light: "vitesse-light" },
  });
};

const cache = new Map<string, { result: TokensResult; size: number }>();
const requests = new Map<string, Promise<TokensResult>>();
let cacheSize = 0;
const maxCacheSize = 2 * 1024 * 1024;

export const highlightCode = async (code: string, language: string): Promise<TokensResult> => {
  const normalized = normalizeCodeLanguage(language);
  const key = `${normalized}\u0000${code}`;
  const cached = cache.get(key);

  if (cached) {
    cache.delete(key);
    cache.set(key, cached);

    return cached.result;
  }

  const pending = requests.get(key);

  if (pending) {
    return await pending;
  }

  const request = tokenizeCode(code, normalized)
    .then((result) => {
      const size = code.length * 2 + JSON.stringify(result.tokens).length * 2;

      if (size <= maxCacheSize) {
        cache.set(key, { result, size });
        cacheSize += size;

        while (cache.size > 100 || cacheSize > maxCacheSize) {
          const oldest = cache.keys().next().value;

          if (oldest === undefined) {
            break;
          }

          cacheSize -= cache.get(oldest)?.size ?? 0;
          cache.delete(oldest);
        }
      }

      return result;
    })
    .finally(() => requests.delete(key));

  requests.set(key, request);

  return await request;
};
