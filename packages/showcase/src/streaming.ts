/*
 * A stand-in for a model's reply, so streaming examples run without a server. In an app, pass
 * `useTextStream` the response body or the text stream of your model SDK.
 */

interface SimulatedStreamOptions {
  signal?: AbortSignal;
  /** Characters per chunk. */
  chunkSize?: number;
  /** Milliseconds between chunks. */
  interval?: number;
  /** How long the "model" thinks before the first chunk. */
  delay?: number;
}

const wait = async (milliseconds: number) => {
  // oxlint-disable-next-line promise/avoid-new -- a timer has no promise form in browsers.
  await new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
};

/**
 * Streams `text` a few characters at a time until it ends or `signal` aborts.
 *
 * @yields {string} The next chunk of `text`.
 */
const simulateStream = async function* simulateStream(
  text: string,
  { signal, chunkSize = 6, interval = 24, delay = 600 }: SimulatedStreamOptions = {},
) {
  await wait(delay);

  for (let start = 0; start < text.length; start += chunkSize) {
    if (signal?.aborted === true) {
      return;
    }

    yield text.slice(start, start + chunkSize);
    // Chunks arrive in order, one after another.
    // oxlint-disable-next-line no-await-in-loop
    await wait(interval);
  }
};

export { simulateStream };
