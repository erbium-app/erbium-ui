import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { ButtonShortcut } from "@erbium/ui/components/button";
import { DirectionProvider } from "@erbium/ui/components/direction";
import { StatefulButton } from "@erbium/ui/components/stateful-button";
import StatefulButtonDemo, { AsyncStatefulButton } from "../examples/stateful-button-demo";
import StatefulButtonForm from "../examples/stateful-button-form";

const meta = {
  title: "UI/Stateful Button",
  component: StatefulButton,
  parameters: {
    docs: {
      description: {
        component:
          "Shows loading and success feedback for an async action. Use `state` with TanStack Form's `form.Subscribe` when the form owns submission. Import from `@erbium/ui/components/stateful-button`.",
      },
    },
  },
} satisfies Meta<typeof StatefulButton>;

export default meta;
type Story = StoryObj;

export const AsyncAction: Story = {
  render: () => <StatefulButtonDemo />,
};

export const TanStackForm: Story = {
  render: () => <StatefulButtonForm />,
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
                <AsyncStatefulButton successLabel={successLabel}>{label}</AsyncStatefulButton>
                <StatefulButton successLabel={successLabel} variant="outline">
                  {label}
                  <ButtonShortcut hotkey="Mod+S" />
                </StatefulButton>
                <StatefulButton state="loading" successLabel={successLabel}>
                  {label}
                  <ButtonShortcut hotkey="Mod+S" />
                </StatefulButton>
                <StatefulButton state="success" successLabel={successLabel}>
                  {label}
                  <ButtonShortcut hotkey="Mod+S" />
                </StatefulButton>
                <StatefulButton state="success" successLabel={successLabel} variant="outline">
                  {label}
                </StatefulButton>
              </div>
            </div>
          </DirectionProvider>
        );
      })}
    </div>
  ),
};
