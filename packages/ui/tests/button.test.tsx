import { fireEvent, render, screen } from "@testing-library/react";
import { Button, ButtonShortcut } from "@erbium/ui/components/button";

test("keeps a shortcut hint out of the button name in RTL", () => {
  const { container } = render(
    <Button dir="rtl" size="sm" variant="outline">
      حفظ
      <ButtonShortcut hotkey="Mod+S" />
    </Button>,
  );

  expect(screen.getByRole("button", { name: "حفظ" })).toBeTruthy();
  const shortcut = container.querySelector('[data-slot="button-shortcut"]');
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
