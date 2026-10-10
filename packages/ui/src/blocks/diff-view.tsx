import { DirectionProvider } from "@base-ui/react/direction-provider";
import { parseDiffFromFile } from "@pierre/diffs";
import type { DiffFileInput, FileDiffMetadata } from "@pierre/diffs";
import { FileDiff } from "@pierre/diffs/react";
import type { FileDiffProps, FileDiffOptions } from "@pierre/diffs/react";
import { createContext, use, useMemo } from "react";
import type { ComponentProps, ReactNode } from "react";
import { Separator } from "../components/separator";
import { enhanceDiffAccessibility } from "../lib/diff-accessibility";
import { diffTheme, diffThemeCSS } from "../lib/diff-theme";
import { cn } from "../lib/utils";
import { CopyButton } from "./copy-button";
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
  Omit<ComponentProps<"div">, "children" | "dangerouslySetInnerHTML" | "dir"> &
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
  const rendererOptions: FileDiffOptions<Annotation, undefined> = {
    diffIndicators: "classic",
    ...options,
    theme: diffTheme,
    themeType: "system",
    disableFileHeader: true,
    unsafeCSS: diffThemeCSS,
    onPostRender(node, instance, phase) {
      if (phase !== "unmount") enhanceDiffAccessibility(node);
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
    <DirectionProvider direction="ltr">
      <DiffViewContext value={context}>
        <div
          {...props}
          dir="ltr"
          data-slot="diff-view"
          className={cn(
            "min-w-0 w-full overflow-hidden rounded-xl surface-panel text-foreground",
            className,
          )}
        >
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
        </div>
      </DiffViewContext>
    </DirectionProvider>
  );
}

function DiffViewHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <>
      <div
        {...props}
        data-slot="diff-view-header"
        className={cn(
          "flex min-h-10 flex-wrap items-center justify-between gap-related px-3 py-1.5",
          className,
        )}
      />
      <Separator variant="full" />
    </>
  );
}
function DiffViewTitle({ children, className, ...props }: ComponentProps<"span">) {
  const { fileDiff } = useDiffView();
  return (
    <span
      {...props}
      data-slot="diff-view-title"
      className={cn("min-w-0 truncate text-metadata font-medium text-muted-foreground", className)}
    >
      {children ??
        (fileDiff.prevName && fileDiff.prevName !== fileDiff.name
          ? `${fileDiff.prevName} → ${fileDiff.name}`
          : fileDiff.name)}
    </span>
  );
}
function DiffViewActions({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      {...props}
      data-slot="diff-view-actions"
      className={cn("flex shrink-0 items-center gap-related", className)}
    />
  );
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
function DiffViewContent({
  className,
  ...props
}: Omit<ComponentProps<"div">, "children" | "dangerouslySetInnerHTML" | "dir">) {
  const { content, fileDiff } = useDiffView();
  return (
    <div
      role="region"
      aria-label={`Changes to ${fileDiff.name}`}
      tabIndex={0}
      {...props}
      dir="ltr"
      data-slot="diff-view-content"
      className={cn(
        "max-h-120 min-w-0 overflow-auto bg-surface-panel outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
        className,
      )}
    >
      {fileDiff.hunks.length > 0 ? (
        content
      ) : (
        <p className="p-panel text-caption text-muted-foreground">
          {fileDiff.additionLines.length === 0 && fileDiff.deletionLines.length === 0
            ? "Empty file."
            : "No content changes."}
        </p>
      )}
    </div>
  );
}
function DiffViewCopyButton({
  side = "new",
  ...props
}: Omit<CopyButtonProps, "value"> & { side?: "old" | "new" }) {
  const { oldContents, newContents } = useDiffView();
  const contents = side === "old" ? oldContents : newContents;
  return (
    <CopyButton
      variant="ghost"
      size={props.children == null ? "icon-xs" : "xs"}
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
