// @vitest-environment jsdom

import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vite-plus/test";
import { Toaster, toast } from "@erbium/ui/components/toast";

afterEach(() => {
  cleanup();
  document.documentElement.removeAttribute("dir");
  Reflect.deleteProperty(Element.prototype, "animate");
});

function swipe(element: Element, distance: number) {
  fireEvent.pointerDown(element, { clientX: 100, clientY: 100, button: 0, pointerId: 1 });
  fireEvent.pointerMove(element, {
    clientX: 100 + Math.sign(distance),
    clientY: 100,
    pointerId: 1,
  });
  fireEvent.pointerMove(element, { clientX: 100 + distance, clientY: 100, pointerId: 1 });
  fireEvent.pointerUp(element, { clientX: 100 + distance, clientY: 100, pointerId: 1 });
}

test("one viewport renders one toast while repeated notifications remain separate", () => {
  render(<Toaster />);

  act(() => {
    toast.add({ title: "Saved" });
  });
  expect(document.querySelectorAll('[data-slot="toast"]')).toHaveLength(1);

  act(() => {
    toast.add({ title: "Saved" });
  });
  expect(document.querySelectorAll('[data-slot="toast"]')).toHaveLength(2);
});

test("adding the same content with a stable ID replays the shake on the existing toast", () => {
  const cancel = vi.fn();
  const animate = vi.fn(
    (_keyframes: Keyframe[], _options: KeyframeAnimationOptions) =>
      ({ cancel }) as unknown as Animation,
  );
  Object.defineProperty(Element.prototype, "animate", { configurable: true, value: animate });
  render(<Toaster />);

  act(() => {
    toast.add({ id: "repeat-save", title: "Saved", timeout: 0 });
  });
  const root = document.querySelector('[data-slot="toast"]');
  expect(animate).not.toHaveBeenCalled();

  act(() => {
    toast.add({ id: "repeat-save", title: "Saved", timeout: 0 });
  });
  expect(document.querySelectorAll('[data-slot="toast"]')).toHaveLength(1);
  expect(animate).toHaveBeenCalledTimes(1);
  expect(animate.mock.contexts[0]).toBe(root);
  expect(animate.mock.calls[0]?.[0]?.[1]).toMatchObject({ translate: "6px 0" });

  act(() => {
    toast.add({ id: "repeat-save", title: "Saved", timeout: 0 });
  });
  expect(animate).toHaveBeenCalledTimes(2);
  expect(cancel).toHaveBeenCalledTimes(1);

  act(() => {
    toast.add({ id: "repeat-save", title: "Done", timeout: 0 });
  });
  expect(animate).toHaveBeenCalledTimes(2);
});

test("an ID updates a toast in place and older toasts become visible on expansion", () => {
  render(<Toaster />);

  act(() => {
    toast.add({ id: "save", title: "Saving", timeout: 0 });
    toast.add({ id: "save", title: "Saved", timeout: 0 });
    for (let index = 1; index <= 4; index += 1) {
      toast.add({ title: `Message ${index}`, timeout: 0 });
    }
  });

  expect(document.querySelectorAll('[data-slot="toast"]')).toHaveLength(5);
  expect(screen.getAllByText("Saved")).toHaveLength(1);
  const olderToasts = document.querySelectorAll("[data-stack-hidden]");
  expect(olderToasts).toHaveLength(2);
  expect(olderToasts[0]?.getAttribute("class")).toContain("invisible");

  fireEvent.mouseEnter(screen.getByRole("region", { name: "Notifications" }));
  expect(screen.getByRole("region", { name: "Notifications" }).hasAttribute("data-expanded")).toBe(
    true,
  );
  expect(olderToasts[0]?.hasAttribute("data-expanded")).toBe(true);

  act(() => toast.close("save"));
  expect(document.querySelectorAll('[data-slot="toast"]')).toHaveLength(4);
});

test("status icons, dismiss buttons, and Base UI actions have consistent defaults", () => {
  render(<Toaster />);

  act(() => {
    toast.add({ type: "success", title: "Done", timeout: 0, actionProps: { children: "Undo" } });
  });

  expect(document.querySelector('[data-slot="toast-icon"] svg.text-success')).toBeTruthy();
  expect(screen.getByRole("button", { name: "Undo" })).toBeTruthy();
  expect(document.querySelector('[data-slot="toast-close"]')?.getAttribute("aria-hidden")).toBe(
    "true",
  );
  fireEvent.mouseEnter(screen.getByRole("region", { name: "Notifications" }));
  expect(screen.getByRole("button", { name: "Close toast" })).toBeTruthy();
});

test("rejected promises use the error styling and icon", async () => {
  render(<Toaster />);

  await act(async () => {
    await toast
      .promise(Promise.reject(new Error("nope")), {
        loading: "Saving",
        success: "Saved",
        error: "Could not save",
      })
      .catch(() => undefined);
  });

  const root = screen.getByText("Could not save").closest('[data-slot="toast"]');
  expect(root?.getAttribute("class")).toContain("surface-tint-error-soft");
  expect(root?.querySelector('[data-slot="toast-icon"] svg.text-error')).toBeTruthy();
});

test("toast types are restricted to the supported set", () => {
  // @ts-expect-error unknown toast types are rejected at compile time
  expect(() => toast.add({ type: "critical", title: "Typed" })).not.toThrow();
  toast.close();
});

test.each([
  ["ltr", 100],
  ["rtl", -100],
] as const)("%s pages dismiss toward the inline end", (direction, distance) => {
  document.documentElement.dir = direction;
  render(<Toaster />);

  act(() => {
    toast.add({ title: `Swipe ${direction}`, timeout: 0 });
  });

  const element = screen.getByText(`Swipe ${direction}`).closest('[data-slot="toast"]');
  expect(element).toBeTruthy();

  act(() => swipe(element!, -distance));
  expect(screen.getByText(`Swipe ${direction}`)).toBeTruthy();

  act(() => swipe(element!, distance));
  expect(screen.queryByText(`Swipe ${direction}`)).toBeNull();
});
