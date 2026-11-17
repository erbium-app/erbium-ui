import { Icon } from "@erbium/ui/components/icon";
import type { IconProps } from "@erbium/ui/components/icon";
import { Kbd } from "@erbium/ui/components/kbd";
import { SurfaceStage, control } from "../helpers";

const stats = [
  { icon: "coins-01", label: "Tokens", value: "0" },
  { icon: "sparkles", label: "Total cost", value: "$0.00" },
] satisfies { icon: IconProps["name"]; label: string; value: string }[];

const emptyPanels = [
  { empty: "No model yet", icon: "cpu", label: "Models" },
  { empty: "No agent yet", icon: "bot", label: "Agents" },
] satisfies { empty: string; icon: IconProps["name"]; label: string }[];

export default function SurfacesRolesExample() {
  return (
    <SurfaceStage>
      <div className="grid w-full max-w-3xl gap-section">
        <div className="flex flex-wrap items-center gap-related">
          <div className="flex control-size w-full max-w-72 items-center rounded-lg border surface-field">
            <Icon name="search-01" className="size-3.5 text-muted-foreground" />
            <span className="text-muted-foreground">Search repositories and people…</span>
          </div>
          <button type="button" className={`${control} border surface-control text-foreground`}>
            <Icon name="sparkles" className="size-3.5" />
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

        <div className="grid gap-group @md:grid-cols-2">
          {stats.map(({ icon, label, value }) => (
            <div key={label} className="rounded-xl border surface-panel p-5">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-related">
                  <Icon name={icon} className="size-3.5 text-muted-foreground" />
                  {label}
                </span>
                <span className="tabular-nums">{value}</span>
              </div>
            </div>
          ))}
          {emptyPanels.map(({ empty, icon, label }) => (
            <div key={label} className="flex h-56 flex-col rounded-xl border surface-panel p-5">
              <span className="font-medium">{label}</span>
              <div className="grid flex-1 place-content-center justify-items-center gap-3">
                <span className="grid size-8 place-content-center rounded-lg border surface-control">
                  <Icon name={icon} className="size-3.5 text-muted-foreground" />
                </span>
                <span>{empty}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-group rounded-xl border surface-panel p-5">
          <div className="inline-flex rounded-lg surface-well p-0.5">
            <span className={`${control} min-h-control-sm border surface-control`}>Overview</span>
            <span className={`${control} min-h-control-sm text-muted-foreground`}>Traces</span>
            <span className={`${control} min-h-control-sm text-muted-foreground`}>Costs</span>
          </div>
          <span className="flex h-[18px] w-8 items-center rounded-full surface-well px-0.5">
            <span className="size-3.5 rounded-full surface-knob" />
          </span>
          <span className="flex h-[18px] w-8 items-center justify-end rounded-full surface-well bg-primary px-0.5">
            <span className="size-3.5 rounded-full surface-knob bg-primary-foreground" />
          </span>
          <span className="rounded-full border surface-tag-green px-2.5 py-0.5 text-metadata font-medium text-tag-green">
            Healthy
          </span>
          <span className="rounded-full border surface-tag-orange px-2.5 py-0.5 text-metadata font-medium text-tag-orange">
            Degraded
          </span>
          <Kbd hotkey="Mod+K" />
        </div>
      </div>
    </SurfaceStage>
  );
}
