import {
  AttachmentMedia,
  AttachmentContent,
  AttachmentTitle,
  AttachmentDescription,
  AttachmentActions,
  AttachmentAction,
  AttachmentTrigger,
} from "@erbium/ui/components/attachment";
import { AttachmentImage } from "../examples/upstream/attachment-image";
import { AttachmentStates } from "../examples/upstream/attachment-states";
import { AttachmentSizes } from "../examples/upstream/attachment-sizes";
import { AttachmentGroupDemo } from "../examples/upstream/attachment-group";
import { AttachmentTriggerDemo } from "../examples/upstream/attachment-trigger";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Attachment } from "@erbium/ui/components/attachment";
import Demo from "../examples/attachment-demo";

const meta = {
  title: "UI/Attachment",
  component: Attachment,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'Displays a file or image attachment with media, metadata, upload state, and actions.\n\n**Import:** `@erbium/ui/components/attachment`  \n\n**shadcn/ui page:** [Attachment](https://ui.shadcn.com/docs/components/base/attachment)\n\n### Usage\n\n```tsx\nimport {\n  Attachment,\n  AttachmentAction,\n  AttachmentActions,\n  AttachmentContent,\n  AttachmentDescription,\n  AttachmentMedia,\n  AttachmentTitle,\n} from "@erbium/ui/components/attachment"\n```\n\n```tsx\n<Attachment>\n  <AttachmentMedia>\n    <FileTextIcon />\n  </AttachmentMedia>\n  <AttachmentContent>\n    <AttachmentTitle>sales-dashboard.pdf</AttachmentTitle>\n    <AttachmentDescription>PDF · 2.4 MB</AttachmentDescription>\n  </AttachmentContent>\n  <AttachmentActions>\n    <AttachmentAction aria-label="Remove sales-dashboard.pdf">\n      <XIcon />\n    </AttachmentAction>\n  </AttachmentActions>\n</Attachment>\n```\n\n### Composition\n\nUse the following composition to build an attachment:\n\nUse `AttachmentGroup` to lay out multiple attachments in a scrollable row:\n\n```text\nAttachment\n├── AttachmentMedia\n├── AttachmentContent\n│   ├── AttachmentTitle\n│   └── AttachmentDescription\n├── AttachmentActions\n│   └── AttachmentAction\n└── AttachmentTrigger\n```\n\n```text\nAttachmentGroup\n├── Attachment\n└── Attachment\n```\n\n### Features\n\n- Icon and image media through `AttachmentMedia`\n\n- Upload states: `idle`, `uploading`, `processing`, `error`, and `done` with built-in styling and a shimmer while in progress\n\n- Three sizes and horizontal or vertical orientation\n\n- A full-card `AttachmentTrigger` that opens a link or dialog while the actions stay independently clickable\n\n- Scrollable, snapping `AttachmentGroup` with an edge fade\n\n- Customizable styling through the `className` prop on every part\n\n### Accessibility\n\n`AttachmentAction` renders a `Button`, and `AttachmentTrigger` renders a real `<button>` (or your element via `render`). Follow the guidance below so both are operable and announced.\n\n`AttachmentAction` is usually icon-only, so give each one an `aria-label` describing the action and its target.\n\n`AttachmentTrigger` covers the card with no text of its own, so give it an `aria-label` for what activating it does.\n\nThe trigger sits behind the actions in the stacking order, so an `AttachmentAction` and the `AttachmentTrigger` never trap each other — both remain separately focusable and clickable.\n\nAn `AttachmentGroup` scrolls horizontally. When its attachments are interactive: a trigger or actions, keyboard users reach off-screen items by tabbing to them. For a row of presentational attachments, make the group itself focusable and scrollable by adding `tabIndex={0}`, `role="group"`, and an `aria-label`.\n\nThe `error` state uses a error color. Keep the failure reason in `AttachmentDescription` so the state is not conveyed by color alone.\n\n```tsx\n<AttachmentAction aria-label="Remove sales-dashboard.pdf">\n  <XIcon />\n</AttachmentAction>\n```\n\n```tsx\n<AttachmentTrigger\n  render={\n    <a\n      href={url}\n      target="_blank"\n      rel="noreferrer"\n      aria-label="Open workspace.png"\n    />\n  }\n/>\n```',
      },
    },
  },
} satisfies Meta<typeof Attachment>;

export default meta;
type Story = StoryObj;

export const Playground: StoryObj<{
  state: "idle" | "uploading" | "processing" | "error" | "done";
  size: "default" | "sm" | "xs";
  orientation: "horizontal" | "vertical";
  mediaVariant: "icon" | "image";
  className: string;
  title: string;
  actionSize: "icon-xs" | "icon-sm" | "icon";
  triggerAsLink: boolean;
}> = {
  args: {
    state: "done",
    size: "default",
    orientation: "horizontal",
    mediaVariant: "icon",
    className: "",
    title: "document.pdf",
    actionSize: "icon-xs",
    triggerAsLink: false,
  },
  argTypes: {
    state: { control: "select", options: ["idle", "uploading", "processing", "error", "done"] },
    size: { control: "select", options: ["default", "sm", "xs"] },
    orientation: { control: "select", options: ["horizontal", "vertical"] },
    mediaVariant: { control: "select", options: ["icon", "image"] },
    className: { control: "text" },
    title: { control: "text" },
    actionSize: { control: "select", options: ["icon-xs", "icon-sm", "icon"] },
    triggerAsLink: { control: "boolean" },
  },
  render: (args) => (
    <Attachment
      state={args.state}
      size={args.size}
      orientation={args.orientation}
      className={args.className}
    >
      <AttachmentMedia variant={args.mediaVariant}>
        {args.mediaVariant === "icon" ? (
          "📄"
        ) : (
          <span role="img" aria-label="Attachment preview">
            🖼️
          </span>
        )}
      </AttachmentMedia>
      <AttachmentContent>
        <AttachmentTitle>{args.title}</AttachmentTitle>
        <AttachmentDescription>2.4 MB</AttachmentDescription>
      </AttachmentContent>
      <AttachmentActions>
        <AttachmentAction size={args.actionSize} aria-label="Remove attachment">
          ×
        </AttachmentAction>
      </AttachmentActions>
      <AttachmentTrigger
        aria-label={`Open ${args.title}`}
        render={args.triggerAsLink ? <a href="#" /> : undefined}
      />
    </Attachment>
  ),
};

export const Overview: Story = {
  parameters: {
    docs: {
      source: {
        code: 'import {\n  Attachment,\n  AttachmentContent,\n  AttachmentDescription,\n  AttachmentGroup,\n  AttachmentTitle,\n} from "@erbium/ui/components/attachment";\nexport default function Demo() {\n  return (\n    <AttachmentGroup>\n      <Attachment>\n        <AttachmentContent>\n          <AttachmentTitle>report.pdf</AttachmentTitle>\n          <AttachmentDescription>PDF document · 2.4 MB</AttachmentDescription>\n        </AttachmentContent>\n      </Attachment>\n    </AttachmentGroup>\n  );\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <Demo />
    </div>
  ),
};

export const Image: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Set `variant="image"` on `AttachmentMedia` and render an `<img>` inside it. Use `orientation="vertical"` to stack the media above the content.',
      },
      source: {
        code: 'import { HugeiconsIcon } from "@hugeicons/react";\nimport XIcon from "@hugeicons/core-free-icons/XIcon";\n\n\nimport {\n  Attachment,\n  AttachmentAction,\n  AttachmentActions,\n  AttachmentContent,\n  AttachmentDescription,\n  AttachmentGroup,\n  AttachmentMedia,\n  AttachmentTitle,\n  AttachmentTrigger,\n} from "@erbium/ui/components/attachment";\n\nconst images = [\n  {\n    name: "workspace.png",\n    meta: "PNG · 820 KB",\n    src: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=900&auto=format&fit=crop&q=80",\n    alt: "Workspace",\n  },\n  {\n    name: "desk-reference.jpg",\n    meta: "JPG · 1.1 MB",\n    src: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=900&auto=format&fit=crop&q=80",\n    alt: "Desk",\n  },\n  {\n    name: "office-reference.jpg",\n    meta: "JPG · 940 KB",\n    src: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=900&auto=format&fit=crop&q=80",\n    alt: "Office",\n  },\n];\n\nexport function AttachmentImage() {\n  return (\n    <div className="mx-auto w-full max-w-sm py-12">\n      <AttachmentGroup className="w-full">\n        {images.map((image) => (\n          <Attachment key={image.name} orientation="vertical">\n            <AttachmentMedia variant="image">\n              <img src={image.src} alt={image.alt} />\n            </AttachmentMedia>\n            <AttachmentContent>\n              <AttachmentTitle>{image.name}</AttachmentTitle>\n              <AttachmentDescription>{image.meta}</AttachmentDescription>\n            </AttachmentContent>\n            <AttachmentActions>\n              <AttachmentAction aria-label={`Remove ${image.name}`}>\n                <HugeiconsIcon icon={XIcon} />\n              </AttachmentAction>\n            </AttachmentActions>\n            <AttachmentTrigger\n              render={\n                <a\n                  href={image.src}\n                  target="_blank"\n                  rel="noreferrer"\n                  aria-label={`Open ${image.name}`}\n                />\n              }\n            />\n          </Attachment>\n        ))}\n      </AttachmentGroup>\n    </div>\n  );\n}\n',
      },
    },
  },
  render: () => <AttachmentImage />,
};
export const States: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Set `state` to reflect the upload lifecycle. `uploading` and `processing` shimmer the title, and `error` switches to a error treatment.",
      },
      source: {
        code: 'import { HugeiconsIcon } from "@hugeicons/react";\nimport AlertSquareIcon from "@hugeicons/core-free-icons/AlertSquareIcon";\nimport CheckIcon from "@hugeicons/core-free-icons/CheckIcon";\nimport Clock01Icon from "@hugeicons/core-free-icons/Clock01Icon";\nimport FileTextIcon from "@hugeicons/core-free-icons/FileTextIcon";\nimport RefreshCwIcon from "@hugeicons/core-free-icons/RefreshCwIcon";\nimport XIcon from "@hugeicons/core-free-icons/XIcon";\n\n\nimport {\n  Attachment,\n  AttachmentAction,\n  AttachmentActions,\n  AttachmentContent,\n  AttachmentDescription,\n  AttachmentMedia,\n  AttachmentTitle,\n} from "@erbium/ui/components/attachment";\nimport { Spinner } from "@erbium/ui/components/spinner";\n\nexport function AttachmentStates() {\n  return (\n    <div className="mx-auto flex w-full max-w-sm flex-col gap-2 py-12">\n      <Attachment state="idle" className="w-full">\n        <AttachmentMedia>\n          <HugeiconsIcon icon={Clock01Icon} />\n        </AttachmentMedia>\n        <AttachmentContent>\n          <AttachmentTitle>selected-file.pdf</AttachmentTitle>\n          <AttachmentDescription>Ready to upload</AttachmentDescription>\n        </AttachmentContent>\n        <AttachmentActions>\n          <AttachmentAction aria-label="Remove selected-file.pdf">\n            <HugeiconsIcon icon={XIcon} />\n          </AttachmentAction>\n        </AttachmentActions>\n      </Attachment>\n      <Attachment state="uploading" className="w-full">\n        <AttachmentMedia>\n          <Spinner />\n        </AttachmentMedia>\n        <AttachmentContent>\n          <AttachmentTitle>design-system.zip</AttachmentTitle>\n          <AttachmentDescription>Uploading · 64%</AttachmentDescription>\n        </AttachmentContent>\n        <AttachmentActions>\n          <AttachmentAction aria-label="Cancel upload">\n            <HugeiconsIcon icon={XIcon} />\n          </AttachmentAction>\n        </AttachmentActions>\n      </Attachment>\n      <Attachment state="processing" className="w-full">\n        <AttachmentMedia>\n          <HugeiconsIcon icon={FileTextIcon} />\n        </AttachmentMedia>\n        <AttachmentContent>\n          <AttachmentTitle>market-research.pdf</AttachmentTitle>\n          <AttachmentDescription>Processing document</AttachmentDescription>\n        </AttachmentContent>\n        <AttachmentActions>\n          <AttachmentAction aria-label="Remove market-research.pdf">\n            <HugeiconsIcon icon={XIcon} />\n          </AttachmentAction>\n        </AttachmentActions>\n      </Attachment>\n      <Attachment state="error" className="w-full">\n        <AttachmentMedia>\n          <HugeiconsIcon icon={AlertSquareIcon} />\n        </AttachmentMedia>\n        <AttachmentContent>\n          <AttachmentTitle>financial-model.xlsx</AttachmentTitle>\n          <AttachmentDescription>Upload failed. Try again.</AttachmentDescription>\n        </AttachmentContent>\n        <AttachmentActions>\n          <AttachmentAction aria-label="Retry upload">\n            <HugeiconsIcon icon={RefreshCwIcon} />\n          </AttachmentAction>\n          <AttachmentAction aria-label="Remove financial-model.xlsx">\n            <HugeiconsIcon icon={XIcon} />\n          </AttachmentAction>\n        </AttachmentActions>\n      </Attachment>\n      <Attachment state="done" className="w-full">\n        <AttachmentMedia>\n          <HugeiconsIcon icon={CheckIcon} />\n        </AttachmentMedia>\n        <AttachmentContent>\n          <AttachmentTitle>uploaded-report.pdf</AttachmentTitle>\n          <AttachmentDescription>Uploaded · 1.8 MB</AttachmentDescription>\n        </AttachmentContent>\n        <AttachmentActions>\n          <AttachmentAction aria-label="Remove uploaded-report.pdf">\n            <HugeiconsIcon icon={XIcon} />\n          </AttachmentAction>\n        </AttachmentActions>\n      </Attachment>\n    </div>\n  );\n}\n',
      },
    },
  },
  render: () => <AttachmentStates />,
};
export const Sizes: Story = {
  parameters: {
    docs: {
      description: { story: "Use `size` to switch between `default`, `sm`, and `xs`." },
      source: {
        code: 'import { HugeiconsIcon } from "@hugeicons/react";\nimport FileTextIcon from "@hugeicons/core-free-icons/FileTextIcon";\n\n\nimport {\n  Attachment,\n  AttachmentContent,\n  AttachmentDescription,\n  AttachmentMedia,\n  AttachmentTitle,\n} from "@erbium/ui/components/attachment";\n\nexport function AttachmentSizes() {\n  return (\n    <div className="mx-auto flex w-full max-w-sm flex-col gap-3 py-12">\n      <Attachment size="default" className="w-full">\n        <AttachmentMedia>\n          <HugeiconsIcon icon={FileTextIcon} />\n        </AttachmentMedia>\n        <AttachmentContent>\n          <AttachmentTitle>Default attachment</AttachmentTitle>\n          <AttachmentDescription>PDF · 2.4 MB</AttachmentDescription>\n        </AttachmentContent>\n      </Attachment>\n      <Attachment size="sm" className="w-full">\n        <AttachmentMedia>\n          <HugeiconsIcon icon={FileTextIcon} />\n        </AttachmentMedia>\n        <AttachmentContent>\n          <AttachmentTitle>Small attachment</AttachmentTitle>\n          <AttachmentDescription>PDF · 2.4 MB</AttachmentDescription>\n        </AttachmentContent>\n      </Attachment>\n      <Attachment size="xs" className="w-full">\n        <AttachmentMedia>\n          <HugeiconsIcon icon={FileTextIcon} />\n        </AttachmentMedia>\n        <AttachmentContent>\n          <AttachmentTitle>Extra small attachment</AttachmentTitle>\n        </AttachmentContent>\n      </Attachment>\n    </div>\n  );\n}\n',
      },
    },
  },
  render: () => <AttachmentSizes />,
};
export const Group: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Wrap attachments in `AttachmentGroup` to lay them out in a horizontally scrollable, snapping row with an edge fade.",
      },
      source: {
        code: 'import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";\nimport FileCodeIcon from "@hugeicons/core-free-icons/FileCodeIcon";\nimport FileTextIcon from "@hugeicons/core-free-icons/FileTextIcon";\nimport TableIcon from "@hugeicons/core-free-icons/TableIcon";\nimport XIcon from "@hugeicons/core-free-icons/XIcon";\n\n\nimport {\n  Attachment,\n  AttachmentAction,\n  AttachmentActions,\n  AttachmentContent,\n  AttachmentDescription,\n  AttachmentGroup,\n  AttachmentMedia,\n  AttachmentTitle,\n} from "@erbium/ui/components/attachment";\n\ntype Item = {\n  name: string;\n  meta: string;\n  icon?: IconSvgElement;\n  src?: string;\n};\n\nconst items: Item[] = [\n  { name: "briefing-notes.pdf", meta: "PDF · 1.4 MB", icon: FileTextIcon },\n  {\n    name: "workspace.png",\n    meta: "PNG · 820 KB",\n    src: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=900&auto=format&fit=crop&q=80",\n  },\n  { name: "customers.csv", meta: "CSV · 18 KB", icon: TableIcon },\n  { name: "renderer.tsx", meta: "TSX · 12 KB", icon: FileCodeIcon },\n];\n\nexport function AttachmentGroupDemo() {\n  return (\n    <div className="mx-auto w-full max-w-sm py-12">\n      <AttachmentGroup className="w-full">\n        {items.map((item) => {\n          const Icon = item.icon;\n\n          return (\n            <Attachment key={item.name} className="w-64">\n              {item.src ? (\n                <AttachmentMedia variant="image">\n                  <img src={item.src} alt={item.name} />\n                </AttachmentMedia>\n              ) : Icon ? (\n                <AttachmentMedia>\n                  <HugeiconsIcon icon={Icon} />\n                </AttachmentMedia>\n              ) : null}\n              <AttachmentContent>\n                <AttachmentTitle>{item.name}</AttachmentTitle>\n                <AttachmentDescription>{item.meta}</AttachmentDescription>\n              </AttachmentContent>\n              <AttachmentActions>\n                <AttachmentAction aria-label={`Remove ${item.name}`}>\n                  <HugeiconsIcon icon={XIcon} />\n                </AttachmentAction>\n              </AttachmentActions>\n            </Attachment>\n          );\n        })}\n      </AttachmentGroup>\n    </div>\n  );\n}\n',
      },
    },
  },
  render: () => <AttachmentGroupDemo />,
};
export const Trigger: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Add an `AttachmentTrigger` to make the whole card open a link or dialog. It fills the card behind the actions, so the actions stay clickable.\n\n```tsx\n<Dialog>\n  <Attachment>\n    {/* media, content, actions */}\n    <DialogTrigger\n      render={<AttachmentTrigger aria-label="Preview research-summary.pdf" />}\n    />\n  </Attachment>\n  <DialogPanel>{/* ... */}</DialogPanel>\n</Dialog>\n```',
      },
      source: {
        code: 'import { HugeiconsIcon } from "@hugeicons/react";\nimport CopyIcon from "@hugeicons/core-free-icons/CopyIcon";\nimport FileSearchIcon from "@hugeicons/core-free-icons/FileSearchIcon";\nimport XIcon from "@hugeicons/core-free-icons/XIcon";\n\nimport {\n  Attachment,\n  AttachmentAction,\n  AttachmentActions,\n  AttachmentContent,\n  AttachmentDescription,\n  AttachmentMedia,\n  AttachmentTitle,\n  AttachmentTrigger,\n} from "@erbium/ui/components/attachment";\nimport {\n  Dialog,\n  DialogPanel,\n  DialogContent,\n  DialogDescription,\n  DialogHeader,\n  DialogTitle,\n  DialogTrigger,\n} from "@erbium/ui/components/dialog";\n\nexport function AttachmentTriggerDemo() {\n  return (\n    <div className="mx-auto w-full max-w-sm py-12">\n      <Dialog>\n        <Attachment className="w-full">\n          <AttachmentMedia>\n            <HugeiconsIcon icon={FileSearchIcon} />\n          </AttachmentMedia>\n          <AttachmentContent>\n            <AttachmentTitle>research-summary.pdf</AttachmentTitle>\n            <AttachmentDescription>Open preview dialog</AttachmentDescription>\n          </AttachmentContent>\n          <AttachmentActions>\n            <AttachmentAction aria-label="Copy link">\n              <HugeiconsIcon icon={CopyIcon} />\n            </AttachmentAction>\n            <AttachmentAction aria-label="Remove research-summary.pdf">\n              <HugeiconsIcon icon={XIcon} />\n            </AttachmentAction>\n          </AttachmentActions>\n          <DialogTrigger render={<AttachmentTrigger aria-label="Preview research-summary.pdf" />} />\n        </Attachment>\n        <DialogPanel className="sm:max-w-md">\n          <DialogHeader>\n            <DialogTitle>research-summary.pdf</DialogTitle>\n            <DialogDescription>\n              The attachment trigger fills the card and opens the dialog, while the actions stay\n              independently clickable above it.\n            </DialogDescription>\n          </DialogHeader>\n          <DialogContent>Preview the attachment before opening it.</DialogContent>\n        </DialogPanel>\n      </Dialog>\n    </div>\n  );\n}\n',
      },
    },
  },
  render: () => <AttachmentTriggerDemo />,
};
