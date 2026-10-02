import { act, render, screen } from "@testing-library/react";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldItem,
  FieldLabel,
} from "@erbium/ui/components/field";
import { Input } from "@erbium/ui/components/input";
import { RadioGroup, RadioGroupItem } from "@erbium/ui/components/radio-group";
import { Switch } from "@erbium/ui/components/switch";
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

test("a card field labels its control without ids", () => {
  render(
    <Field variant="card" orientation="horizontal">
      <FieldContent>
        <FieldLabel>Pick me</FieldLabel>
        <FieldDescription>Because.</FieldDescription>
      </FieldContent>
      <Switch />
    </Field>,
  );

  const control = screen.getByRole("switch", { name: "Pick me" });
  expect(control.getAttribute("aria-describedby")).toBeTruthy();
});

test("a card field item labels its radio inside a group", () => {
  render(
    <Field>
      <RadioGroup defaultValue="a">
        <FieldItem variant="card">
          <FieldLabel>Plan A</FieldLabel>
          <RadioGroupItem value="a" />
        </FieldItem>
        <FieldItem variant="card" disabled>
          <FieldLabel>Plan B</FieldLabel>
          <RadioGroupItem value="b" />
        </FieldItem>
      </RadioGroup>
    </Field>,
  );

  expect(screen.getByRole("radio", { name: "Plan A" }).getAttribute("aria-checked")).toBe("true");
  expect(screen.getByRole("radio", { name: "Plan B" }).hasAttribute("data-disabled")).toBe(true);
});
