import AccordionCard from "../examples/upstream/accordion-card";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@erbium/ui/components/accordion";
import { Button } from "@erbium/ui/components/button";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { useState } from "react";
import { Accordion } from "@erbium/ui/components/accordion";
import Demo from "../examples/accordion-demo";

const meta = {
  title: "UI/Accordion",
  component: Accordion,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'A vertically stacked set of interactive headings that each reveal a section of content.\n\n**Import:** `@erbium/ui/components/accordion`  \n\n**shadcn/ui page:** [Accordion](https://ui.shadcn.com/docs/components/base/accordion)  \n\n**COSS UI page:** [Accordion](https://coss.com/ui/docs/components/accordion)\n\n### Usage\n\n```tsx\nimport {\n  Accordion,\n  AccordionContent,\n  AccordionItem,\n  AccordionTrigger,\n} from "@erbium/ui/components/accordion"\n```\n\n```tsx\n<Accordion defaultValue={["item-1"]}>\n  <AccordionItem value="item-1">\n    <AccordionTrigger>Is it accessible?</AccordionTrigger>\n    <AccordionContent>\n      Yes. It adheres to the WAI-ARIA design pattern.\n    </AccordionContent>\n  </AccordionItem>\n</Accordion>\n```\n\n### Composition\n\nUse the following composition to build an `Accordion`:\n\n```text\nAccordion\n├── AccordionItem\n│   ├── AccordionTrigger\n│   └── AccordionContent\n└── AccordionItem\n    ├── AccordionTrigger\n    └── AccordionContent\n```',
      },
    },
  },
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: StoryObj<typeof Accordion> = {
  args: { defaultValue: ["one"], multiple: false },
  argTypes: { multiple: { control: "boolean" } },
  render: (args) => (
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
  ),
};

export const Overview: Story = {
  parameters: {
    docs: {
      source: {
        code: 'import {\n  Accordion,\n  AccordionContent,\n  AccordionItem,\n  AccordionTrigger,\n} from "@erbium/ui/components/accordion";\n\nexport default function AccordionDemo() {\n  return (\n    <Accordion className="w-full" defaultValue={["item-1"]}>\n      <AccordionItem value="item-1">\n        <AccordionTrigger>Product Information</AccordionTrigger>\n        <AccordionContent className="flex flex-col gap-4 text-balance">\n          <p>\n            Our flagship product combines cutting-edge technology with sleek design. Built with\n            premium materials, it offers unparalleled performance and reliability.\n          </p>\n          <p>\n            Key features include advanced processing capabilities, and an intuitive user interface\n            designed for both beginners and experts.\n          </p>\n        </AccordionContent>\n      </AccordionItem>\n      <AccordionItem value="item-2">\n        <AccordionTrigger>Shipping Details</AccordionTrigger>\n        <AccordionContent className="flex flex-col gap-4 text-balance">\n          <p>\n            We offer worldwide shipping through trusted courier partners. Standard delivery takes\n            3-5 business days, while express shipping ensures delivery within 1-2 business days.\n          </p>\n          <p>\n            All orders are carefully packaged and fully insured. Track your shipment in real-time\n            through our dedicated tracking portal.\n          </p>\n        </AccordionContent>\n      </AccordionItem>\n      <AccordionItem value="item-3">\n        <AccordionTrigger>Return Policy</AccordionTrigger>\n        <AccordionContent className="flex flex-col gap-4 text-balance">\n          <p>\n            We stand behind our products with a comprehensive 30-day return policy. If you&apos;re\n            not completely satisfied, simply return the item in its original condition.\n          </p>\n          <p>\n            Our hassle-free return process includes free return shipping and full refunds processed\n            within 48 hours of receiving the returned item.\n          </p>\n        </AccordionContent>\n      </AccordionItem>\n    </Accordion>\n  );\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <Demo />
    </div>
  ),
};

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

function AccordionExample({
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

export const Basic: Story = {
  parameters: {
    docs: { description: { story: "One item opens at a time; the first is open by default." } },
  },
  render: () => <AccordionExample />,
};
export const Multiple: Story = {
  parameters: { docs: { description: { story: "Allow several items to remain open at once." } } },
  render: () => <AccordionExample multiple />,
};
export const Controlled: Story = {
  parameters: {
    docs: {
      description: {
        story: "Control expanded items externally and use buttons to update the open panels.",
      },
    },
  },
  render: () => <ControlledAccordionExample />,
};

function ControlledAccordionExample() {
  const [value, setValue] = useState<string[]>(["item-1"]);

  return (
    <div className="flex w-80 flex-col gap-4">
      <Accordion multiple onValueChange={setValue} value={value}>
        {accordionItems.map((item) => (
          <AccordionItem key={item.value} value={item.value}>
            <AccordionTrigger>{item.question}</AccordionTrigger>
            <AccordionContent>{item.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => setValue(["item-1", "item-2"])} variant="outline">
          Open first two
        </Button>
        <Button onClick={() => setValue([])} variant="outline">
          Close all
        </Button>
      </div>
      <p className="text-muted-foreground text-sm">
        Open items: {value.length > 0 ? value.join(", ") : "None"}
      </p>
    </div>
  );
}

export const Disabled: Story = {
  parameters: { docs: { description: { story: "Disable an individual accordion item." } } },
  render: () => (
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
  ),
};
export const Borders: Story = {
  parameters: {
    docs: { description: { story: "Add an outer border and dividers between items." } },
  },
  render: () => <AccordionExample bordered />,
};
export const Card: Story = {
  parameters: { docs: { description: { story: "Place an accordion inside a card." } } },
  render: () => <AccordionCard />,
};
