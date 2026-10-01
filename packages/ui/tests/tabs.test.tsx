import { render } from "@testing-library/react";
import { Tabs, TabsList, TabsTrigger } from "@erbium/ui/components/tabs";

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
