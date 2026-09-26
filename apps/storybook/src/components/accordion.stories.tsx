import { AccordionContent, AccordionItem, AccordionTrigger } from "@erbium/ui/components/accordion";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Accordion } from "@erbium/ui/components/accordion";
import Demo from "./examples/accordion-demo";

const meta = {
  title: "UI/Accordion",
  component: Accordion,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'A vertically stacked set of interactive headings that each reveal a section of content.\n\n**Import:** `@erbium/ui/components/accordion`  \n\n**shadcn/ui page:** [Accordion](https://ui.shadcn.com/docs/components/base/accordion)\n\n### Usage\n\n```tsx\nimport {\n  Accordion,\n  AccordionContent,\n  AccordionItem,\n  AccordionTrigger,\n} from "@erbium/ui/components/accordion"\n```\n\n```tsx\n<Accordion defaultValue={["item-1"]}>\n  <AccordionItem value="item-1">\n    <AccordionTrigger>Is it accessible?</AccordionTrigger>\n    <AccordionContent>\n      Yes. It adheres to the WAI-ARIA design pattern.\n    </AccordionContent>\n  </AccordionItem>\n</Accordion>\n```\n\n### Composition\n\nUse the following composition to build an `Accordion`:\n\n```text\nAccordion\n├── AccordionItem\n│   ├── AccordionTrigger\n│   └── AccordionContent\n└── AccordionItem\n    ├── AccordionTrigger\n    └── AccordionContent\n```\n\n### Basic\n\nA basic accordion that shows one item at a time. The first item is open by default.\n\nstyleName="base-nova"\n\nname="accordion-basic"\n\nalign="start"\n\npreviewClassName="*:data-[slot=accordion]:max-w-sm h-[300px]"\n\n/>\n\n### Multiple\n\nUse the `multiple` prop to allow multiple items to be open at the same time.\n\nstyleName="base-nova"\n\nname="accordion-multiple"\n\nalign="start"\n\npreviewClassName="*:data-[slot=accordion]:max-w-sm h-[450px]"\n\n/>\n\n### Disabled\n\nUse the `disabled` prop on `AccordionItem` to disable individual items.\n\nstyleName="base-nova"\n\nname="accordion-disabled"\n\nalign="start"\n\npreviewClassName="*:data-[slot=accordion]:max-w-sm h-[300px]"\n\n/>\n\n### Borders\n\nAdd `border` to the `Accordion` and `border-b last:border-b-0` to the `AccordionItem` to add borders to the items.\n\nstyleName="base-nova"\n\nname="accordion-borders"\n\nalign="start"\n\npreviewClassName="*:data-[slot=accordion]:max-w-sm h-[300px]"\n\n/>\n\n### Card\n\nWrap the `Accordion` in a `Card` component.\n\nstyleName="base-nova"\n\nname="accordion-card"\n\nalign="start"\n\npreviewClassName="*:data-[slot=accordion]:max-w-sm h-[435px]"\n\n/>',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

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

export const DisabledItem: Story = {
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
