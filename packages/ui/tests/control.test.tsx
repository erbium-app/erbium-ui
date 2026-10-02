import "./browser-animation-stubs";
import { fireEvent, render, screen } from "@testing-library/react";
import { Control } from "@erbium/ui/components/control";

test("edits and clamps a numeric control without losing its slider semantics", () => {
  const changes: number[] = [];
  render(
    <Control.Number
      label="Opacity"
      defaultValue={0.5}
      min={0}
      max={1}
      step={0.1}
      onValueChange={(value) => changes.push(value)}
    />,
  );

  expect(screen.getByRole("slider", { name: "Opacity" })).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "Edit Opacity value" }));
  const input = screen.getByRole("textbox", { name: "Opacity value" });
  fireEvent.change(input, { target: { value: "1.8" } });
  fireEvent.keyDown(input, { key: "Enter" });

  expect(changes).toEqual([1]);
  expect(screen.getByRole("slider", { name: "Opacity" }).getAttribute("aria-valuenow")).toBe("1");
});

test("stretches the slider surface only when a drag passes its bounds", () => {
  const { container } = render(<Control.Number label="Blur" defaultValue={50} min={0} max={100} />);
  const root = container.querySelector('[data-slot="control-number"]');
  const surface = root?.firstElementChild as HTMLElement;
  const track = root?.children[1] as HTMLElement;
  Object.defineProperty(track, "getBoundingClientRect", {
    value: () => ({ left: 0, right: 200, top: 0, bottom: 36, width: 200, height: 36 }),
  });
  Object.defineProperty(track, "setPointerCapture", { value: () => undefined });

  fireEvent.pointerDown(track, { button: 0, pointerId: 1, clientX: 100, clientY: 18 });
  fireEvent.pointerMove(track, { pointerId: 1, buttons: 1, clientX: 250, clientY: 18 });

  expect(surface.style.left).toBe("0px");
  expect(surface.style.right).toBe("-2.4px");

  fireEvent.pointerMove(track, { pointerId: 1, buttons: 1, clientX: -50, clientY: 18 });
  expect(surface.style.left).toBe("-2.4px");
  expect(surface.style.right).toBe("0px");
});

test("continuous values retain precise manual input", () => {
  const changes: number[] = [];
  render(
    <Control.Number
      label="Gain"
      mode="continuous"
      defaultValue={0.5}
      min={0}
      max={1}
      onValueChange={(next) => changes.push(next)}
    />,
  );

  fireEvent.click(screen.getByRole("button", { name: "Edit Gain value" }));
  fireEvent.change(screen.getByRole("textbox", { name: "Gain value" }), {
    target: { value: "0.314159" },
  });
  fireEvent.keyDown(screen.getByRole("textbox", { name: "Gain value" }), { key: "Enter" });

  expect(changes).toEqual([0.314159]);
  expect(screen.getByRole("slider", { name: "Gain" }).getAttribute("aria-valuenow")).toBe(
    "0.314159",
  );
});

test("uneven discrete steps snap typed values and submit the actual value", () => {
  const changes: number[] = [];
  const { container } = render(
    <Control.Number
      label="Quality"
      name="quality"
      steps={[0.1, 0.5, 0.7, 1.3]}
      defaultValue={0.5}
      onValueChange={(next) => changes.push(next)}
    />,
  );

  fireEvent.click(screen.getByRole("button", { name: "Edit Quality value" }));
  fireEvent.change(screen.getByRole("textbox", { name: "Quality value" }), {
    target: { value: "0.64" },
  });
  fireEvent.keyDown(screen.getByRole("textbox", { name: "Quality value" }), { key: "Enter" });

  expect(changes).toEqual([0.7]);
  expect(container.querySelector('input[name="quality"]')?.getAttribute("value")).toBe("0.7");
  expect(screen.getByRole("slider", { name: "Quality" }).getAttribute("aria-valuetext")).toBe(
    "0.7",
  );
  expect(screen.getByRole("slider", { name: "Quality" }).getAttribute("aria-valuenow")).toBe("0.7");
  expect(container.querySelectorAll('[data-slot="control-number-step"]')).toHaveLength(4);
  expect(container.querySelectorAll('[data-slot="control-number-step"][data-active]')).toHaveLength(
    1,
  );
  fireEvent.keyDown(screen.getByRole("slider", { name: "Quality" }), { key: "ArrowRight" });
  expect(changes).toEqual([0.7, 1.3]);
});

test("text, segmented boolean, and section controls remain operable", () => {
  const textValues: string[] = [];
  const checkedValues: boolean[] = [];
  render(
    <Control.Group>
      <Control.Text
        label="Title"
        defaultValue="Japan"
        onValueChange={(value) => textValues.push(value)}
      />
      <Control.Boolean
        label="Visible"
        defaultChecked
        onCheckedChange={(value) => checkedValues.push(value)}
      />
      <Control.Section title="Shadow">
        <Control.Action label="Reset" />
      </Control.Section>
    </Control.Group>,
  );

  fireEvent.change(screen.getByRole("textbox", { name: "Title" }), { target: { value: "Kyoto" } });
  fireEvent.click(screen.getByRole("radio", { name: "Off" }));
  expect(textValues.at(-1)).toBe("Kyoto");
  expect(checkedValues).toEqual([false]);
  expect(screen.getByRole("button", { name: "Shadow" }).getAttribute("aria-expanded")).toBe("true");
  expect(
    document.querySelector('[data-slot="control-section"] [data-slot="collapsible-content"]'),
  ).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "Shadow" }));
  expect(screen.getByRole("button", { name: "Shadow" }).getAttribute("aria-expanded")).toBe(
    "false",
  );
});

test("spring and transition editors switch modes with valid values", () => {
  const springValues: unknown[] = [];
  const transitionValues: unknown[] = [];
  render(
    <Control.Group>
      <Control.Spring label="Spring" onValueChange={(value) => springValues.push(value)} />
      <Control.Transition
        label="Transition"
        onValueChange={(value) => transitionValues.push(value)}
      />
    </Control.Group>,
  );

  fireEvent.click(screen.getAllByRole("radio", { name: "Physics" })[0]);
  fireEvent.click(screen.getAllByRole("radio", { name: "Time" })[1]);
  expect(springValues.at(-1)).toEqual({ type: "spring", stiffness: 200, damping: 25, mass: 1 });
  expect(transitionValues.at(-1)).toEqual({ type: "spring", visualDuration: 0.3, bounce: 0.2 });
});

test("text and textarea rows delegate to Field: label click, form value, disabled, invalid", () => {
  const { container } = render(
    <form>
      <Control.Text label="Title" name="title" defaultValue="Japan" />
      <Control.Textarea label="Notes" name="notes" defaultValue="Hi" />
      <Control.Text label="Locked" disabled defaultValue="x" />
      <Control.Text label="Bad" defaultValue="" aria-invalid />
    </form>,
  );

  const title = screen.getByRole("textbox", { name: "Title" }) as HTMLInputElement;
  const notes = screen.getByRole("textbox", { name: "Notes" }) as HTMLTextAreaElement;
  expect(title.name).toBe("title");
  expect(notes.name).toBe("notes");
  expect(notes.tagName).toBe("TEXTAREA");
  const data = new FormData(container.querySelector("form") as HTMLFormElement);
  expect(data.get("title")).toBe("Japan");
  expect(data.get("notes")).toBe("Hi");

  const row = container.querySelector('[data-slot="control-text"]') as HTMLElement;
  expect(row.tagName).toBe("LABEL");
  expect((screen.getByRole("textbox", { name: "Locked" }) as HTMLInputElement).disabled).toBe(true);
  expect(screen.getByRole("textbox", { name: "Bad" }).getAttribute("aria-invalid")).toBe("true");

  const changes: string[] = [];
  render(<Control.Textarea label="Bio" onValueChange={(v) => changes.push(v)} />);
  fireEvent.change(screen.getByRole("textbox", { name: "Bio" }), { target: { value: "Hello" } });
  expect(changes).toEqual(["Hello"]);
});
