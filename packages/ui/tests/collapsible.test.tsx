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
