import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { Field, FieldLabel } from "@erbium/ui/components/field";
import { Textarea } from "@erbium/ui/components/textarea";

test("reports its state to the surrounding Field and keeps caller handlers", () => {
  const onChange = vi.fn();

  function Controlled() {
    const [value, setValue] = useState("");
    return (
      <Field name="bio">
        <FieldLabel>Bio</FieldLabel>
        <Textarea
          value={value}
          onChange={(event) => {
            onChange(event.target.value);
            setValue(event.target.value);
          }}
        />
      </Field>
    );
  }

  render(<Controlled />);
  const textarea = screen.getByLabelText<HTMLTextAreaElement>("Bio");
  const field = textarea.closest('[data-slot="field"]')!;

  expect(textarea.name).toBe("bio");
  expect(field.hasAttribute("data-filled")).toBe(false);

  fireEvent.change(textarea, { target: { value: "hello" } });

  expect(onChange).toHaveBeenCalledWith("hello");
  expect(textarea.value).toBe("hello");
  expect(field.hasAttribute("data-filled")).toBe(true);
  expect(field.hasAttribute("data-dirty")).toBe(true);
});

test("a disabled Field disables the textarea", () => {
  render(
    <Field disabled>
      <FieldLabel>Bio</FieldLabel>
      <Textarea />
    </Field>,
  );

  expect(screen.getByLabelText<HTMLTextAreaElement>("Bio").disabled).toBe(true);
});
