// @vitest-environment jsdom

import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, expect, test, vi } from "vite-plus/test";
import { OTPFieldStatusDemo } from "./otp-field-status";

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });

afterEach(() => {
  Reflect.deleteProperty(Element.prototype, "animate");
  vi.useRealTimers();
});

function enterCode(input: HTMLInputElement, code: string) {
  Reflect.set(HTMLInputElement.prototype, "value", code, input);
  input.dispatchEvent(new Event("input", { bubbles: true }));
}

async function mount() {
  const animate = vi.fn(
    (_keyframes: Keyframe[], _options: KeyframeAnimationOptions) =>
      ({ cancel: vi.fn() }) as unknown as Animation,
  );
  Object.defineProperty(Element.prototype, "animate", { configurable: true, value: animate });
  vi.useFakeTimers();

  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);
  await act(async () => {
    root.render(<OTPFieldStatusDemo />);
  });

  const field = container.querySelector<HTMLElement>('[data-slot="otp-field"]')!;
  const inputs = [...container.querySelectorAll<HTMLInputElement>('[data-slot="otp-field-input"]')];

  return {
    animate,
    container,
    field,
    inputs,
    unmount: async () => {
      await act(async () => {
        root.unmount();
      });
      container.remove();
    },
  };
}

test("a complete code loads read-only, then settles on success", async () => {
  const { field, inputs, unmount } = await mount();

  try {
    expect(inputs).toHaveLength(6);

    await act(async () => {
      enterCode(inputs[0]!, "123456");
    });
    expect(field.getAttribute("aria-busy")).toBe("true");
    expect(field.dataset.status).toBe("loading");
    expect(inputs.every((input) => input.readOnly && !input.disabled)).toBe(true);

    await act(async () => {
      vi.advanceTimersByTime(1000);
    });
    expect(field.hasAttribute("aria-busy")).toBe(false);
    expect(field.dataset.status).toBe("success");
    expect(inputs.every((input) => input.readOnly)).toBe(true);
  } finally {
    await unmount();
  }
});

test("a wrong code errors, shakes the field once, and editing resets it", async () => {
  const { animate, field, inputs, unmount } = await mount();

  try {
    await act(async () => {
      enterCode(inputs[0]!, "000000");
      vi.advanceTimersByTime(1000);
    });
    expect(field.dataset.status).toBe("error");
    expect(inputs.every((input) => input.getAttribute("aria-invalid") === "true")).toBe(true);
    expect(inputs.every((input) => !input.readOnly)).toBe(true);
    expect(animate).toHaveBeenCalledTimes(1);
    expect(animate.mock.contexts[0]).toBe(field);

    await act(async () => {
      enterCode(inputs[5]!, "");
    });
    expect(field.hasAttribute("data-status")).toBe(false);
    expect(inputs.some((input) => input.hasAttribute("aria-invalid"))).toBe(false);
    expect(animate).toHaveBeenCalledTimes(1);
  } finally {
    await unmount();
  }
});
