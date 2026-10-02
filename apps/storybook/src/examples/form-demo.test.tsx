// @vitest-environment jsdom

import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, expect, test, vi } from "vite-plus/test";
import FormDemo from "./form-demo";

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });

afterEach(() => {
  Reflect.deleteProperty(Element.prototype, "animate");
});

test("each invalid submit shakes the field while the error remains visible", async () => {
  const cancel = vi.fn();
  const animate = vi.fn(() => ({ cancel }) as unknown as Animation);
  Object.defineProperty(Element.prototype, "animate", { configurable: true, value: animate });

  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);

  try {
    await act(async () => {
      root.render(<FormDemo />);
    });

    const form = container.querySelector("form");
    const input = container.querySelector("input");
    expect(form?.noValidate).toBe(true);
    expect(input).toBeTruthy();

    await act(async () => {
      form?.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    });
    expect(animate).toHaveBeenCalledTimes(1);
    expect(animate.mock.contexts[0]).toBe(input);
    expect(container.querySelector('[data-slot="field-error"]')?.textContent).toBe(
      "Enter a valid email address.",
    );
    expect(input?.getAttribute("aria-invalid")).toBe("true");

    await act(async () => {
      form?.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    });
    expect(animate).toHaveBeenCalledTimes(2);
    expect(cancel).toHaveBeenCalledTimes(1);
  } finally {
    await act(async () => {
      root.unmount();
    });
    container.remove();
  }
});
