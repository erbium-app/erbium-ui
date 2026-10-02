import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { CSPProvider } from "@erbium/ui/components/csp-provider";
import { ScrollArea } from "@erbium/ui/components/scroll-area";

const meta = {
  title: "UI/CSP Provider",
  component: CSPProvider,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `Configures inline style and script tags rendered by Base UI components. Import from \`@erbium/ui/components/csp-provider\`.

Wrap your application with \`<CSPProvider nonce={nonceFromServer}>\` when your CSP requires a nonce. Generate a fresh nonce on the server for each response and include the same value in the CSP header. The provider does not configure the header or authorize inline style attributes.

Alternatively, use \`disableStyleElements\` with Erbium's global stylesheet, which includes Base UI's scrollbar-hiding rules. Storybook and the docs previews use this configuration. This option does not disable inline scripts; opt-in scripts still require a nonce under a strict CSP.

See [Base UI CSP Provider](https://base-ui.com/react/utils/csp-provider) for server configuration and limitations.`,
      },
    },
  },
} satisfies Meta<typeof CSPProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ExternalStyles: Story = {
  args: { disableStyleElements: true },
  render: (args) => (
    <CSPProvider {...args}>
      <ScrollArea className="h-40 w-72" aria-label="CSP provider example">
        {Array.from({ length: 12 }, (_, index) => (
          <p key={index} className="p-3">
            Scrollable item {index + 1}
          </p>
        ))}
      </ScrollArea>
    </CSPProvider>
  ),
};
