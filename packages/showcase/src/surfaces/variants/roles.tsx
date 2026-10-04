import { Kbd } from "@erbium/ui/components/kbd";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import BotIcon from "@hugeicons/core-free-icons/BotIcon";
import Coins01Icon from "@hugeicons/core-free-icons/Coins01Icon";
import CpuIcon from "@hugeicons/core-free-icons/CpuIcon";
import Search01Icon from "@hugeicons/core-free-icons/Search01Icon";
import SparklesIcon from "@hugeicons/core-free-icons/SparklesIcon";
import { Canvas, control } from "../helpers";

const Example = () => (
  <Canvas>
    <div className="grid w-full max-w-3xl gap-6">
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex h-8 w-full max-w-72 items-center gap-2 rounded-lg border surface-field px-2.5">
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

      <div className="grid gap-4 @md:grid-cols-2">
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
);

export default Example;
