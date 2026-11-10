import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";
import { createContext, use, useEffect, useMemo, useState } from "react";
import type { ComponentProps } from "react";
import type { TokensResult } from "shiki/core";
import { TabsList, TabsTrigger } from "../components/tabs";
import { DirectionProvider } from "../components/direction";
import { Icon } from "../components/icon";
import { codeLanguageIcon } from "../lib/code-language-icon";
import { highlightCode } from "../lib/code-highlighter";
import { cn } from "../lib/utils";
import type { CSSVariableStyle } from "../lib/utils";
import {
  CodePanelCopyButton,
  CodePanelHeader,
  CodePanelTitle,
  codePanelFocusRing,
  codePanelSurface,
} from "./code-panel";
import type { CopyButtonProps } from "./copy-button";

type CodeToken = TokensResult["tokens"][number][number];

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
  disabled?: boolean;
}

type CodeBlockSource =
  | { code: string; language?: string; tokens?: CodeBlockTokens; items?: never }
  | { items: readonly CodeBlockItem[]; code?: never; language?: never; tokens?: never };

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
    wrap?: boolean;
    title?: string;
  };

interface CodeBlockContextValue {
  items: readonly CodeBlockItem[];
  active: CodeBlockItem | undefined;
  surface: "code" | "command";
  lineNumbers: boolean;
  wrap: boolean;
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
      className,
    )}
  />
);

const CodeBlockLanguage = ({ children, ...props }: ComponentProps<typeof CodeBlockTitle>) => {
  const { active } = useCodeBlock();

  return <CodeBlockTitle {...props}>{children ?? active?.language ?? "text"}</CodeBlockTitle>;
};

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
      name={codeLanguageIcon(item?.language ?? (surface === "command" ? "shell" : undefined))}
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
  const { items } = useCodeBlock();

  return (
    <TabsList
      {...props}
      aria-label={label}
      className={cn("h-7 min-w-0 max-w-full overflow-x-auto", className)}
    >
      {children ??
        items.map((item) => (
          <CodeBlockTab key={item.value} value={item.value} disabled={item.disabled}>
            <CodeBlockIcon value={item.value} />
            {item.label}
          </CodeBlockTab>
        ))}
    </TabsList>
  );
};

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

type CodeBlockContentProps = Omit<
  ComponentProps<"pre">,
  "children" | "dangerouslySetInnerHTML" | "dir"
>;

const CodeBlockContent = ({ className, style, ...props }: CodeBlockContentProps) => {
  const { active, lineNumbers, wrap, surface } = useCodeBlock();
  const code = active?.code ?? "";
  const language = active?.language ?? "text";
  const tokens = active?.tokens;

  const [highlighted, setHighlighted] = useState<{
    code: string;
    language: string;
    result: TokensResult;
  }>();

  useEffect(() => {
    let current = true;

    const highlight = async () => {
      try {
        const result = await highlightCode(code, language);

        if (current) {
          setHighlighted({ code, language, result });
        }
      } catch {
        // Source remains readable as plain text when highlighting is unavailable.
      }
    };

    // Provided tokens render on the server and skip the client highlighter.
    if (tokens === undefined && !["text", "plaintext", "plain", "txt", ""].includes(language)) {
      void highlight();
    }

    return () => {
      current = false;
    };
  }, [code, language, tokens]);

  const result =
    tokens ??
    (highlighted?.code === code && highlighted.language === language
      ? highlighted.result
      : undefined);

  const rows: TokensResult["tokens"] =
    result?.tokens ?? code.split(/\r\n|\n|\r/u).map((content) => [{ content, offset: 0 }]);

  // Shiki reports `false` when the theme sets no root style.
  const rootStyle = result?.rootStyle;
  const declarations = rootStyle === undefined || rootStyle === false ? [] : rootStyle.split(";");

  const themeColor = (name: string) => {
    const declaration = declarations.find((entry) => entry.startsWith(`${name}:`));

    return declaration?.slice(name.length + 1);
  };

  const blockStyle: CSSVariableStyle = {
    "--shiki-dark": themeColor("--shiki-dark"),
    "--shiki-light": themeColor("--shiki-light"),
    ...style,
  };

  return (
    <pre
      {...props}
      data-slot="code-block-content"
      data-language={language}
      dir="ltr"
      // Long code scrolls inside a fixed height; keyboard users need a tab stop to scroll it
      // (WCAG 2.1.1, axe scrollable-region-focusable). The rule only knows interactive roles.
      // oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex
      tabIndex={0}
      style={blockStyle}
      className={cn(
        "m-0 max-h-120 overflow-auto p-panel text-code-block [tab-size:2] text-(--shiki-light,inherit) dark:text-(--shiki-dark,inherit)",
        codePanelFocusRing,
        wrap ? "whitespace-pre-wrap break-words" : "whitespace-pre",
        surface === "command" && "px-3 py-3",
        "group-has-[[data-slot=code-block-actions]]/code-block:pe-12",
        className,
      )}
    >
      <code>
        {rows.map((row, index) => (
          <span key={index} data-slot="code-block-line">
            {lineNumbers && (
              <span
                aria-hidden="true"
                className="me-5 inline-block min-w-6 select-none text-end text-muted-foreground/60"
              >
                {index + 1}
              </span>
            )}
            {row.map((token, tokenIndex) => (
              <CodeBlockToken key={tokenIndex} token={token} />
            ))}
            {index < rows.length - 1 ? "\n" : null}
          </span>
        ))}
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
  items: providedItems,
  value,
  defaultValue,
  onValueChange,
  surface = "code",
  lineNumbers = false,
  wrap = false,
  title,
  children,
  className,
  ...props
}: CodeBlockProps) => {
  const items = useMemo(
    () =>
      providedItems ?? [
        { code: code ?? "", label: title ?? language ?? "Code", language, tokens, value: "code" },
      ],
    [providedItems, code, language, title, tokens],
  );

  const [selection, setSelection] = useState(defaultValue);
  const requested = value ?? selection;

  const enabled = items.filter((item) => item.disabled !== true);
  const active = enabled.find((item) => item.value === requested) ?? enabled.at(0);

  const context = useMemo(
    () => ({ active, items, lineNumbers, surface, wrap }),
    [active, items, lineNumbers, surface, wrap],
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
                    <CodeBlockTabs />
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
