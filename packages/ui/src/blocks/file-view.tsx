import { File as PierreFile } from "@pierre/diffs/react";
import type { FileProps, FileOptions } from "@pierre/diffs/react";
import type { FileContents } from "@pierre/diffs";
import { createContext, use, useMemo, useState } from "react";
import type { ComponentProps, ReactNode } from "react";
import { Icon } from "../components/icon";
import { enhanceDiffAccessibility } from "../lib/diff-accessibility";
import { applyDiffIcons } from "../lib/diff-icons";
import { diffHighlighter, diffTheme, diffThemeCSS } from "../lib/diff-theme";
import { fileIconName } from "../lib/file-icons";
import {
  CodePanel,
  CodePanelActions,
  CodePanelContent,
  CodePanelCopyButton,
  CodePanelEmpty,
  CodePanelHeader,
  CodePanelLines,
  CodePanelTitle,
  sourceLines,
} from "./code-panel";
import type { CodePanelContentProps, CodePanelProps } from "./code-panel";
import type { CopyButtonProps } from "./copy-button";

type FileViewOptions<Annotation = undefined> = Omit<
  FileOptions<Annotation, undefined>,
  | "preferredHighlighter"
  | "theme"
  | "themeType"
  | "unsafeCSS"
  | "disableFileHeader"
  | "renderCustomHeader"
  | "renderHeaderPrefix"
  | "renderHeaderFilenameSuffix"
  | "renderHeaderMetadata"
>;

type FileViewProps<Annotation = undefined> = Omit<CodePanelProps, "children"> &
  Pick<
    FileProps<Annotation, undefined>,
    | "file"
    | "lineAnnotations"
    | "selectedLines"
    | "renderAnnotation"
    | "renderGutterUtility"
    | "prerenderedHTML"
    | "metrics"
    | "disableWorkerPool"
  > & {
    options?: FileViewOptions<Annotation>;
    children?: ReactNode;
  };

const FileViewContext = createContext<{
  file: FileContents;
  content: ReactNode;
  /** Whether Pierre draws line numbers, so the plain source matches. */
  numbered: boolean;
  /** False until Pierre has produced its first render; the plain source shows until then. */
  rendered: boolean;
} | null>(null);

const useFileView = () => {
  const context = use(FileViewContext);

  if (!context) {
    throw new Error("File view parts must be inside FileView.");
  }

  return context;
};

const FileViewHeader = (props: ComponentProps<typeof CodePanelHeader>) => (
  <CodePanelHeader {...props} data-slot="file-view-header" />
);

const FileViewTitle = ({ children, ...props }: ComponentProps<typeof CodePanelTitle>) => {
  const { file } = useFileView();

  return (
    <CodePanelTitle {...props} data-slot="file-view-title">
      <Icon name={fileIconName(file.name)} className="size-4.5" />
      <span className="truncate">{children ?? file.name}</span>
    </CodePanelTitle>
  );
};

const FileViewActions = (props: ComponentProps<typeof CodePanelActions>) => (
  <CodePanelActions {...props} data-slot="file-view-actions" />
);

const FileViewContent = (
  props: Omit<CodePanelContentProps, "children" | "empty" | "fallback" | "loading">,
) => {
  const { content, file, rendered, numbered } = useFileView();

  return (
    <CodePanelContent
      aria-label={`Contents of ${file.name}`}
      {...props}
      data-slot="file-view-content"
      fallback={
        rendered ? undefined : <CodePanelLines lines={sourceLines(file.contents, numbered)} />
      }
      empty={
        file.contents.length === 0 ? (
          <CodePanelEmpty title="Empty file" description="This file has no contents." />
        ) : undefined
      }
    >
      {content}
    </CodePanelContent>
  );
};

const FileViewCopyButton = (props: Omit<CopyButtonProps, "value">) => {
  const { file } = useFileView();

  return <CodePanelCopyButton aria-label="Copy file" {...props} value={file.contents} />;
};

const FileView = <Annotation = undefined,>({
  file,
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
}: FileViewProps<Annotation>) => {
  // Pierre highlights asynchronously, so its host stays empty until the first render; the plain
  // source stands in until then.
  const [rendered, setRendered] = useState(false);

  const numbered = options?.disableLineNumbers !== true;
  const ready = rendered || prerenderedHTML !== undefined;

  const context = useMemo(
    () => ({
      file,
      numbered,
      content: (
        <PierreFile
          file={file}
          options={{
            ...options,
            disableFileHeader: true,
            onPostRender(node, instance, phase) {
              if (phase !== "unmount") {
                // The same Erbium icons and keyboard support as Diff View, for Pierre's gutter
                // utility and any other controls it draws.
                applyDiffIcons(node);
                enhanceDiffAccessibility(node);
                setRendered(true);
              }

              return options?.onPostRender?.(node, instance, phase);
            },
            preferredHighlighter: diffHighlighter(),
            theme: diffTheme,
            themeType: "system",
            unsafeCSS: diffThemeCSS,
          }}
          lineAnnotations={lineAnnotations}
          selectedLines={selectedLines}
          renderAnnotation={renderAnnotation}
          renderGutterUtility={renderGutterUtility}
          prerenderedHTML={prerenderedHTML}
          metrics={metrics}
          disableWorkerPool={disableWorkerPool}
        />
      ),
      rendered: ready,
    }),
    [
      disableWorkerPool,
      file,
      lineAnnotations,
      metrics,
      numbered,
      options,
      prerenderedHTML,
      ready,
      renderAnnotation,
      renderGutterUtility,
      selectedLines,
    ],
  );

  return (
    <FileViewContext value={context}>
      <CodePanel {...props} data-slot="file-view" className={className}>
        {children ?? (
          <>
            <FileViewHeader>
              <FileViewTitle />
              <FileViewActions>
                <FileViewCopyButton />
              </FileViewActions>
            </FileViewHeader>
            <FileViewContent />
          </>
        )}
      </CodePanel>
    </FileViewContext>
  );
};

export {
  FileView,
  FileViewHeader,
  FileViewTitle,
  FileViewActions,
  FileViewContent,
  FileViewCopyButton,
};

export type { FileViewProps, FileViewOptions };

export type { FileContents, LineAnnotation, SelectedLineRange } from "@pierre/diffs";
