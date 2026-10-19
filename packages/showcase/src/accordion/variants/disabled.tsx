import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Accordion,
} from "@erbium/ui/components/accordion";

const Example = () => (
  <Accordion className="w-80">
    <AccordionItem value="one">
      <AccordionTrigger>Available</AccordionTrigger>
      <AccordionContent>This panel opens.</AccordionContent>
    </AccordionItem>
    <AccordionItem value="two" disabled>
      <AccordionTrigger>Unavailable</AccordionTrigger>
      <AccordionContent>This panel is disabled.</AccordionContent>
    </AccordionItem>
  </Accordion>
);

export default Example;
