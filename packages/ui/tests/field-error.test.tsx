import { act, render, screen } from "@testing-library/react";
import { Field, FieldError, FieldLabel } from "@erbium/ui/components/field";
import { Input } from "@erbium/ui/components/input";
import { Textarea } from "@erbium/ui/components/textarea";

test("shows the error only while errors exist and links it to the control", async () => {
  const { rerender } = render(
    <Field name="email" invalid={false}>
      <FieldLabel>Email</FieldLabel>
      <Input />
      <FieldError errors={[]} />
    </Field>,
  );

  expect(screen.queryByRole("alert")).toBeNull();
  expect(screen.getByLabelText("Email").hasAttribute("aria-invalid")).toBe(false);

  rerender(
    <Field name="email" invalid>
      <FieldLabel>Email</FieldLabel>
      <Input />
      <FieldError errors={["Enter a valid email address."]} />
    </Field>,
  );

  const input = screen.getByLabelText("Email");
  const alert = screen.getByRole("alert");
  expect(alert.textContent).toBe("Enter a valid email address.");
  expect(input.getAttribute("aria-invalid")).toBe("true");
  expect(input.getAttribute("aria-describedby")).toContain(alert.id);

  rerender(
    <Field name="email" invalid={false}>
      <FieldLabel>Email</FieldLabel>
      <Input />
      <FieldError errors={[]} />
    </Field>,
  );
  await act(async () => {});
  expect(screen.queryByRole("alert")).toBeNull();
});

test("shows each distinct error once", () => {
  render(
    <Field invalid>
      <FieldError errors={["Required", { message: "Required" }, { message: "Invalid" }]} />
    </Field>,
  );

  expect(screen.getAllByRole("listitem").map((item) => item.textContent)).toEqual([
    "Required",
    "Invalid",
  ]);
});

test("textarea picks up the field's invalid state", () => {
  render(
    <Field invalid>
      <FieldLabel>Bio</FieldLabel>
      <Textarea />
    </Field>,
  );

  expect(screen.getByLabelText("Bio").getAttribute("aria-invalid")).toBe("true");
});
