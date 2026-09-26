import type { Meta, StoryObj } from "@storybook/react-vite";
import { Attachment } from "@erbium/ui/components/attachment";
import Demo from "./examples/attachment-demo";

const meta = {
  title: "UI/Attachment",
  component: Attachment,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'Displays a file or image attachment with media, metadata, upload state, and actions.\n\n**Import:** `@erbium/ui/components/attachment`  \n\n**shadcn/ui page:** [Attachment](https://ui.shadcn.com/docs/components/base/attachment)\n\n### Usage\n\n```tsx\nimport {\n  Attachment,\n  AttachmentAction,\n  AttachmentActions,\n  AttachmentContent,\n  AttachmentDescription,\n  AttachmentMedia,\n  AttachmentTitle,\n} from "@erbium/ui/components/attachment"\n```\n\n```tsx\n<Attachment>\n  <AttachmentMedia>\n    <FileTextIcon />\n  </AttachmentMedia>\n  <AttachmentContent>\n    <AttachmentTitle>sales-dashboard.pdf</AttachmentTitle>\n    <AttachmentDescription>PDF · 2.4 MB</AttachmentDescription>\n  </AttachmentContent>\n  <AttachmentActions>\n    <AttachmentAction aria-label="Remove sales-dashboard.pdf">\n      <XIcon />\n    </AttachmentAction>\n  </AttachmentActions>\n</Attachment>\n```\n\n### Composition\n\nUse the following composition to build an attachment:\n\nUse `AttachmentGroup` to lay out multiple attachments in a scrollable row:\n\n```text\nAttachment\n├── AttachmentMedia\n├── AttachmentContent\n│   ├── AttachmentTitle\n│   └── AttachmentDescription\n├── AttachmentActions\n│   └── AttachmentAction\n└── AttachmentTrigger\n```\n\n```text\nAttachmentGroup\n├── Attachment\n└── Attachment\n```\n\n### Features\n\n- Icon and image media through `AttachmentMedia`\n\n- Upload states: `idle`, `uploading`, `processing`, `error`, and `done` with built-in styling and a shimmer while in progress\n\n- Three sizes and horizontal or vertical orientation\n\n- A full-card `AttachmentTrigger` that opens a link or dialog while the actions stay independently clickable\n\n- Scrollable, snapping `AttachmentGroup` with an edge fade\n\n- Customizable styling through the `className` prop on every part\n\n### Image\n\nSet `variant="image"` on `AttachmentMedia` and render an `<img>` inside it. Use `orientation="vertical"` to stack the media above the content.\n\nstyleName="base-rhea"\n\nname="attachment-image"\n\npreviewClassName="h-auto theme-blue bg-surface dark:bg-background"\n\n/>\n\n### States\n\nSet `state` to reflect the upload lifecycle. `uploading` and `processing` shimmer the title, and `error` switches to a destructive treatment.\n\nstyleName="base-rhea"\n\nname="attachment-states"\n\npreviewClassName="h-auto theme-blue bg-surface dark:bg-background"\n\n/>\n\n### Sizes\n\nUse `size` to switch between `default`, `sm`, and `xs`.\n\nstyleName="base-rhea"\n\nname="attachment-sizes"\n\npreviewClassName="h-auto theme-blue bg-surface dark:bg-background"\n\n/>\n\n### Group\n\nWrap attachments in `AttachmentGroup` to lay them out in a horizontally scrollable, snapping row with an edge fade.\n\nstyleName="base-rhea"\n\nname="attachment-group"\n\npreviewClassName="h-auto theme-blue bg-surface dark:bg-background"\n\n/>\n\n### Trigger\n\nAdd an `AttachmentTrigger` to make the whole card open a link or dialog. It fills the card behind the actions, so the actions stay clickable.\n\nstyleName="base-rhea"\n\nname="attachment-trigger"\n\npreviewClassName="h-auto theme-blue bg-surface dark:bg-background"\n\n/>\n\n```tsx\n<Dialog>\n  <Attachment>\n    {/* media, content, actions */}\n    <DialogTrigger\n      render={<AttachmentTrigger aria-label="Preview research-summary.pdf" />}\n    />\n  </Attachment>\n  <DialogContent>{/* ... */}</DialogContent>\n</Dialog>\n```\n\n### Accessibility\n\n`AttachmentAction` renders a `Button`, and `AttachmentTrigger` renders a real `<button>` (or your element via `render`). Follow the guidance below so both are operable and announced.\n\n`AttachmentAction` is usually icon-only, so give each one an `aria-label` describing the action and its target.\n\n`AttachmentTrigger` covers the card with no text of its own, so give it an `aria-label` for what activating it does.\n\nThe trigger sits behind the actions in the stacking order, so an `AttachmentAction` and the `AttachmentTrigger` never trap each other — both remain separately focusable and clickable.\n\nAn `AttachmentGroup` scrolls horizontally. When its attachments are interactive: a trigger or actions, keyboard users reach off-screen items by tabbing to them. For a row of presentational attachments, make the group itself focusable and scrollable by adding `tabIndex={0}`, `role="group"`, and an `aria-label`.\n\nThe `error` state uses a destructive color. Keep the failure reason in `AttachmentDescription` so the state is not conveyed by color alone.\n\n```tsx\n<AttachmentAction aria-label="Remove sales-dashboard.pdf">\n  <XIcon />\n</AttachmentAction>\n```\n\n```tsx\n<AttachmentTrigger\n  render={\n    <a\n      href={url}\n      target="_blank"\n      rel="noreferrer"\n      aria-label="Open workspace.png"\n    />\n  }\n/>\n```',
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
