import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Kbd } from "@erbium/ui/components/kbd";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import BotIcon from "@hugeicons/core-free-icons/BotIcon";
import ChevronDownIcon from "@hugeicons/core-free-icons/ChevronDownIcon";
import Coins01Icon from "@hugeicons/core-free-icons/Coins01Icon";
import CpuIcon from "@hugeicons/core-free-icons/CpuIcon";
import Search01Icon from "@hugeicons/core-free-icons/Search01Icon";
import SparklesIcon from "@hugeicons/core-free-icons/SparklesIcon";

/*
 * The surface primitives on raw elements, before any component adopts them.
 * Review these in both themes when tuning surfaces.css; the component
 * migrations then reuse exactly these class pairs.
 */

const meta = {
  title: "Foundations/Surfaces",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj;

function Canvas({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface-canvas p-8 text-sm text-foreground">{children}</div>
  );
}

const ladder = [
  ["canvas", "bg-surface-canvas", "page"],
  ["panel", "border border-surface-rim bg-surface-panel shadow-panel", "card, frame"],
  ["control", "border border-surface-rim bg-surface-control shadow-control", "button, input"],
  ["overlay", "border border-surface-rim bg-surface-overlay shadow-overlay", "popover, menu"],
  ["modal", "border border-surface-rim bg-surface-modal shadow-modal", "dialog, sheet"],
  ["top", "border border-surface-rim bg-surface-top shadow-overlay", "menu in a dialog"],
] as const;

export const Ladder: Story = {
  render: () => (
    <Canvas>
      <div className="flex flex-wrap gap-8">
        {ladder.map(([name, classes, use]) => (
          <div key={name} className="grid justify-items-center gap-3">
            <div className={`size-24 rounded-xl ${classes}`} />
            <div className="text-center">
              <div className="font-medium">{name}</div>
              <div className="text-xs text-muted-foreground">{use}</div>
            </div>
          </div>
        ))}
      </div>
    </Canvas>
  ),
};

const control =
  "inline-flex h-8 items-center gap-1.5 rounded-lg px-3 text-xs font-medium transition-[background-color,box-shadow] duration-150";

export const Roles: Story = {
  render: () => (
    <Canvas>
      <div className="grid max-w-3xl gap-6">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex h-8 w-72 items-center gap-2 rounded-lg border border-surface-rim bg-surface-control px-2.5 shadow-control">
            <HugeiconsIcon icon={Search01Icon} className="size-3.5 text-muted-foreground" />
            <span className="text-muted-foreground">Search repositories and people…</span>
          </div>
          <button
            type="button"
            className={`${control} border border-surface-rim bg-surface-control text-foreground shadow-control`}
          >
            <HugeiconsIcon icon={SparklesIcon} className="size-3.5" />
            Selected
          </button>
          <button
            type="button"
            className={`${control} text-muted-foreground hover:tint-hover hover:text-foreground`}
          >
            Ghost
          </button>
          <button
            type="button"
            className={`${control} border border-surface-rim bg-surface-control text-muted-foreground shadow-control hover:tint-hover hover:text-foreground active:tint-press active:shadow-pressed`}
          >
            Outline
          </button>
          <button
            type="button"
            className={`${control} bg-primary text-primary-foreground shadow-fill hover:tint-hover active:tint-press active:shadow-pressed`}
          >
            Primary
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {[
            ["Tokens", "0", Coins01Icon],
            ["Total cost", "$0.00", SparklesIcon],
          ].map(([label, value, Icon]) => {
            return (
              <div
                key={label as string}
                className="rounded-xl border border-surface-rim bg-surface-panel p-5 shadow-panel"
              >
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <HugeiconsIcon
                      icon={Icon as IconSvgElement}
                      className="size-3.5 text-muted-foreground"
                    />
                    {label as string}
                  </span>
                  <span className="tabular-nums">{value as string}</span>
                </div>
              </div>
            );
          })}
          {[
            ["Models", "No model yet", CpuIcon],
            ["Agents", "No agent yet", BotIcon],
          ].map(([label, empty, Icon]) => {
            return (
              <div
                key={label as string}
                className="flex h-56 flex-col rounded-xl border border-surface-rim bg-surface-panel p-5 shadow-panel"
              >
                <span className="font-medium">{label as string}</span>
                <div className="grid flex-1 place-content-center justify-items-center gap-3">
                  <span className="grid size-8 place-content-center rounded-lg border border-surface-rim bg-surface-control shadow-control">
                    <HugeiconsIcon
                      icon={Icon as IconSvgElement}
                      className="size-3.5 text-muted-foreground"
                    />
                  </span>
                  <span>{empty as string}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-4 rounded-xl border border-surface-rim bg-surface-panel p-5 shadow-panel">
          <div className="inline-flex rounded-lg bg-surface-well p-0.5 shadow-well">
            <span
              className={`${control} h-7 border border-surface-rim bg-surface-control shadow-control`}
            >
              Overview
            </span>
            <span className={`${control} h-7 text-muted-foreground`}>Traces</span>
            <span className={`${control} h-7 text-muted-foreground`}>Costs</span>
          </div>
          <span className="flex h-[18px] w-8 items-center rounded-full bg-surface-well px-0.5 shadow-well">
            <span className="size-3.5 rounded-full border border-surface-rim bg-surface-control shadow-knob" />
          </span>
          <span className="flex h-[18px] w-8 items-center justify-end rounded-full bg-primary px-0.5 shadow-well">
            <span className="size-3.5 rounded-full bg-primary-foreground shadow-knob" />
          </span>
          <span className="rounded-full bg-tag-green/10 px-2.5 py-0.5 text-xs font-medium text-tag-green shadow-tint">
            Healthy
          </span>
          <span className="rounded-full bg-tag-orange/10 px-2.5 py-0.5 text-xs font-medium text-tag-orange shadow-tint">
            Degraded
          </span>
          <Kbd>⌘K</Kbd>
        </div>
      </div>
    </Canvas>
  ),
};

export const Nesting: Story = {
  render: () => (
    <Canvas>
      <div className="grid max-w-3xl grid-cols-2 items-start gap-8">
        <div className="grid gap-2">
          <span
            className={`${control} w-fit border border-surface-rim bg-surface-control shadow-pressed`}
          >
            Workspace <HugeiconsIcon icon={ChevronDownIcon} className="size-3.5" />
          </span>
          <div className="w-56 rounded-xl border border-surface-rim bg-surface-overlay p-1 shadow-overlay">
            {["Profile", "Settings", "Sign out"].map((item, index) => (
              <div
                key={item}
                className={`rounded-md px-2 py-1.5 ${index === 1 ? "tint-hover" : ""}`}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
        <div className="grid gap-4 rounded-2xl border border-surface-rim bg-surface-modal p-6 shadow-modal">
          <div>
            <div className="text-base font-medium">Invite people</div>
            <div className="text-muted-foreground">A menu opened in a dialog climbs above it.</div>
          </div>
          <span
            className={`${control} w-fit border border-surface-rim bg-surface-control shadow-pressed`}
          >
            Member <HugeiconsIcon icon={ChevronDownIcon} className="size-3.5" />
          </span>
          <div className="w-48 rounded-xl border border-surface-rim bg-surface-top p-1 shadow-overlay">
            {["Owner", "Member", "Restricted"].map((item, index) => (
              <div
                key={item}
                className={`rounded-md px-2 py-1.5 ${index === 1 ? "tint-hover" : ""}`}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Canvas>
  ),
};

const states = [
  ["rest", "shadow-control"],
  ["hover", "shadow-control tint-hover"],
  ["pressed", "shadow-pressed tint-press"],
  ["focus", "shadow-control ring-3 ring-ring/50"],
  ["invalid", "shadow-control [--surface-edge:var(--destructive)]"],
  ["disabled", "shadow-edge opacity-50"],
] as const;

export const States: Story = {
  render: () => (
    <Canvas>
      <div className="flex flex-wrap gap-4 rounded-xl border border-surface-rim bg-surface-panel p-6 shadow-panel">
        {states.map(([name, classes]) => (
          <span
            key={name}
            className={`${control} border border-surface-rim bg-surface-control ${classes}`}
          >
            {name}
          </span>
        ))}
      </div>
    </Canvas>
  ),
};
