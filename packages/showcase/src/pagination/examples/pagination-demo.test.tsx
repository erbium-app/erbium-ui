// @vitest-environment jsdom
import { act } from "react";
import { createRoot } from "react-dom/client";
import { expect, test } from "vite-plus/test";
import PaginationDemo from "./pagination-demo";

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });

test("pagination changes pages and stops at the first and last pages", async () => {
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);
  try {
    await act(async () => root.render(<PaginationDemo />));
    const next = container.querySelector<HTMLElement>('[aria-label="Go to next page"]');
    const previous = container.querySelector<HTMLElement>('[aria-label="Go to previous page"]');
    await act(async () => next?.click());
    expect(container.querySelector('[aria-current="page"]')?.textContent).toBe("3");
    expect(next?.getAttribute("aria-disabled")).toBe("true");
    await act(async () => next?.click());
    expect(container.querySelector('[aria-current="page"]')?.textContent).toBe("3");
    await act(async () => previous?.click());
    await act(async () => previous?.click());
    expect(container.querySelector('[aria-current="page"]')?.textContent).toBe("1");
    expect(previous?.getAttribute("aria-disabled")).toBe("true");
  } finally {
    await act(async () => root.unmount());
    container.remove();
  }
});
