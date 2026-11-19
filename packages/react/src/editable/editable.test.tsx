import * as React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vite-plus/test";
import { Editable } from "./index";
import type { EditableRootProps, EditableSubmitDetails } from "./index";

const Title = (props: EditableRootProps) => (
  <Editable.Root placeholder="Untitled" {...props}>
    <Editable.Preview />
    <Editable.Input aria-label="Title" />
  </Editable.Root>
);

const preview = () => {
  const [first] = screen.getAllByRole("button");

  if (first === undefined) {
    throw new Error("No preview");
  }

  return first;
};

const input = () => screen.getByLabelText<HTMLInputElement>("Title");

const Controlled = () => {
  const [value, setValue] = React.useState("Kept");
  const [editing, setEditing] = React.useState(false);

  return (
    <>
      <Title
        value={value}
        editing={editing}
        onValueChange={setValue}
        onEditingChange={setEditing}
      />
      <output>{`${value}:${String(editing)}`}</output>
    </>
  );
};

describe("Editable parts", () => {
  it("shows the value, or the placeholder while empty", () => {
    const { rerender } = render(<Title defaultValue="Draft" />);

    expect(preview().textContent).toBe("Draft");
    expect(Object.hasOwn(preview().dataset, "empty")).toBeFalsy();

    rerender(<Title key="empty" />);
    expect(preview().textContent).toBe("Untitled");
    expect(Object.hasOwn(preview().dataset, "empty")).toBeTruthy();
  });

  it("keeps the input inert until editing starts", () => {
    render(<Title defaultValue="Draft" />);

    expect(input().getAttribute("tabindex")).toBe("-1");
    expect(input().hasAttribute("readonly")).toBeTruthy();
    expect(input().getAttribute("aria-hidden")).toBe("true");
  });

  it("starts on click, selects the text, commits on Enter and returns focus", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn<(value: string, details: EditableSubmitDetails) => void>();

    render(<Title defaultValue="Draft" onValueChange={onValueChange} />);
    await user.click(preview());

    const field = input();

    expect({
      editing: Object.hasOwn(field.dataset, "editing"),
      focused: document.activeElement === field,
      selection: [field.selectionStart, field.selectionEnd],
    }).toStrictEqual({ editing: true, focused: true, selection: [0, 5] });

    await user.keyboard("Final{Enter}");

    expect(onValueChange).toHaveBeenCalledOnce();
    const [value, details] = onValueChange.mock.calls[0] ?? [];
    expect({ reason: details?.reason, value }).toStrictEqual({ reason: "enter", value: "Final" });
    expect(preview().textContent).toBe("Final");
    expect(document.activeElement).toBe(preview());
  });

  it("discards the draft on Escape", async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn<NonNullable<EditableRootProps["onCancel"]>>();

    render(<Title defaultValue="Draft" onCancel={onCancel} />);
    await user.click(preview());
    await user.keyboard("Changed{Escape}");

    expect(onCancel.mock.calls[0]?.[0].reason).toBe("escape");
    expect(preview().textContent).toBe("Draft");
    expect(document.activeElement).toBe(preview());
  });

  it("commits on blur without moving focus back", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn<NonNullable<EditableRootProps["onSubmit"]>>();

    render(
      <>
        <Title defaultValue="Draft" onSubmit={onSubmit} />
        <button type="button">Elsewhere</button>
      </>,
    );
    await user.click(preview());
    await user.keyboard("Blurred");
    await user.click(screen.getByText("Elsewhere"));

    expect(onSubmit.mock.calls[0]?.[0]).toBe("Blurred");
    expect(onSubmit.mock.calls[0]?.[1].reason).toBe("blur");
    expect(document.activeElement).toBe(screen.getByText("Elsewhere"));
  });

  it("cancels on blur when the submit mode leaves blur out", async () => {
    const user = userEvent.setup();

    render(
      <>
        <Title defaultValue="Draft" submitMode="enter" />
        <button type="button">Elsewhere</button>
      </>,
    );
    await user.click(preview());
    await user.keyboard("Lost");
    await user.click(screen.getByText("Elsewhere"));

    expect(screen.getByText("Draft")).toBeTruthy();
  });

  it("ignores Enter during IME composition", async () => {
    const user = userEvent.setup();

    render(<Title defaultValue="Draft" />);
    await user.click(preview());
    fireEvent.keyDown(input(), { isComposing: true, key: "Enter", keyCode: 229 });

    expect(Object.hasOwn(input().dataset, "editing")).toBeTruthy();
  });

  it("rejects a commit when onValueChange cancels it", async () => {
    const user = userEvent.setup();

    render(
      <Title
        defaultValue="Draft"
        onValueChange={(value, details) => {
          if (value === "") {
            details.cancel();
          }
        }}
      />,
    );
    await user.click(preview());
    await user.keyboard("{Backspace}{Enter}");

    expect(Object.hasOwn(input().dataset, "editing")).toBeTruthy();
    expect(document.activeElement).toBe(input());
  });

  it("activates on double click or focus per activationMode", async () => {
    const user = userEvent.setup();
    const { unmount } = render(<Title defaultValue="Draft" activationMode="dblclick" />);

    await user.click(preview());
    expect(Object.hasOwn(input().dataset, "editing")).toBeFalsy();
    await user.dblClick(preview());
    expect(Object.hasOwn(input().dataset, "editing")).toBeTruthy();
    unmount();

    render(<Title defaultValue="Draft" activationMode="focus" />);
    await user.tab();
    expect(Object.hasOwn(input().dataset, "editing")).toBeTruthy();
    await user.keyboard("{Escape}");
    // Focus returns to the preview without reopening the editor.
    expect(document.activeElement).toBe(preview());
    expect(Object.hasOwn(input().dataset, "editing")).toBeFalsy();
  });

  it("does not edit while disabled or read-only", async () => {
    const user = userEvent.setup();

    render(<Title defaultValue="Draft" readOnly />);
    await user.click(screen.getByText("Draft"));

    expect(Object.hasOwn(input().dataset, "editing")).toBeFalsy();
    expect(Object.hasOwn(input().dataset, "readonly")).toBeTruthy();
  });

  it("uses Trigger, Submit and Cancel buttons and returns focus to the trigger", async () => {
    const user = userEvent.setup();

    render(
      <Editable.Root defaultValue="Draft" activationMode="none">
        <Editable.Preview />
        <Editable.Input aria-label="Title" />
        <Editable.Trigger>Edit</Editable.Trigger>
        <Editable.Submit>Save</Editable.Submit>
        <Editable.Cancel>Discard</Editable.Cancel>
      </Editable.Root>,
    );

    expect(screen.queryByText("Save")).toBeNull();
    await user.click(screen.getByText("Edit"));
    expect(screen.queryByText("Edit")).toBeNull();
    await user.keyboard("Saved");
    await user.click(screen.getByText("Save"));

    expect(screen.getByText("Saved")).toBeTruthy();
    expect(document.activeElement).toBe(screen.getByText("Edit"));

    await user.click(screen.getByText("Edit"));
    await user.keyboard("Thrown");
    await user.click(screen.getByText("Discard"));
    expect(screen.getAllByText("Saved").length).toBeGreaterThan(0);
  });

  it("commits multiline text with Ctrl+Enter in a textarea", async () => {
    const user = userEvent.setup();

    render(
      <Editable.Root defaultValue="One">
        <Editable.Preview />
        <Editable.Input aria-label="Notes" render={<textarea />} />
      </Editable.Root>,
    );
    await user.click(screen.getByRole("button", { name: "One" }));
    await user.keyboard("{End}{Enter}Two");

    const notes = screen.getByLabelText<HTMLTextAreaElement>("Notes");

    expect(Object.hasOwn(notes.dataset, "editing")).toBeTruthy();
    await user.keyboard("{Control>}{Enter}{/Control}");
    expect(Object.hasOwn(notes.dataset, "editing")).toBeFalsy();
    expect(notes.value).toBe("One\nTwo");
  });

  it("follows controlled value and editing", async () => {
    const user = userEvent.setup();

    render(<Controlled />);
    await user.click(screen.getByText("Kept"));
    expect(screen.getByRole("status").textContent).toBe("Kept:true");
    await user.keyboard("Next{Enter}");
    expect(screen.getByRole("status").textContent).toBe("Next:false");
  });

  it("submits the committed value with a form", async () => {
    const user = userEvent.setup();

    render(
      <form aria-label="Form">
        <Title defaultValue="Draft" name="title" />
      </form>,
    );
    await user.click(preview());
    await user.keyboard("Sent");

    const form = screen.getByRole<HTMLFormElement>("form");

    expect(new FormData(form).get("title")).toBe("Draft");
    await act(async () => {
      await user.keyboard("{Enter}");
    });
    expect(new FormData(form).get("title")).toBe("Sent");
  });

  it("renders on the server", () => {
    const html = renderToString(<Title defaultValue="Server" name="title" />);

    expect(html).toContain("Server");
    expect(html).toContain('name="title"');
  });
});
