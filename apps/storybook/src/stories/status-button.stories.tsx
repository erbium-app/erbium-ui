import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { DirectionProvider } from "@erbium/ui/components/direction";
import { StatusButton } from "@erbium/ui/components/status-button";
import StatusButtonDemo, { AsyncStatusButton } from "../examples/status-button-demo";
import StatusButtonForm from "../examples/status-button-form";

const meta = {
  title: "UI/Status Button",
  component: StatusButton,
  parameters: {
    docs: {
      description: {
        component:
          "Shows loading and success feedback for an async action. Use `status` with TanStack Form's `form.Subscribe` when the form owns submission. Import from `@erbium/ui/components/status-button`.",
      },
    },
  },
} satisfies Meta<typeof StatusButton>;

export default meta;
type Story = StoryObj;

export const AsyncAction: Story = {
  render: () => <StatusButtonDemo />,
};

export const TanStackForm: Story = {
  render: () => <StatusButtonForm />,
};

export const Directions: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {(["ltr", "rtl"] as const).map((direction) => {
        const isRtl = direction === "rtl";
        const label = isRtl ? "حفظ" : "Save";
        const successLabel = isRtl ? "تم الحفظ" : "Saved";

        return (
          <DirectionProvider direction={direction} key={direction}>
            <div dir={direction} className="rounded-lg border p-4">
              <p className="mb-3 text-sm font-medium uppercase">{direction}</p>
              <div className="flex flex-wrap gap-3">
                <AsyncStatusButton successLabel={successLabel}>{label}</AsyncStatusButton>
                <StatusButton status="loading" successLabel={successLabel}>
                  {label}
                </StatusButton>
                <StatusButton status="success" successLabel={successLabel}>
                  {label}
                </StatusButton>
                <StatusButton status="success" successLabel={successLabel} variant="outline">
                  {label}
                </StatusButton>
              </div>
            </div>
          </DirectionProvider>
        );
      })}
    </div>
  ),
};
