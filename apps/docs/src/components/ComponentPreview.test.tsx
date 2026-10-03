// @vitest-environment jsdom
import { act, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { expect, test } from "vite-plus/test";
import { loadShowcase } from "@erbium/showcase/catalog";
import ComponentPreview, { PreviewErrorBoundary } from "./ComponentPreview";
Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });

test("a rejected lazy showcase displays a recovery action instead of an empty island", async () => {
  const container = document.createElement("div");
  const errors: unknown[] = [];
  const root = createRoot(container, { onCaughtError: (error) => errors.push(error) });
  const failure = new TypeError("Failed to fetch dynamically imported module");
  const Example = lazy(() => Promise.reject(failure));
  try {
    await act(async () => {
      root.render(
        <PreviewErrorBoundary>
          <Suspense fallback={<p>Loading preview…</p>}>
            <Example />
          </Suspense>
        </PreviewErrorBoundary>,
      );
    });
    expect(errors).toEqual([failure]);
    expect(container.querySelector('[role="alert"]')?.textContent).toContain(
      "This preview could not load.",
    );
    expect(container.querySelector("button")?.textContent).toBe("Reload page");
  } finally {
    await act(async () => root.unmount());
  }
});

test("the website runs the shared checkbox and its playground controls", async () => {
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);
  try {
    await loadShowcase("checkbox");
    await act(async () => {
      root.render(<ComponentPreview name="checkbox" variant="Playground" />);
    });
    expect(container.querySelector('[role="checkbox"]')).not.toBeNull();
    const checkbox = container.querySelector<HTMLElement>('[role="checkbox"]')!;
    await act(async () => {
      checkbox.click();
    });
    expect(checkbox.getAttribute("aria-checked")).toBe("true");
    const disabled = [
      ...container.querySelectorAll<HTMLInputElement>('.preview-controls input[type="checkbox"]'),
    ][2];
    await act(async () => {
      disabled.click();
    });
    expect(checkbox.hasAttribute("data-disabled")).toBe(true);
    await act(async () => {
      checkbox.click();
    });
    expect(checkbox.getAttribute("aria-checked")).toBe("true");
  } finally {
    await act(async () => root.unmount());
    container.remove();
  }
});
