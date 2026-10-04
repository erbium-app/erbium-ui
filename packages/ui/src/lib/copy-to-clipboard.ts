type CopyToClipboardState = {
  isCopied: boolean;
  isPending: boolean;
  error: unknown;
};
type CopyToClipboardOptions = {
  timeout?: number;
  onCopy?: () => void;
  onError?: (error: unknown) => void;
};
const idleState: CopyToClipboardState = { isCopied: false, isPending: false, error: null };

/** Framework-independent clipboard lifecycle. Dispose when the owner unmounts. */
function createCopyToClipboard() {
  let state = idleState;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let generation = 0;
  const listeners = new Set<() => void>();
  const update = (next: CopyToClipboardState) => {
    state = next;
    for (const listener of listeners) listener();
  };
  return {
    getSnapshot: () => state,
    getServerSnapshot: () => idleState,
    subscribe(this: void, listener: () => void) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    async copyToClipboard(
      value: string | (() => Promise<string>),
      { timeout = 2000, onCopy, onError }: CopyToClipboardOptions = {},
    ): Promise<boolean> {
      if (state.isPending) return false;
      const operation = ++generation;
      clearTimeout(timer);
      update({ isCopied: false, isPending: true, error: null });
      try {
        if (typeof navigator === "undefined" || !navigator.clipboard?.writeText) {
          throw new Error("Clipboard access is unavailable");
        }
        const text = typeof value === "function" ? await value() : value;
        if (operation !== generation) return false;
        await navigator.clipboard.writeText(text);
      } catch (error) {
        if (operation === generation) {
          update({ isCopied: false, isPending: false, error });
          onError?.(error);
        }
        return false;
      }
      if (operation !== generation) return true;
      update({ isCopied: true, isPending: false, error: null });
      if (timeout !== 0) timer = setTimeout(() => update(idleState), timeout);
      onCopy?.();
      return true;
    },
    dispose() {
      generation++;
      clearTimeout(timer);
      state = idleState;
    },
  };
}
export { createCopyToClipboard };
export type { CopyToClipboardOptions, CopyToClipboardState };
