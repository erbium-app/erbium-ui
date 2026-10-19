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
        { easing, offset: 0, translate: "0 0" },
        { easing, offset: 80 / 280, translate: `${6 * direction}px 0` },
        { easing, offset: 160 / 280, translate: `${-6 * direction}px 0` },
        { easing, offset: 220 / 280, translate: `${4 * direction}px 0` },
        { offset: 1, translate: "0 0" },
      ],
      { duration: 280 },
    ),
  );
}

export { shake };
