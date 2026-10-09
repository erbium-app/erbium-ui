import { AccordionContent, AccordionItem, AccordionTrigger } from "@erbium/ui/components/accordion";

import { Button } from "@erbium/ui/components/button";

import { useState } from "react";

import { Accordion } from "@erbium/ui/components/accordion";

const accordionItems = [
  {
    value: "item-1",
    question: "Is it accessible?",
    answer: "Yes. It follows the WAI-ARIA accordion pattern.",
  },
  {
    value: "item-2",
    question: "Can I customize it?",
    answer: "Yes. You can style each part of the accordion.",
  },
  {
    value: "item-3",
    question: "Can I open multiple items?",
    answer: "Yes. Enable the multiple prop to open several items.",
  },
];

export function AccordionExample({
  multiple = false,
  bordered = false,
}: {
  multiple?: boolean;
  bordered?: boolean;
}) {
  return (
    <Accordion
      className={bordered ? "w-80 rounded-lg border px-4" : "w-80"}
      defaultValue={["item-1"]}
      multiple={multiple}
    >
      {accordionItems.map((item) => (
        <AccordionItem key={item.value} value={item.value}>
          <AccordionTrigger>{item.question}</AccordionTrigger>
          <AccordionContent>{item.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

export function ControlledAccordionExample() {
  const [value, setValue] = useState<string[]>(["item-1"]);

  return (
    <div className="flex w-80 flex-col gap-group">
      <Accordion multiple onValueChange={setValue} value={value}>
        {accordionItems.map((item) => (
          <AccordionItem key={item.value} value={item.value}>
            <AccordionTrigger>{item.question}</AccordionTrigger>
            <AccordionContent>{item.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <div className="flex flex-wrap gap-related">
        <Button onClick={() => setValue(["item-1", "item-2"])} variant="outline">
          Open first two
        </Button>
        <Button onClick={() => setValue([])} variant="outline">
          Close all
        </Button>
      </div>
      <p className="text-muted-foreground text-caption">
        Open items: {value.length > 0 ? value.join(", ") : "None"}
      </p>
    </div>
  );
}
