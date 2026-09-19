import { render, screen } from "@testing-library/react";
import { Button } from "@erbium/ui/components/button";

test("renders a button", () => {
  render(<Button>Continue</Button>);
  expect(screen.getByRole("button", { name: "Continue" })).toBeTruthy();
});
