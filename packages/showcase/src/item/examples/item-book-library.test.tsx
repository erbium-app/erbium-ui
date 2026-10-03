// @vitest-environment jsdom

import { act } from "react";
import { createRoot } from "react-dom/client";
import { expect, test } from "vite-plus/test";
import ItemBookLibrary from "./item-book-library";

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });

test("book selection and select-all stay in sync", async () => {
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);

  try {
    await act(async () => {
      root.render(<ItemBookLibrary />);
    });

    const selectAll = container.querySelector<HTMLElement>('[role="checkbox"][aria-labelledby]');
    const bookCheckboxes = container.querySelectorAll<HTMLElement>(
      '[role="listitem"] [role="checkbox"]',
    );
    const bookItems = container.querySelectorAll<HTMLElement>(
      '[data-slot="item-group"] > [data-slot="item"]',
    );
    expect(bookCheckboxes).toHaveLength(4);
    expect(bookItems).toHaveLength(4);
    expect(bookItems[0]?.getAttribute("data-selected")).toBe("true");
    expect(bookItems[1]?.getAttribute("data-selected")).toBe("true");
    expect(bookItems[1]?.firstElementChild?.getAttribute("data-slot")).toBe("item-separator");
    expect(
      container.querySelector('[data-slot="item-group"] > [data-slot="item-separator"]'),
    ).toBeNull();
    expect(selectAll?.getAttribute("aria-checked")).toBe("mixed");
    expect(container.querySelector('[role="status"]')?.textContent).toBe("2 of 4 selected");

    await act(async () => {
      bookCheckboxes[2]?.click();
    });
    expect(container.querySelector('[role="status"]')?.textContent).toBe("3 of 4 selected");

    await act(async () => {
      selectAll?.click();
    });
    expect(selectAll?.getAttribute("aria-checked")).toBe("true");
    expect(container.querySelector('[role="status"]')?.textContent).toBe("4 of 4 selected");

    await act(async () => {
      selectAll?.click();
    });
    expect(selectAll?.getAttribute("aria-checked")).toBe("false");
    expect(container.querySelector('[role="status"]')?.textContent).toBe("0 of 4 selected");
  } finally {
    await act(async () => {
      root.unmount();
    });
    container.remove();
  }
});
