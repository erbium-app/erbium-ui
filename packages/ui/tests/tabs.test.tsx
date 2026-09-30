import { fireEvent, render, screen } from "@testing-library/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@erbium/ui/components/tabs";

test("uses one recessed list and one raised indicator as selection changes", () => {
  const { container } = render(
    <Tabs defaultValue="first">
      <TabsList>
        <TabsTrigger value="first">First</TabsTrigger>
        <TabsTrigger value="second">Second</TabsTrigger>
      </TabsList>
      <TabsContent value="first">First panel</TabsContent>
      <TabsContent value="second">Second panel</TabsContent>
    </Tabs>,
  );

  const list = screen.getByRole("tablist");
  const indicator = container.querySelector('[data-slot="tabs-indicator"]');
  expect(list.className).toContain("bg-surface-well");
  expect(list.className).toContain("shadow-well");
  expect(indicator?.className).toContain("bg-surface-control");
  expect(indicator?.className).toContain("shadow-control");
  expect(container.querySelectorAll('[data-slot="tabs-indicator"]')).toHaveLength(1);

  fireEvent.click(screen.getByRole("tab", { name: "Second" }));
  expect(screen.getByRole("tab", { name: "Second" }).getAttribute("aria-selected")).toBe("true");
  expect(screen.getByRole("tabpanel").textContent).toBe("Second panel");
  expect(container.querySelectorAll('[data-slot="tabs-indicator"]')).toHaveLength(1);
});

test("places the selected surface at its measured size on mount", () => {
  const width = vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockImplementation(function (
    this: HTMLElement,
  ) {
    return this.dataset.slot === "tabs-trigger" ? 80 : 166;
  });
  const height = vi
    .spyOn(HTMLElement.prototype, "offsetHeight", "get")
    .mockImplementation(function (this: HTMLElement) {
      return this.dataset.slot === "tabs-trigger" ? 26 : 32;
    });
  const left = vi.spyOn(HTMLElement.prototype, "offsetLeft", "get").mockImplementation(function (
    this: HTMLElement,
  ) {
    return this.dataset.slot === "tabs-trigger" ? 3 : 0;
  });

  try {
    const { container } = render(
      <Tabs defaultValue="first">
        <TabsList>
          <TabsTrigger value="first">First</TabsTrigger>
          <TabsTrigger value="second">Second</TabsTrigger>
        </TabsList>
      </Tabs>,
    );

    const indicator = container.querySelector<HTMLElement>('[data-slot="tabs-indicator"]');
    expect(indicator?.hidden).toBe(false);
    expect(indicator?.style.width).toBe("80px");
    expect(indicator?.style.height).toBe("26px");
  } finally {
    width.mockRestore();
    height.mockRestore();
    left.mockRestore();
  }
});
