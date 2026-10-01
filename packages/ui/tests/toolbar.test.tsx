import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Toggle } from "@erbium/ui/components/toggle";
import {
  Toolbar,
  ToolbarButton,
  ToolbarGroup,
  ToolbarSeparator,
} from "@erbium/ui/components/toolbar";

test("navigates a horizontal toolbar across groups and skips disabled items", async () => {
  render(
    <Toolbar aria-label="Editing commands">
      <ToolbarGroup aria-label="History">
        <ToolbarButton>Undo</ToolbarButton>
        <ToolbarButton disabled focusableWhenDisabled={false}>
          Redo
        </ToolbarButton>
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToolbarButton>Save</ToolbarButton>
    </Toolbar>,
  );

  const toolbar = screen.getByRole("toolbar", { name: "Editing commands" });
  const undo = screen.getByRole("button", { name: "Undo" });
  const save = screen.getByRole("button", { name: "Save" });
  expect(toolbar.getAttribute("aria-orientation")).toBe("horizontal");
  const separator = screen.getByRole("separator");
  expect(separator.getAttribute("aria-orientation")).toBe("vertical");
  expect(separator.getAttribute("data-orientation")).toBe("vertical");
  expect(separator.hasAttribute("data-separator")).toBe(true);
  expect(separator.getAttribute("data-variant")).toBe("full");
  expect(separator.className).toContain("data-vertical:w-0.5");

  await waitFor(() => expect(undo.tabIndex).toBe(0));
  act(() => undo.focus());
  fireEvent.keyDown(undo, { key: "ArrowRight" });
  await waitFor(() => expect(document.activeElement).toBe(save));
});

test("navigates a vertical toolbar with up and down arrows", async () => {
  render(
    <Toolbar aria-label="Arrange" orientation="vertical">
      <ToolbarButton>Move up</ToolbarButton>
      <ToolbarSeparator />
      <ToolbarButton>Move down</ToolbarButton>
    </Toolbar>,
  );

  const first = screen.getByRole("button", { name: "Move up" });
  const last = screen.getByRole("button", { name: "Move down" });
  const separator = screen.getByRole("separator");
  expect(separator.getAttribute("aria-orientation")).toBe("horizontal");
  expect(separator.className).toContain("data-horizontal:h-0.5");

  await waitFor(() => expect(first.tabIndex).toBe(0));
  act(() => first.focus());
  fireEvent.keyDown(first, { key: "ArrowDown" });
  await waitFor(() => expect(document.activeElement).toBe(last));
});

test("composes a toggle without losing its pressed state", () => {
  render(
    <Toolbar aria-label="Formatting">
      <ToolbarButton render={<Toggle aria-label="Bold" />}>B</ToolbarButton>
    </Toolbar>,
  );

  const bold = screen.getByRole("button", { name: "Bold" });
  fireEvent.click(bold);
  expect(bold.getAttribute("aria-pressed")).toBe("true");
});
