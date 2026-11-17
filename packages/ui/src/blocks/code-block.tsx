import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";
import { createContext, use, useEffect, useMemo, useRef, useState } from "react";
import type { ComponentProps } from "react";
import type { TokensResult } from "shiki/core";
import { TabsList, TabsTrigger } from "../components/tabs";
import { DirectionProvider } from "../components/direction";
import { Icon } from "../components/icon";
import { codeLanguageIcon } from "../lib/code-language-icon";
import { normalizeCodeLanguage, updateCodeHighlight } from "../lib/code-highlighter";
import type { CodeHighlight } from "../lib/code-highlighter";
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
type CodeBlockTokens = Pick<TokensResult, "tokens" | "rootStyle">;

const CodeBlockToken = ({ token }: { token: CodeToken }) => {
  const htmlStyle = "htmlStyle" in token ? token.htmlStyle : undefined;

  const tokenStyle: CSSVariableStyle = {
    "--shiki-dark": htmlStyle?.["--shiki-dark"],
    "--shiki-light": htmlStyle?.["--shiki-light"],
  };

  return (
    <span
      style={tokenStyle}
      data-italic={htmlStyle?.["font-style"] === "italic" ? "" : undefined}
      data-bold={htmlStyle?.["font-weight"] === "bold" ? "" : undefined}
      className="text-(--shiki-light,inherit) dark:text-(--shiki-dark,inherit) data-italic:italic data-bold:font-bold"
    >
      {token.content}
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
      "opacity-0 transition-opacity group-focus-within/code-block:opacity-100 group-hover/code-block:opacity-100 group-has-[[data-slot=code-block-header]]/code-block:opacity-100 pointer-coarse:opacity-100 motion-reduce:transition-none",
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
      className={cn("h-7 min-w-0 max-w-full overflow-x-auto", className)}
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
  /** The tokens were highlighted from this exact source. */
  current: boolean;
  /** The source is terminal output, whose escape codes are never shown as text. */
  ansi: boolean;
}

/**
 * The source as panel rows. Tokens from an earlier version of a changing source keep coloring the
 * lines whose text is unchanged or has only grown, while the new version highlights.
 */
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
    const highlighted = row.map((token) => token.content).join("");
    // A line that grew since it was highlighted, as a streamed line does, keeps its colors and
    // shows the new text plainly until the next highlight.
    const reusable = highlighted !== "" && (options.current || text.startsWith(highlighted));

    return {
      content: reusable ? (
        <>
          {row.map((token, tokenIndex) => (
            <CodeBlockToken key={tokenIndex} token={token} />
          ))}
          {options.current ? null : text.slice(highlighted.length)}
        </>
      ) : undefined,
      number: options.lineNumbers ? number : undefined,
      text,
      tone: calledOut.has(number) ? "highlight" : undefined,
    };
  });
};

/** A theme color from the highlighter's root style, which is `false` when the theme sets none. */
const themeColor = (result: CodeBlockTokens | undefined, name: string) => {
  const rootStyle = result?.rootStyle;
  const declarations = rootStyle === undefined || rootStyle === false ? [] : rootStyle.split(";");
  const declaration = declarations.find((entry) => entry.startsWith(`${name}:`));

  return declaration?.slice(name.length + 1);
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

  const [highlight, setHighlight] = useState<CodeHighlight>();
  // The latest highlight, which a growing source continues from.
  const latest = useRef<CodeHighlight>(undefined);

  useEffect(() => {
    let current = true;

    const run = async () => {
      try {
        const next = await updateCodeHighlight(latest.current, code, language);

        if (current) {
          latest.current = next;
          setHighlight(next);
        }
      } catch {
        // Source remains readable as plain text when highlighting is unavailable.
      }
    };

    // Provided tokens render on the server and skip the client highlighter.
    if (tokens === undefined && !plaintext.has(language)) {
      void run();
    }

    return () => {
      current = false;
    };
  }, [code, language, tokens]);

  // Until the current source is highlighted, the previous highlight colors the lines it shares.
  const sameLanguage = highlight?.language === normalizeCodeLanguage(language);
  const result = tokens ?? (sameLanguage ? highlight?.result : undefined);

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
    ansi: normalizeCodeLanguage(language) === "ansi",
    current: tokens !== undefined || (sameLanguage && highlight?.code === code),
    highlightLines: active?.highlightLines,
    lineNumbers,
    startLine,
  });

  const blockStyle: CSSVariableStyle = {
    "--shiki-dark": themeColor(result, "--shiki-dark"),
    "--shiki-light": themeColor(result, "--shiki-light"),
    ...style,
  };

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
      style={blockStyle}
      className={cn(
        "m-0 max-h-120 overflow-auto text-code-block [tab-size:2] text-(--shiki-light,inherit) dark:text-(--shiki-dark,inherit)",
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
}: Omit<TabsPrimitive.Panel.Props, "children"> & { value: string }) => {
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
          code: code ?? "",
          highlightLines,
          label: title ?? language ?? "Code",
          language,
          tokens,
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
              {hasTabs || hasTitle ? (
                <CodeBlockHeader>
                  {hasTabs ? (
                    <div className="flex min-w-0 items-center gap-related">
                      {sharedIcon ? (
                        <CodeBlockIcon className="shrink-0 text-muted-foreground" />
                      ) : null}
                      <CodeBlockTabs />
                    </div>
                  ) : (
                    <CodeBlockTitle>
                      <CodeBlockIcon />
                      <span className="truncate">{title}</span>
                    </CodeBlockTitle>
                  )}
                </CodeBlockHeader>
              ) : null}
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
};

export type { CodeBlockProps, CodeBlockItem, CodeBlockContentProps, CodeBlockTokens };
