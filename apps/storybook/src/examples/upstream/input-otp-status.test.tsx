// @vitest-environment jsdom

import { act } from "react";
import { createRoot } from "react-dom/client";
import { expect, test, vi } from "vite-plus/test";
import { InputOTPStatusDemo } from "./input-otp-status";

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });

function enterCode(input: HTMLInputElement, code: string) {
  Reflect.set(HTMLInputElement.prototype, "value", code, input);
  input.dispatchEvent(new Event("input", { bubbles: true }));
}

test("a complete code loads read-only, then settles on success or error", async () => {
  vi.useFakeTimers();
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);

  try {
    await act(async () => {
      root.render(<InputOTPStatusDemo />);
    });
    const input = container.querySelector<HTMLInputElement>("[data-input-otp]")!;

    await act(async () => {
      enterCode(input, "123456");
    });
    expect(input.getAttribute("aria-busy")).toBe("true");
    expect(input.readOnly).toBe(true);
    expect(input.disabled).toBe(false);

    await act(async () => {
      vi.advanceTimersByTime(1000);
    });
    expect(input.hasAttribute("aria-busy")).toBe(false);
    expect(input.readOnly).toBe(true);
    expect(container.textContent).toContain("Code verified.");
    expect(
      container.querySelectorAll('[data-slot="input-otp-slot"][data-status="success"]'),
    ).toHaveLength(6);
  } finally {
    await act(async () => {
      root.unmount();
    });
    container.remove();
    vi.useRealTimers();
  }
});

test("a wrong code ends in the error state and editing resets it", async () => {
  vi.useFakeTimers();
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);

  try {
    await act(async () => {
      root.render(<InputOTPStatusDemo />);
    });
    const input = container.querySelector<HTMLInputElement>("[data-input-otp]")!;

    await act(async () => {
      enterCode(input, "000000");
      vi.advanceTimersByTime(1000);
    });
    expect(input.getAttribute("aria-invalid")).toBe("true");
    expect(input.readOnly).toBe(false);

    await act(async () => {
      enterCode(input, "00000");
    });
    expect(input.hasAttribute("aria-invalid")).toBe(false);
  } finally {
    await act(async () => {
      root.unmount();
    });
    container.remove();
    vi.useRealTimers();
  }
});
