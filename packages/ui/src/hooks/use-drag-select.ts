import { useEffect, useRef } from "react";
import type { MouseEvent, PointerEvent } from "react";

const INTERACTIVE =
  'a, button:not([data-slot="checkbox"]), input, select, textarea, [contenteditable]';

interface DragSelectOptions {
  /** Returns the index and selected state of the item under the pointer, or `null` when it is not selectable. */
  resolve: (target: Element, container: HTMLElement) => { index: number; selected: boolean } | null;
  /** Applies `selected` to every selectable item from `start` to `end`, inclusive. */
  selectRange: (start: number, end: number, selected: boolean, container: HTMLElement) => void;
}

/**
 * Press on an item and drag across its siblings to select or clear them in one gesture.
 * Spread the returned handlers on the element that contains the items.
 */
export const useDragSelect = ({ resolve, selectRange }: DragSelectOptions) => {
  const drag = useRef<{ index: number; selected: boolean } | null>(null);
  const suppressClick = useRef(false);
  const stopDrag = useRef<() => void>(null);

  useEffect(() => () => stopDrag.current?.(), []);

  return {
    onClickCapture(event: MouseEvent<HTMLElement>) {
      if (suppressClick.current) {
        suppressClick.current = false;
        event.preventDefault();
        event.stopPropagation();
      }
    },
    onPointerDown(event: PointerEvent<HTMLElement>) {
      const { target } = event;

      if (event.button !== 0 || event.pointerType === "touch" || !(target instanceof Element)) {
        return;
      }

      if (target.closest(INTERACTIVE)) {
        return;
      }

      const item = resolve(target, event.currentTarget);

      if (!item) {
        return;
      }

      stopDrag.current?.();
      suppressClick.current = false;
      drag.current = { index: item.index, selected: !item.selected };

      const preventTextSelection = (selectEvent: Event) => {
        selectEvent.preventDefault();
      };

      const stop = () => {
        drag.current = null;
        stopDrag.current = null;
        window.removeEventListener("pointerup", stop);
        window.removeEventListener("pointercancel", stop);
        window.removeEventListener("blur", stop);
        document.removeEventListener("selectstart", preventTextSelection);
        // The click that follows pointerup fires after this; release the guard once it has.
        window.setTimeout(() => {
          suppressClick.current = false;
        }, 0);
      };

      window.addEventListener("pointerup", stop);
      window.addEventListener("pointercancel", stop);
      window.addEventListener("blur", stop);
      document.addEventListener("selectstart", preventTextSelection);
      stopDrag.current = stop;
    },
    onPointerOver(event: PointerEvent<HTMLElement>) {
      const { current } = drag;

      if (!current || !(event.buttons & 1) || !(event.target instanceof Element)) {
        return;
      }

      const item = resolve(event.target, event.currentTarget);

      if (!item || item.index === current.index) {
        return;
      }

      // Let clicks that `selectRange` dispatches through.
      suppressClick.current = false;
      selectRange(
        Math.min(current.index, item.index),
        Math.max(current.index, item.index),
        current.selected,
        event.currentTarget,
      );
      current.index = item.index;
      // The drag already toggled the item it started on; swallow the click released over it.
      suppressClick.current = true;
    },
  };
};
