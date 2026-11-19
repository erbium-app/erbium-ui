import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";
import { createContext, use, useMemo, useState, useSyncExternalStore } from "react";
import type { ComponentProps } from "react";
import type { TokensResult } from "@pierre/highlights";
import { TabsList, TabsTrigger } from "../components/tabs";
import { DirectionProvider } from "../components/direction";
import { Icon } from "../components/icon";
import { codeLanguageIcon } from "../lib/code-language-icon";
import { cn } from "../lib/utils";
import type { CSSVariableStyle } from "../lib/utils";
import {
  CodePanelCopyButton,
  CodePanelHeader,
  CodePanelLines,
  CodePanelTitle,
  codePanelFocusRing,
  codePanelSurface,
} from "./code-panel";
import type { CodePanelLine } from "./code-panel";
import type { CopyButtonProps } from "./copy-button";

type CodeToken = TokensResult["tokens"][number][number];

const lineBreak = /\r\n|\n|\r/u;

const plaintext = new Set(["text", "plaintext", "plain", "txt", ""]);

/** Highlighted output from `highlightCode`, for code tokenized ahead of render. */
type CodeBlockTokens = Pick<TokensResult, "tokens">;

type Highlight = (code: string, language: string) => TokensResult;

let highlight: Highlight | null = null;
let loading: Promise<Highlight> | null = null;

// Highlights compiles its WebAssembly at import, so it loads the first time a block needs it.
// Diff View and File View select the same backend, so a page loads it once.
const createHighlight = async (): Promise<Highlight> => {
  const [{ codeToTokens, isSupportedLanguage }, light, dark] = await Promise.all([
    import("@pierre/highlights"),
    import("@pierre/highlights/themes/vitesse-light"),
    import("@pierre/highlights/themes/vitesse-dark"),
  ]);

  const themes = { dark: dark.default, light: light.default };

  // `defaultColor: false` gives only `--hls-light-*` and `--hls-dark-*` properties, which the
  // page's scheme picks between. Highlights keeps a lone CR inside a line, but a displayed line
  // ends there, so it becomes LF; the length and token offsets are unchanged.
  return (code, language) =>
    codeToTokens(code.replaceAll(/\r(?!\n)/gu, "\n"), {
      defaultColor: false,
      lang: isSupportedLanguage(language) ? language : "plain",
      themes,
    });
};

const loadHighlight = async () => {
  try {
    loading ??= createHighlight();
    highlight = await loading;

    return highlight;
  } catch (error) {
    // The next block retries a failed load.
    loading = null;
    throw error;
  }
};

/** Tokenizes `code` ahead of render, for example on the server, to pass as `tokens`. */
const highlightCode = async (code: string, language: string) =>
  (await loadHighlight())(code, language);

// Subscribing loads the highlighter and re-renders once it is ready. The server snapshot is null,
// so hydration renders the server's plain source first.
const subscribeHighlight = (onLoad: () => void) => {
  let subscribed = true;

  const run = async () => {
    try {
      await loadHighlight();

      if (subscribed) {
        onLoad();
      }
    } catch {
      // Source stays readable as plain text where WebAssembly is unavailable or blocked.
    }
  };

  void run();

  return () => {
    subscribed = false;
  };
};

const skipHighlight = () => () => null;
const getHighlight = () => highlight;
const getServerHighlight = () => null;

// Colors and ANSI backgrounds are custom properties per theme; an unset background stays clear.
// Vitesse and ANSI style fonts the same in both themes, so the light keys decide them.
const CodeBlockToken = ({ token: { content, htmlStyle } }: { token: CodeToken }) => {
  const colors: CSSVariableStyle = {
    "--hls-dark": htmlStyle?.["--hls-dark"],
    "--hls-dark-bg": htmlStyle?.["--hls-dark-bg"],
    "--hls-light": htmlStyle?.["--hls-light"],
    "--hls-light-bg": htmlStyle?.["--hls-light-bg"],
  };

  return (
    <span
      style={colors}
      data-italic={htmlStyle?.["--hls-light-font-style"] === "italic" ? "" : undefined}
      data-bold={htmlStyle?.["--hls-light-font-weight"] === undefined ? undefined : ""}
      className="bg-(--hls-light-bg) text-(--hls-light) data-bold:font-bold data-italic:italic dark:bg-(--hls-dark-bg) dark:text-(--hls-dark)"
    >
      {content}
    </span>
  );
};

interface CodeBlockItem {
  value: string;
  label: string;
  code: string;
  language?: string;
  tokens?: CodeBlockTokens;
  /** Lines to call out, by their displayed number (counted from `startLine`). */
  highlightLines?: readonly number[];
  disabled?: boolean;
}

type CodeBlockSource =
  | {
      code: string;
      language?: string;
      tokens?: CodeBlockTokens;
      /** Lines to call out, by their displayed number (counted from `startLine`). */
      highlightLines?: readonly number[];
      items?: never;
    }
  | {
      items: readonly CodeBlockItem[];
      code?: never;
      language?: never;
      tokens?: never;
      highlightLines?: never;
    };

type CodeBlockProps = Omit<
  TabsPrimitive.Root.Props,
  "value" | "defaultValue" | "onValueChange" | "orientation" | "dir"
> &
  CodeBlockSource & {
    dir?: never;
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string, details: TabsPrimitive.Root.ChangeEventDetails) => void;
    surface?: "code" | "command";
    lineNumbers?: boolean;
    /** The number of the first line, when `lineNumbers` is set. */
    startLine?: number;
    wrap?: boolean;
    title?: string;
  };

interface CodeBlockContextValue {
  items: readonly CodeBlockItem[];
  active: CodeBlockItem | undefined;
  surface: "code" | "command";
  lineNumbers: boolean;
  startLine: number;
  wrap: boolean;
  /** A command block whose items all have the same icon shows it once, before the tabs. */
  sharedIcon: boolean;
}

const CodeBlockContext = createContext<CodeBlockContextValue | null>(null);

const useCodeBlock = () => {
  const context = use(CodeBlockContext);

  if (!context) {
    throw new Error("Code block parts must be inside CodeBlock.");
  }

  return context;
};

const CodeBlockHeader = ({ className, ...props }: ComponentProps<typeof CodePanelHeader>) => (
  <CodePanelHeader
    {...props}
    data-slot="code-block-header"
    className={cn("flex-nowrap pe-12 group-data-[surface=command]/code-block:min-h-9", className)}
  />
);

const CodeBlockTitle = ({ className, ...props }: ComponentProps<typeof CodePanelTitle>) => (
  <CodePanelTitle {...props} data-slot="code-block-title" className={cn("truncate", className)} />
);

const CodeBlockActions = ({ className, ...props }: ComponentProps<"div">) => (
  <div
    {...props}
    data-slot="code-block-actions"
    className={cn(
      "absolute end-2 top-2 z-10 flex items-center gap-1 rounded-md bg-surface-panel",
      // Over the source, actions appear on hover or focus so they do not cover code while reading;
      // touch screens have no hover, and a header leaves them room, so both keep them shown.
      "opacity-0 transition-opacity group-focus-within/code-block:opacity-100 group-hover/code-block:opacity-100 group-has-[[data-slot=code-block-header]]/code-block:opacity-100 motion-reduce:transition-none pointer-coarse:opacity-100",
      className,
    )}
  />
);

const CodeBlockLanguage = ({ children, ...props }: ComponentProps<typeof CodeBlockTitle>) => {
  const { active } = useCodeBlock();

  return <CodeBlockTitle {...props}>{children ?? active?.language ?? "text"}</CodeBlockTitle>;
};

const itemIcon = (item: CodeBlockItem | undefined, surface: "code" | "command") =>
  codeLanguageIcon(item?.language ?? (surface === "command" ? "shell" : undefined));

const CodeBlockIcon = ({
  value,
  className,
  ...props
}: Omit<ComponentProps<typeof Icon>, "name"> & { value?: string }) => {
  const { active, items, surface } = useCodeBlock();
  const item = value === undefined ? active : items.find((entry) => entry.value === value);

  return (
    <Icon
      {...props}
      className={cn("size-4.5", className)}
      name={itemIcon(item, surface)}
      data-slot="code-block-icon"
    />
  );
};

const CodeBlockTab = (props: ComponentProps<typeof TabsTrigger>) => <TabsTrigger {...props} />;

const CodeBlockTabs = ({
  children,
  className,
  "aria-label": label = "Code examples",
  ...props
}: ComponentProps<typeof TabsList>) => {
  const { items, sharedIcon } = useCodeBlock();

  return (
    <TabsList
      {...props}
      aria-label={label}
      className={cn("h-7 max-w-full min-w-0 overflow-x-auto", className)}
    >
      {children ??
        items.map((item) => (
          <CodeBlockTab key={item.value} value={item.value} disabled={item.disabled}>
            {sharedIcon ? null : <CodeBlockIcon value={item.value} />}
            {item.label}
          </CodeBlockTab>
        ))}
    </TabsList>
  );
};

/**
 * A ghost copy action for the active source. Keep it icon-only when it copies the block's source;
 * add a label only when it names something the icon cannot, such as "Copy prompt".
 */
const CodeBlockCopyButton = ({
  value,
  ...props
}: Omit<CopyButtonProps, "value"> & { value?: string }) => {
  const { active, surface } = useCodeBlock();

  return (
    <CodePanelCopyButton
      value={value ?? active?.code ?? ""}
      aria-label={surface === "command" ? "Copy command" : "Copy code"}
      disabled={!active}
      {...props}
    />
  );
};

// ANSI select graphic rendition sequences, which terminal output colors and styles text with.
const ansiStyle = new RegExp(`${String.fromCodePoint(27)}\\[[0-9;]*m`, "gu");

interface CodeLinesOptions {
  lineNumbers: boolean;
  startLine: number;
  highlightLines?: readonly number[];
  /** The source is terminal output, whose escape codes are never shown as text. */
  ansi: boolean;
}

/** The source as panel rows, colored by `result` once it exists and plain until then. */
const codeLines = (
  code: string,
  result: CodeBlockTokens | undefined,
  options: CodeLinesOptions,
): CodePanelLine[] => {
  const calledOut = new Set(options.highlightLines);
  const texts = (options.ansi ? code.replaceAll(ansiStyle, "") : code).split(lineBreak);

  // A final line break ends the last line rather than starting an empty one. Copying still uses
  // the exact source.
  if (texts.length > 1 && lineBreak.test(code.at(-1) ?? "")) {
    texts.pop();
  }

  return texts.map((text, index) => {
    const number = options.startLine + index;
    const row = result?.tokens[index] ?? [];

    return {
      text,
      content:
        row.length > 0
          ? row.map((token, tokenIndex) => <CodeBlockToken key={tokenIndex} token={token} />)
          : undefined,
      number: options.lineNumbers ? number : undefined,
      tone: calledOut.has(number) ? "highlight" : undefined,
    };
  });
};

type CodeBlockContentProps = Omit<
  ComponentProps<"pre">,
  "children" | "dangerouslySetInnerHTML" | "dir"
>;

const CodeBlockContent = ({ className, style, ...props }: CodeBlockContentProps) => {
  const { active, lineNumbers, startLine, wrap, surface } = useCodeBlock();
  const code = active?.code ?? "";
  const language = active?.language ?? "text";
  const tokens = active?.tokens;
  // Provided tokens render on the server and skip the client highlighter.
  const highlighted = tokens === undefined && !plaintext.has(language);

  const highlighter = useSyncExternalStore(
    highlighted ? subscribeHighlight : skipHighlight,
    getHighlight,
    getServerHighlight,
  );

  // Tokenizing is synchronous once the highlighter has loaded, so a changing or streamed source
  // highlights in full on each render and never shows stale colors.
  const result = tokens ?? (highlighted ? highlighter?.(code, language) : undefined);

  // Numbered rows use the file and diff view gutter; plain rows pad to the panel. The code column
  // keeps clear of the anchored actions, so row tints still reach both edges.
  const plainInset =
    surface === "command"
      ? "px-3 group-has-[[data-slot=code-block-actions]]/code-block:pe-12"
      : "px-panel group-has-[[data-slot=code-block-actions]]/code-block:pe-12";

  const codeInset = lineNumbers
    ? "pe-4 group-has-[[data-slot=code-block-actions]]/code-block:pe-12"
    : plainInset;

  const lines = codeLines(code, result, {
    ansi: language.toLowerCase() === "ansi",
    highlightLines: active?.highlightLines,
    lineNumbers,
    startLine,
  });

  return (
    <pre
      // Long code scrolls inside a fixed height; keyboard users need a tab stop to scroll it
      // (WCAG 2.1.1, axe scrollable-region-focusable). The rule only knows interactive roles.
      // oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex
      tabIndex={0}
      {...props}
      data-slot="code-block-content"
      data-language={language}
      dir="ltr"
      style={style}
      className={cn(
        "m-0 max-h-120 overflow-auto text-code-block [tab-size:2]",
        codePanelFocusRing,
        surface === "command" ? "px-3 py-3" : "p-panel",
        // Rows pad themselves so highlighted lines reach both edges.
        "px-0",
        className,
      )}
    >
      <code>
        <CodePanelLines lines={lines} wrap={wrap} limit={lines.length} codeClassName={codeInset} />
      </code>
    </pre>
  );
};

const CodeBlockPanel = ({
  value,
  ...props
}: Omit<TabsPrimitive.Panel.Props, "children" | "value"> & { value: string }) => {
  const context = useCodeBlock();

  const panelContext = useMemo(
    () => ({ ...context, active: context.items.find((entry) => entry.value === value) }),
    [context, value],
  );

  return (
    <TabsPrimitive.Panel {...props} value={value} data-slot="code-block-panel">
      <CodeBlockContext value={panelContext}>
        <CodeBlockContent />
      </CodeBlockContext>
    </TabsPrimitive.Panel>
  );
};

const CodeBlock = ({
  code,
  language,
  tokens,
  highlightLines,
  items: providedItems,
  value,
  defaultValue,
  onValueChange,
  surface = "code",
  lineNumbers = false,
  startLine = 1,
  wrap = false,
  title,
  children,
  className,
  ...props
}: CodeBlockProps) => {
  const items = useMemo(
    () =>
      providedItems ?? [
        {
          highlightLines,
          language,
          tokens,
          code: code ?? "",
          label: title ?? language ?? "Code",
          value: "code",
        },
      ],
    [providedItems, code, highlightLines, language, title, tokens],
  );

  const [selection, setSelection] = useState(defaultValue);
  const requested = value ?? selection;

  const enabled = items.filter((item) => item.disabled !== true);
  const active = enabled.find((item) => item.value === requested) ?? enabled.at(0);

  // Command tabs are alternatives for one command (package managers), so a shared icon shows once;
  // file tabs keep an icon each, even when the files share a language.
  const sharedIcon =
    surface === "command" &&
    items.length > 1 &&
    new Set(items.map((item) => itemIcon(item, surface))).size === 1;

  const context = useMemo(
    () => ({ active, items, lineNumbers, sharedIcon, startLine, surface, wrap }),
    [active, items, lineNumbers, sharedIcon, startLine, surface, wrap],
  );

  const hasTabs = providedItems !== undefined && items.length > 0;
  const hasTitle = title !== undefined && title !== "";

  const headerContent = hasTabs ? (
    <div className="flex min-w-0 items-center gap-related">
      {sharedIcon ? <CodeBlockIcon className="shrink-0 text-muted-foreground" /> : null}
      <CodeBlockTabs />
    </div>
  ) : (
    <CodeBlockTitle>
      <CodeBlockIcon />
      <span className="truncate">{title}</span>
    </CodeBlockTitle>
  );

  const header = hasTabs || hasTitle ? <CodeBlockHeader>{headerContent}</CodeBlockHeader> : null;

  return (
    <DirectionProvider direction="ltr">
      <CodeBlockContext value={context}>
        <TabsPrimitive.Root
          {...props}
          dir="ltr"
          data-slot="code-block"
          data-surface={surface}
          className={cn("group/code-block relative", codePanelSurface, className)}
          value={active?.value ?? null}
          onValueChange={(next, details) => {
            // Tabs report any value; only an item's value selects code.
            const item = items.find((entry) => entry.value === next);

            if (!item) {
              return;
            }

            onValueChange?.(item.value, details);

            if (!details.isCanceled && value === undefined) {
              setSelection(item.value);
            }
          }}
        >
          {children ?? (
            <>
              {header}
              <CodeBlockActions>
                <CodeBlockCopyButton />
              </CodeBlockActions>
              {providedItems ? (
                items.map((item) => <CodeBlockPanel key={item.value} value={item.value} />)
              ) : (
                <CodeBlockContent />
              )}
            </>
          )}
        </TabsPrimitive.Root>
      </CodeBlockContext>
    </DirectionProvider>
  );
};

export {
  CodeBlock,
  CodeBlockHeader,
  CodeBlockTitle,
  CodeBlockActions,
  CodeBlockLanguage,
  CodeBlockIcon,
  CodeBlockTabs,
  CodeBlockTab,
  CodeBlockPanel,
  CodeBlockContent,
  CodeBlockCopyButton,
  highlightCode,
};

export type { CodeBlockProps, CodeBlockItem, CodeBlockContentProps, CodeBlockTokens };
