import "./browser-animation-stubs";
import { fireEvent, render, screen } from "@testing-library/react";
import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
} from "@erbium/ui/components/number-field";

function renderField(props: React.ComponentProps<typeof NumberField> = {}) {
  return render(
    <NumberField defaultValue={1200} {...props}>
      <NumberFieldGroup>
        <NumberFieldDecrement aria-label="Decrease" />
        <NumberFieldInput aria-label="Quantity" />
        <NumberFieldIncrement aria-label="Increase" />
      </NumberFieldGroup>
    </NumberField>,
  );
}

const wrapper = (container: HTMLElement) =>
  container.querySelector("[data-slot=number-field-input-wrapper]");
const display = (container: HTMLElement) =>
  container.querySelector("[data-slot=number-field-display]");

test("mirrors the formatted value in an overlay hidden from assistive tech", () => {
  const { container } = renderField();

  expect(screen.getByRole("textbox", { name: "Quantity" })).toHaveProperty("value", "1,200");
  expect(display(container)?.getAttribute("aria-hidden")).toBe("true");
  expect(display(container)?.textContent).toContain("1,200");
  expect(wrapper(container)?.hasAttribute("data-typing")).toBe(false);
});

test("typed text shows as typed, and stepping hands back to the morph", () => {
  const onValueChange = vi.fn();
  const { container } = renderField({ onValueChange });
  const input = screen.getByRole("textbox", { name: "Quantity" });

  fireEvent.change(input, { target: { value: "1500" } });
  expect(wrapper(container)?.hasAttribute("data-typing")).toBe(true);
  expect(onValueChange).toHaveBeenLastCalledWith(
    1500,
    expect.objectContaining({ reason: "input-change" }),
  );

  // Typed text is drawn plain, never by the morph layer.
  expect(wrapper(container)?.hasAttribute("data-morphing")).toBe(false);
  expect(container.querySelector("[data-slot=number-field-text]")?.textContent).toBe("1,500");

  fireEvent.keyDown(input, { key: "ArrowUp" });
  expect(wrapper(container)?.hasAttribute("data-typing")).toBe(false);
  expect(wrapper(container)?.hasAttribute("data-morphing")).toBe(true);
  expect(input).toHaveProperty("value", "1,501");
  expect(display(container)?.textContent).toContain("1,501");
});

test("steppers clamp to the bounds", () => {
  renderField({ defaultValue: 9, max: 10 });

  fireEvent.pointerDown(screen.getByRole("button", { name: "Increase" }));
  fireEvent.pointerUp(screen.getByRole("button", { name: "Increase" }));
  fireEvent.pointerDown(screen.getByRole("button", { name: "Increase" }));
  fireEvent.pointerUp(screen.getByRole("button", { name: "Increase" }));

  expect(screen.getByRole("textbox", { name: "Quantity" })).toHaveProperty("value", "10");
});

/** Types like a person: the DOM text and caret change, then the input event fires. */
function type(input: HTMLInputElement, value: string, caret = value.length) {
  Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set?.call(input, value);
  input.setSelectionRange(caret, caret);
  fireEvent.input(input);
}

test("regroups digits while typing, in the locale's grouping", () => {
  renderField({ defaultValue: undefined, locale: "en-IN" });
  const input = screen.getByRole("textbox", { name: "Quantity" }) as HTMLInputElement;

  type(input, "12,34,5671234");
  // The screenshot's case: digits typed into "12,34,567" regroup instead of piling up.
  expect(input.value).toBe("12,34,56,71,234");
});

test("keeps the caret after the digit it followed", () => {
  renderField({ defaultValue: undefined });
  const input = screen.getByRole("textbox", { name: "Quantity" }) as HTMLInputElement;

  // "1,2|34" + "9" typed → "1,29|34" → regrouped "12,9|34"
  type(input, "1,2934", 4);
  expect(input.value).toBe("12,934");
  expect(input.selectionStart).toBe(4);
});

test("leaves fractions, prefixes, and mid-edit leading zeros as typed", () => {
  renderField({ defaultValue: undefined, format: { style: "currency", currency: "USD" } });
  const input = screen.getByRole("textbox", { name: "Quantity" }) as HTMLInputElement;

  type(input, "$1234.5");
  expect(input.value).toBe("$1,234.5");
  type(input, "$05");
  expect(input.value).toBe("$05");
});
