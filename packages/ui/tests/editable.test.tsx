import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Editable, EditableInput, EditablePreview } from "@erbium/ui/components/editable";

function renderEditable(props: React.ComponentProps<typeof Editable> = {}) {
  return render(
    <Editable defaultValue="First tab" {...props}>
      <EditablePreview aria-label="Rename tab" />
      <EditableInput aria-label="Tab name" />
    </Editable>,
  );
}

test("commits on Enter and keeps the preview in the layout while editing", async () => {
  const values: string[] = [];
  const { container } = renderEditable({ onValueChange: (value) => values.push(value) });
  const displayedInput = container.querySelector('[data-slot="editable-input"]');
  fireEvent.click(screen.getByRole("button", { name: "Rename tab" }));
  const input = screen.getByRole("textbox", { name: "Tab name" });
  expect(input).toBe(displayedInput);
  expect(container.querySelector('[data-slot="editable-preview"]')).toBeTruthy();
  await waitFor(() => expect(document.activeElement).toBe(input));
  fireEvent.change(input, { target: { value: "Second tab" } });
  fireEvent.keyDown(input, { key: "Enter" });
  expect(values).toEqual(["Second tab"]);
  expect(screen.getByRole("button", { name: "Rename tab" }).textContent).toBe("Second tab");
  await waitFor(() =>
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Rename tab" })),
  );
});

test("Escape discards the draft and blur commits it", () => {
  const values: string[] = [];
  renderEditable({ onValueChange: (value) => values.push(value) });
  fireEvent.click(screen.getByRole("button", { name: "Rename tab" }));
  fireEvent.change(screen.getByRole("textbox"), { target: { value: "Discarded" } });
  fireEvent.keyDown(screen.getByRole("textbox"), { key: "Escape" });
  expect(values).toEqual([]);
  expect(screen.getByRole("button").textContent).toBe("First tab");
  fireEvent.click(screen.getByRole("button"));
  fireEvent.change(screen.getByRole("textbox"), { target: { value: "Saved" } });
  fireEvent.blur(screen.getByRole("textbox"));
  expect(values).toEqual(["Saved"]);
});

test("supports controlled values and double click activation", () => {
  const values: string[] = [];
  renderEditable({
    value: "Controlled",
    triggerMode: "doubleClick",
    onValueChange: (value) => values.push(value),
  });
  fireEvent.click(screen.getByRole("button"));
  expect(screen.queryByRole("textbox")).toBeNull();
  fireEvent.doubleClick(screen.getByRole("button"));
  fireEvent.change(screen.getByRole("textbox"), { target: { value: "Changed" } });
  fireEvent.keyDown(screen.getByRole("textbox"), { key: "Enter" });
  expect(values).toEqual(["Changed"]);
  expect(screen.getByRole("button").textContent).toBe("Controlled");
});
