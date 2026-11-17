import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Accordion,
} from "@erbium/ui/components/accordion";
import type * as React from "react";

export const defaultProps = {
  defaultValue: ["one"],
  multiple: false,
} satisfies React.ComponentProps<typeof Accordion>;

export default function AccordionPlaygroundExample(
  args: React.ComponentProps<typeof Accordion> = defaultProps,
) {
  return (
    <Accordion {...args} className="w-80">
      <AccordionItem value="one">
        <AccordionTrigger>First question</AccordionTrigger>
        <AccordionContent>First answer</AccordionContent>
      </AccordionItem>
      <AccordionItem value="two">
        <AccordionTrigger>Second question</AccordionTrigger>
        <AccordionContent>Second answer</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
