import { fireEvent, render, screen } from "@testing-library/react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@erbium/ui/components/accordion";

test("accordion animates the panel height when its trigger is clicked", () => {
  const { container } = render(
    <Accordion>
      <AccordionItem value="details">
        <AccordionTrigger>Details</AccordionTrigger>
        <AccordionContent>More details</AccordionContent>
      </AccordionItem>
    </Accordion>,
  );

  const trigger = screen.getByRole("button", { name: "Details" });
  expect(trigger.getAttribute("aria-expanded")).toBe("false");

  fireEvent.click(trigger);
  const panel = container.querySelector('[data-slot="accordion-content"]');
  expect(trigger.getAttribute("aria-expanded")).toBe("true");
  expect(trigger.className).toContain("data-panel-open:rounded-b-none");
  expect(panel?.className).toContain("h-(--accordion-panel-height)");
  expect(panel?.className).toContain("data-starting-style:h-0");
  expect(panel?.firstElementChild?.getAttribute("data-slot")).toBe("separator");
  expect(panel?.lastElementChild?.textContent).toBe("More details");
});
