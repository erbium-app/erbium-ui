import { render, screen } from "@testing-library/react";
import { Label } from "@erbium/ui/components/label";

test("labels a control through htmlFor", () => {
  render(
    <>
      <Label htmlFor="name">Name</Label>
      <input id="name" />
    </>,
  );

  expect(screen.getByLabelText("Name")).toBeTruthy();
});

test("renders as another element through render", () => {
  render(<Label render={<span />}>Name</Label>);

  expect(screen.getByText("Name").tagName).toBe("SPAN");
});
