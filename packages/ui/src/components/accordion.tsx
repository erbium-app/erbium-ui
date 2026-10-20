import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion";
import { cn } from "../lib/utils";
import { RotatingChevron } from "./stateful-icon";
import { Separator } from "./separator";

const Accordion = ({ className, ...props }: AccordionPrimitive.Root.Props) => (
  <AccordionPrimitive.Root
    data-slot="accordion"
    className={cn("flex w-full flex-col", className)}
    {...props}
  />
);

const AccordionItem = ({ className, children, ...props }: AccordionPrimitive.Item.Props) => (
  <AccordionPrimitive.Item
    data-slot="accordion-item"
    className={cn("group/accordion-item", className)}
    {...props}
  >
    {children}
    <Separator data-slot="accordion-item-separator" className="group-last/accordion-item:hidden" />
  </AccordionPrimitive.Item>
);

const AccordionTrigger = ({ className, children, ...props }: AccordionPrimitive.Trigger.Props) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      data-slot="accordion-trigger"
      className={cn(
        "group group/accordion-trigger relative flex flex-1 items-start justify-between rounded-lg border border-transparent min-h-control control-adaptive py-related text-start text-control-sm font-medium transition-colors outline-none hover:underline data-panel-open:rounded-b-none group-has-[[data-slot=accordion-content]:not([hidden])]/accordion-item:rounded-b-none focus-visible:border-ring focus-visible:after:border-ring **:data-[slot=accordion-trigger-icon]:ms-auto **:data-[slot=accordion-trigger-icon]:size-4 **:data-[slot=accordion-trigger-icon]:text-muted-foreground data-disabled:pointer-events-none data-disabled:opacity-50",
        className,
      )}
      {...props}
    >
      {children}
      <RotatingChevron data-slot="accordion-trigger-icon" className="pointer-events-none" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
);

const AccordionContent = ({ className, children, ...props }: AccordionPrimitive.Panel.Props) => (
  <AccordionPrimitive.Panel
    data-slot="accordion-content"
    className="h-(--accordion-panel-height) overflow-hidden text-caption transition-[height] duration-200 ease-in-out data-ending-style:h-0 data-starting-style:h-0 motion-reduce:transition-none"
    {...props}
  >
    <div
      className={cn(
        "pt-2.5 pb-2.5 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4",
        className,
      )}
    >
      {children}
    </div>
  </AccordionPrimitive.Panel>
);

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
