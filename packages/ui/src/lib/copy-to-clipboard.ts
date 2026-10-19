interface CopyToClipboardState {
  status: "idle" | "copied" | "error";
  revision: number;
  isCopied: boolean;
  isPending: boolean;
  error: unknown;
}

interface CopyToClipboardOptions {
  timeout?: number;
  onCopy?: () => void;
  onError?: (error: unknown) => void;
}

type CopyToClipboardValue = string | (() => Promise<string>);

const idleState: CopyToClipboardState = {
  error: null,
  isCopied: false,
  isPending: false,
  revision: 0,
  status: "idle",
};

/** Framework-independent clipboard lifecycle. Dispose when the owner unmounts. */
function createCopyToClipboard() {
  let state = idleState;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let generation = 0;
  const listeners = new Set<() => void>();

  const update = (next: CopyToClipboardState) => {
    state = next;

    for (const listener of listeners) {
      listener();
    }
  };

  return {
    async copyToClipboard(
      value: CopyToClipboardValue,
      { timeout = 2000, onCopy, onError }: CopyToClipboardOptions = {},
    ): Promise<boolean> {
      if (state.isPending) {
        return false;
      }

      const operation = ++generation;
      clearTimeout(timer);
      update({ ...state, isPending: true });

      try {
        if (typeof navigator === "undefined" || !navigator.clipboard?.writeText) {
          throw new Error("Clipboard access is unavailable");
        }

        const text = typeof value === "function" ? await value() : value;

        if (operation !== generation) {
          return false;
        }

        await navigator.clipboard.writeText(text);
      } catch (error) {
        if (operation === generation) {
          update({
            error,
            isCopied: false,
            isPending: false,
            revision: state.revision + 1,
            status: "error",
          });

          if (timeout !== 0) {
            timer = setTimeout(() => {
              if (generation === operation) {
                update({ ...idleState, revision: state.revision });
              }
            }, timeout);
          }

          onError?.(error);
        }

        return false;
      }

      if (operation !== generation) {
        return true;
      }

      update({
        error: null,
        isCopied: true,
        isPending: false,
        revision: state.revision + 1,
        status: "copied",
      });

      if (timeout !== 0) {
        timer = setTimeout(() => {
          if (generation === operation) {
            update({ ...idleState, revision: state.revision });
          }
        }, timeout);
      }

      onCopy?.();

      return true;
    },
    dispose() {
      generation++;
      clearTimeout(timer);
      state = idleState;
    },
    getServerSnapshot: () => idleState,
    getSnapshot: () => state,
    reset(this: void) {
      generation++;
      clearTimeout(timer);
      update({ ...idleState, revision: state.revision });
    },
    subscribe(this: void, listener: () => void) {
      listeners.add(listener);

      return () => {
        listeners.delete(listener);
      };
    },
  };
}

export { createCopyToClipboard };

export type { CopyToClipboardOptions, CopyToClipboardState, CopyToClipboardValue };
