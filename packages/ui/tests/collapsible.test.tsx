import { fireEvent, render, screen } from "@testing-library/react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@erbium/ui/components/collapsible";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@erbium/ui/components/sidebar";

test("collapsible exposes its state and animates the shared panel", () => {
  const { container } = render(
    <Collapsible defaultOpen>
      <CollapsibleTrigger>Details</CollapsibleTrigger>
      <CollapsibleContent>More details</CollapsibleContent>
    </Collapsible>,
  );

  const trigger = screen.getByRole("button", { name: "Details" });
  const panel = container.querySelector('[data-slot="collapsible-content"]');
  expect(trigger.getAttribute("aria-expanded")).toBe("true");
  expect(panel?.className).toContain("h-(--collapsible-panel-height)");
  expect(panel?.className).toContain("data-ending-style:h-0");
  expect(panel?.className).toContain("data-starting-style:h-0");

  fireEvent.click(trigger);
  expect(trigger.getAttribute("aria-expanded")).toBe("false");
});

test("a sidebar group label can act as the collapsible trigger", () => {
  render(
    <Collapsible defaultOpen>
      <SidebarGroup>
        <SidebarGroupLabel render={<CollapsibleTrigger />}>Workspace</SidebarGroupLabel>
        <CollapsibleContent>
          <SidebarGroupContent>Overview</SidebarGroupContent>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>,
  );

  const trigger = screen.getByRole("button", { name: "Workspace" });
  expect(trigger.getAttribute("aria-expanded")).toBe("true");
  fireEvent.click(trigger);
  expect(trigger.getAttribute("aria-expanded")).toBe("false");
});
