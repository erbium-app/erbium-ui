import type { Meta, StoryObj } from "../types";

import { QRCodeImage } from "@erbium/ui/components/qr-code";
import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";
import { latencyArgType } from "../loading";

import PlaygroundExample, { defaultProps as PlaygroundDefaults } from "./variants/playground";

import PlaygroundSource from "./variants/playground.tsx?raw";

import OverviewExample from "./variants/overview";

import OverviewSource from "./examples/qr-code-demo.tsx?raw";

import TonesExample from "./variants/tones";

import TonesSource from "./variants/tones.tsx?raw";

import LogoExample from "./variants/logo";

import LogoSource from "./variants/logo.tsx?raw";

import DownloadExample from "./variants/download";

import DownloadSource from "./variants/download.tsx?raw";

import LoadingExample from "./variants/loading";

import LoadingSource from "./variants/loading.tsx?raw";

import ShareLinkExample from "./variants/share-link";

import ShareLinkSource from "./examples/qr-code-share-link.tsx?raw";

import TwoFactorExample from "./variants/two-factor";

import TwoFactorSource from "./examples/qr-code-two-factor.tsx?raw";

import ExpiringExample from "./variants/expiring";

import ExpiringSource from "./examples/qr-code-expiring.tsx?raw";

import InDialogExample from "./variants/dialog";

import InDialogSource from "./examples/qr-code-dialog.tsx?raw";

import InItemExample from "./variants/item";

import InItemSource from "./examples/qr-code-item.tsx?raw";

const meta = {
  component: QRCodeImage,
  parameters: {
    docs: {
      description: {
        component: componentDocumentation("qr-code"),
      },
    },
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof QRCodeImage>;

export default meta;

type Story = StoryObj;

const choice = (options: readonly string[]) => ({ control: "inline-radio" as const, options });

export const Playground: StoryObj<typeof PlaygroundExample> = {
  argTypes: {
    size: choice(["sm", "default", "lg"]),
    tone: choice(["default", "accent"]),
    value: { control: "text" },
  },
  args: PlaygroundDefaults,
  parameters: {
    docs: {
      description: { story: variantDocumentation("qr-code", "playground") },
      source: { code: PlaygroundSource },
    },
  },
  render: PlaygroundExample,
};

export const Overview: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("qr-code", "overview") },
      source: { code: OverviewSource },
    },
  },
  render: OverviewExample,
};

export const Tones: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("qr-code", "tones") },
      source: { code: TonesSource },
    },
  },
  render: TonesExample,
};

export const Logo: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("qr-code", "logo") },
      source: { code: LogoSource },
    },
  },
  render: LogoExample,
};

export const Download: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("qr-code", "download") },
      source: { code: DownloadSource },
    },
  },
  render: DownloadExample,
};

export const Loading: Story = {
  argTypes: latencyArgType,
  parameters: {
    docs: {
      description: { story: variantDocumentation("qr-code", "loading") },
      source: { code: LoadingSource },
    },
  },
  render: LoadingExample,
};

export const ShareLink: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("qr-code", "share-link") },
      source: { code: ShareLinkSource },
    },
  },
  render: ShareLinkExample,
};

export const TwoFactor: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("qr-code", "two-factor") },
      source: { code: TwoFactorSource },
    },
  },
  render: TwoFactorExample,
};

export const Expiring: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("qr-code", "expiring") },
      source: { code: ExpiringSource },
    },
  },
  render: ExpiringExample,
};

export const InDialog: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("qr-code", "dialog") },
      source: { code: InDialogSource },
    },
  },
  render: InDialogExample,
};

export const InItem: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("qr-code", "item") },
      source: { code: InItemSource },
    },
  },
  render: InItemExample,
};
