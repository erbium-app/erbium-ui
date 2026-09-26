import { render, screen } from "@testing-library/react";
import { Spinner } from "@erbium/ui/components/spinner";

test("uses separate gradients for each accessible spinner", () => {
  const { container } = render(
    <>
      <Spinner />
      <Spinner aria-label="Saving" className="size-6" />
    </>,
  );

  const spinners = screen.getAllByRole("status");
  expect(screen.getByRole("status", { name: "Loading" })).toBeTruthy();
  expect(screen.getByRole("status", { name: "Saving" })).toBeTruthy();
  expect(spinners[1]?.getAttribute("class")).toContain("size-6");

  const gradients = [...container.querySelectorAll("linearGradient")];
  expect(new Set(gradients.map((gradient) => gradient.id)).size).toBe(4);
  for (const spinner of spinners) {
    const paths = spinner.querySelectorAll("path");
    for (const path of paths) {
      const id = path.getAttribute("stroke")?.slice(5, -1);
      expect(container.querySelector(`[id="${id}"]`)).toBeTruthy();
    }
  }
});
