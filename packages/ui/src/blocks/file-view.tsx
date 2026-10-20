import { File as PierreFile } from "@pierre/diffs/react";
import type { FileProps, FileOptions } from "@pierre/diffs/react";
import type { FileContents } from "@pierre/diffs";
import { createContext, use, useState } from "react";
import type { ComponentProps, ReactNode } from "react";
import { Icon } from "../components/icon";
import { diffTheme, diffThemeCSS } from "../lib/diff-theme";
import { fileIconName } from "../lib/file-icons";
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

type FileViewOptions<Annotation = undefined> = Omit<
  FileOptions<Annotation, undefined>,
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
  /** True until Pierre has produced its first render. */
  loading: boolean;
} | null>(null);

const useFileView = () => {
  const context = use(FileViewContext);

  if (!context) {
    throw new Error("File view parts must be inside FileView.");
  }

  return context;
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
  // Pierre highlights asynchronously, so its host stays empty until the first render.
  const [rendered, setRendered] = useState(false);

  const content = (
    <PierreFile
      file={file}
      options={{
        ...options,
        disableFileHeader: true,
        onPostRender(node, instance, phase) {
          if (phase !== "unmount") {
            setRendered(true);
          }

          return options?.onPostRender?.(node, instance, phase);
        },
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
  );

  return (
    <FileViewContext value={{ content, file, loading: !rendered && prerenderedHTML === undefined }}>
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

const FileViewContent = (props: Omit<CodePanelContentProps, "children" | "empty" | "loading">) => {
  const { content, file, loading } = useFileView();

  return (
    <CodePanelContent
      aria-label={`Contents of ${file.name}`}
      {...props}
      data-slot="file-view-content"
      loading={loading}
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
