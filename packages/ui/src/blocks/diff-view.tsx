import { parseDiffFromFile, parsePatchFiles } from "@pierre/diffs";
import type { ChangeContent, ContextContent, DiffFileInput, FileDiffMetadata } from "@pierre/diffs";
import { FileDiff } from "@pierre/diffs/react";
import type { FileDiffProps, FileDiffOptions } from "@pierre/diffs/react";
import { createContext, use, useMemo, useState } from "react";
import type { ComponentProps, ReactNode } from "react";
import { Icon } from "../components/icon";
import { applyDiffIcons } from "../lib/diff-icons";
import { enhanceDiffAccessibility } from "../lib/diff-accessibility";
import { fileIconName } from "../lib/file-icons";
import { diffHighlighter, diffTheme, diffThemeCSS } from "../lib/diff-theme";
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
  | "preferredHighlighter"
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
  | (DiffFileInput & { fileDiff?: never; patch?: never })
  | { fileDiff: FileDiffMetadata; oldFile?: never; newFile?: never; patch?: never }
  | {
      /** A unified diff or `git diff` output for one file. */
      patch: string;
      oldFile?: never;
      newFile?: never;
      fileDiff?: never;
    };

/** The one file a patch changes. */
const patchDiff = (patch: string): FileDiffMetadata => {
  const files = parsePatchFiles(patch).flatMap((parsed) => parsed.files);
  const [file] = files;

  if (file === undefined || files.length > 1) {
    throw new Error(
      `DiffView expects a patch for exactly one file; this patch changes ${files.length}.`,
    );
  }

  return file;
};

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
  /** Pierre's classic `+` and `-` markers are on. */
  indicators: boolean;
  /** The longest gap of unchanged lines Pierre shows instead of collapsing. */
  collapse: number;
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
  const { name, prevName = "" } = fileDiff;
  const renamed = prevName !== "" && prevName !== name;

  return (
    <CodePanelTitle {...props} data-slot="diff-view-title">
      <Icon name={fileIconName(name)} className="size-4.5" />
      <span className="truncate">{children ?? (renamed ? `${prevName} → ${name}` : name)}</span>
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

const separatorRow = (split: boolean): DiffRow =>
  split
    ? { new: { text: "", tone: "separator" }, old: { text: "", tone: "separator" } }
    : { new: { text: "", tone: "separator" } };

/** Unchanged lines `count` long, ending just before line `oldEnd` and `newEnd`. */
const unchangedRows = (
  fileDiff: FileDiffMetadata,
  split: boolean,
  { count, oldEnd, newEnd }: { count: number; oldEnd: number; newEnd: number },
): DiffRow[] =>
  Array.from({ length: count }, (_, offset) => {
    const newNumber = newEnd - count + offset;
    const text = stripEOL(fileDiff.additionLines[newNumber - 1]);
    const newLine = { number: newNumber, text };

    return split
      ? { new: newLine, old: { number: oldEnd - count + offset, text } }
      : { new: newLine };
  });

/**
 * Pierre's rule for unchanged lines between hunks: it shows a gap of up to `collapse` lines (all of
 * them with `expandUnchanged`) and draws a separator over a longer one. A partial patch has no
 * text for the gap, so every gap is a separator.
 */
const gapRows = (
  fileDiff: FileDiffMetadata,
  split: boolean,
  collapse: number,
  gap: { count: number; oldEnd: number; newEnd: number },
): DiffRow[] => {
  if (gap.count <= 0) {
    return [];
  }

  return !fileDiff.isPartial && gap.count <= collapse
    ? unchangedRows(fileDiff, split, gap)
    : [separatorRow(split)];
};

/** The next old and new line numbers. */
interface DiffCursor {
  old: number;
  new: number;
}

/** Unchanged lines inside a hunk, from `cursor`. */
const contextRows = (
  fileDiff: FileDiffMetadata,
  split: boolean,
  block: ContextContent,
  cursor: DiffCursor,
): DiffRow[] =>
  Array.from({ length: block.lines }, (_, offset) => {
    const text = stripEOL(fileDiff.additionLines[block.additionLineIndex + offset]);
    const newLine = { number: cursor.new + offset, text };

    return split ? { new: newLine, old: { number: cursor.old + offset, text } } : { new: newLine };
  });

/** Deleted then added lines, side by side for `split`, from `cursor`. */
const changeRows = (
  fileDiff: FileDiffMetadata,
  split: boolean,
  block: ChangeContent,
  cursor: DiffCursor,
): DiffRow[] => {
  const deletions = changedLines(
    fileDiff.deletionLines,
    block.deletionLineIndex,
    block.deletions,
    cursor.old,
    "deletion",
  );

  const additions = changedLines(
    fileDiff.additionLines,
    block.additionLineIndex,
    block.additions,
    cursor.new,
    "addition",
  );

  if (!split) {
    return [...deletions, ...additions].map((line) => ({ new: line }));
  }

  return Array.from({ length: Math.max(deletions.length, additions.length) }, (_, index) => ({
    new: additions[index] ?? { text: "" },
    old: deletions[index] ?? { text: "" },
  }));
};

/** The first line number of a hunk side; an empty side starts after its anchor line. */
const hunkStart = (start: number, count: number) => (count === 0 ? start + 1 : start);

/** Unchanged lines after the last hunk, which a partial patch does not know. */
const trailingRows = (
  fileDiff: FileDiffMetadata,
  split: boolean,
  collapse: number,
  cursor: DiffCursor,
): DiffRow[] => {
  const trailing = fileDiff.additionLines.length - cursor.new + 1;
  const known = !fileDiff.isPartial && fileDiff.deletionLines.length > 0;

  if (!known || fileDiff.hunks.length === 0 || trailing <= 0) {
    return [];
  }

  return gapRows(fileDiff, split, collapse, {
    count: trailing,
    oldEnd: cursor.old + trailing,
    newEnd: cursor.new + trailing,
  });
};

/**
 * The diff's rows as plain text, in Pierre's layout: one column for `unified`, old and new side by
 * side for `split`, with Pierre's separators. Shown until Pierre's first render, so the code reads
 * at once and highlighting lands in place.
 */
const diffRows = (fileDiff: FileDiffMetadata, split: boolean, collapse: number): DiffRow[] => {
  const rows: DiffRow[] = [];
  let cursor: DiffCursor = { new: 1, old: 1 };

  for (const hunk of fileDiff.hunks) {
    cursor = {
      new: hunkStart(hunk.additionStart, hunk.additionCount),
      old: hunkStart(hunk.deletionStart, hunk.deletionCount),
    };

    rows.push(
      ...gapRows(fileDiff, split, collapse, {
        count: hunk.collapsedBefore,
        oldEnd: cursor.old,
        newEnd: cursor.new,
      }),
    );

    for (const block of hunk.hunkContent) {
      if (block.type === "context") {
        rows.push(...contextRows(fileDiff, split, block, cursor));
        cursor = { new: cursor.new + block.lines, old: cursor.old + block.lines };
      } else {
        rows.push(...changeRows(fileDiff, split, block, cursor));
        cursor = { new: cursor.new + block.additions, old: cursor.old + block.deletions };
      }
    }
  }

  rows.push(...trailingRows(fileDiff, split, collapse, cursor));

  return rows;
};

/** The last line number of a hunk side, or its anchor line when the side is empty. */
const hunkEnd = (start: number, count: number) => (count === 0 ? start : start + count - 1);

/** The digits Pierre sizes its number column for: the longest side of the file. */
const diffDigits = (fileDiff: FileDiffMetadata) => {
  const last = fileDiff.hunks.at(-1);

  const lastLine = last
    ? Math.max(
        hunkEnd(last.additionStart, last.additionCount),
        hunkEnd(last.deletionStart, last.deletionCount),
      )
    : 0;

  return String(Math.max(lastLine, fileDiff.additionLines.length, fileDiff.deletionLines.length, 1))
    .length;
};

const DiffViewFallback = () => {
  const { fileDiff, split, numbered, indicators, collapse } = useDiffView();
  const rows = diffRows(fileDiff, split, collapse);
  const lines = { indicators, minDigits: diffDigits(fileDiff) };

  const side = (key: "old" | "new") =>
    rows.map((row) => {
      const { number, ...unnumbered } = row[key] ?? { text: "" };

      return numbered ? { ...unnumbered, number } : unnumbered;
    });

  // Pierre leaves out the empty side of an added or deleted file.
  if (!split || fileDiff.type === "new") {
    return <CodePanelLines lines={side("new")} {...lines} />;
  }

  if (fileDiff.type === "deleted") {
    return <CodePanelLines lines={side("old")} {...lines} />;
  }

  return (
    <div className="grid grid-cols-2">
      <CodePanelLines lines={side("old")} className="min-w-0 overflow-hidden" {...lines} />
      <CodePanelLines lines={side("new")} className="min-w-0 overflow-hidden" {...lines} />
    </div>
  );
};

const DiffViewContent = (
  props: Omit<CodePanelContentProps, "children" | "empty" | "fallback" | "loading">,
) => {
  const { content, fileDiff, rendered } = useDiffView();
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
      fallback={rendered ? undefined : <DiffViewFallback />}
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
  patch,
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
      (patch === undefined
        ? parseDiffFromFile(oldFile ?? null, newFile ?? null, options?.parseDiffOptions)
        : patchDiff(patch)),
    [providedDiff, patch, oldFile, newFile, options?.parseDiffOptions],
  );

  // Pierre highlights asynchronously, so its host stays empty until the first render; the plain
  // diff stands in until then.
  const [rendered, setRendered] = useState(false);

  const rendererOptions = useMemo(
    (): FileDiffOptions<Annotation, undefined> => ({
      diffIndicators: "classic",
      ...options,
      preferredHighlighter: diffHighlighter(),
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
      indicators: (options?.diffIndicators ?? "classic") === "classic",
      collapse:
        options?.expandUnchanged === true
          ? Number.POSITIVE_INFINITY
          : (options?.collapsedContextThreshold ?? 1),
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
      options?.diffIndicators,
      options?.expandUnchanged,
      options?.collapsedContextThreshold,
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
