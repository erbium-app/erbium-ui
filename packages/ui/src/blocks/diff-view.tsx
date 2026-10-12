import { parseDiffFromFile } from "@pierre/diffs";
import type { DiffFileInput, FileDiffMetadata } from "@pierre/diffs";
import { FileDiff } from "@pierre/diffs/react";
import type { FileDiffProps, FileDiffOptions } from "@pierre/diffs/react";
import { createContext, use, useMemo, useState } from "react";
import type { ComponentProps, ReactNode } from "react";
import { enhanceDiffAccessibility } from "../lib/diff-accessibility";
import { diffTheme, diffThemeCSS } from "../lib/diff-theme";
import { cn } from "../lib/utils";
import {
  CodePanel,
  CodePanelActions,
  CodePanelContent,
  CodePanelCopyButton,
  CodePanelEmpty,
  CodePanelHeader,
  CodePanelTitle,
} from "./code-panel";
import type { CodePanelContentProps, CodePanelProps } from "./code-panel";
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
type DiffViewContextValue = {
  fileDiff: FileDiffMetadata;
  oldContents: string | undefined;
  newContents: string | undefined;
  content: ReactNode;
  /** True until Pierre has produced its first render. */
  loading: boolean;
};
const DiffViewContext = createContext<DiffViewContextValue | null>(null);
function useDiffView() {
  const context = use(DiffViewContext);
  if (!context) throw new Error("Diff view parts must be inside DiffView.");
  return context;
}

function DiffView<Annotation = undefined>({
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
}: DiffViewProps<Annotation>) {
  const fileDiff = useMemo(
    () =>
      providedDiff ??
      parseDiffFromFile(oldFile ?? null, newFile ?? null, options?.parseDiffOptions),
    [providedDiff, oldFile, newFile, options?.parseDiffOptions],
  );
  // Pierre highlights asynchronously, so its host stays empty until the first render.
  const [rendered, setRendered] = useState(false);
  const rendererOptions: FileDiffOptions<Annotation, undefined> = {
    diffIndicators: "classic",
    ...options,
    theme: diffTheme,
    themeType: "system",
    disableFileHeader: true,
    unsafeCSS: diffThemeCSS,
    onPostRender(node, instance, phase) {
      if (phase !== "unmount") {
        enhanceDiffAccessibility(node);
        setRendered(true);
      }
      return options?.onPostRender?.(node, instance, phase);
    },
  };
  const context = {
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
    loading: !rendered && prerenderedHTML === undefined,
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
  };
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
}

function DiffViewHeader(props: ComponentProps<typeof CodePanelHeader>) {
  return <CodePanelHeader {...props} data-slot="diff-view-header" />;
}
function DiffViewTitle({ children, ...props }: ComponentProps<typeof CodePanelTitle>) {
  const { fileDiff } = useDiffView();
  return (
    <CodePanelTitle {...props} data-slot="diff-view-title">
      <span className="truncate">
        {children ??
          (fileDiff.prevName && fileDiff.prevName !== fileDiff.name
            ? `${fileDiff.prevName} → ${fileDiff.name}`
            : fileDiff.name)}
      </span>
    </CodePanelTitle>
  );
}
function DiffViewActions(props: ComponentProps<typeof CodePanelActions>) {
  return <CodePanelActions {...props} data-slot="diff-view-actions" />;
}
function DiffViewStats({ className, ...props }: Omit<ComponentProps<"span">, "children">) {
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
}
function DiffViewContent(props: Omit<CodePanelContentProps, "children" | "empty" | "loading">) {
  const { content, fileDiff, loading } = useDiffView();
  const empty = fileDiff.hunks.length === 0;
  return (
    <CodePanelContent
      aria-label={`Changes to ${fileDiff.name}`}
      {...props}
      data-slot="diff-view-content"
      loading={loading}
      empty={
        empty ? (
          <CodePanelEmpty>
            {fileDiff.additionLines.length === 0 && fileDiff.deletionLines.length === 0
              ? "Empty file"
              : "No content changes"}
          </CodePanelEmpty>
        ) : undefined
      }
    >
      {content}
    </CodePanelContent>
  );
}
function DiffViewCopyButton({
  side = "new",
  ...props
}: Omit<CopyButtonProps, "value"> & { side?: "old" | "new" }) {
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
}

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
