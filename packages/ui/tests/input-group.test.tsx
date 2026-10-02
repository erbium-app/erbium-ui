import { fireEvent, render, screen } from "@testing-library/react";
import { Field, FieldLabel } from "@erbium/ui/components/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@erbium/ui/components/input-group";

// The group styles itself from these selectors; the control carries the state.
const focused = ":has([data-slot=input-group-control]:focus-visible)";
const disabled = ":has(> [data-slot=input-group-control][data-disabled])";
const invalid = ":has([data-slot][aria-invalid=true])";

function getGroup() {
  return screen.getByRole("textbox").closest<HTMLElement>('[data-slot="input-group"]')!;
}

test("pressing an addon focuses the control without moving focus away first", () => {
  const onBlur = vi.fn();
  render(
    <InputGroup>
      <InputGroupTextarea aria-label="Message" onBlur={onBlur} />
      <InputGroupAddon align="block-end">
        <InputGroupText>0/280</InputGroupText>
      </InputGroupAddon>
    </InputGroup>,
  );
  const textarea = screen.getByRole("textbox");

  const pressed = fireEvent.mouseDown(screen.getByText("0/280"));

  expect(pressed).toBe(false);
  expect(document.activeElement).toBe(textarea);
  expect(getGroup().matches(focused)).toBe(true);

  fireEvent.mouseDown(screen.getByText("0/280"));
  expect(onBlur).not.toHaveBeenCalled();
});

test("pressing a button in an addon leaves focus to the button", () => {
  const onMouseDown = vi.fn();
  render(
    <InputGroup>
      <InputGroupInput aria-label="Search" />
      <InputGroupAddon align="inline-end" onMouseDown={onMouseDown}>
        <InputGroupButton>Go</InputGroupButton>
      </InputGroupAddon>
    </InputGroup>,
  );

  const pressed = fireEvent.mouseDown(screen.getByRole("button", { name: "Go" }));

  expect(pressed).toBe(true);
  expect(onMouseDown).toHaveBeenCalledOnce();
  expect(document.activeElement).not.toBe(screen.getByRole("textbox"));
});

test("a disabled Field disables the group through its control", () => {
  render(
    <Field disabled>
      <FieldLabel>Search</FieldLabel>
      <InputGroup>
        <InputGroupInput />
      </InputGroup>
    </Field>,
  );

  expect(screen.getByRole<HTMLInputElement>("textbox").disabled).toBe(true);
  expect(getGroup().matches(disabled)).toBe(true);
});

test("a disabled addon button does not disable the group", () => {
  render(
    <InputGroup>
      <InputGroupInput aria-label="Link" />
      <InputGroupAddon align="inline-end">
        <InputGroupButton disabled>Copy</InputGroupButton>
      </InputGroupAddon>
    </InputGroup>,
  );

  expect(getGroup().matches(disabled)).toBe(false);
});

test("an invalid Field marks the group invalid through its control", () => {
  render(
    <Field invalid>
      <FieldLabel>Email</FieldLabel>
      <InputGroup>
        <InputGroupInput />
      </InputGroup>
    </Field>,
  );

  expect(screen.getByRole("textbox").getAttribute("aria-invalid")).toBe("true");
  expect(getGroup().matches(invalid)).toBe(true);
});
