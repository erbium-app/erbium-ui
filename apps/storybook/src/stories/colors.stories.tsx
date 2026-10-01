import type { Meta, StoryObj } from "@storybook/tanstack-react";

const meta = {
  title: "Foundations/Colors",
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const semanticColors = [
  ["Error", "bg-error text-error-foreground"],
  ["Success", "bg-success text-success-foreground"],
  ["Warning", "bg-warning text-warning-foreground"],
  ["Info", "bg-info text-info-foreground"],
] as const;

const tagColors = [
  ["Gray", "bg-tag-gray/10 text-tag-gray"],
  ["Red", "bg-tag-red/10 text-tag-red"],
  ["Orange", "bg-tag-orange/10 text-tag-orange"],
  ["Yellow", "bg-tag-yellow/15 text-tag-yellow-foreground"],
  ["Green", "bg-tag-green/10 text-tag-green"],
  ["Cyan", "bg-tag-cyan/10 text-tag-cyan"],
  ["Blue", "bg-tag-blue/10 text-tag-blue"],
  ["Purple", "bg-tag-purple/10 text-tag-purple"],
  ["Magenta", "bg-tag-magenta/10 text-tag-magenta"],
] as const;

const softColors = [
  ["Error", "bg-error-soft text-error-soft-foreground"],
  ["Success", "bg-success-soft text-success-soft-foreground"],
  ["Warning", "bg-warning-soft text-warning-soft-foreground"],
  ["Info", "bg-info-soft text-info-soft-foreground"],
] as const;

export const Semantic: Story = {
  render: () => (
    <div className="grid max-w-2xl gap-8">
      <section className="grid gap-3">
        <h2 className="text-sm font-medium">Semantic colors</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {semanticColors.map(([name, colors]) => (
            <div key={name} className={`rounded-lg p-3 text-sm font-medium ${colors}`}>
              {name}
            </div>
          ))}
        </div>
      </section>
      <section className="grid gap-3">
        <h2 className="text-sm font-medium">Soft semantic colors</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {softColors.map(([name, colors]) => (
            <div key={name} className={`rounded-lg p-3 text-sm font-medium ${colors}`}>
              {name}
            </div>
          ))}
        </div>
      </section>
      <section className="grid gap-3">
        <h2 className="text-sm font-medium">Categorical tag colors</h2>
        <div className="flex flex-wrap gap-2">
          {tagColors.map(([name, colors]) => (
            <span key={name} className={`rounded-full px-2.5 py-1 text-xs font-medium ${colors}`}>
              {name}
            </span>
          ))}
        </div>
      </section>
    </div>
  ),
};
