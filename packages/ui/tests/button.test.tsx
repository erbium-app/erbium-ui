import { render, screen } from "@testing-library/react";
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
