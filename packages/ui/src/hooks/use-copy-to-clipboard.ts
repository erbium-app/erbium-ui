import * as React from "react";

export function useCopyToClipboard({
  timeout = 2000,
  onCopy,
  onError,
}: {
  timeout?: number;
  onCopy?: () => void;
  onError?: (error: unknown) => void;
} = {}): { copyToClipboard: (value: string) => void; isCopied: boolean } {
  const [isCopied, setIsCopied] = React.useState(false);
  const timeoutIdRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const copyToClipboard = (value: string): void => {
    if (typeof navigator === "undefined" || !navigator.clipboard?.writeText) {
      return;
    }

    if (!value) return;

    navigator.clipboard.writeText(value).then(
      () => {
        if (timeoutIdRef.current) {
          clearTimeout(timeoutIdRef.current);
        }
        setIsCopied(true);

        if (onCopy) {
          onCopy();
        }

        if (timeout !== 0) {
          timeoutIdRef.current = setTimeout(() => {
            setIsCopied(false);
            timeoutIdRef.current = null;
          }, timeout);
        }
      },
      (error: unknown) => {
        setIsCopied(false);
        onError?.(error);
      },
    );
  };

  // Cleanup timeout on unmount
  React.useEffect(() => {
    return (): void => {
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
    };
  }, []);

  return { copyToClipboard, isCopied };
}
