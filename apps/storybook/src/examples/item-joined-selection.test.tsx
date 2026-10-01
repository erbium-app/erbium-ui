// @vitest-environment jsdom

import { act } from "react";
import { createRoot } from "react-dom/client";
import { expect, test } from "vite-plus/test";
import ItemJoinedSelection from "./item-joined-selection";

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });

test("selection changes which adjacent item rows form a group", async () => {
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);

  try {
    await act(async () => {
      root.render(<ItemJoinedSelection />);
    });

    const items = container.querySelectorAll<HTMLElement>(
      '[data-slot="item-group"] > [data-slot="item"]',
    );
    expect(items).toHaveLength(8);
    expect(Array.from(items, (item) => item.getAttribute("data-selected"))).toEqual([
      "true",
      "true",
      "false",
      "true",
      "true",
      "false",
      "true",
      "true",
    ]);

    await act(async () => {
      items[2]?.querySelector<HTMLElement>('[role="checkbox"]')?.click();
    });
    expect(Array.from(items, (item) => item.getAttribute("data-selected")).slice(0, 5)).toEqual([
      "true",
      "true",
      "true",
      "true",
      "true",
    ]);
  } finally {
    await act(async () => {
      root.unmount();
    });
    container.remove();
  }
});
