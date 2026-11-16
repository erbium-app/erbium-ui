import type { ComponentProps, ReactNode } from "react";
import { DirectionProvider } from "../components/direction";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "../components/empty";
import { Separator } from "../components/separator";
import { Skeleton } from "../components/skeleton";
import { cn } from "../lib/utils";
import { CopyButton } from "./copy-button";
import type { CopyButtonProps } from "./copy-button";

// Shared chrome for blocks that present source code: the surface, header, title,
// actions, and the scrollable body. Code is direction-neutral, so every panel
// stays LTR even on RTL pages.
const codePanelSurface = "min-w-0 w-full overflow-hidden rounded-xl surface-panel text-foreground";
const codePanelHeader = "flex min-h-10 items-center justify-between gap-related px-3 py-1.5";

const codePanelTitle =
  "inline-flex min-w-0 items-center gap-related text-metadata font-medium text-muted-foreground";

const codePanelFocusRing =
  "outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring";

type CodePanelProps = Omit<ComponentProps<"div">, "dir" | "dangerouslySetInnerHTML">;

const CodePanel = ({ className, ...props }: CodePanelProps) => (
  <DirectionProvider direction="ltr">
    <div data-slot="code-panel" {...props} dir="ltr" className={cn(codePanelSurface, className)} />
  </DirectionProvider>
);

const CodePanelHeader = ({ className, ...props }: ComponentProps<"div">) => (
  <>
    <div
      data-slot="code-panel-header"
      {...props}
      className={cn(codePanelHeader, "flex-wrap", className)}
    />
    <Separator variant="full" />
  </>
);

const CodePanelTitle = ({ className, ...props }: ComponentProps<"span">) => (
  <span data-slot="code-panel-title" {...props} className={cn(codePanelTitle, className)} />
);

const CodePanelActions = ({ className, ...props }: ComponentProps<"div">) => (
  <div
    data-slot="code-panel-actions"
    {...props}
    className={cn("flex shrink-0 items-center gap-related", className)}
  />
);

const CodePanelCopyButton = ({ children, ...props }: CopyButtonProps) => (
  <CopyButton
    variant="ghost"
    size={children === undefined || children === null ? "icon-xs" : "xs"}
    {...props}
  >
    {children}
  </CopyButton>
);

interface CodePanelLine {
  /** The line number shown in the gutter; none when line numbers are off. */
  number?: number;
  text: string;
  /** Highlighted content for the line. `text` is shown when it is absent. */
  content?: ReactNode;
  tone?: "addition" | "deletion";
}

// Rows the panel body can show before it scrolls; later rows stay out of view, so plain fallbacks
// and skeletons stop there.
const codePanelLineLimit = 200;

interface CodePanelLinesProps {
  lines: CodePanelLine[];
  className?: string;
  /** Wrap long lines inside the code column instead of scrolling. */
  wrap?: boolean;
  /** Rows to render. Defaults to the rows a panel shows before it scrolls. */
  limit?: number;
  /**
   * Pad the code column. Turn it off when the container already pads the code, as a code block
   * without line numbers does.
   */
  inset?: boolean;
}

/**
 * Source as rows in the metrics Pierre and code blocks render with (`text-code-block`, the same
 * gutter). Code blocks render their highlighted rows through it, and file and diff views show
 * their known source with it until Pierre has rendered, so the swap changes colour, never
 * position.
 */
const CodePanelLines = ({
  lines,
  className,
  wrap = false,
  limit = codePanelLineLimit,
  inset = true,
}: CodePanelLinesProps) => {
  const shown = lines.slice(0, limit);
  const numbered = shown.some((line) => line.number !== undefined);
  // One gutter width for every row, sized by the widest number.
  const digits = String(Math.max(...shown.map((line) => line.number ?? 0), 1)).length;
  const gutter = { minWidth: `calc(${digits}ch + 2rem)` };

  return (
    <span
      data-slot="code-panel-lines"
      data-wrap={wrap ? "" : undefined}
      className={cn("grid text-code-block", wrap ? "min-w-0" : "min-w-max", className)}
    >
      {shown.map((line, index) => (
        <span
          // Rows are positional: a fallback is replaced, never reordered.
          key={`${index}:${line.number ?? ""}`}
          data-slot="code-panel-line"
          data-tone={line.tone}
          className="flex min-h-lh data-[tone=addition]:bg-success/8 data-[tone=deletion]:bg-error/8"
        >
          {numbered ? (
            <span
              aria-hidden="true"
              className="shrink-0 select-none px-4 text-end text-muted-foreground tabular-nums"
              style={gutter}
            >
              {line.number}
            </span>
          ) : null}
          <span
            className={cn(
              "min-w-0",
              inset && "ps-2 pe-4",
              wrap ? "whitespace-pre-wrap wrap-break-word" : "whitespace-pre",
            )}
          >
            {/* A blank row holds a newline so a copied selection keeps it. */}
            {line.content ?? (line.text === "" ? "\n" : line.text)}
          </span>
        </span>
      ))}
    </span>
  );
};

/** Numbered rows for a file's source. */
const sourceLines = (source: string, numbered = true): CodePanelLine[] =>
  source
    .replace(/\n$/u, "")
    .split("\n")
    .slice(0, codePanelLineLimit)
    .map((text, index) => ({ number: numbered ? index + 1 : undefined, text }));

// Generic lines for source that is not known yet, measured into a skeleton.
const placeholderLines = sourceLines(
  [
    'import { createThing } from "./thing";',
    "",
    "export const configure = (options) => {",
    "  const thing = createThing(options);",
    "  thing.start();",
    "",
    "  return thing;",
    "};",
  ].join("\n"),
);

type CodePanelContentProps = Omit<ComponentProps<"section">, "dir" | "dangerouslySetInnerHTML"> & {
  /**
   * Shown in place of the rendered code until the renderer has produced output. Pass the known
   * source as `CodePanelLines` so it reads at once and highlighting lands without a loading state.
   */
  fallback?: ReactNode;
  /**
   * The source itself is not known yet (it is being fetched). Draws a skeleton of code lines.
   * Prefer `fallback` whenever the source is in hand.
   */
  loading?: boolean;
  /** Replaces the body when there is nothing to render. */
  empty?: ReactNode;
};

const CodePanelContent = ({
  fallback,
  loading,
  empty,
  children,
  className,
  ...props
}: CodePanelContentProps) => {
  const showEmpty = empty !== undefined && empty !== null && empty !== false;
  let body: ReactNode = empty;

  if (!showEmpty) {
    body =
      loading === true ? (
        <Skeleton loading label="Loading code">
          <CodePanelLines lines={placeholderLines} />
        </Skeleton>
      ) : (
        // The renderer's host is empty until its first render, so the fallback holds the code's
        // place and the highlighted code lands where it was.
        <>
          {fallback}
          {children}
        </>
      );
  }

  return (
    <section
      aria-busy={loading === true ? true : undefined}
      data-slot="code-panel-content"
      {...props}
      dir="ltr"
      className={cn(
        "max-h-120 min-w-0 overflow-auto bg-surface-panel",
        codePanelFocusRing,
        className,
      )}
    >
      {body}
    </section>
  );
};

const CodePanelEmpty = ({ title, description }: { title: ReactNode; description?: ReactNode }) => (
  <Empty className="rounded-none border-0 p-panel sm:p-panel">
    <EmptyHeader>
      <EmptyTitle>{title}</EmptyTitle>
      {description !== undefined && description !== null ? (
        <EmptyDescription>{description}</EmptyDescription>
      ) : null}
    </EmptyHeader>
  </Empty>
);

export {
  CodePanel,
  CodePanelHeader,
  CodePanelTitle,
  CodePanelActions,
  CodePanelCopyButton,
  CodePanelContent,
  CodePanelEmpty,
  CodePanelLines,
  sourceLines,
  codePanelFocusRing,
  codePanelHeader,
  codePanelSurface,
  codePanelTitle,
};

export type { CodePanelProps, CodePanelContentProps, CodePanelLine, CodePanelLinesProps };
