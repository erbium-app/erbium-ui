import { act, fireEvent, render, screen } from "@testing-library/react";
import { Checkbox, CheckboxGroup } from "@erbium/ui/components/checkbox";

const pointer = (type: string, target: Element, init: MouseEventInit = {}) =>
  act(() => {
    target.dispatchEvent(new MouseEvent(type, { bubbles: true, button: 0, buttons: 1, ...init }));
  });

function drag(from: Element, to: Element) {
  pointer("pointerdown", from);
  pointer("pointerover", to);
  act(() => {
    window.dispatchEvent(new MouseEvent("pointerup"));
  });
}

function Frameworks({ onValueChange }: { onValueChange?: (value: string[]) => void }) {
  return (
    <CheckboxGroup
      aria-label="Frameworks"
      allValues={["next", "vite", "astro", "remix"]}
      defaultValue={["next"]}
      onValueChange={onValueChange}
    >
      <label>
        <Checkbox parent />
        All
      </label>
      <label>
        <Checkbox value="next" />
        Next.js
      </label>
      <label>
        <Checkbox value="vite" />
        Vite
      </label>
      <label>
        <Checkbox disabled value="astro" />
        Astro
      </label>
      <label>
        <Checkbox value="remix" />
        Remix
      </label>
    </CheckboxGroup>
  );
}

const checkbox = (name: string) => screen.getByRole("checkbox", { name });

test("checkbox group exposes Base UI group semantics", () => {
  const { container } = render(<Frameworks />);
  const group = screen.getByRole("group", { name: "Frameworks" });
  expect(group.getAttribute("data-slot")).toBe("checkbox-group");
  expect(container.querySelector("[data-parent]")?.getAttribute("aria-checked")).toBe("mixed");
});

test("dragging across labels selects the range, skips disabled items, and updates the parent", () => {
  const values: string[][] = [];
  render(<Frameworks onValueChange={(value) => values.push(value)} />);

  drag(screen.getByText("Vite"), screen.getByText("Remix"));
  expect(checkbox("Vite").getAttribute("aria-checked")).toBe("true");
  expect(checkbox("Astro").getAttribute("aria-checked")).toBe("false");
  expect(checkbox("Remix").getAttribute("aria-checked")).toBe("true");
  expect(values.at(-1)).toEqual(["next", "vite", "remix"]);

  drag(checkbox("Remix"), checkbox("Next.js"));
  expect(values.at(-1)).toEqual([]);
  expect(checkbox("All").getAttribute("aria-checked")).toBe("false");
});

test("the click released at the end of a drag does not toggle the item again", async () => {
  render(<Frameworks />);
  drag(checkbox("Vite"), checkbox("Next.js"));
  expect(checkbox("Next.js").getAttribute("aria-checked")).toBe("true");
  expect(checkbox("Vite").getAttribute("aria-checked")).toBe("true");

  fireEvent.click(checkbox("Next.js"));
  expect(checkbox("Next.js").getAttribute("aria-checked")).toBe("true");

  await act(() => new Promise((resolve) => setTimeout(resolve)));
  fireEvent.click(checkbox("Next.js"));
  expect(checkbox("Next.js").getAttribute("aria-checked")).toBe("false");
});
