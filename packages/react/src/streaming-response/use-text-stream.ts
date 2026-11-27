import * as React from "react";
import { aborted, untilAborted } from "../internal/until-aborted";
import { readTextStream } from "./core";
import type { ResponseStatus, TextStreamSource } from "./core";

/**
 * A stream, or a function that opens one. The function's signal aborts on `stop`, so pass it to
 * `fetch` or the model SDK to cancel the request too.
 */
type TextStreamInput =
  | TextStreamSource
  | ((signal: AbortSignal) => TextStreamSource | PromiseLike<TextStreamSource>);

interface UseTextStreamOptions {
  /** The stream ended or was stopped. */
  onFinish?: ((text: string, details: { stopped: boolean }) => void) | undefined;
  /** Opening or reading the stream failed. */
  onError?: ((error: Error, text: string) => void) | undefined;
}

interface TextStreamState {
  text: string;
  status: ResponseStatus;
  error?: Error | undefined;
}

interface TextStream extends TextStreamState {
  /** Stops any current stream and reads a new one from empty. Resolves when it settles. */
  start: (input: TextStreamInput) => Promise<void>;
  /** Ends the current stream and keeps its text. */
  stop: () => void;
  /** Ends the current stream and clears the text. */
  reset: () => void;
}

const idle: TextStreamState = { status: "idle", text: "" };

// oxlint-disable-next-line anti-slop/no-runtime-typeof -- "a stream or a function that opens one" is this hook's contract; neither stream type is callable.
const isOpener = (input: TextStreamInput) => typeof input === "function";

const toError = (cause: unknown) =>
  cause instanceof Error ? cause : new Error("The response stream failed.", { cause });

/**
 * Collects a text stream into the `text` and `status` a response renders. Text updates at most
 * once a frame, however fast it arrives.
 */
const useTextStream = ({ onError, onFinish }: UseTextStreamOptions = {}): TextStream => {
  const [state, setState] = React.useState(idle);
  const current = React.useRef<AbortController | null>(null);
  const callbacks = React.useRef({ onError, onFinish });

  React.useEffect(() => {
    callbacks.current = { onError, onFinish };
  }, [onError, onFinish]);

  const start = React.useCallback(async (input: TextStreamInput) => {
    current.current?.abort();

    const controller = new AbortController();
    const { signal } = controller;
    let text = "";
    let frame: number | null = null;

    current.current = controller;
    setState({ status: "pending", text: "" });

    // A newer stream, `reset` or an unmount replaces this one, which then reports nothing.
    const isCurrent = () => current.current === controller;

    const publish = () => {
      frame = null;

      if (isCurrent()) {
        setState({ text, status: "streaming" });
      }
    };

    const cancelPublish = () => {
      if (frame !== null) {
        cancelAnimationFrame(frame);
        frame = null;
      }
    };

    try {
      const source = isOpener(input)
        ? await untilAborted(Promise.resolve(input(signal)), signal)
        : input;

      if (source !== aborted) {
        await readTextStream(source, {
          onChunk: (chunk) => {
            text += chunk;
            frame ??= requestAnimationFrame(publish);
          },
          signal,
        });
      }
    } catch (error) {
      // Stopping makes a request reject; that is not a failure.
      if (!signal.aborted) {
        cancelPublish();

        if (isCurrent()) {
          const failure = toError(error);

          setState({ text, error: failure, status: "error" });
          callbacks.current.onError?.(failure, text);
        }

        return;
      }
    }

    cancelPublish();

    if (isCurrent()) {
      setState({ text, status: "complete" });
      callbacks.current.onFinish?.(text, { stopped: signal.aborted });
    }
  }, []);

  const stop = React.useCallback(() => {
    current.current?.abort();
  }, []);

  const reset = React.useCallback(() => {
    const controller = current.current;

    current.current = null;
    controller?.abort();
    setState(idle);
  }, []);

  React.useEffect(
    () => () => {
      const controller = current.current;

      current.current = null;
      controller?.abort();
    },
    [],
  );

  return React.useMemo(() => ({ ...state, reset, start, stop }), [reset, start, state, stop]);
};

export { useTextStream };

export type { TextStream, TextStreamInput, TextStreamState, UseTextStreamOptions };
