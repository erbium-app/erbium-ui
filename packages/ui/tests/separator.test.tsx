import { render, screen } from "@testing-library/react";
import { Separator } from "@erbium/ui/components/separator";
import { expect, test } from "vite-plus/test";

test("unlabeled separators keep their accessible role and orientation", () => {
  render(<Separator orientation="vertical" />);

  const separator = screen.getByRole("separator");
  expect(separator.getAttribute("aria-orientation")).toBe("vertical");
  expect(separator.getAttribute("data-orientation")).toBe("vertical");
  expect(separator.getAttribute("data-slot")).toBe("separator");
});

test("labeled separators expose their text without separator semantics", () => {
  const { container } = render(<Separator>or</Separator>);

  expect(screen.getByText("or")).toBeTruthy();
  expect(screen.queryByRole("separator")).toBeNull();
  expect(container.querySelector("[data-labeled]")).toBeTruthy();
});

test("separators are full width by default and can opt into fading", () => {
  const { container, rerender } = render(<Separator />);
  expect(container.querySelector("[data-separator]")?.hasAttribute("data-fade")).toBe(false);

  rerender(<Separator fade />);
  expect(container.querySelector("[data-separator]")?.hasAttribute("data-fade")).toBe(true);
});

test("custom slots retain separator styling", () => {
  const { container } = render(<Separator data-slot="command-separator" />);
  const separator = container.querySelector('[data-slot="command-separator"]');

  expect(separator?.hasAttribute("data-separator")).toBe(true);
});
