import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Accordion,
} from "@erbium/ui/components/accordion";

export default function AccordionDisabledExample() {
  return (
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
}
