import { createContext, lazy, Suspense, use, useLayoutEffect, useMemo, useRef } from "react";
import type { ComponentProps, ReactNode } from "react";
import type { ThemeOptions } from "@pierre/highlights";
import type { MarkdownProps } from "@pierre/words/react";
import {
  isRemoteUrl,
  isResponseBusy,
  isResponsePending,
  isResponseSettled,
} from "@erbium-ui/react/streaming-response/core";
import type { ResponseStatus } from "@erbium-ui/react/streaming-response/core";
import { Alert, AlertDescription } from "../components/alert";
import { useIconSpriteHref } from "../components/icon";
import { Marker, MarkerContent, MarkerIcon } from "../components/marker";
import { Spinner } from "../components/spinner";
import { useCopyToClipboard } from "../hooks/use-copy-to-clipboard";
import {
  createResponseElementHooks,
  responseCopyButtons,
  showCopyStatus,
} from "../lib/streaming-response-markup";
import { cn } from "../lib/utils";

type ResponseUrlTransform = NonNullable<MarkdownProps["urlTransform"]>;

// A remote image is requested as soon as it renders, so a prompt-injected model could send data
// away in its URL. Links stay, since they load only when someone follows them.
const blockRemoteImages: ResponseUrlTransform = (url, key) =>
  key === "src" && isRemoteUrl(url) ? null : url;

const copyAnnouncements = {
  copied: "Copied to clipboard.",
  error: "Unable to copy. Please try again.",
  idle: "",
};

const ResponseSource = ({ children, className }: MarkdownProps) => (
  <div data-slot="streaming-response-content" className={cn(className, "whitespace-pre-wrap")}>
    {children}
  </div>
);

// Words and Highlights compile WebAssembly at import, so they load with the first response.
const loadMarkdown = async () => {
  try {
    const [words, { createHighlightsPlugin }, light, dark] = await Promise.all([
      import("@pierre/words/react"),
      import("@pierre/words/highlights"),
      import("@pierre/highlights/themes/vitesse-light"),
      import("@pierre/highlights/themes/vitesse-dark"),
    ]);

    // The same themes and color properties as `CodeBlock`.
    const themes = { themes: { dark: dark.default, light: light.default } } satisfies ThemeOptions;
    const code = createHighlightsPlugin({ ...themes, defaultColor: false });

    const ResponseMarkdown = ({
      components,
      plugins,
      urlTransform = blockRemoteImages,
      ...props
    }: MarkdownProps) => (
      <words.Markdown
        lineNumbers={false}
        {...props}
        // The element hooks draw the code block's header and copy button.
        controls={false}
        components={components}
        plugins={{ code, ...plugins }}
        // Unsafe schemes such as `javascript:` are removed before any app policy sees the URL.
        urlTransform={(url, key) => {
          const safe = words.defaultUrlTransform(url);

          return safe === undefined ? null : urlTransform(safe, key);
        }}
      />
    );

    return { default: ResponseMarkdown };
  } catch {
    // Where WebAssembly is unavailable or blocked, the source stays readable as text.
    return { default: ResponseSource };
  }
};

const LazyMarkdown = lazy(loadMarkdown);

/** Loads the Markdown renderer before the first response, for example when a chat opens. */
const preloadStreamingResponse = async () => {
  await loadMarkdown();
};

interface StreamingResponseState {
  text: string;
  status: ResponseStatus;
  error: ReactNode;
}

const StreamingResponseContext = createContext<StreamingResponseState | null>(null);

/** The text, status and error of the surrounding `StreamingResponse`. */
const useStreamingResponse = () => {
  const context = use(StreamingResponseContext);

  if (!context) {
    throw new Error("Streaming response parts must be inside StreamingResponse.");
  }

  return context;
};

type StreamingResponseProps = ComponentProps<"div"> & {
  /** The Markdown received so far. Pass all of it on each update. */
  text?: string;
  status?: ResponseStatus;
  /** What went wrong, shown when `status` is `error`. */
  error?: ReactNode;
};

/**
 * One response from a model. Without children it shows the waiting state, the Markdown and the
 * error; pass parts to arrange them or add actions.
 */
const StreamingResponse = ({
  text = "",
  status = "complete",
  error,
  children,
  className,
  ...props
}: StreamingResponseProps) => {
  const context = useMemo(() => ({ error, status, text }), [error, status, text]);

  return (
    <StreamingResponseContext value={context}>
      <div
        {...props}
        data-slot="streaming-response"
        data-status={status}
        className={cn("flex w-full min-w-0 flex-col gap-related", className)}
      >
        {children ?? (
          <>
            <StreamingResponsePending />
            <StreamingResponseContent />
            <StreamingResponseError />
          </>
        )}
      </div>
    </StreamingResponseContext>
  );
};

type StreamingResponseContentProps = Omit<
  MarkdownProps,
  "caret" | "children" | "controls" | "isAnimating" | "mode"
> & {
  /** The shape of the caret that marks where text is arriving. */
  caret?: MarkdownProps["caret"] | false;
};

/**
 * The response's Markdown, rendered by Pierre's `Markdown`, whose props it takes. Code blocks,
 * tables, task lists, callouts and rules look like Erbium's components. Define `islands`
 * outside render: a new object formats the whole response again.
 */
const StreamingResponseContent = ({
  animated = true,
  caret = "block",
  className,
  components,
  onClick,
  ...props
}: StreamingResponseContentProps) => {
  const { status, text } = useStreamingResponse();
  const spriteHref = useIconSpriteHref();
  const hooks = useMemo(() => createResponseElementHooks(spriteHref), [spriteHref]);
  const clipboard = useCopyToClipboard();
  // A position rather than an element, which Pierre may replace.
  const copied = useRef<{ content: Element; index: number } | null>(null);

  // Pierre resets the button's markup as text arrives, so its state is written after every
  // render, once Pierre has updated the HTML.
  useLayoutEffect(() => {
    if (copied.current) {
      const { content, index } = copied.current;
      showCopyStatus(responseCopyButtons(content)[index], clipboard.status);
    }
  });

  // Code block copy buttons are part of the Markdown's HTML, so one handler serves them all.
  const handleClick: NonNullable<MarkdownProps["onClick"]> = (event) => {
    onClick?.(event);

    const target = event.target instanceof Element ? event.target : null;
    const button = target?.closest("[data-response-copy]");
    const source = button?.closest('[data-markdown="code-block"]')?.querySelector("pre code");

    if (event.defaultPrevented || !button || !source) {
      return;
    }

    const content = event.currentTarget;
    const buttons = responseCopyButtons(content);

    if (copied.current) {
      showCopyStatus(responseCopyButtons(copied.current.content)[copied.current.index], "idle");
    }

    copied.current = { content, index: buttons.indexOf(button) };
    void clipboard.copyToClipboard(source.textContent ?? "");
  };

  if (text === "") {
    return null;
  }

  const contentClassName = cn("typeset", className);

  return (
    <>
      <Suspense fallback={<ResponseSource className={contentClassName}>{text}</ResponseSource>}>
        <LazyMarkdown
          {...props}
          animated={animated}
          aria-busy={isResponseBusy(status) || undefined}
          caret={caret === false ? undefined : caret}
          className={contentClassName}
          components={{ ...hooks, ...components }}
          data-slot="streaming-response-content"
          isAnimating={status === "streaming"}
          onClick={handleClick}
        >
          {text}
        </LazyMarkdown>
      </Suspense>
      <output className="sr-only" aria-atomic="true">
        <span key={clipboard.revision}>{copyAnnouncements[clipboard.status]}</span>
      </output>
    </>
  );
};

/** Shown while a request is in flight and no text has arrived. */
const StreamingResponsePending = ({
  children = "Thinking…",
  ...props
}: ComponentProps<typeof Marker>) => {
  const { status, text } = useStreamingResponse();

  if (!isResponsePending(status, text)) {
    return null;
  }

  return (
    <Marker render={<output />} {...props} data-slot="streaming-response-pending">
      <MarkerIcon>
        <Spinner />
      </MarkerIcon>
      <MarkerContent className="shimmer">{children}</MarkerContent>
    </Marker>
  );
};

/** Shown when the stream failed. It shows the response's `error` unless it has children. */
const StreamingResponseError = ({
  children,
  ...props
}: Omit<ComponentProps<typeof Alert>, "variant">) => {
  const { error, status } = useStreamingResponse();

  if (status !== "error") {
    return null;
  }

  return (
    <Alert {...props} variant="error" data-slot="streaming-response-error">
      <AlertDescription>{children ?? error ?? "The response failed."}</AlertDescription>
    </Alert>
  );
};

/** Controls for a finished response, such as copy and retry. Hidden while text can arrive. */
const StreamingResponseActions = ({ className, ...props }: ComponentProps<"div">) => {
  const { status } = useStreamingResponse();

  if (!isResponseSettled(status)) {
    return null;
  }

  return (
    <div
      {...props}
      data-slot="streaming-response-actions"
      className={cn("flex items-center gap-1", className)}
    />
  );
};

export {
  StreamingResponse,
  StreamingResponseContent,
  StreamingResponsePending,
  StreamingResponseError,
  StreamingResponseActions,
  useStreamingResponse,
  preloadStreamingResponse,
};

export { useTextStream } from "@erbium-ui/react/streaming-response";

export type { StreamingResponseProps, StreamingResponseContentProps, StreamingResponseState };

export type { ReactiveIslands as StreamingResponseIslands } from "@pierre/words/react";

export type { ResponseStatus } from "@erbium-ui/react/streaming-response/core";
