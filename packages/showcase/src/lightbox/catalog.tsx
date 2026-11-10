import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";
import { Lightbox } from "@erbium/ui/blocks/lightbox";
import type { Meta, StoryObj } from "../types";
import GalleryExample from "./variants/gallery";
import GallerySource from "./variants/gallery.tsx?raw";

const meta = {
  component: Lightbox,
  parameters: {
    docs: { description: { component: componentDocumentation("lightbox") } },
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Lightbox>;

export default meta;

export const Gallery: StoryObj = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("lightbox", "gallery") },
      source: { code: GallerySource },
    },
  },
  render: GalleryExample,
};
