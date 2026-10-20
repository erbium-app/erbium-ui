import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import type { Root } from "hast";
import { Children, isValidElement, useCallback } from "react";
import type { ComponentProps, ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { CodeBlock as UICodeBlock } from "@erbium/ui/blocks/code-block";
import {
  CopyButton,
  CopyButtonIcon,
  CopyButtonLabel,
  CopyButtonLabelIdle,
  CopyButtonLabelCopied,
  CopyButtonLabelError,
} from "@erbium/ui/blocks/copy-button";
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from "@erbium/ui/components/table";

const textContent = (children: ReactNode): string =>
  Children.toArray(children)
    .map((child) =>
      isValidElement<{ children?: ReactNode }>(child)
        ? textContent(child.props.children)
        : typeof child === "string" || typeof child === "number"
          ? String(child)
          : "",
    )
    .join("");

const MarkdownLink = ({ href, children }: ComponentProps<"a">) =>
  href?.startsWith("/") && !/\.(md|json|txt|xml)$/.test(href) ? (
    <Link to={href}>{children}</Link>
  ) : (
    <a
      href={href}
      target={href?.startsWith("https:") ? "_blank" : undefined}
      rel={href?.startsWith("https:") ? "noopener noreferrer" : undefined}
    >
      {children}
    </a>
  );

const MarkdownPre = ({ children }: ComponentProps<"pre">) => {
  const code = Children.toArray(children).find(isValidElement<{ className?: string }>);

  const language = isValidElement<{ className?: string }>(code)
    ? code.props.className
        ?.split(" ")
        .find((value) => value.startsWith("language-"))
        ?.slice(9)
    : undefined;

  return (
    <UICodeBlock
      code={textContent(children).replace(/\n$/, "")}
      language={language}
      className="not-typeset my-4"
    />
  );
};

const MarkdownTable = (props: ComponentProps<"table">) => (
  <Table
    {...props}
    className="[&_td]:whitespace-normal [&_th]:whitespace-normal"
    containerProps={{
      "aria-label": "Documentation table",
      className: "not-typeset my-4",
      role: "region",
      tabIndex: 0,
    }}
  />
);

export const Prose = ({ tree }: { tree: string }) => (
  <div className="typeset markdown-copy">
    {toJsxRuntime(JSON.parse(tree) as Root, {
      Fragment,
      components: {
        a: MarkdownLink,
        caption: TableCaption,
        pre: MarkdownPre,
        table: MarkdownTable,
        tbody: TableBody,
        td: TableCell,
        tfoot: TableFooter,
        th: TableHead,
        thead: TableHeader,
        tr: TableRow,
      },
      jsx,
      jsxs,
    })}
  </div>
);

export const CopyPageButton = ({ path }: { path: string }) => {
  const markdown = useCallback(async () => {
    const response = await fetch(path === "/" ? "/index.md" : `${path}.md`);

    if (!response.ok) {
      throw new Error("Markdown unavailable");
    }

    return await response.text();
  }, [path]);

  return (
    <CopyButton value={markdown} variant="outline" size="xs" aria-label="Copy page as Markdown">
      <CopyButtonIcon data-icon="inline-start" />
      <CopyButtonLabel>
        <CopyButtonLabelIdle>Copy Markdown</CopyButtonLabelIdle>
        <CopyButtonLabelCopied>Copied</CopyButtonLabelCopied>
        <CopyButtonLabelError>Failed</CopyButtonLabelError>
      </CopyButtonLabel>
    </CopyButton>
  );
};
