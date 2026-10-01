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

test("separators follow their container unless a variant or label sets their ends", () => {
  const { container, rerender } = render(<Separator />);
  const variant = () => container.querySelector("[data-separator]")?.getAttribute("data-variant");
  expect(variant()).toBeNull();

  rerender(<Separator variant="full" />);
  expect(variant()).toBe("full");

  rerender(<Separator variant="inset" />);
  expect(variant()).toBe("inset");

  rerender(<Separator variant="full">or</Separator>);
  expect(variant()).toBe("inset");
});
