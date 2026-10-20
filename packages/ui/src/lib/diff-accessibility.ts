const initializedRoots = new WeakSet<ShadowRoot>();

// Pierre 1.5 renders expansion controls as div[role=button]. Supply names,
// focusability, and native button keyboard behavior after each render.
const enhanceDiffAccessibility = (host: HTMLElement) => {
  const root = host.shadowRoot;

  if (!root) {
    return;
  }

  for (const button of root.querySelectorAll<HTMLElement>("[data-expand-button]")) {
    button.tabIndex = 0;
    button.setAttribute(
      "aria-label",
      Object.hasOwn(button.dataset, "expandAllButton")
        ? "Expand all unchanged lines"
        : Object.hasOwn(button.dataset, "expandUp")
          ? "Expand unchanged lines above"
          : Object.hasOwn(button.dataset, "expandDown")
            ? "Expand unchanged lines below"
            : "Expand unchanged lines",
    );
  }

  if (initializedRoots.has(root)) {
    return;
  }

  initializedRoots.add(root);
  root.addEventListener("keydown", (event) => {
    if (!(event instanceof KeyboardEvent)) {
      return;
    }

    const { target } = event;

    if (!(target instanceof HTMLElement) || !target.matches("[data-expand-button]")) {
      return;
    }

    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    event.preventDefault();
    target.click();
  });
};

export { enhanceDiffAccessibility };
