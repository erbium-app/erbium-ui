import type { Meta, StoryObj } from "../types";
import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";
import OverviewExample from "./variants/overview";
import OverviewSource from "./variants/overview.tsx?raw";
import OptionalExample from "./variants/optional";
import OptionalSource from "./variants/optional.tsx?raw";
import FreeExample from "./variants/free";
import FreeSource from "./variants/free.tsx?raw";
import AsyncGuardExample from "./variants/async-guard";
import AsyncGuardSource from "./variants/async-guard.tsx?raw";
import TanstackFormExample from "./variants/tanstack-form";
import TanstackFormSource from "./variants/tanstack-form.tsx?raw";
import ControlledExample from "./variants/controlled";
import ControlledSource from "./variants/controlled.tsx?raw";
import DynamicExample from "./variants/dynamic";
import DynamicSource from "./variants/dynamic.tsx?raw";
import DotsExample from "./variants/dots";
import DotsSource from "./variants/dots.tsx?raw";
import VerticalExample from "./variants/vertical";
import VerticalSource from "./variants/vertical.tsx?raw";
import HeadlessExample from "./variants/headless";
import HeadlessSource from "./variants/headless.tsx?raw";

const meta = {
  parameters: {
    docs: { description: { component: componentDocumentation("stepper") } },
    layout: "centered",
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("stepper", "overview") },
      source: { code: OverviewSource },
    },
  },
  render: OverviewExample,
};

export const Optional: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("stepper", "optional") },
      source: { code: OptionalSource },
    },
  },
  render: OptionalExample,
};

export const Free: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("stepper", "free") },
      source: { code: FreeSource },
    },
  },
  render: FreeExample,
};

export const AsyncGuard: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("stepper", "async-guard") },
      source: { code: AsyncGuardSource },
    },
  },
  render: AsyncGuardExample,
};

export const TanstackForm: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("stepper", "tanstack-form") },
      source: { code: TanstackFormSource },
    },
  },
  render: TanstackFormExample,
};

export const Controlled: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("stepper", "controlled") },
      source: { code: ControlledSource },
    },
  },
  render: ControlledExample,
};

export const Dynamic: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("stepper", "dynamic") },
      source: { code: DynamicSource },
    },
  },
  render: DynamicExample,
};

export const Dots: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("stepper", "dots") },
      source: { code: DotsSource },
    },
  },
  render: DotsExample,
};

export const Vertical: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("stepper", "vertical") },
      source: { code: VerticalSource },
    },
  },
  render: VerticalExample,
};

export const Headless: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("stepper", "headless") },
      source: { code: HeadlessSource },
    },
  },
  render: HeadlessExample,
};
