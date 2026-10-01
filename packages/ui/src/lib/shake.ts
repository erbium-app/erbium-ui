const activeShakes = new WeakMap<Element, Animation>();

/** Replays the error shake without changing the element's validation state. */
function shake(element: Element | null) {
  if (!element) {
    return;
  }

  activeShakes.get(element)?.cancel();

  if (
    typeof element.animate !== "function" ||
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  ) {
    return;
  }

  const easing = "cubic-bezier(0.22, 1, 0.36, 1)";
  const direction = getComputedStyle(element).direction === "rtl" ? -1 : 1;

  activeShakes.set(
    element,
    element.animate(
      [
        { translate: "0 0", offset: 0, easing },
        { translate: `${6 * direction}px 0`, offset: 80 / 280, easing },
        { translate: `${-6 * direction}px 0`, offset: 160 / 280, easing },
        { translate: `${4 * direction}px 0`, offset: 220 / 280, easing },
        { translate: "0 0", offset: 1 },
      ],
      { duration: 280 },
    ),
  );
}

export { shake };
