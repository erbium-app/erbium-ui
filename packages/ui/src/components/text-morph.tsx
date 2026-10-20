import * as React from "react";
import { useTextMorph as useTextMorphPrimitive } from "torph/react";
import { cn } from "../lib/utils";

/** Critically damped, so digits land without overshooting their slot. */
const textMorphSpring = { damping: 30, stiffness: 400 } as const;

type TextMorphOptions = Parameters<typeof useTextMorphPrimitive>[0];

/** Drives a morph imperatively, for text that changes outside React's render. */
const useTextMorph = ({ ease = textMorphSpring, ...options }: TextMorphOptions = {}) => {
  const { ref, update } = useTextMorphPrimitive({ ease, ...options });

  const setRef = React.useCallback(
    (element: HTMLElement | null) => {
      ref.current = element;
    },
    [ref],
  );

  return { ref: setRef, update };
};

const escapeHtml = (value: string) =>
  value.replaceAll(
    /[&<>"']/g,
    (character) =>
      ({ '"': "&quot;", "&": "&amp;", "'": "&#39;", "<": "&lt;", ">": "&gt;" })[character] ??
      character,
  );

type TextMorphProps = TextMorphOptions &
  Omit<React.ComponentProps<"span">, "children" | "dangerouslySetInnerHTML" | "ref"> & {
    children: string | number;
    /** Caret position for a value being typed: place matching becomes caret matching. */
    cursorIndex?: number;
  };

const TextMorph = ({
  children,
  cursorIndex,
  className,
  // Morph options are split out so the rest reach the span.
  debug,
  decimals,
  disabled,
  duration,
  ease,
  locale,
  numbers,
  onAnimationCancel,
  onAnimationComplete,
  onAnimationStart,
  respectReducedMotion,
  scale,
  ...props
}: TextMorphProps) => {
  const { ref, update } = useTextMorph({
    debug,
    decimals,
    disabled,
    duration,
    ease,
    locale,
    numbers,
    onAnimationCancel,
    onAnimationComplete,
    onAnimationStart,
    respectReducedMotion,
    scale,
  });

  const cursorRef = React.useRef(cursorIndex);
  React.useLayoutEffect(() => {
    cursorRef.current = cursorIndex;
  }, [cursorIndex]);

  // torph owns the DOM after mount; a stable object keeps React from rewriting it.
  const [initialHtml] = React.useState(() => ({
    __html: escapeHtml(
      typeof children === "number"
        ? children.toLocaleString(locale, {
            maximumFractionDigits: decimals,
            minimumFractionDigits: decimals,
          })
        : children,
    ).replaceAll("\n", "<br>"),
  }));

  React.useEffect(() => {
    update(children, cursorRef.current);
  }, [children, update]);

  return (
    <span
      ref={ref}
      data-slot="text-morph"
      className={cn("whitespace-pre tabular-nums", className)}
      dangerouslySetInnerHTML={initialHtml}
      {...props}
    />
  );
};

export { TextMorph, textMorphSpring, useTextMorph };

export type { TextMorphOptions, TextMorphProps };
