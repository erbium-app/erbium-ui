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
