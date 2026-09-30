import { fireEvent, render, screen } from "@testing-library/react";
import { Field, FieldError } from "@erbium/ui/components/field";

test("keeps the error container mounted while validation changes", () => {
  const { rerender } = render(
    <Field>
      <FieldError id="email-error" errors={[]} />
    </Field>,
  );

  const error = document.getElementById("email-error");
  expect(error?.getAttribute("data-visible")).toBe("false");
  expect(screen.queryByRole("alert")).toBeNull();

  rerender(
    <Field>
      <FieldError id="email-error" errors={["Enter a valid email address."]} />
    </Field>,
  );

  expect(document.getElementById("email-error")).toBe(error);
  expect(error?.getAttribute("data-visible")).toBe("true");
  expect(screen.getByRole("alert").textContent).toBe("Enter a valid email address.");

  rerender(
    <Field>
      <FieldError id="email-error" errors={[]} />
    </Field>,
  );

  expect(document.getElementById("email-error")).toBe(error);
  expect(error?.getAttribute("data-visible")).toBe("false");
  expect(error?.getAttribute("aria-hidden")).toBe("true");
  expect(error?.textContent).toBe("Enter a valid email address.");
  expect(screen.queryByRole("alert")).toBeNull();

  if (error) {
    fireEvent.transitionEnd(error, { propertyName: "grid-template-rows" });
  }

  expect(error?.textContent).toBe("");
});

test("shows each distinct error once", () => {
  render(<FieldError errors={["Required", { message: "Required" }, { message: "Invalid" }]} />);

  expect(screen.getAllByRole("listitem").map((item) => item.textContent)).toEqual([
    "Required",
    "Invalid",
  ]);
});
