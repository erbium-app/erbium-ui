import type { Meta, StoryObj } from "../types";

import { Autocomplete } from "@erbium/ui/components/autocomplete";

import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";

import OverviewExample from "./variants/overview";

import OverviewSource from "./variants/overview.tsx?raw";

import DisabledExample from "./variants/disabled";

import DisabledSource from "./variants/disabled.tsx?raw";

import SmallSizeExample from "./variants/small-size";

import SmallSizeSource from "./variants/small-size.tsx?raw";

import LargeSizeExample from "./variants/large-size";

import LargeSizeSource from "./variants/large-size.tsx?raw";

import WithLabelExample from "./variants/with-label";

import WithLabelSource from "./variants/with-label.tsx?raw";

import InlineAutocompleteExample from "./variants/inline-autocomplete";

import InlineAutocompleteSource from "./variants/inline-autocomplete.tsx?raw";

import AutoHighlightExample from "./variants/auto-highlight";

import AutoHighlightSource from "./variants/auto-highlight.tsx?raw";

import WithClearButtonExample from "./variants/with-clear-button";

import WithClearButtonSource from "./variants/with-clear-button.tsx?raw";

import WithTriggerAndClearExample from "./variants/with-trigger-and-clear";

import WithTriggerAndClearSource from "./variants/with-trigger-and-clear.tsx?raw";

import WithStartAddonExample from "./variants/with-start-addon";

import WithStartAddonSource from "./variants/with-start-addon.tsx?raw";

import WithGroupsExample from "./variants/with-groups";

import WithGroupsSource from "./variants/with-groups.tsx?raw";

import WithLimitResultsExample from "./variants/with-limit-results";

import WithLimitResultsSource from "./variants/with-limit-results.tsx?raw";

import AsyncSearchExample from "./variants/async-search";

import AsyncSearchSource from "./variants/async-search.tsx?raw";

import FormIntegrationExample from "./variants/form-integration";

import FormIntegrationSource from "./variants/form-integration.tsx?raw";

import ShowcaseExample from "./variants/showcase";

import ShowcaseSource from "./variants/showcase.tsx?raw";

const meta = {
  title: "UI/Autocomplete",
  component: Autocomplete,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: componentDocumentation("autocomplete"),
      },
    },
  },
} satisfies Meta<typeof Autocomplete>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("autocomplete", "overview") },
      source: { code: OverviewSource },
    },
  },
  render: OverviewExample,
};

export const Disabled: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("autocomplete", "disabled") },
      source: { code: DisabledSource },
    },
  },
  render: DisabledExample,
};

export const SmallSize: Story = {
  name: "Small Size",
  parameters: {
    docs: {
      description: { story: variantDocumentation("autocomplete", "small-size") },
      source: { code: SmallSizeSource },
    },
  },
  render: SmallSizeExample,
};

export const LargeSize: Story = {
  name: "Large Size",
  parameters: {
    docs: {
      description: { story: variantDocumentation("autocomplete", "large-size") },
      source: { code: LargeSizeSource },
    },
  },
  render: LargeSizeExample,
};

export const WithLabel: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("autocomplete", "with-label") },
      source: { code: WithLabelSource },
    },
  },
  render: WithLabelExample,
};

export const InlineAutocomplete: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("autocomplete", "inline-autocomplete") },
      source: { code: InlineAutocompleteSource },
    },
  },
  render: InlineAutocompleteExample,
};

export const AutoHighlight: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("autocomplete", "auto-highlight") },
      source: { code: AutoHighlightSource },
    },
  },
  render: AutoHighlightExample,
};

export const WithClearButton: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("autocomplete", "with-clear-button") },
      source: { code: WithClearButtonSource },
    },
  },
  render: WithClearButtonExample,
};

export const WithTriggerAndClear: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("autocomplete", "with-trigger-and-clear") },
      source: { code: WithTriggerAndClearSource },
    },
  },
  render: WithTriggerAndClearExample,
};

export const WithStartAddon: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("autocomplete", "with-start-addon") },
      source: { code: WithStartAddonSource },
    },
  },
  render: WithStartAddonExample,
};

export const WithGroups: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("autocomplete", "with-groups") },
      source: { code: WithGroupsSource },
    },
  },
  render: WithGroupsExample,
};

export const WithLimitResults: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("autocomplete", "with-limit-results") },
      source: { code: WithLimitResultsSource },
    },
  },
  render: WithLimitResultsExample,
};

export const AsyncSearch: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("autocomplete", "async-search") },
      source: { code: AsyncSearchSource },
    },
  },
  render: AsyncSearchExample,
};

export const FormIntegration: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("autocomplete", "form-integration") },
      source: { code: FormIntegrationSource },
    },
  },
  render: FormIntegrationExample,
};

export const Showcase: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("autocomplete", "showcase") },
      source: { code: ShowcaseSource },
    },
  },
  render: ShowcaseExample,
};
