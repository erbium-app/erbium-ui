/** Search-row padding belongs to the field; nested actions retain their behavior. */
export function focusSearchInput(
  container: HTMLElement,
  event: Pick<PointerEvent, "button" | "target" | "defaultPrevented" | "preventDefault">,
) {
  if (event.button !== 0 || event.defaultPrevented) return;
  if (event.target instanceof Element && event.target.closest("input, button, a, select, textarea"))
    return;
  const input = container.querySelector("input");
  if (!input || input.disabled) return;
  event.preventDefault();
  input.focus();
}
