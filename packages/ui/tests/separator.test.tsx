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

test("the fade can be disabled for edge-to-edge dividers", () => {
  const { container } = render(<Separator fade={false} />);

  expect(container.querySelector('[data-slot="separator"]')?.getAttribute("data-fade")).toBe(
    "none",
  );
});
