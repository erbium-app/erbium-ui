import type { GrammarState, HighlighterCore, LanguageRegistration, TokensResult } from "shiki/core";

interface Grammar {
  /** Shiki's name for the language. */
  name: string;
  load: () => Promise<{ default: LanguageRegistration[] }>;
}

// Keyed by the normalized language name. Each grammar loads the first time it is used.
const grammars = new Map<string, Grammar>([
  ["css", { load: async () => await import("shiki/langs/css.mjs"), name: "css" }],
  ["html", { load: async () => await import("shiki/langs/html.mjs"), name: "html" }],
  ["js", { load: async () => await import("shiki/langs/javascript.mjs"), name: "javascript" }],
  ["json", { load: async () => await import("shiki/langs/json.mjs"), name: "json" }],
  ["jsx", { load: async () => await import("shiki/langs/jsx.mjs"), name: "jsx" }],
  ["markdown", { load: async () => await import("shiki/langs/markdown.mjs"), name: "markdown" }],
  ["python", { load: async () => await import("shiki/langs/python.mjs"), name: "python" }],
  ["shell", { load: async () => await import("shiki/langs/shellscript.mjs"), name: "shellscript" }],
  ["sql", { load: async () => await import("shiki/langs/sql.mjs"), name: "sql" }],
  ["ts", { load: async () => await import("shiki/langs/typescript.mjs"), name: "typescript" }],
  ["tsx", { load: async () => await import("shiki/langs/tsx.mjs"), name: "tsx" }],
  ["yaml", { load: async () => await import("shiki/langs/yaml.mjs"), name: "yaml" }],
]);

const aliases = new Map<string, string>([
  ["bash", "shell"],
  ["javascript", "js"],
  ["md", "markdown"],
  ["py", "python"],
  ["sh", "shell"],
  ["shellscript", "shell"],
  ["typescript", "ts"],
  ["yml", "yaml"],
]);

const themes = { dark: "vitesse-dark", light: "vitesse-light" };

let highlighter: Promise<HighlighterCore> | undefined;
const languageRequests = new Map<string, Promise<void>>();

export const normalizeCodeLanguage = (language: string) => {
  const name = language.trim().toLowerCase();

  return aliases.get(name) ?? name;
};

const createHighlighter = async () => {
  const [core, engine, light, dark] = await Promise.all([
    import("shiki/core"),
    import("shiki/engine/javascript"),
    import("shiki/themes/vitesse-light.mjs"),
    import("shiki/themes/vitesse-dark.mjs"),
  ]);

  return await core.createHighlighterCore({
    engine: engine.createJavaScriptRegexEngine(),
    langs: [],
    themes: [light.default, dark.default],
  });
};

const getHighlighter = async () => {
  highlighter ??= createHighlighter();

  try {
    return await highlighter;
  } catch (error) {
    // A failed load is retried by the next caller.
    highlighter = undefined;
    throw error;
  }
};

const loadGrammar = async (instance: HighlighterCore, grammar: Grammar) => {
  const module = await grammar.load();
  await instance.loadLanguage(module.default);
};

// One runtime and one in-flight grammar load per language, shared by every block. Returns Shiki's
// name for the language, or `text` for a language without a grammar.
const resolveLanguage = async (instance: HighlighterCore, normalized: string) => {
  const grammar = grammars.get(normalized);

  if (!grammar) {
    return "text";
  }

  if (!instance.getLoadedLanguages().includes(grammar.name)) {
    let request = languageRequests.get(grammar.name);

    if (!request) {
      request = loadGrammar(instance, grammar);
      languageRequests.set(grammar.name, request);
    }

    try {
      await request;
    } finally {
      languageRequests.delete(grammar.name);
    }
  }

  return grammar.name;
};

const tokenize = (
  instance: HighlighterCore,
  lang: string,
  code: string,
  grammarState?: GrammarState,
) => instance.codeToTokens(code, { defaultColor: false, grammarState, lang, themes });

const tokenizeCode = async (code: string, language: string) => {
  const instance = await getHighlighter();

  return tokenize(instance, await resolveLanguage(instance, language), code);
};

const cache = new Map<string, { result: TokensResult; size: number }>();
const requests = new Map<string, Promise<TokensResult>>();
let cacheSize = 0;
const maxCacheSize = 2 * 1024 * 1024;

const remember = (key: string, code: string, result: TokensResult) => {
  const size = code.length * 2 + JSON.stringify(result.tokens).length * 2;

  if (size > maxCacheSize) {
    return;
  }

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
};

const tokenizeAndRemember = async (key: string, code: string, language: string) => {
  const result = await tokenizeCode(code, language);
  remember(key, code, result);

  return result;
};

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

  const request = tokenizeAndRemember(key, code, normalized);
  requests.set(key, request);

  try {
    return await request;
  } finally {
    requests.delete(key);
  }
};

/** Highlighted source that can be continued as the source grows. */
export interface CodeHighlight {
  code: string;
  /** The normalized language. */
  language: string;
  result: TokensResult;
  /**
   * Where the complete lines end, how many there are, and the grammar state after them. Absent
   * for a result from the shared cache; the next growth then highlights the source once in full.
   */
  checkpoint?: { length: number; lines: number; state: GrammarState | undefined };
}

const finalLineBreak = /(?:\r\n|\n|\r)$/u;

/** The length of the source's complete lines, through the last line break. */
const completeLength = (code: string) =>
  Math.max(code.lastIndexOf("\n"), code.lastIndexOf("\r")) + 1;

// Tokenizes only what follows the previous checkpoint: the new complete lines from the saved
// grammar state, then the unfinished last line from the state after them.
const continueHighlight = async (
  previous: CodeHighlight,
  code: string,
  language: string,
): Promise<CodeHighlight> => {
  const instance = await getHighlighter();
  const lang = await resolveLanguage(instance, language);
  const checkpoint = previous.checkpoint ?? { length: 0, lines: 0, state: undefined };
  const end = completeLength(code);

  let { state } = checkpoint;
  let lines = previous.result.tokens.slice(0, checkpoint.lines);

  if (end > checkpoint.length) {
    const complete = tokenize(
      instance,
      lang,
      code.slice(checkpoint.length, end).replace(finalLineBreak, ""),
      state,
    );

    lines = [...lines, ...complete.tokens];
    state = complete.grammarState;
  }

  const tail = tokenize(instance, lang, code.slice(end), state);

  return {
    checkpoint: { length: end, lines: lines.length, state },
    code,
    language,
    result: { ...tail, tokens: [...lines, ...tail.tokens] },
  };
};

/**
 * Highlights `code`, continuing from `previous` when the source has grown from it, as streamed
 * output does. Other changes highlight the source in full through the shared cache.
 */
export const updateCodeHighlight = async (
  previous: CodeHighlight | undefined,
  code: string,
  language: string,
): Promise<CodeHighlight> => {
  const normalized = normalizeCodeLanguage(language);

  if (
    previous !== undefined &&
    previous.language === normalized &&
    code.length > previous.code.length &&
    code.startsWith(previous.code) &&
    // A trailing CR may be half of a CRLF the next chunk completes.
    !previous.code.endsWith("\r")
  ) {
    return await continueHighlight(previous, code, normalized);
  }

  return { code, language: normalized, result: await highlightCode(code, normalized) };
};
