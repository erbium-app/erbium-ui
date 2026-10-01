import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Button } from "@erbium/ui/components/button";
import { ButtonGroup } from "@erbium/ui/components/button-group";
import { ToggleGroup, ToggleGroupItem } from "@erbium/ui/components/toggle-group";
import { Kbd } from "@erbium/ui/components/kbd";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import BotIcon from "@hugeicons/core-free-icons/BotIcon";
import ChevronDownIcon from "@hugeicons/core-free-icons/ChevronDownIcon";
import Coins01Icon from "@hugeicons/core-free-icons/Coins01Icon";
import CpuIcon from "@hugeicons/core-free-icons/CpuIcon";
import Search01Icon from "@hugeicons/core-free-icons/Search01Icon";
import SparklesIcon from "@hugeicons/core-free-icons/SparklesIcon";

/*
 * The surface roles on raw elements, before any component adopts them.
 * Each element takes `border` plus one surface class; interaction states come
 * from the element itself. Review these in both themes when tuning surfaces.css.
 */

const meta = {
  title: "Foundations/Surfaces",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj;

function Canvas({ children }: { children: React.ReactNode }) {
  return <div className="min-h-dvh bg-surface-canvas p-8 text-sm text-foreground">{children}</div>;
}

const ladder = [
  ["canvas", "bg-surface-canvas", "page"],
  ["panel", "border surface-panel", "card, frame"],
  ["control", "border surface-control", "button, trigger"],
  ["field", "border surface-field", "input, textarea"],
  ["overlay", "border surface-overlay", "popover, menu"],
  ["modal", "border surface-modal", "dialog, sheet, drawer"],
  ["top", "border surface-overlay [--surface-face:var(--surface-top)]", "menu in a dialog"],
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

const coloredSurfaces = [
  [
    "error",
    "surface-fill-error text-error-foreground",
    "surface-tint-error-soft text-error-soft-foreground",
  ],
  [
    "info",
    "surface-fill-info text-info-foreground",
    "surface-tint-info-soft text-info-soft-foreground",
  ],
  [
    "success",
    "surface-fill-success text-success-foreground",
    "surface-tint-success-soft text-success-soft-foreground",
  ],
  [
    "warning",
    "surface-fill-warning text-warning-foreground",
    "surface-tint-warning-soft text-warning-soft-foreground",
  ],
] as const;

/* Tags take their strength from --surface-tag-alpha, or from a per-colour
   token such as --tag-yellow-alpha. */
const tagColors = [
  ["gray", "surface-tag-gray text-tag-gray"],
  ["red", "surface-tag-red text-tag-red"],
  ["orange", "surface-tag-orange text-tag-orange"],
  ["yellow", "surface-tag-yellow text-tag-yellow-foreground"],
  ["green", "surface-tag-green text-tag-green"],
  ["cyan", "surface-tag-cyan text-tag-cyan"],
  ["blue", "surface-tag-blue text-tag-blue"],
  ["purple", "surface-tag-purple text-tag-purple"],
  ["magenta", "surface-tag-magenta text-tag-magenta"],
] as const;

export const Colored: Story = {
  render: () => (
    <Canvas>
      <div className="grid max-w-lg gap-4">
        {coloredSurfaces.map(([color, fill, tint]) => (
          <div key={color} className="grid grid-cols-2 gap-4">
            <div className={`${fill} rounded-lg border p-3`}>{color} fill</div>
            <div className={`${tint} rounded-lg border p-3`}>{color} tint</div>
          </div>
        ))}
        <div className="flex flex-wrap gap-2">
          {tagColors.map(([color, classes]) => (
            <span
              key={color}
              className={`${classes} rounded-full border px-2.5 py-0.5 text-xs font-medium`}
            >
              {color}
            </span>
          ))}
        </div>
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
          <div className="flex h-8 w-72 items-center gap-2 rounded-lg border surface-field px-2.5">
            <HugeiconsIcon icon={Search01Icon} className="size-3.5 text-muted-foreground" />
            <span className="text-muted-foreground">Search repositories and people…</span>
          </div>
          <button type="button" className={`${control} border surface-control text-foreground`}>
            <HugeiconsIcon icon={SparklesIcon} className="size-3.5" />
            Selected
          </button>
          <button
            type="button"
            className={`${control} border surface-flat text-muted-foreground hover:text-foreground`}
          >
            Ghost
          </button>
          <button
            type="button"
            className={`${control} border surface-control text-muted-foreground hover:text-foreground`}
          >
            Outline
          </button>
          <button
            type="button"
            className={`${control} border surface-fill-primary text-primary-foreground`}
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
              <div key={label as string} className="rounded-xl border surface-panel p-5">
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
                className="flex h-56 flex-col rounded-xl border surface-panel p-5"
              >
                <span className="font-medium">{label as string}</span>
                <div className="grid flex-1 place-content-center justify-items-center gap-3">
                  <span className="grid size-8 place-content-center rounded-lg border surface-control">
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

        <div className="flex flex-wrap items-center gap-4 rounded-xl border surface-panel p-5">
          <div className="inline-flex rounded-lg surface-well p-0.5">
            <span className={`${control} h-7 border surface-control`}>Overview</span>
            <span className={`${control} h-7 text-muted-foreground`}>Traces</span>
            <span className={`${control} h-7 text-muted-foreground`}>Costs</span>
          </div>
          <span className="flex h-[18px] w-8 items-center rounded-full surface-well px-0.5">
            <span className="size-3.5 rounded-full surface-knob" />
          </span>
          <span className="flex h-[18px] w-8 items-center justify-end rounded-full surface-well bg-primary px-0.5">
            <span className="size-3.5 rounded-full surface-knob bg-primary-foreground" />
          </span>
          <span className="rounded-full border surface-tag-green px-2.5 py-0.5 text-xs font-medium text-tag-green">
            Healthy
          </span>
          <span className="rounded-full border surface-tag-orange px-2.5 py-0.5 text-xs font-medium text-tag-orange">
            Degraded
          </span>
          <Kbd hotkey="Mod+K" />
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
          <span aria-expanded className={`${control} w-fit border surface-control`}>
            Workspace <HugeiconsIcon icon={ChevronDownIcon} className="size-3.5" />
          </span>
          <div className="w-56 rounded-xl border surface-overlay p-1">
            {["Profile", "Settings", "Sign out"].map((item, index) => (
              <div
                key={item}
                className={`rounded-md px-2 py-1.5 ${index === 1 ? "bg-accent" : ""}`}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
        <div className="grid gap-4 rounded-2xl border surface-modal p-6">
          <div>
            <div className="text-base font-medium">Invite people</div>
            <div className="text-muted-foreground">A menu opened in a dialog climbs above it.</div>
          </div>
          <span aria-expanded className={`${control} w-fit border surface-control`}>
            Member <HugeiconsIcon icon={ChevronDownIcon} className="size-3.5" />
          </span>
          <div className="w-48 rounded-xl border surface-overlay p-1 [--surface-face:var(--surface-top)]">
            {["Owner", "Member", "Restricted"].map((item, index) => (
              <div
                key={item}
                className={`rounded-md px-2 py-1.5 ${index === 1 ? "bg-accent" : ""}`}
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

/* Hover and press are pointer states, so the static swatches set the same
   element tokens the surface sets on :hover and :active. Flat roles only
   tint; raised roles also sink. The other states are plain attributes: the
   surface reads them. */
const sunk =
  "[--surface-catchlight:transparent] [--surface-backing:transparent] [--surface-drop:0_0_0_0_transparent,0_0_0_0_transparent,0_0_0_0_transparent] [--surface-recess:0_2px_3px_-1px_var(--surface-shadow-inset)]";

const stateRoles = [
  ["surface-control", true],
  ["surface-fill-primary text-primary-foreground", true],
  ["surface-flat text-muted-foreground", false],
  ["surface-ghost-error-soft text-error-soft-foreground", false],
] as const;

const states = [
  ["rest", {}, ""],
  ["hover", {}, "[--surface-tint:var(--surface-hover-tint)]"],
  ["selected / open", { "aria-pressed": true }, ""],
  ["pressed", {}, "[--surface-tint:var(--surface-press-tint)]"],
  ["focus", {}, "ring-3 ring-ring/50"],
  ["invalid", { "aria-invalid": true }, ""],
  ["disabled", { "aria-disabled": true }, "opacity-50"],
] as const;

export const States: Story = {
  render: () => (
    <Canvas>
      <div className="grid gap-4 rounded-xl border surface-panel p-6">
        {stateRoles.map(([role, raised]) => (
          <div key={role} className="flex flex-wrap gap-4">
            {states.map(([name, attributes, classes]) => (
              <span
                key={name}
                {...attributes}
                className={`${control} border ${role} ${classes} ${name === "pressed" && raised ? sunk : ""}`}
              >
                {name}
              </span>
            ))}
          </div>
        ))}
      </div>
    </Canvas>
  ),
};

/* Real primitives alongside the token swatches: review seams, focus, and
   persistent selection at each size, orientation, and reading direction. */
export const ControlStates: Story = {
  render: () => (
    <Canvas>
      <div className="grid gap-8">
        {(["ltr", "rtl"] as const).map((direction) => (
          <section key={direction} dir={direction} className="grid justify-items-start gap-4">
            <h2 className="font-medium">{direction.toUpperCase()}</h2>
            {(["xs", "sm", "default", "lg"] as const).map((size) => (
              <ButtonGroup key={size} aria-label={`${direction} ${size} states`}>
                <Button variant="outline" size={size}>
                  Rest
                </Button>
                <Button variant="outline" size={size} aria-pressed>
                  Selected
                </Button>
                <Button variant="outline" size={size} aria-expanded>
                  Open
                </Button>
                <Button variant="outline" size={size} aria-pressed disabled>
                  Disabled
                </Button>
              </ButtonGroup>
            ))}
            <div className="flex flex-wrap items-start gap-6">
              <ButtonGroup orientation="vertical" aria-label={`${direction} vertical states`}>
                <Button variant="outline">Rest</Button>
                <Button variant="outline" aria-pressed>
                  Selected
                </Button>
                <Button variant="outline" aria-expanded>
                  Open
                </Button>
              </ButtonGroup>
              <ToggleGroup
                variant="outline"
                spacing={0}
                defaultValue={["center"]}
                aria-label={`${direction} alignment`}
              >
                <ToggleGroupItem value="start">Start</ToggleGroupItem>
                <ToggleGroupItem value="center">Center</ToggleGroupItem>
                <ToggleGroupItem value="end">End</ToggleGroupItem>
              </ToggleGroup>
              <ButtonGroup aria-label={`${direction} filled states`}>
                <Button>Rest</Button>
                <Button aria-pressed>Selected</Button>
                <Button aria-expanded>Open</Button>
              </ButtonGroup>
            </div>
          </section>
        ))}
      </div>
    </Canvas>
  ),
};
