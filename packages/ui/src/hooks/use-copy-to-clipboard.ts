import * as React from "react";
import { createCopyToClipboard } from "../lib/copy-to-clipboard";
import type { CopyToClipboardOptions } from "../lib/copy-to-clipboard";

/** React adapter for the shared clipboard lifecycle. */
export function useCopyToClipboard(options: CopyToClipboardOptions = {}) {
  const [clipboard] = React.useState(createCopyToClipboard);
  const state = React.useSyncExternalStore(
    clipboard.subscribe,
    clipboard.getSnapshot,
    clipboard.getServerSnapshot,
  );
  React.useEffect(() => () => clipboard.dispose(), [clipboard]);
  const copyToClipboard = (value: string): Promise<boolean> =>
    clipboard.copyToClipboard(value, options);
  return { ...state, copyToClipboard, reset: clipboard.reset };
}
export type { CopyToClipboardOptions };
