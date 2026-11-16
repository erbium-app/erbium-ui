import { Markdown } from "@tanstack/markdown/react";
import type { MarkdownComponents } from "@tanstack/markdown/react";
import type { MarkdownDocument } from "@tanstack/markdown";
import { useCallback } from "react";
import type { ComponentProps, ReactNode } from "react";
import { Link } from "@erbium/ui/components/link";
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

const MarkdownLink = ({ href, children, ...props }: ComponentProps<"a">) => {
  const internal = href?.startsWith("/") === true && !/\.(?:md|json|txt|xml)$/u.test(href);

  if (internal) {
    return (
      <Link {...props} to={href}>
        {children}
      </Link>
    );
  }

  const external = href?.startsWith("https:") === true;

  return (
    <a
      {...props}
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
    >
      {children}
    </a>
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

const isCodeText = (value: ReactNode): value is string => typeof value === "string";

const MarkdownCode = ({ children, className, ...props }: ComponentProps<"code">) => {
  if (className?.startsWith("language-") === true && isCodeText(children)) {
    const language = className.slice(9);

    return <UICodeBlock code={children} language={language} className="not-typeset my-4" />;
  }

  return (
    <code {...props} className={className}>
      {children}
    </code>
  );
};

const MarkdownPre = ({ children }: ComponentProps<"pre">): ReactNode => children;

const components = {
  a: MarkdownLink,
  caption: TableCaption,
  code: MarkdownCode,
  pre: MarkdownPre,
  table: MarkdownTable,
  tbody: TableBody,
  td: TableCell,
  tfoot: TableFooter,
  th: TableHead,
  thead: TableHeader,
  tr: TableRow,
} satisfies MarkdownComponents;

export const Prose = ({ tree }: { tree: MarkdownDocument }) => (
  <div className="typeset markdown-copy">
    <Markdown components={components}>{tree}</Markdown>
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
      <CopyButtonIcon />
      <CopyButtonLabel>
        <CopyButtonLabelIdle>Copy Markdown</CopyButtonLabelIdle>
        <CopyButtonLabelCopied>Copied</CopyButtonLabelCopied>
        <CopyButtonLabelError>Failed</CopyButtonLabelError>
      </CopyButtonLabel>
    </CopyButton>
  );
};
