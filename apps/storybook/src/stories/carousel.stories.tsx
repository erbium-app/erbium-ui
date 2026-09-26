import {
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@erbium/ui/components/carousel";
import CarouselDApiDemo from "../examples/upstream/carousel-api";
import CarouselPlugin from "../examples/upstream/carousel-plugin";
import ExampleCarouselSize from "../examples/carousel-size";
import ExampleCarouselSpacing from "../examples/carousel-spacing";
import ExampleCarouselOrientation from "../examples/carousel-orientation";
import ExampleCarouselApi from "../examples/carousel-api";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Carousel } from "@erbium/ui/components/carousel";
import Demo from "../examples/carousel-demo";

const meta = {
  title: "UI/Carousel",
  component: Carousel,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'A carousel with motion and swipe built using Embla.\n\n**Import:** `@erbium/ui/components/carousel`  \n\n**shadcn/ui page:** [Carousel](https://ui.shadcn.com/docs/components/base/carousel)\n\n### About\n\nThe carousel component is built using the [Embla Carousel](https://www.embla-carousel.com/) library.\n\n### Usage\n\n```tsx\nimport {\n  Carousel,\n  CarouselContent,\n  CarouselItem,\n  CarouselNext,\n  CarouselPrevious,\n} from "@erbium/ui/components/carousel"\n```\n\n```tsx\n<Carousel>\n  <CarouselContent>\n    <CarouselItem>...</CarouselItem>\n    <CarouselItem>...</CarouselItem>\n    <CarouselItem>...</CarouselItem>\n  </CarouselContent>\n  <CarouselPrevious />\n  <CarouselNext />\n</Carousel>\n```\n\n### Composition\n\nUse the following composition to build a `Carousel`:\n\n```text\nCarousel\n├── CarouselContent\n│   ├── CarouselItem\n│   └── CarouselItem\n├── CarouselPrevious\n└── CarouselNext\n```\n\n### Options\n\nYou can pass options to the carousel using the `opts` prop. See the [Embla Carousel docs](https://www.embla-carousel.com/api/options/) for more information.\n\n```tsx\n<Carousel\n  opts={{\n    align: "start",\n    loop: true,\n  }}\n>\n  <CarouselContent>\n    <CarouselItem>...</CarouselItem>\n    <CarouselItem>...</CarouselItem>\n    <CarouselItem>...</CarouselItem>\n  </CarouselContent>\n</Carousel>\n```',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Playground: StoryObj<typeof Carousel> = {
  args: { orientation: "horizontal" },
  argTypes: { orientation: { control: "select", options: ["horizontal", "vertical"] } },
  render: (args) => (
    <Carousel {...args} className={args.orientation === "vertical" ? "h-64 w-72" : "w-72"}>
      <CarouselContent>
        {[1, 2, 3].map((item) => (
          <CarouselItem key={item}>
            <div className="flex h-32 items-center justify-center rounded border">Slide {item}</div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  ),
};

export const Overview: Story = {
  parameters: {
    docs: {
      source: {
        code: 'import * as React from "react";\n\nimport { Card, CardContent } from "@erbium/ui/components/card";\nimport {\n  Carousel,\n  CarouselContent,\n  CarouselItem,\n  CarouselNext,\n  CarouselPrevious,\n} from "@erbium/ui/components/carousel";\n\nexport default function CarouselDemo() {\n  return (\n    <Carousel className="w-full max-w-xs">\n      <CarouselContent>\n        {Array.from({ length: 5 }).map((_, index) => (\n          <CarouselItem key={index}>\n            <div className="p-1">\n              <Card>\n                <CardContent className="flex aspect-square items-center justify-center p-6">\n                  <span className="text-4xl font-semibold">{index + 1}</span>\n                </CardContent>\n              </Card>\n            </div>\n          </CarouselItem>\n        ))}\n      </CarouselContent>\n      <CarouselPrevious />\n      <CarouselNext />\n    </Carousel>\n  );\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <Demo />
    </div>
  ),
};

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'To set the size of the items, you can use the `basis` utility class on the `<CarouselItem />`.\n\n```tsx\n// 33% of the carousel width.\n<Carousel>\n  <CarouselContent>\n    <CarouselItem className="basis-1/3">...</CarouselItem>\n    <CarouselItem className="basis-1/3">...</CarouselItem>\n    <CarouselItem className="basis-1/3">...</CarouselItem>\n  </CarouselContent>\n</Carousel>\n```\n\n```tsx\n// 50% on small screens and 33% on larger screens.\n<Carousel>\n  <CarouselContent>\n    <CarouselItem className="md:basis-1/2 lg:basis-1/3">...</CarouselItem>\n    <CarouselItem className="md:basis-1/2 lg:basis-1/3">...</CarouselItem>\n    <CarouselItem className="md:basis-1/2 lg:basis-1/3">...</CarouselItem>\n  </CarouselContent>\n</Carousel>\n```',
      },

      source: {
        code: 'import * as React from "react"\n\nimport { Card, CardContent } from "@erbium/ui/components/card"\nimport {\n  Carousel,\n  CarouselContent,\n  CarouselItem,\n  CarouselNext,\n  CarouselPrevious,\n} from "@erbium/ui/components/carousel"\n\nexport default function CarouselSize() {\n  return (\n    <Carousel\n      opts={{\n        align: "start",\n      }}\n      className="w-full max-w-sm"\n    >\n      <CarouselContent>\n        {Array.from({ length: 5 }).map((_, index) => (\n          <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">\n            <div className="p-1">\n              <Card>\n                <CardContent className="flex aspect-square items-center justify-center p-6">\n                  <span className="text-3xl font-semibold">{index + 1}</span>\n                </CardContent>\n              </Card>\n            </div>\n          </CarouselItem>\n        ))}\n      </CarouselContent>\n      <CarouselPrevious />\n      <CarouselNext />\n    </Carousel>\n  )\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <ExampleCarouselSize />
    </div>
  ),
};
export const Spacing: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'To set the spacing between the items, we use a `pl-[VALUE]` utility on the `<CarouselItem />` and a negative `-ml-[VALUE]` on the `<CarouselContent />`.\n\n```tsx\n<Carousel>\n  <CarouselContent className="-ml-4">\n    <CarouselItem className="pl-4">...</CarouselItem>\n    <CarouselItem className="pl-4">...</CarouselItem>\n    <CarouselItem className="pl-4">...</CarouselItem>\n  </CarouselContent>\n</Carousel>\n```\n\n```tsx\n<Carousel>\n  <CarouselContent className="-ml-2 md:-ml-4">\n    <CarouselItem className="pl-2 md:pl-4">...</CarouselItem>\n    <CarouselItem className="pl-2 md:pl-4">...</CarouselItem>\n    <CarouselItem className="pl-2 md:pl-4">...</CarouselItem>\n  </CarouselContent>\n</Carousel>\n```',
      },

      source: {
        code: 'import * as React from "react"\n\nimport { Card, CardContent } from "@erbium/ui/components/card"\nimport {\n  Carousel,\n  CarouselContent,\n  CarouselItem,\n  CarouselNext,\n  CarouselPrevious,\n} from "@erbium/ui/components/carousel"\n\nexport default function CarouselSpacing() {\n  return (\n    <Carousel className="w-full max-w-sm">\n      <CarouselContent className="-ml-1">\n        {Array.from({ length: 5 }).map((_, index) => (\n          <CarouselItem key={index} className="pl-1 md:basis-1/2 lg:basis-1/3">\n            <div className="p-1">\n              <Card>\n                <CardContent className="flex aspect-square items-center justify-center p-6">\n                  <span className="text-2xl font-semibold">{index + 1}</span>\n                </CardContent>\n              </Card>\n            </div>\n          </CarouselItem>\n        ))}\n      </CarouselContent>\n      <CarouselPrevious />\n      <CarouselNext />\n    </Carousel>\n  )\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <ExampleCarouselSpacing />
    </div>
  ),
};
export const Orientation: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Use the `orientation` prop to set the orientation of the carousel.\n\n```tsx\n<Carousel orientation="vertical | horizontal">\n  <CarouselContent>\n    <CarouselItem>...</CarouselItem>\n    <CarouselItem>...</CarouselItem>\n    <CarouselItem>...</CarouselItem>\n  </CarouselContent>\n</Carousel>\n```',
      },

      source: {
        code: 'import * as React from "react"\n\nimport { Card, CardContent } from "@erbium/ui/components/card"\nimport {\n  Carousel,\n  CarouselContent,\n  CarouselItem,\n  CarouselNext,\n  CarouselPrevious,\n} from "@erbium/ui/components/carousel"\n\nexport default function CarouselOrientation() {\n  return (\n    <Carousel\n      opts={{\n        align: "start",\n      }}\n      orientation="vertical"\n      className="w-full max-w-xs"\n    >\n      <CarouselContent className="-mt-1 h-[200px]">\n        {Array.from({ length: 5 }).map((_, index) => (\n          <CarouselItem key={index} className="pt-1 md:basis-1/2">\n            <div className="p-1">\n              <Card>\n                <CardContent className="flex items-center justify-center p-6">\n                  <span className="text-3xl font-semibold">{index + 1}</span>\n                </CardContent>\n              </Card>\n            </div>\n          </CarouselItem>\n        ))}\n      </CarouselContent>\n      <CarouselPrevious />\n      <CarouselNext />\n    </Carousel>\n  )\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <ExampleCarouselOrientation />
    </div>
  ),
};
export const Api: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Use a state and the `setApi` prop to get an instance of the carousel API.\n\n```tsx\nimport { type CarouselApi } from "@erbium/ui/components/carousel"\n\nexport function Example() {\n  const [api, setApi] = React.useState<CarouselApi>()\n  const [current, setCurrent] = React.useState(0)\n  const [count, setCount] = React.useState(0)\n\n  React.useEffect(() => {\n    if (!api) {\n      return\n    }\n\n    setCount(api.scrollSnapList().length)\n    setCurrent(api.selectedScrollSnap() + 1)\n\n    api.on("select", () => {\n      setCurrent(api.selectedScrollSnap() + 1)\n    })\n  }, [api])\n\n  return (\n    <Carousel setApi={setApi}>\n      <CarouselContent>\n        <CarouselItem>...</CarouselItem>\n        <CarouselItem>...</CarouselItem>\n        <CarouselItem>...</CarouselItem>\n      </CarouselContent>\n    </Carousel>\n  )\n}\n```',
      },

      source: {
        code: '\nimport * as React from "react"\n\nimport { Card, CardContent } from "@erbium/ui/components/card"\nimport {\n  Carousel,\n  CarouselContent,\n  CarouselItem,\n  CarouselNext,\n  CarouselPrevious,\n  type CarouselApi,\n} from "@erbium/ui/components/carousel"\n\nexport default function CarouselDApiDemo() {\n  const [api, setApi] = React.useState<CarouselApi>()\n  const [current, setCurrent] = React.useState(0)\n  const [count, setCount] = React.useState(0)\n\n  React.useEffect(() => {\n    if (!api) {\n      return\n    }\n\n    setCount(api.scrollSnapList().length)\n    setCurrent(api.selectedScrollSnap() + 1)\n\n    api.on("select", () => {\n      setCurrent(api.selectedScrollSnap() + 1)\n    })\n  }, [api])\n\n  return (\n    <div className="mx-auto max-w-xs">\n      <Carousel setApi={setApi} className="w-full max-w-xs">\n        <CarouselContent>\n          {Array.from({ length: 5 }).map((_, index) => (\n            <CarouselItem key={index}>\n              <Card>\n                <CardContent className="flex aspect-square items-center justify-center p-6">\n                  <span className="text-4xl font-semibold">{index + 1}</span>\n                </CardContent>\n              </Card>\n            </CarouselItem>\n          ))}\n        </CarouselContent>\n        <CarouselPrevious />\n        <CarouselNext />\n      </Carousel>\n      <div className="py-2 text-center text-sm text-muted-foreground">\n        Slide {current} of {count}\n      </div>\n    </div>\n  )\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <ExampleCarouselApi />
    </div>
  ),
};

export const Plugin: Story = {
  name: "Plugins",
  parameters: {
    docs: {
      description: {
        story:
          'You can use the `plugins` prop to add plugins to the carousel.\n\n```ts\nimport Autoplay from "embla-carousel-autoplay"\n\nexport function Example() {\n  return (\n    <Carousel\n      plugins={[\n        Autoplay({\n          delay: 2000,\n        }),\n      ]}\n    >\n      // ...\n    </Carousel>\n  )\n}\n```',
      },
      source: {
        code: 'import * as React from "react";\nimport Autoplay from "embla-carousel-autoplay";\n\nimport { Card, CardContent } from "@erbium/ui/components/card";\nimport {\n  Carousel,\n  CarouselContent,\n  CarouselItem,\n  CarouselNext,\n  CarouselPrevious,\n} from "@erbium/ui/components/carousel";\n\nexport default function CarouselPlugin() {\n  const plugin = React.useRef(Autoplay({ delay: 2000, stopOnInteraction: true }));\n\n  return (\n    <Carousel\n      plugins={[plugin.current]}\n      className="w-full max-w-[10rem] sm:max-w-xs"\n      onMouseEnter={plugin.current.stop}\n      onMouseLeave={plugin.current.reset}\n    >\n      <CarouselContent>\n        {Array.from({ length: 5 }).map((_, index) => (\n          <CarouselItem key={index}>\n            <div className="p-1">\n              <Card>\n                <CardContent className="flex aspect-square items-center justify-center p-6">\n                  <span className="text-4xl font-semibold">{index + 1}</span>\n                </CardContent>\n              </Card>\n            </div>\n          </CarouselItem>\n        ))}\n      </CarouselContent>\n      <CarouselPrevious />\n      <CarouselNext />\n    </Carousel>\n  );\n}\n',
      },
    },
  },
  render: () => <CarouselPlugin />,
};

export const Events: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'You can listen to events using the api instance from `setApi`.\n\nSee the [Embla Carousel docs](https://www.embla-carousel.com/api/events/) for more information on using events.\n\n```tsx\nimport { type CarouselApi } from "@erbium/ui/components/carousel"\n\nexport function Example() {\n  const [api, setApi] = React.useState<CarouselApi>()\n\n  React.useEffect(() => {\n    if (!api) {\n      return\n    }\n\n    api.on("select", () => {\n      // Do something on select.\n    })\n  }, [api])\n\n  return (\n    <Carousel setApi={setApi}>\n      <CarouselContent>\n        <CarouselItem>...</CarouselItem>\n        <CarouselItem>...</CarouselItem>\n        <CarouselItem>...</CarouselItem>\n      </CarouselContent>\n    </Carousel>\n  )\n}\n```',
      },
      source: {
        code: 'import * as React from "react";\n\nimport { Card, CardContent } from "@erbium/ui/components/card";\nimport {\n  Carousel,\n  CarouselContent,\n  CarouselItem,\n  CarouselNext,\n  CarouselPrevious,\n  type CarouselApi,\n} from "@erbium/ui/components/carousel";\n\nexport default function CarouselDApiDemo() {\n  const [api, setApi] = React.useState<CarouselApi>();\n  const [current, setCurrent] = React.useState(0);\n  const [count, setCount] = React.useState(0);\n\n  React.useEffect(() => {\n    if (!api) {\n      return;\n    }\n\n    setCount(api.scrollSnapList().length);\n    setCurrent(api.selectedScrollSnap() + 1);\n\n    api.on("select", () => {\n      setCurrent(api.selectedScrollSnap() + 1);\n    });\n  }, [api]);\n\n  return (\n    <div className="mx-auto max-w-[10rem] sm:max-w-xs">\n      <Carousel setApi={setApi} className="w-full max-w-xs">\n        <CarouselContent>\n          {Array.from({ length: 5 }).map((_, index) => (\n            <CarouselItem key={index}>\n              <Card className="m-px">\n                <CardContent className="flex aspect-square items-center justify-center p-6">\n                  <span className="text-4xl font-semibold">{index + 1}</span>\n                </CardContent>\n              </Card>\n            </CarouselItem>\n          ))}\n        </CarouselContent>\n        <CarouselPrevious />\n        <CarouselNext />\n      </Carousel>\n      <div className="py-2 text-center text-sm text-muted-foreground">\n        Slide {current} of {count}\n      </div>\n    </div>\n  );\n}\n',
      },
    },
  },
  render: () => <CarouselDApiDemo />,
};
