import { fireEvent, render, screen } from "@testing-library/react";
import { Button, ButtonShortcut } from "@erbium/ui/components/button";

test("renders a button", () => {
  render(<Button>Continue</Button>);
  expect(screen.getByRole("button", { name: "Continue" })).toBeTruthy();
});

test("keeps a shortcut hint out of the button name in RTL", () => {
  const { container } = render(
    <Button dir="rtl" size="sm" variant="outline">
      حفظ
      <ButtonShortcut hotkey="Mod+S" />
    </Button>,
  );

  const button = screen.getByRole("button", { name: "حفظ" });
  expect(button.getAttribute("dir")).toBe("rtl");
  expect(button.getAttribute("data-size")).toBe("sm");
  const shortcut = container.querySelector('[data-slot="button-shortcut"]');
  expect(shortcut?.tagName).toBe("SPAN");
  expect(shortcut?.querySelector("kbd")?.getAttribute("dir")).toBe("ltr");
});

test("shows a spinner and blocks activation while loading without changing the button name", () => {
  const onClick = vi.fn();
  const { rerender } = render(
    <Button loading onClick={onClick}>
      Save
    </Button>,
  );
  const button = screen.getByRole("button", { name: "Save" });
  button.focus();
  expect(button.getAttribute("aria-busy")).toBe("true");
  expect(button.getAttribute("aria-disabled")).toBe("true");
  expect(button.querySelectorAll('[data-slot="spinner"]')).toHaveLength(1);
  fireEvent.click(button);
  expect(onClick).not.toHaveBeenCalled();

  rerender(<Button onClick={onClick}>Save</Button>);
  expect(button.getAttribute("aria-busy")).toBeNull();
  expect(button.querySelector('[data-slot="spinner"]')).toBeNull();
  fireEvent.click(button);
  expect(onClick).toHaveBeenCalledTimes(1);
});

test("replaces icon-only content with the spinner while loading", () => {
  const { container } = render(
    <Button aria-label="Refresh" loading size="icon">
      <span data-slot="refresh-icon">↻</span>
    </Button>,
  );
  expect(screen.getByRole("button", { name: "Refresh" })).toBeTruthy();
  expect(container.querySelector('[data-slot="refresh-icon"]')).toBeNull();
  expect(container.querySelectorAll('[data-slot="spinner"]')).toHaveLength(1);
  expect(container.querySelector('[data-slot="spinner"]')?.hasAttribute("data-icon")).toBe(false);
});

test.each(["ltr", "rtl"] as const)(
  "places the loading spinner at the logical start in %s",
  (direction) => {
    const { container } = render(
      <Button dir={direction} loading size="sm">
        Save
      </Button>,
    );
    const button = container.querySelector('[data-slot="button"]');
    expect(button?.getAttribute("dir")).toBe(direction);
    expect(button?.firstElementChild?.getAttribute("data-icon")).toBe("inline-start");
    expect(button?.firstElementChild?.getAttribute("data-slot")).toBe("spinner");
    expect(button?.getAttribute("class")).toContain("has-data-[icon=inline-start]:ps-1.5");
    expect(button?.getAttribute("class")).toContain("gap-1");
  },
);
