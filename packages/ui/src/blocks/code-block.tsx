import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";
import { createContext, use, useEffect, useMemo, useState } from "react";
import type { ComponentProps, CSSProperties } from "react";
import type { TokensResult } from "shiki/core";
import { TabsList, TabsTrigger } from "../components/tabs";
import { DirectionProvider } from "../components/direction";
import { Icon } from "../components/icon";
import { codeLanguageIcon } from "../lib/code-language-icon";
import { highlightCode } from "../lib/code-highlighter";
import { cn } from "../lib/utils";
import {
  CodePanelCopyButton,
  CodePanelHeader,
  CodePanelTitle,
  codePanelFocusRing,
  codePanelSurface,
} from "./code-panel";
import type { CopyButtonProps } from "./copy-button";

type CodeBlockItem = {
  value: string;
  label: string;
  code: string;
  language?: string;
  disabled?: boolean;
};
type CodeBlockSource =
  | { code: string; language?: string; items?: never }
  | { items: readonly CodeBlockItem[]; code?: never; language?: never };
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
type CodeBlockContextValue = {
  items: readonly CodeBlockItem[];
  active: CodeBlockItem | undefined;
  surface: "code" | "command";
  lineNumbers: boolean;
  wrap: boolean;
};
const CodeBlockContext = createContext<CodeBlockContextValue | null>(null);
function useCodeBlock() {
  const context = use(CodeBlockContext);
  if (!context) throw new Error("Code block parts must be inside CodeBlock.");
  return context;
}

function CodeBlock({
  code,
  language,
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
}: CodeBlockProps) {
  const items = useMemo(
    () =>
      providedItems ?? [
        { value: "code", label: title ?? language ?? "Code", code: code ?? "", language },
      ],
    [providedItems, code, language, title],
  );
  const [selection, setSelection] = useState(defaultValue);
  const requested = value ?? selection;
  const active =
    items.find((item) => item.value === requested && !item.disabled) ??
    items.find((item) => !item.disabled);
  return (
    <DirectionProvider direction="ltr">
      <CodeBlockContext value={{ items, active, surface, lineNumbers, wrap }}>
        <TabsPrimitive.Root
          {...props}
          dir="ltr"
          data-slot="code-block"
          data-surface={surface}
          className={cn("group/code-block relative", codePanelSurface, className)}
          value={active?.value ?? null}
          onValueChange={(next, details) => {
            if (typeof next !== "string") return;
            onValueChange?.(next, details);
            if (!details.isCanceled && value === undefined) setSelection(next);
          }}
        >
          {children ?? (
            <>
              {(providedItems && items.length > 0) || title ? (
                <CodeBlockHeader>
                  {providedItems && items.length > 0 ? (
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
}
function CodeBlockHeader({ className, ...props }: ComponentProps<typeof CodePanelHeader>) {
  return (
    <CodePanelHeader
      {...props}
      data-slot="code-block-header"
      className={cn("flex-nowrap pe-12 group-data-[surface=command]/code-block:min-h-9", className)}
    />
  );
}
function CodeBlockTitle({ className, ...props }: ComponentProps<typeof CodePanelTitle>) {
  return (
    <CodePanelTitle {...props} data-slot="code-block-title" className={cn("truncate", className)} />
  );
}
function CodeBlockActions({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      {...props}
      data-slot="code-block-actions"
      className={cn(
        "absolute end-2 top-2 z-10 flex items-center gap-1 rounded-md bg-surface-panel",
        className,
      )}
    />
  );
}
function CodeBlockLanguage({ children, ...props }: ComponentProps<typeof CodeBlockTitle>) {
  const { active } = useCodeBlock();
  return <CodeBlockTitle {...props}>{children ?? active?.language ?? "text"}</CodeBlockTitle>;
}
function CodeBlockIcon({
  value,
  className,
  ...props
}: Omit<ComponentProps<typeof Icon>, "name"> & { value?: string }) {
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
}
function CodeBlockTabs({
  children,
  className,
  "aria-label": label = "Code examples",
  ...props
}: ComponentProps<typeof TabsList>) {
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
}
function CodeBlockTab(props: ComponentProps<typeof TabsTrigger>) {
  return <TabsTrigger {...props} />;
}
function CodeBlockCopyButton({
  value,
  ...props
}: Omit<CopyButtonProps, "value"> & { value?: string }) {
  const { active, surface } = useCodeBlock();
  return (
    <CodePanelCopyButton
      value={value ?? active?.code ?? ""}
      aria-label={surface === "command" ? "Copy command" : "Copy code"}
      disabled={!active}
      {...props}
    />
  );
}

type CodeBlockContentProps = Omit<
  ComponentProps<"pre">,
  "children" | "dangerouslySetInnerHTML" | "dir"
>;
function CodeBlockContent({ className, style, ...props }: CodeBlockContentProps) {
  const { active, lineNumbers, wrap, surface } = useCodeBlock();
  const code = active?.code ?? "";
  const language = active?.language ?? "text";
  const [highlighted, setHighlighted] = useState<{
    code: string;
    language: string;
    result: TokensResult;
  }>();
  useEffect(() => {
    let current = true;
    if (!["text", "plaintext", "plain", "txt", ""].includes(language)) {
      void highlightCode(code, language)
        .then((result) => {
          if (current) setHighlighted({ code, language, result });
        })
        .catch(() => {
          /* Source remains readable when highlighting is unavailable. */
        });
    }
    return () => {
      current = false;
    };
  }, [code, language]);
  const result =
    highlighted?.code === code && highlighted.language === language
      ? highlighted.result
      : undefined;
  const rows: TokensResult["tokens"] =
    result?.tokens ?? code.split(/\r\n|\n|\r/).map((content) => [{ content, offset: 0 }]);
  function themeColor(name: string) {
    const declaration = (result?.rootStyle || "")
      .split(";")
      .find((entry) => entry.startsWith(`${name}:`));
    return declaration?.slice(name.length + 1);
  }
  const blockStyle = {
    "--shiki-light": themeColor("--shiki-light"),
    "--shiki-dark": themeColor("--shiki-dark"),
    ...style,
  } as CSSProperties;
  return (
    <pre
      {...props}
      data-slot="code-block-content"
      data-language={language}
      dir="ltr"
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
              <span
                key={tokenIndex}
                style={
                  {
                    "--shiki-light":
                      "htmlStyle" in token ? token.htmlStyle?.["--shiki-light"] : undefined,
                    "--shiki-dark":
                      "htmlStyle" in token ? token.htmlStyle?.["--shiki-dark"] : undefined,
                  } as CSSProperties
                }
                data-italic={
                  "htmlStyle" in token && token.htmlStyle?.["font-style"] === "italic"
                    ? ""
                    : undefined
                }
                data-bold={
                  "htmlStyle" in token && token.htmlStyle?.["font-weight"] === "bold"
                    ? ""
                    : undefined
                }
                className="text-(--shiki-light,inherit) dark:text-(--shiki-dark,inherit) data-italic:italic data-bold:font-bold"
              >
                {token.content}
              </span>
            ))}
            {index < rows.length - 1 ? "\n" : null}
          </span>
        ))}
      </code>
    </pre>
  );
}
function CodeBlockPanel({
  value,
  ...props
}: Omit<TabsPrimitive.Panel.Props, "children"> & { value: string }) {
  const context = useCodeBlock();
  const item = context.items.find((entry) => entry.value === value);
  return (
    <TabsPrimitive.Panel {...props} value={value} data-slot="code-block-panel">
      <CodeBlockContext value={{ ...context, active: item }}>
        <CodeBlockContent />
      </CodeBlockContext>
    </TabsPrimitive.Panel>
  );
}

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
export type { CodeBlockProps, CodeBlockItem, CodeBlockContentProps };
