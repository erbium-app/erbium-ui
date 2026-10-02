// @vitest-environment jsdom

import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, expect, test, vi } from "vite-plus/test";
import { OTPFieldInvalid } from "./otp-field-invalid";

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });

afterEach(() => {
  Reflect.deleteProperty(Element.prototype, "animate");
});

function enterCode(input: HTMLInputElement, code: string) {
  Reflect.set(HTMLInputElement.prototype, "value", code, input);
  input.dispatchEvent(new Event("input", { bubbles: true }));
}

test("a wrong complete code marks every slot invalid and shakes; a correct code clears it", async () => {
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
      root.render(<OTPFieldInvalid />);
    });

    const field = container.querySelector<HTMLElement>('[data-slot="otp-field"]')!;
    const inputs = [
      ...container.querySelectorAll<HTMLInputElement>('[data-slot="otp-field-input"]'),
    ];
    expect(inputs.some((input) => input.hasAttribute("aria-invalid"))).toBe(false);

    await act(async () => {
      enterCode(inputs[0]!, "000000");
    });
    expect(inputs.every((input) => input.getAttribute("aria-invalid") === "true")).toBe(true);
    expect(animate).toHaveBeenCalledTimes(1);
    expect(animate.mock.contexts[0]).toBe(field);

    await act(async () => {
      enterCode(inputs[5]!, "");
    });
    await act(async () => {
      enterCode(inputs[0]!, "123456");
    });
    expect(inputs.some((input) => input.hasAttribute("aria-invalid"))).toBe(false);
    expect(field.dataset.status).toBe("success");
    expect(animate).toHaveBeenCalledTimes(1);
  } finally {
    await act(async () => {
      root.unmount();
    });
    container.remove();
  }
});
