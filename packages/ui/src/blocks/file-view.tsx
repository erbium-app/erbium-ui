import { DirectionProvider } from "@base-ui/react/direction-provider";
import { File as PierreFile } from "@pierre/diffs/react";
import type { FileProps, FileOptions } from "@pierre/diffs/react";
import type { FileContents } from "@pierre/diffs";
import { createContext, use } from "react";
import type { ComponentProps, ReactNode } from "react";
import { Separator } from "../components/separator";
import { diffTheme, diffThemeCSS } from "../lib/diff-theme";
import { cn } from "../lib/utils";
import { CopyButton } from "./copy-button";
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
type FileViewProps<Annotation = undefined> = Omit<
  ComponentProps<"div">,
  "children" | "dangerouslySetInnerHTML" | "dir"
> &
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
const FileViewContext = createContext<{ file: FileContents; content: ReactNode } | null>(null);
function useFileView() {
  const context = use(FileViewContext);
  if (!context) throw new Error("File view parts must be inside FileView.");
  return context;
}
function FileView<Annotation = undefined>({
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
}: FileViewProps<Annotation>) {
  const content = (
    <PierreFile
      file={file}
      options={{
        ...options,
        theme: diffTheme,
        themeType: "system",
        disableFileHeader: true,
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
    <DirectionProvider direction="ltr">
      <FileViewContext value={{ file, content }}>
        <div
          {...props}
          dir="ltr"
          data-slot="file-view"
          className={cn(
            "min-w-0 w-full overflow-hidden rounded-xl surface-panel text-foreground",
            className,
          )}
        >
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
        </div>
      </FileViewContext>
    </DirectionProvider>
  );
}
function FileViewHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <>
      <div
        {...props}
        data-slot="file-view-header"
        className={cn(
          "flex min-h-10 flex-wrap items-center justify-between gap-related px-3 py-1.5",
          className,
        )}
      />
      <Separator variant="full" />
    </>
  );
}
function FileViewTitle({ children, className, ...props }: ComponentProps<"span">) {
  const { file } = useFileView();
  return (
    <span
      {...props}
      data-slot="file-view-title"
      className={cn("min-w-0 truncate text-metadata font-medium text-muted-foreground", className)}
    >
      {children ?? file.name}
    </span>
  );
}
function FileViewActions({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      {...props}
      data-slot="file-view-actions"
      className={cn("flex shrink-0 items-center gap-related", className)}
    />
  );
}
function FileViewContent({
  className,
  ...props
}: Omit<ComponentProps<"div">, "children" | "dangerouslySetInnerHTML" | "dir">) {
  const { content, file } = useFileView();
  return (
    <div
      role="region"
      aria-label={`Contents of ${file.name}`}
      tabIndex={0}
      {...props}
      dir="ltr"
      data-slot="file-view-content"
      className={cn(
        "max-h-120 min-w-0 overflow-auto bg-surface-panel outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
        className,
      )}
    >
      {file.contents.length > 0 ? (
        content
      ) : (
        <p className="p-panel text-caption text-muted-foreground">Empty file.</p>
      )}
    </div>
  );
}
function FileViewCopyButton(props: Omit<CopyButtonProps, "value">) {
  const { file } = useFileView();
  return (
    <CopyButton
      variant="ghost"
      size={props.children == null ? "icon-xs" : "xs"}
      aria-label="Copy file"
      {...props}
      value={file.contents}
    />
  );
}
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
