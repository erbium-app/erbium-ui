/** What `untilAborted` resolves to when the signal wins. */
const aborted = Symbol("aborted");

/** `promise`, unless `signal` aborts first, which resolves to `aborted` without waiting. */
const untilAborted = async <T>(
  promise: PromiseLike<T>,
  signal: AbortSignal | undefined,
): Promise<T | typeof aborted> => {
  if (signal === undefined) {
    return await promise;
  }

  // Removes the listener once the wait settles, so a long stream holds none of them.
  const settled = new AbortController();

  // oxlint-disable-next-line promise/avoid-new -- an AbortSignal has no promise form.
  const stopped = new Promise<typeof aborted>((resolve) => {
    const onAbort = () => {
      resolve(aborted);
    };

    signal.addEventListener("abort", onAbort, { once: true, signal: settled.signal });

    if (signal.aborted) {
      onAbort();
    }
  });

  try {
    return await Promise.race([stopped, promise]);
  } finally {
    settled.abort();
  }
};

export { aborted, untilAborted };
