import { aborted, untilAborted } from "../internal/until-aborted";

/*
 * Pure logic for a response that arrives as a stream: its lifecycle, reading a text stream, and
 * telling remote URLs apart. Nothing here imports React, so servers can call it.
 */

/**
 * Where a response is in its life.
 *
 * - `idle`: nothing has been requested.
 * - `pending`: requested, and no text has arrived.
 * - `streaming`: text is arriving.
 * - `complete`: the text is final, whether the model finished or the reader stopped it.
 * - `error`: the stream failed. Text that arrived stays.
 */
type ResponseStatus = "idle" | "pending" | "streaming" | "complete" | "error";

/** Whether more text can still arrive. */
const isResponseBusy = (status: ResponseStatus) => status === "pending" || status === "streaming";

/** Whether the response has finished, successfully or not. */
const isResponseSettled = (status: ResponseStatus) => status === "complete" || status === "error";

/** Whether to show a waiting state: a request is in flight and there is nothing to read yet. */
const isResponsePending = (status: ResponseStatus, text: string) =>
  status === "pending" || (status === "streaming" && text.trim() === "");

type TextStreamChunk = string | Uint8Array;

/** A stream of text or UTF-8 bytes, such as `response.body` or a model SDK's text stream. */
type TextStreamSource =
  | ReadableStream<string>
  | ReadableStream<Uint8Array>
  | AsyncIterable<TextStreamChunk>;

interface ReadTextStreamOptions {
  /** Called with each piece of decoded text, in order. */
  onChunk: (chunk: string) => void;
  /** Stops reading and cancels the source. */
  signal?: AbortSignal;
}

interface Reader {
  next: () => Promise<{ done?: boolean; value?: TextStreamChunk }>;
  cancel: () => Promise<void>;
}

const isReadableStream = (
  source: TextStreamSource,
): source is ReadableStream<string> | ReadableStream<Uint8Array> => "getReader" in source;

const openReader = (source: TextStreamSource): Reader => {
  // Safari cannot iterate a ReadableStream, so it is read through its reader.
  if (isReadableStream(source)) {
    const reader: ReadableStreamDefaultReader<TextStreamChunk> = source.getReader();

    return {
      cancel: async () => {
        await reader.cancel();
      },
      next: async () => await reader.read(),
    };
  }

  const iterator = source[Symbol.asyncIterator]();

  return {
    cancel: async () => {
      await iterator.return?.();
    },
    next: async () => await iterator.next(),
  };
};

/** Cancels a source that is no longer wanted. A source that already failed may reject again. */
const release = async (reader: Reader) => {
  try {
    await reader.cancel();
  } catch {
    // The reason the stream ended has already been reported.
  }
};

/** Passes each chunk of `reader` to `emit`. Returns whether the source ran to its end. */
const pump = async (
  reader: Reader,
  emit: (text: string) => void,
  signal: AbortSignal | undefined,
) => {
  const decoder = new TextDecoder();

  for (;;) {
    if (signal?.aborted === true) {
      return false;
    }

    // Chunks arrive in order, so each read waits for the one before it.
    // oxlint-disable-next-line no-await-in-loop
    const result = await untilAborted(reader.next(), signal);

    if (result === aborted) {
      return false;
    }

    if (result.done === true || result.value === undefined) {
      emit(decoder.decode());

      return true;
    }

    emit(
      ArrayBuffer.isView(result.value)
        ? decoder.decode(result.value, { stream: true })
        : result.value,
    );
  }
};

/**
 * Reads a stream to its end, decoding bytes as UTF-8 even when a character is split between
 * chunks. Resolves when the source ends or `signal` aborts, and rejects when the source fails.
 */
const readTextStream = async (
  source: TextStreamSource,
  { onChunk, signal }: ReadTextStreamOptions,
): Promise<void> => {
  const reader = openReader(source);
  let finished = false;

  const emit = (text: string) => {
    if (text !== "") {
      onChunk(text);
    }
  };

  try {
    finished = await pump(reader, emit, signal);
  } finally {
    if (!finished) {
      // Not awaited: a generator blocked on its next value only returns once that value arrives.
      void release(reader);
    }
  }
};

// A host that cannot exist, so a URL that keeps it is relative to the page.
const relativeHost = "relative.invalid";

/**
 * Whether a URL leaves the page's origin over the web, as `//host` and `https:` URLs do. A remote
 * image in model output loads as soon as it renders, so its URL can carry data away.
 */
const isRemoteUrl = (url: string) => {
  try {
    const { host, protocol } = new URL(url, `https://${relativeHost}/`);

    return (protocol === "http:" || protocol === "https:") && host !== relativeHost;
  } catch {
    return false;
  }
};

export { isRemoteUrl, isResponseBusy, isResponsePending, isResponseSettled, readTextStream };

export type { ReadTextStreamOptions, ResponseStatus, TextStreamChunk, TextStreamSource };
