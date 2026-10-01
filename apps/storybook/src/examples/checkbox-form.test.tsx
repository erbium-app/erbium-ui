// @vitest-environment jsdom

import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, expect, test, vi } from "vite-plus/test";
import CheckboxForm from "./checkbox-form";

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });

afterEach(() => {
  Reflect.deleteProperty(Element.prototype, "animate");
});

test("an invalid required checkbox shakes its visible row and clears when checked", async () => {
  const cancel = vi.fn();
  const animate = vi.fn(() => ({ cancel }) as unknown as Animation);
  Object.defineProperty(Element.prototype, "animate", { configurable: true, value: animate });

  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);

  try {
    await act(async () => {
      root.render(<CheckboxForm />);
    });

    const form = container.querySelector("form");
    const termsInput = container.querySelector<HTMLInputElement>('input[name="terms"]');
    const termsCheckbox = container.querySelector<HTMLElement>('[data-slot="checkbox"]');
    const termsRow = termsCheckbox?.closest('[data-slot="field"]');
    expect(form).toBeTruthy();
    expect(termsInput?.required).toBe(true);

    await act(async () => {
      expect(form?.checkValidity()).toBe(false);
    });
    expect(animate).toHaveBeenCalledTimes(1);
    expect(animate.mock.contexts[0]).toBe(termsRow);
    expect(termsCheckbox?.getAttribute("aria-invalid")).toBe("true");
    expect(termsRow?.hasAttribute("data-invalid")).toBe(true);
    expect(container.querySelector('[data-slot="field-error"]')).toBeNull();

    await act(async () => {
      expect(form?.checkValidity()).toBe(false);
    });
    expect(animate).toHaveBeenCalledTimes(2);
    expect(cancel).toHaveBeenCalledTimes(1);

    await act(async () => {
      termsCheckbox?.click();
    });
    expect(termsInput?.checked).toBe(true);
    expect(termsCheckbox?.getAttribute("aria-invalid")).toBe("false");
    expect(termsRow?.getAttribute("data-invalid")).toBe("false");
  } finally {
    await act(async () => {
      root.unmount();
    });
    container.remove();
  }
});
