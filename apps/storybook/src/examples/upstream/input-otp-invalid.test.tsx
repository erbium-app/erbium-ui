// @vitest-environment jsdom

import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, expect, test, vi } from "vite-plus/test";
import { InputOTPInvalid } from "./input-otp-invalid";

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });

afterEach(() => {
  Reflect.deleteProperty(Element.prototype, "animate");
});

function enterCode(input: HTMLInputElement, code: string) {
  Reflect.set(HTMLInputElement.prototype, "value", code, input);
  input.dispatchEvent(new Event("input", { bubbles: true }));
}

test("a wrong complete code shakes all slots and a corrected code clears the error", async () => {
  const animate = vi.fn(
    (_keyframes: Keyframe[], _options: KeyframeAnimationOptions) =>
      ({ cancel: vi.fn() }) as unknown as Animation,
  );
  Object.defineProperty(Element.prototype, "animate", { configurable: true, value: animate });

  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);

  try {
    await act(async () => {
      root.render(<InputOTPInvalid />);
    });

    const input = container.querySelector<HTMLInputElement>("[data-input-otp]");
    expect(input).toBeTruthy();
    expect(input?.hasAttribute("aria-invalid")).toBe(false);

    await act(async () => {
      enterCode(input!, "000000");
    });
    expect(input?.getAttribute("aria-invalid")).toBe("true");
    expect(
      container.querySelectorAll('[data-slot="input-otp-slot"][aria-invalid="true"]'),
    ).toHaveLength(6);
    expect(animate).toHaveBeenCalledTimes(1);
    expect(animate.mock.contexts[0]).toBe(
      input?.closest("[data-input-otp-container]")?.parentElement,
    );

    await act(async () => {
      enterCode(input!, "123456");
    });
    expect(input?.hasAttribute("aria-invalid")).toBe(false);
    expect(container.textContent).toContain("Code verified.");
    expect(animate).toHaveBeenCalledTimes(1);

    await act(async () => {
      enterCode(input!, "123457");
    });
    expect(animate).toHaveBeenCalledTimes(2);
  } finally {
    await act(async () => {
      root.unmount();
    });
    container.remove();
  }
});
