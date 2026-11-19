import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Accordion,
} from "@erbium/ui/components/accordion";

import { Button } from "@erbium/ui/components/button";

import { useState } from "react";

const accordionItems = [
  {
    answer: "Yes. It follows the WAI-ARIA accordion pattern.",
    question: "Is it accessible?",
    value: "item-1",
  },
  {
    answer: "Yes. You can style each part of the accordion.",
    question: "Can I customize it?",
    value: "item-2",
  },
  {
    answer: "Yes. Enable the multiple prop to open several items.",
    question: "Can I open multiple items?",
    value: "item-3",
  },
];

export const AccordionExample = ({
  multiple = false,
  bordered = false,
}: {
  multiple?: boolean;
  bordered?: boolean;
}) => (
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

export const ControlledAccordionExample = () => {
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
        <Button
          onClick={() => {
            setValue(["item-1", "item-2"]);
          }}
          variant="outline"
        >
          Open first two
        </Button>
        <Button
          onClick={() => {
            setValue([]);
          }}
          variant="outline"
        >
          Close all
        </Button>
      </div>
      <p className="text-caption text-muted-foreground">
        Open items: {value.length > 0 ? value.join(", ") : "None"}
      </p>
    </div>
  );
};
