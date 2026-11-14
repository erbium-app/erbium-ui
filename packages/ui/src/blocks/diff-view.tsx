import { parseDiffFromFile } from "@pierre/diffs";
import type { DiffFileInput, FileDiffMetadata } from "@pierre/diffs";
import { FileDiff } from "@pierre/diffs/react";
import type { FileDiffProps, FileDiffOptions } from "@pierre/diffs/react";
import { createContext, use, useMemo, useState } from "react";
import type { ComponentProps, ReactNode } from "react";
import { Icon } from "../components/icon";
import { applyDiffIcons } from "../lib/diff-icons";
import { enhanceDiffAccessibility } from "../lib/diff-accessibility";
import { fileIconName } from "../lib/file-icons";
import { diffTheme, diffThemeCSS } from "../lib/diff-theme";
import { cn } from "../lib/utils";
import {
  CodePanel,
  CodePanelActions,
  CodePanelContent,
  CodePanelCopyButton,
  CodePanelEmpty,
  CodePanelHeader,
  CodePanelLines,
  CodePanelTitle,
} from "./code-panel";
import type { CodePanelContentProps, CodePanelLine, CodePanelProps } from "./code-panel";
import type { CopyButtonProps } from "./copy-button";

type OwnedOptions =
  | "theme"
  | "themeType"
  | "unsafeCSS"
  | "disableFileHeader"
  | "renderCustomHeader"
  | "renderHeaderPrefix"
  | "renderHeaderFilenameSuffix"
  | "renderHeaderMetadata";

type DiffViewOptions<Annotation = undefined> = Omit<
  FileDiffOptions<Annotation, undefined>,
  OwnedOptions
>;

type DiffViewSource =
  | (DiffFileInput & { fileDiff?: never })
  | { fileDiff: FileDiffMetadata; oldFile?: never; newFile?: never };

type DiffViewProps<Annotation = undefined> = DiffViewSource &
  Omit<CodePanelProps, "children"> &
  Pick<
    FileDiffProps<Annotation, undefined>,
    | "lineAnnotations"
    | "selectedLines"
    | "renderAnnotation"
    | "renderGutterUtility"
    | "prerenderedHTML"
    | "metrics"
    | "disableWorkerPool"
  > & {
    options?: DiffViewOptions<Annotation>;
    children?: ReactNode;
  };

interface DiffViewContextValue {
  fileDiff: FileDiffMetadata;
  oldContents: string | undefined;
  newContents: string | undefined;
  content: ReactNode;
  /** False until Pierre has produced its first render; the plain diff shows until then. */
  rendered: boolean;
  /** Pierre's layout and gutter, so the plain diff matches them. */
  split: boolean;
  numbered: boolean;
}

const DiffViewContext = createContext<DiffViewContextValue | null>(null);

const useDiffView = () => {
  const context = use(DiffViewContext);

  if (!context) {
    throw new Error("Diff view parts must be inside DiffView.");
  }

  return context;
};

const DiffViewHeader = (props: ComponentProps<typeof CodePanelHeader>) => (
  <CodePanelHeader {...props} data-slot="diff-view-header" />
);

const DiffViewTitle = ({ children, ...props }: ComponentProps<typeof CodePanelTitle>) => {
  const { fileDiff } = useDiffView();

  return (
    <CodePanelTitle {...props} data-slot="diff-view-title">
      <Icon name={fileIconName(fileDiff.name)} className="size-4.5" />
      <span className="truncate">
        {children ??
          (fileDiff.prevName !== undefined &&
          fileDiff.prevName !== "" &&
          fileDiff.prevName !== fileDiff.name
            ? `${fileDiff.prevName} → ${fileDiff.name}`
            : fileDiff.name)}
      </span>
    </CodePanelTitle>
  );
};

const DiffViewActions = (props: ComponentProps<typeof CodePanelActions>) => (
  <CodePanelActions {...props} data-slot="diff-view-actions" />
);

const DiffViewStats = ({ className, ...props }: Omit<ComponentProps<"span">, "children">) => {
  const { fileDiff } = useDiffView();
  const additions = fileDiff.hunks.reduce((total, hunk) => total + hunk.additionLines, 0);
  const deletions = fileDiff.hunks.reduce((total, hunk) => total + hunk.deletionLines, 0);

  return (
    <span
      {...props}
      data-slot="diff-view-stats"
      className={cn("inline-flex items-center gap-2 text-metadata tabular-nums", className)}
    >
      <span className="text-success">
        +{additions}
        <span className="sr-only"> added lines</span>
      </span>
      <span className="text-error">
        −{deletions}
        <span className="sr-only"> deleted lines</span>
      </span>
    </span>
  );
};

interface DiffRow {
  old?: CodePanelLine;
  new?: CodePanelLine;
}

const stripEOL = (line: string | undefined) => (line ?? "").replace(/\r?\n$/u, "");

const changedLines = (
  source: string[],
  index: number,
  count: number,
  firstNumber: number,
  tone: "addition" | "deletion",
): CodePanelLine[] =>
  Array.from({ length: count }, (_, offset) => ({
    number: firstNumber + offset,
    text: stripEOL(source[index + offset]),
    tone,
  }));

/**
 * The diff's rows as plain text, in Pierre's layout: one column for `unified`, old and new side by
 * side for `split`. Shown until Pierre's first render, so the code reads at once and highlighting
 * lands in place.
 */
const diffRows = (fileDiff: FileDiffMetadata, split: boolean): DiffRow[] => {
  const rows: DiffRow[] = [];

  for (const hunk of fileDiff.hunks) {
    // Pierre draws a separator over the unchanged lines it collapses before each hunk.
    if (hunk.collapsedBefore > 0 || rows.length > 0) {
      rows.push(split ? { new: { text: "" }, old: { text: "" } } : { new: { text: "" } });
    }

    let oldNumber = hunk.deletionStart;
    let newNumber = hunk.additionStart;

    for (const block of hunk.hunkContent) {
      if (block.type === "context") {
        for (let offset = 0; offset < block.lines; offset += 1) {
          const text = stripEOL(fileDiff.additionLines[block.additionLineIndex + offset]);
          const newLine = { number: newNumber, text };
          rows.push(split ? { new: newLine, old: { number: oldNumber, text } } : { new: newLine });
          oldNumber += 1;
          newNumber += 1;
        }

        continue;
      }

      const deletions = changedLines(
        fileDiff.deletionLines,
        block.deletionLineIndex,
        block.deletions,
        oldNumber,
        "deletion",
      );

      const additions = changedLines(
        fileDiff.additionLines,
        block.additionLineIndex,
        block.additions,
        newNumber,
        "addition",
      );

      oldNumber += block.deletions;
      newNumber += block.additions;

      if (split) {
        for (let index = 0; index < Math.max(deletions.length, additions.length); index += 1) {
          rows.push({
            new: additions[index] ?? { text: "" },
            old: deletions[index] ?? { text: "" },
          });
        }
      } else {
        rows.push(
          ...deletions.map((line) => ({ new: line })),
          ...additions.map((line) => ({ new: line })),
        );
      }
    }
  }

  return rows;
};

const DiffViewFallback = ({ split, numbered }: { split: boolean; numbered: boolean }) => {
  const { fileDiff } = useDiffView();
  const rows = diffRows(fileDiff, split);

  const side = (key: "old" | "new") =>
    rows.map((row) => {
      const line = row[key] ?? { text: "" };

      return numbered ? line : { ...line, number: undefined };
    });

  return split ? (
    <div className="grid grid-cols-2">
      <CodePanelLines lines={side("old")} className="min-w-0 overflow-hidden" />
      <CodePanelLines lines={side("new")} className="min-w-0 overflow-hidden" />
    </div>
  ) : (
    <CodePanelLines lines={side("new")} />
  );
};

const DiffViewContent = (
  props: Omit<CodePanelContentProps, "children" | "empty" | "fallback" | "loading">,
) => {
  const { content, fileDiff, rendered, split, numbered } = useDiffView();
  const blank = fileDiff.additionLines.length === 0 && fileDiff.deletionLines.length === 0;

  const noChanges = blank ? (
    <CodePanelEmpty title="Empty file" description="This file has no contents." />
  ) : (
    <CodePanelEmpty
      title="No content changes"
      description="The two versions have identical contents."
    />
  );

  const empty = fileDiff.hunks.length > 0 ? undefined : noChanges;

  return (
    <CodePanelContent
      aria-label={`Changes to ${fileDiff.name}`}
      {...props}
      data-slot="diff-view-content"
      fallback={rendered ? undefined : <DiffViewFallback split={split} numbered={numbered} />}
      empty={empty}
    >
      {content}
    </CodePanelContent>
  );
};

const DiffViewCopyButton = ({
  side = "new",
  ...props
}: Omit<CopyButtonProps, "value"> & { side?: "old" | "new" }) => {
  const { oldContents, newContents } = useDiffView();
  const contents = side === "old" ? oldContents : newContents;

  return (
    <CodePanelCopyButton
      aria-label={`Copy ${side} file`}
      {...props}
      value={contents ?? ""}
      disabled={contents === undefined || props.disabled}
    />
  );
};

const DiffView = <Annotation = undefined,>({
  oldFile,
  newFile,
  fileDiff: providedDiff,
  options,
  lineAnnotations,
  selectedLines,
  renderAnnotation,
  renderGutterUtility,
  prerenderedHTML,
  metrics,
  disableWorkerPool,
  children,
  className,
  ...props
}: DiffViewProps<Annotation>) => {
  const fileDiff = useMemo(
    () =>
      providedDiff ??
      parseDiffFromFile(oldFile ?? null, newFile ?? null, options?.parseDiffOptions),
    [providedDiff, oldFile, newFile, options?.parseDiffOptions],
  );

  // Pierre highlights asynchronously, so its host stays empty until the first render; the plain
  // diff stands in until then.
  const [rendered, setRendered] = useState(false);

  const rendererOptions = useMemo(
    (): FileDiffOptions<Annotation, undefined> => ({
      diffIndicators: "classic",
      ...options,
      theme: diffTheme,
      themeType: "system",
      disableFileHeader: true,
      unsafeCSS: diffThemeCSS,
      onPostRender(node, instance, phase) {
        if (phase !== "unmount") {
          applyDiffIcons(node);
          enhanceDiffAccessibility(node);
          setRendered(true);
        }

        return options?.onPostRender?.(node, instance, phase);
      },
    }),
    [options],
  );

  const context = useMemo(
    () => ({
      fileDiff,
      // Partial patches cannot provide an exact full-file copy.
      oldContents:
        oldFile?.contents ??
        (!fileDiff.isPartial && fileDiff.type !== "new"
          ? fileDiff.deletionLines.join("")
          : undefined),
      newContents:
        newFile?.contents ??
        (!fileDiff.isPartial && fileDiff.type !== "deleted"
          ? fileDiff.additionLines.join("")
          : undefined),
      rendered: rendered || prerenderedHTML !== undefined,
      split: options?.diffStyle !== "unified",
      numbered: options?.disableLineNumbers !== true,
      content: (
        <FileDiff
          fileDiff={fileDiff}
          options={rendererOptions}
          lineAnnotations={lineAnnotations}
          selectedLines={selectedLines}
          renderAnnotation={renderAnnotation}
          renderGutterUtility={renderGutterUtility}
          prerenderedHTML={prerenderedHTML}
          metrics={metrics}
          disableWorkerPool={disableWorkerPool}
        />
      ),
    }),
    [
      disableWorkerPool,
      fileDiff,
      lineAnnotations,
      metrics,
      newFile?.contents,
      oldFile?.contents,
      options?.diffStyle,
      options?.disableLineNumbers,
      prerenderedHTML,
      renderAnnotation,
      renderGutterUtility,
      rendered,
      rendererOptions,
      selectedLines,
    ],
  );

  return (
    <DiffViewContext value={context}>
      <CodePanel {...props} data-slot="diff-view" className={className}>
        {children ?? (
          <>
            <DiffViewHeader>
              <DiffViewTitle />
              <DiffViewActions>
                <DiffViewStats />
                <DiffViewCopyButton />
              </DiffViewActions>
            </DiffViewHeader>
            <DiffViewContent />
          </>
        )}
      </CodePanel>
    </DiffViewContext>
  );
};

export {
  DiffView,
  DiffViewHeader,
  DiffViewTitle,
  DiffViewStats,
  DiffViewActions,
  DiffViewContent,
  DiffViewCopyButton,
};

export type { DiffViewProps, DiffViewOptions };

export type {
  FileContents,
  FileDiffMetadata,
  DiffLineAnnotation,
  SelectedLineRange,
} from "@pierre/diffs";
