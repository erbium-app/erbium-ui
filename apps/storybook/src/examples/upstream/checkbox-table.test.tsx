// @vitest-environment jsdom

import { act } from "react";
import { createRoot } from "react-dom/client";
import { expect, test } from "vite-plus/test";
import { CheckboxInTable } from "./checkbox-table";

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });

test("dragging across rows selects and clears each crossed row", async () => {
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);

  try {
    await act(async () => root.render(<CheckboxInTable />));

    const rows = container.querySelectorAll<HTMLElement>('tbody [data-slot="table-row"]');
    const selected = () => [...rows].map((row) => row.getAttribute("data-state") === "selected");
    expect(selected()).toEqual([true, false, false, false]);

    await act(async () => {
      rows[1]?.dispatchEvent(
        new MouseEvent("pointerdown", { bubbles: true, button: 0, buttons: 1 }),
      );
      rows[3]?.dispatchEvent(
        new MouseEvent("pointerover", { bubbles: true, buttons: 1, relatedTarget: rows[1] }),
      );
      window.dispatchEvent(new MouseEvent("pointerup", { bubbles: true }));
    });
    expect(selected()).toEqual([true, true, true, true]);

    await act(async () => {
      rows[3]?.dispatchEvent(
        new MouseEvent("pointerdown", { bubbles: true, button: 0, buttons: 1 }),
      );
      rows[1]?.dispatchEvent(
        new MouseEvent("pointerover", { bubbles: true, buttons: 1, relatedTarget: rows[3] }),
      );
      window.dispatchEvent(new MouseEvent("pointerup", { bubbles: true }));
    });
    expect(selected()).toEqual([true, false, false, false]);
  } finally {
    await act(async () => root.unmount());
    container.remove();
  }
});

test("a normal checkbox click still toggles one row", async () => {
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);

  try {
    await act(async () => root.render(<CheckboxInTable />));
    const rows = container.querySelectorAll<HTMLElement>('tbody [data-slot="table-row"]');
    await act(async () => rows[1]?.querySelector<HTMLElement>('[role="checkbox"]')?.click());
    expect(rows[0]?.getAttribute("data-state")).toBe("selected");
    expect(rows[1]?.getAttribute("data-state")).toBe("selected");
    expect(rows[2]?.getAttribute("data-state")).toBeNull();
  } finally {
    await act(async () => root.unmount());
    container.remove();
  }
});
