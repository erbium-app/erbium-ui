import { AccordionContent, AccordionItem, AccordionTrigger } from "@erbium/ui/components/accordion";
import { Accordion } from "@erbium/ui/components/accordion";
import type * as React from "react";

const Example = (args: React.ComponentProps<typeof Accordion>) => (
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

export default Example;
