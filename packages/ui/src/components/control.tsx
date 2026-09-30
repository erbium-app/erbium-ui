import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import CheckIcon from "@hugeicons/core-free-icons/CheckIcon";
import ChevronDownIcon from "@hugeicons/core-free-icons/ChevronDownIcon";
import ImagePlusIcon from "@hugeicons/core-free-icons/ImagePlusIcon";

import { Input as InputPrimitive } from "@base-ui/react/input";
import { Radio as RadioPrimitive } from "@base-ui/react/radio";
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group";
import { Select as SelectPrimitive } from "@base-ui/react/select";
import { Slider as SliderPrimitive } from "@base-ui/react/slider";
import { Switch as SwitchPrimitive } from "@base-ui/react/switch";
import {
  animate,
  LayoutGroup,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./collapsible";
import { Separator } from "./separator";
import { cn } from "../lib/utils";

const rowClass =
  "group/control relative flex min-h-8 w-full min-w-0 items-center gap-2.5 rounded-lg border border-surface-rim bg-surface-control px-2.5 text-sm text-foreground shadow-control transition-[background-color,box-shadow] duration-150 motion-reduce:transition-none has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring/40 has-[:disabled]:opacity-50 has-[[data-disabled]]:opacity-50";
const labelClass = "min-w-0 shrink-0 truncate text-sm font-medium text-muted-foreground";
const valueClass =
  "ms-auto min-w-0 flex-1 text-end text-sm text-foreground outline-none placeholder:text-muted-foreground";
const monoClass = "font-mono tabular-nums";

type CommonProps = {
  label: string;
  disabled?: boolean;
  className?: string;
};

function Group({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="control-group"
      className={cn("flex w-full min-w-0 flex-col gap-1.5", className)}
      {...props}
    />
  );
}

function Row({ label, className, children, ...props }: CommonProps & React.ComponentProps<"div">) {
  return (
    <div data-slot="control-row" className={cn(rowClass, className)} {...props}>
      <span className={labelClass}>{label}</span>
      {children}
    </div>
  );
}

type NumberProps = CommonProps & {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  onValueCommitted?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  /** Continuous dragging accepts fine values; discrete dragging snaps to step or steps. */
  mode?: "continuous" | "discrete";
  /** Allowed values for a discrete control, including uneven intervals. */
  steps?: readonly number[];
  /** Show position marks for small discrete sets. */
  showSteps?: boolean;
  formatValue?: (value: number) => string;
  name?: string;
};

function decimalPlaces(step: number) {
  const text = String(step);
  return text.includes("e-") ? Number(text.split("e-")[1]) : (text.split(".")[1]?.length ?? 0);
}

function ControlNumber({
  label,
  value,
  defaultValue,
  onValueChange,
  onValueCommitted,
  min = 0,
  max = 100,
  step = 1,
  mode = "discrete",
  steps,
  showSteps = true,
  formatValue,
  disabled,
  className,
  name,
}: NumberProps) {
  const [localValue, setLocalValue] = React.useState(defaultValue ?? min);
  const current = value ?? localValue;
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState("");
  const [dragging, setDragging] = React.useState(false);
  const surfaceRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const pointerRef = React.useRef<{ x: number; y: number; bounds: DOMRect } | null>(null);
  const stretchRef = React.useRef(0);
  const springFrameRef = React.useRef<number | null>(null);
  const fillAnimationRef = React.useRef<ReturnType<typeof animate> | null>(null);
  const id = React.useId();
  const safeStep = step > 0 ? step : 1;
  const allowedValues = React.useMemo(
    () =>
      mode === "discrete" && steps
        ? [...new Set(steps.filter(Number.isFinite))].sort((a, b) => a - b)
        : [],
    [mode, steps],
  );
  const hasSteps = allowedValues.length > 1;
  const lower = hasSteps ? allowedValues[0] : min;
  const upper = hasSteps
    ? allowedValues[allowedValues.length - 1]
    : max > min
      ? max
      : min + safeStep;
  const nearestIndex = (number: number) =>
    allowedValues.reduce(
      (best, candidate, index) =>
        Math.abs(candidate - number) < Math.abs(allowedValues[best] - number) ? index : best,
      0,
    );
  const toValue = (number: number) => (hasSteps ? allowedValues[nearestIndex(number)] : number);
  // Base UI uses a step for pointer and keyboard input. A fine step makes the
  // pointer feel free while preserving native slider semantics. Uneven discrete
  // values stay on the real numeric axis, then snap through onValueChange.
  const rootStep = hasSteps || mode === "continuous" ? 0.0001 : safeStep;
  const pct = Math.max(0, Math.min(100, ((current - lower) / (upper - lower)) * 100));
  const markValues =
    showSteps && mode === "discrete"
      ? hasSteps
        ? allowedValues
        : (upper - lower) / safeStep <= 10
          ? Array.from(
              { length: Math.ceil((upper - lower) / safeStep) },
              (_, index) => lower + index * safeStep,
            ).concat(upper)
          : []
      : [];
  const visualPct = useMotionValue(pct);
  const fillWidth = useTransform(visualPct, (percent) => `${percent}%`);
  const handleStart = useTransform(
    visualPct,
    (percent) => `clamp(4px, ${percent}%, calc(100% - 4px))`,
  );
  const shown =
    formatValue?.(current) ??
    (hasSteps
      ? String(current)
      : mode === "continuous"
        ? String(Number(current.toFixed(4)))
        : current.toFixed(decimalPlaces(safeStep)));

  React.useEffect(() => {
    if (editing) inputRef.current?.select();
  }, [editing]);

  React.useEffect(() => {
    fillAnimationRef.current?.stop();
    if (
      dragging ||
      pointerRef.current ||
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    ) {
      visualPct.jump(pct);
      return;
    }
    fillAnimationRef.current = animate(visualPct, pct, {
      type: "spring",
      stiffness: 300,
      damping: 25,
      mass: 0.8,
    });
  }, [pct, dragging, visualPct]);

  React.useEffect(
    () => () => {
      if (springFrameRef.current !== null) cancelAnimationFrame(springFrameRef.current);
      fillAnimationRef.current?.stop();
    },
    [],
  );

  const setSurfaceStretch = (pixels: number) => {
    stretchRef.current = pixels;
    if (!surfaceRef.current) return;
    surfaceRef.current.style.left = `${Math.min(pixels, 0)}px`;
    surfaceRef.current.style.right = `${Math.min(-pixels, 0)}px`;
  };

  const finishStretch = () => {
    if (!pointerRef.current) return;
    pointerRef.current = null;
    setDragging(false);
    const start = stretchRef.current;
    if (start === 0) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setSurfaceStretch(0);
      return;
    }
    let position = start;
    let velocity = 0;
    let previousTime = performance.now();
    const tick = (time: number) => {
      const delta = Math.min((time - previousTime) / 1000, 0.032);
      previousTime = time;
      velocity += (-360 * position - 26 * velocity) * delta;
      position += velocity * delta;
      if (Math.abs(position) < 0.02 && Math.abs(velocity) < 0.2) {
        setSurfaceStretch(0);
        springFrameRef.current = null;
      } else {
        setSurfaceStretch(position);
        springFrameRef.current = requestAnimationFrame(tick);
      }
    };
    springFrameRef.current = requestAnimationFrame(tick);
  };

  const change = (next: number) => {
    const actual = toValue(next);
    setLocalValue(actual);
    onValueChange?.(actual);
  };
  const commit = () => {
    if (!editing) return;
    const parsed = Number(draft.trim());
    if (draft.trim() && Number.isFinite(parsed)) {
      const clamped = Math.max(lower, Math.min(upper, parsed));
      const next = hasSteps
        ? allowedValues[nearestIndex(clamped)]
        : mode === "continuous"
          ? clamped
          : Math.max(
              lower,
              Math.min(
                upper,
                Number(
                  (lower + Math.round((clamped - lower) / safeStep) * safeStep).toFixed(
                    decimalPlaces(safeStep),
                  ),
                ),
              ),
            );
      setLocalValue(next);
      onValueChange?.(next);
      onValueCommitted?.(next);
    }
    setEditing(false);
  };

  return (
    <SliderPrimitive.Root
      data-slot="control-number"
      data-elastic-dragging={dragging || undefined}
      aria-labelledby={id}
      className={cn(
        "group/number relative block h-8 w-full min-w-0 data-disabled:opacity-50",
        className,
      )}
      disabled={disabled}
      min={lower}
      max={upper}
      step={rootStep}
      name={name}
      value={current}
      onValueChange={change}
      onValueCommitted={(next) => onValueCommitted?.(toValue(next))}
      onKeyDownCapture={(event) => {
        if (!hasSteps || disabled || editing) return;
        const rtl = getComputedStyle(event.currentTarget).direction === "rtl";
        const direction =
          event.key === "ArrowRight"
            ? rtl
              ? -1
              : 1
            : event.key === "ArrowLeft"
              ? rtl
                ? 1
                : -1
              : event.key === "ArrowUp" || event.key === "PageUp"
                ? 1
                : event.key === "ArrowDown" || event.key === "PageDown"
                  ? -1
                  : 0;
        const targetIndex =
          event.key === "Home"
            ? 0
            : event.key === "End"
              ? allowedValues.length - 1
              : direction
                ? Math.max(
                    0,
                    Math.min(
                      allowedValues.length - 1,
                      nearestIndex(current) + direction * (event.shiftKey ? 10 : 1),
                    ),
                  )
                : null;
        if (targetIndex === null) return;
        event.preventDefault();
        event.stopPropagation();
        const next = allowedValues[targetIndex];
        if (next === current) return;
        setLocalValue(next);
        onValueChange?.(next);
        onValueCommitted?.(next);
      }}
    >
      <div
        ref={surfaceRef}
        aria-hidden="true"
        data-slot="control-number-surface"
        className="pointer-events-none absolute inset-0 rounded-lg border border-surface-rim bg-surface-control shadow-control"
      >
        <div className="absolute inset-0 overflow-hidden rounded-[calc(var(--radius-lg)-1px)]">
          <motion.div
            className="absolute inset-y-0 start-0 bg-foreground/8 transition-colors duration-150 group-hover/number:bg-foreground/12 dark:bg-foreground/12 dark:group-hover/number:bg-foreground/16 motion-reduce:transition-none"
            style={{ width: fillWidth }}
          />
          {markValues.map((mark) => (
            <span
              key={mark}
              data-slot="control-number-step"
              data-active={Math.abs(mark - current) < 0.000001 || undefined}
              className="absolute top-1/2 size-[5px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground/35 transition-[background-color,transform] duration-150 data-active:scale-125 data-active:bg-foreground/80 rtl:translate-x-1/2 motion-reduce:transition-none"
              style={{
                insetInlineStart: `clamp(4px, ${((mark - lower) / (upper - lower)) * 100}%, calc(100% - 4px))`,
              }}
            />
          ))}
        </div>
        <motion.div
          className="absolute top-1/2 h-5 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground/70 opacity-0 transition-opacity duration-150 group-hover/number:opacity-70 group-data-elastic-dragging/number:opacity-100 rtl:translate-x-1/2 motion-reduce:transition-none"
          style={{ insetInlineStart: handleStart }}
        />
      </div>
      <SliderPrimitive.Control
        className="group/slider-control absolute inset-0 z-10 flex cursor-ew-resize touch-none items-center rounded-lg outline-none select-none"
        onPointerDown={(event) => {
          if (event.button !== 0 || disabled || editing) return;
          if (springFrameRef.current !== null) cancelAnimationFrame(springFrameRef.current);
          springFrameRef.current = null;
          pointerRef.current = {
            x: event.clientX,
            y: event.clientY,
            bounds: event.currentTarget.getBoundingClientRect(),
          };
        }}
        onPointerMove={(event) => {
          const pointer = pointerRef.current;
          if (!pointer || Math.hypot(event.clientX - pointer.x, event.clientY - pointer.y) <= 3)
            return;
          if (!dragging) setDragging(true);
          const rect = pointer.bounds;
          const overflow =
            event.clientX < rect.left
              ? event.clientX - rect.left
              : event.clientX > rect.right
                ? event.clientX - rect.right
                : 0;
          const distance = Math.max(0, Math.abs(overflow) - 32);
          setSurfaceStretch(
            window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
              ? 0
              : Math.sign(overflow) * 8 * Math.sqrt(Math.min(distance / 200, 1)),
          );
        }}
        onPointerUp={finishStretch}
        onPointerCancel={finishStretch}
        onLostPointerCapture={finishStretch}
      >
        <SliderPrimitive.Track className="relative h-full w-full rounded-lg">
          <SliderPrimitive.Indicator className="pointer-events-none h-full bg-transparent" />
          <SliderPrimitive.Thumb
            aria-label={label}
            aria-valuetext={shown}
            className="absolute top-1/2 size-5 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring/70"
          />
        </SliderPrimitive.Track>
      </SliderPrimitive.Control>
      <span
        id={id}
        aria-hidden="true"
        className={cn(
          labelClass,
          "pointer-events-none absolute inset-s-2.5 top-1/2 z-20 max-w-[55%] -translate-y-1/2",
        )}
      >
        {label}
      </span>
      {editing ? (
        <input
          ref={inputRef}
          aria-label={`${label} value`}
          className={cn(
            "absolute inset-e-2.5 top-1/2 z-30 w-20 -translate-y-1/2 border-b border-ring bg-surface-control text-end text-sm outline-none",
            monoClass,
          )}
          inputMode="decimal"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onBlur={commit}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              commit();
            }
            if (event.key === "Escape") {
              event.preventDefault();
              setEditing(false);
            }
          }}
        />
      ) : (
        <button
          type="button"
          disabled={disabled}
          aria-label={`Edit ${label} value`}
          className={cn(
            "absolute inset-e-2.5 top-1/2 z-20 -translate-y-1/2 rounded-sm px-0.5 text-sm text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring",
            monoClass,
          )}
          onClick={() => {
            setDraft(String(current));
            setEditing(true);
          }}
        >
          {shown}
        </button>
      )}
    </SliderPrimitive.Root>
  );
}

type TextProps = CommonProps &
  Omit<
    React.ComponentProps<"input">,
    "type" | "onChange" | "value" | "defaultValue" | "disabled"
  > & {
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
  };

function Text({
  label,
  value,
  defaultValue,
  onValueChange,
  disabled,
  className,
  id: idProp,
  ...props
}: TextProps) {
  const generatedId = React.useId();
  const id = idProp ?? generatedId;
  return (
    <label className={cn(rowClass, className)} data-slot="control-text" htmlFor={id}>
      <span className={labelClass}>{label}</span>
      <InputPrimitive
        id={id}
        disabled={disabled}
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        className={cn(valueClass, "h-7 bg-transparent")}
        {...props}
      />
    </label>
  );
}

type TextareaProps = CommonProps &
  Omit<React.ComponentProps<"textarea">, "onChange" | "value" | "defaultValue" | "disabled"> & {
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
  };

function Textarea({
  label,
  value,
  defaultValue,
  onValueChange,
  disabled,
  className,
  id: idProp,
  ...props
}: TextareaProps) {
  const generatedId = React.useId();
  const id = idProp ?? generatedId;
  return (
    <label
      data-slot="control-textarea"
      htmlFor={id}
      className={cn(rowClass, "items-start py-1.5", className)}
    >
      <span className={cn(labelClass, "pt-0.5")}>{label}</span>
      <textarea
        id={id}
        disabled={disabled}
        value={value}
        defaultValue={defaultValue}
        onChange={(event) => onValueChange?.(event.target.value)}
        rows={1}
        className={cn(
          valueClass,
          "max-h-40 min-h-5 resize-none field-sizing-content bg-transparent leading-5",
        )}
        {...props}
      />
    </label>
  );
}

type BooleanProps = CommonProps & {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  presentation?: "switch" | "segments";
  name?: string;
};

type Option = { value: string; label: string };

function SegmentedTrack({
  id,
  options,
  value,
  onValueChange,
  disabled,
  name,
  className,
}: {
  id: string;
  options: readonly Option[];
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  name?: string;
  className?: string;
}) {
  const layoutId = React.useId();
  const shouldReduceMotion = useReducedMotion();

  return (
    <LayoutGroup id={layoutId}>
      <RadioGroupPrimitive
        aria-labelledby={id}
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        name={name}
        className={cn(
          "relative isolate ms-auto flex min-w-0 rounded-lg bg-surface-well p-[3px] shadow-well",
          className,
        )}
      >
        {options.map((option) => (
          <RadioPrimitive.Root
            key={option.value}
            value={option.value}
            className="relative flex min-h-6 min-w-0 items-center justify-center rounded-md px-2 py-0.5 text-center text-xs text-muted-foreground outline-none transition-colors duration-150 data-checked:text-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/60 motion-reduce:transition-none"
          >
            {value === option.value && (
              <motion.span
                data-slot="control-segment-indicator"
                aria-hidden="true"
                layoutId="selection"
                initial={false}
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 400, damping: 35 }
                }
                className="pointer-events-none absolute inset-0 z-0 rounded-md border border-surface-rim bg-surface-control shadow-control"
              />
            )}
            <span className="relative z-10 min-w-0 truncate">{option.label}</span>
          </RadioPrimitive.Root>
        ))}
      </RadioGroupPrimitive>
    </LayoutGroup>
  );
}

function Boolean({
  label,
  checked,
  defaultChecked,
  onCheckedChange,
  presentation = "segments",
  disabled,
  className,
  name,
}: BooleanProps) {
  const [local, setLocal] = React.useState(defaultChecked ?? false);
  const current = checked ?? local;
  const id = React.useId();
  const change = (next: boolean) => {
    setLocal(next);
    onCheckedChange?.(next);
  };
  return (
    <div className={cn(rowClass, className)} data-slot="control-boolean">
      <span id={id} className={labelClass}>
        {label}
      </span>
      {presentation === "segments" ? (
        <SegmentedTrack
          id={id}
          options={[
            { value: "off", label: "Off" },
            { value: "on", label: "On" },
          ]}
          value={current ? "on" : "off"}
          onValueChange={(next) => change(next === "on")}
          disabled={disabled}
          name={name}
          className="shrink-0 [&_[role=radio]]:min-w-9"
        />
      ) : (
        <SwitchPrimitive.Root
          aria-labelledby={id}
          checked={current}
          onCheckedChange={change}
          disabled={disabled}
          name={name}
          className="ms-auto inline-flex h-5 w-9 shrink-0 items-center rounded-full bg-surface-well p-0.5 shadow-well outline-none transition-colors data-checked:bg-primary focus-visible:ring-2 focus-visible:ring-ring/60"
        >
          <SwitchPrimitive.Thumb className="size-4 rounded-full bg-surface-control shadow-knob transition-transform duration-200 data-checked:translate-x-4 rtl:data-checked:-translate-x-4 motion-reduce:transition-none" />
        </SwitchPrimitive.Root>
      )}
    </div>
  );
}

type ChoiceProps = CommonProps & {
  options: readonly Option[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  name?: string;
};

function Segmented({
  label,
  options,
  value,
  defaultValue,
  onValueChange,
  disabled,
  className,
  name,
}: ChoiceProps) {
  const id = React.useId();
  const [local, setLocal] = React.useState(defaultValue);
  const current = value ?? local;
  const change = (next: string) => {
    setLocal(next);
    onValueChange?.(next);
  };
  return (
    <div data-slot="control-segmented" className={cn(rowClass, className)}>
      <span id={id} className={labelClass}>
        {label}
      </span>
      <SegmentedTrack
        id={id}
        options={options}
        value={current}
        onValueChange={change}
        disabled={disabled}
        name={name}
        className="max-w-[65%]"
      />
    </div>
  );
}

function Select({
  label,
  options,
  value,
  defaultValue,
  onValueChange,
  disabled,
  className,
  name,
}: ChoiceProps) {
  return (
    <SelectPrimitive.Root
      value={value}
      defaultValue={defaultValue}
      onValueChange={(next) => {
        if (next !== null) onValueChange?.(next);
      }}
      disabled={disabled}
      name={name}
      items={options}
    >
      <SelectPrimitive.Trigger
        data-slot="control-select"
        aria-label={label}
        className={cn(
          rowClass,
          "justify-between outline-none hover:tint-hover data-popup-open:shadow-pressed focus-visible:ring-2 focus-visible:ring-ring/40",
          className,
        )}
      >
        <span className={labelClass}>{label}</span>
        <span className="ms-auto flex min-w-0 items-center gap-2 text-muted-foreground">
          <SelectPrimitive.Value className="truncate text-end text-foreground" />
          <SelectPrimitive.Icon>
            <HugeiconsIcon icon={ChevronDownIcon} className="size-3.5 shrink-0" />
          </SelectPrimitive.Icon>
        </span>
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Portal>
        <SelectPrimitive.Positioner sideOffset={5} align="end" className="z-50">
          <SelectPrimitive.Popup className="min-w-(--anchor-width) origin-(--transform-origin) rounded-lg border border-surface-rim bg-surface-overlay p-1 text-sm shadow-overlay outline-none transition-[opacity,transform] duration-150 data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0 motion-reduce:transition-none">
            <SelectPrimitive.List className="max-h-(--available-height) overflow-auto">
              {options.map((option) => (
                <SelectPrimitive.Item
                  key={option.value}
                  value={option.value}
                  className="flex cursor-default items-center justify-between gap-3 rounded-md px-2.5 py-1.5 outline-none data-highlighted:bg-accent data-highlighted:text-accent-foreground"
                >
                  <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
                  <SelectPrimitive.ItemIndicator>
                    <HugeiconsIcon icon={CheckIcon} className="size-3.5" />
                  </SelectPrimitive.ItemIndicator>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.List>
          </SelectPrimitive.Popup>
        </SelectPrimitive.Positioner>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}

type ColorProps = CommonProps & {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  name?: string;
};

function Color({
  label,
  value,
  defaultValue = "#000000",
  onValueChange,
  disabled,
  className,
  name,
}: ColorProps) {
  const [local, setLocal] = React.useState(defaultValue);
  const [draft, setDraft] = React.useState(value ?? defaultValue);
  const current = value ?? local;
  const id = React.useId();
  React.useEffect(() => setDraft(current), [current]);
  const change = (next: string) => {
    setLocal(next);
    setDraft(next);
    onValueChange?.(next);
  };
  return (
    <div data-slot="control-color" className={cn(rowClass, className)}>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <input
        id={id}
        aria-label={`${label} hex value`}
        disabled={disabled}
        value={draft}
        onChange={(event) => {
          setDraft(event.target.value);
          if (/^#[\da-fA-F]{6}$/.test(event.target.value)) change(event.target.value);
        }}
        className={cn(valueClass, monoClass, "w-20 bg-transparent")}
      />
      <span
        className="relative size-5 shrink-0 overflow-hidden rounded-md border border-surface-rim shadow-knob focus-within:ring-2 focus-within:ring-ring/50"
        style={{ backgroundColor: /^#[\da-fA-F]{6}$/.test(current) ? current : "transparent" }}
      >
        <input
          aria-label={`Pick ${label}`}
          type="color"
          disabled={disabled}
          value={/^#[\da-fA-F]{6}$/.test(current) ? current : "#000000"}
          onChange={(event) => change(event.target.value)}
          className="absolute inset-0 size-full cursor-pointer opacity-0"
        />
      </span>
      {name ? <input type="hidden" name={name} value={current} /> : null}
    </div>
  );
}

type ImageProps = CommonProps & {
  src?: string;
  options?: readonly (Option & { src: string })[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  onFileChange?: (file: File | null) => void;
  accept?: string;
  name?: string;
};

function Image({
  label,
  src,
  options,
  value,
  defaultValue,
  onValueChange,
  onFileChange,
  accept = "image/*",
  disabled,
  className,
  name,
}: ImageProps) {
  const ref = React.useRef<HTMLInputElement>(null);
  const [selectedValue, setSelectedValue] = React.useState(defaultValue ?? options?.[0]?.value);
  const selected = options?.find((option) => option.value === (value ?? selectedValue));
  const preview = selected?.src ?? src;
  return (
    <div data-slot="control-image" className={cn(rowClass, className)}>
      <span className={labelClass}>{label}</span>
      {options?.length ? (
        <SelectPrimitive.Root
          items={options}
          value={value ?? selectedValue}
          onValueChange={(next) => {
            if (next !== null) {
              setSelectedValue(next);
              onValueChange?.(next);
            }
          }}
          disabled={disabled}
          name={name}
        >
          <SelectPrimitive.Trigger
            aria-label={label}
            className="ms-auto flex min-w-0 items-center gap-2 rounded-sm text-sm text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50"
          >
            {preview ? (
              <img alt="" src={preview} className="size-6 rounded-sm object-cover" />
            ) : null}
            <SelectPrimitive.Value className="max-w-24 truncate" />
            <SelectPrimitive.Icon>
              <HugeiconsIcon icon={ChevronDownIcon} className="size-3.5" />
            </SelectPrimitive.Icon>
          </SelectPrimitive.Trigger>
          <SelectPrimitive.Portal>
            <SelectPrimitive.Positioner sideOffset={5} align="end" className="z-50">
              <SelectPrimitive.Popup className="min-w-(--anchor-width) rounded-lg border border-surface-rim bg-surface-overlay p-1 shadow-overlay outline-none">
                <SelectPrimitive.List className="max-h-(--available-height) overflow-auto">
                  {options.map((option) => (
                    <SelectPrimitive.Item
                      key={option.value}
                      value={option.value}
                      className="flex cursor-default items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none data-highlighted:bg-accent data-highlighted:text-accent-foreground"
                    >
                      <img alt="" src={option.src} className="size-6 rounded-sm object-cover" />
                      <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
                      <SelectPrimitive.ItemIndicator className="ms-auto">
                        <HugeiconsIcon icon={CheckIcon} className="size-3.5" />
                      </SelectPrimitive.ItemIndicator>
                    </SelectPrimitive.Item>
                  ))}
                </SelectPrimitive.List>
              </SelectPrimitive.Popup>
            </SelectPrimitive.Positioner>
          </SelectPrimitive.Portal>
        </SelectPrimitive.Root>
      ) : null}
      {onFileChange || !options?.length ? (
        <button
          type="button"
          disabled={disabled}
          aria-label={`Upload ${label}`}
          onClick={() => ref.current?.click()}
          className={cn(
            "flex min-w-0 items-center gap-2 rounded-sm text-sm text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring",
            !options?.length && "ms-auto",
          )}
        >
          {!options?.length && preview ? (
            <img alt="" src={preview} className="size-6 rounded-sm object-cover" />
          ) : (
            <HugeiconsIcon icon={ImagePlusIcon} className="size-4" />
          )}
          {!options?.length ? <span>{preview ? "Change" : "Choose image"}</span> : null}
        </button>
      ) : null}
      <input
        ref={ref}
        type="file"
        name={options?.length ? undefined : name}
        accept={accept}
        disabled={disabled}
        tabIndex={-1}
        className="sr-only"
        onChange={(event) => onFileChange?.(event.target.files?.[0] ?? null)}
      />
    </div>
  );
}

type PadValue = { x: number; y: number };
type PadProps = CommonProps & {
  value?: PadValue;
  defaultValue?: PadValue;
  onValueChange?: (value: PadValue) => void;
  min?: number;
  max?: number;
  step?: number;
};

function Pad({
  label,
  value,
  defaultValue = { x: 0, y: 0 },
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  disabled,
  className,
}: PadProps) {
  const [local, setLocal] = React.useState(defaultValue);
  const current = value ?? local;
  const ref = React.useRef<HTMLDivElement>(null);
  const span = max > min ? max - min : 1;
  const safeStep = step > 0 ? step : 1;
  const change = (next: PadValue) => {
    setLocal(next);
    onValueChange?.(next);
  };
  const fromPointer = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const snap = (fraction: number) =>
      Math.max(min, Math.min(max, min + Math.round((span * fraction) / safeStep) * safeStep));
    change({
      x: snap((event.clientX - rect.left) / rect.width),
      y: snap(1 - (event.clientY - rect.top) / rect.height),
    });
  };
  return (
    <div
      data-slot="control-pad"
      className={cn(
        "rounded-lg border border-surface-rim bg-surface-control p-3 shadow-control",
        className,
      )}
    >
      <div className={cn(labelClass, "mb-2")}>{label}</div>
      <div
        ref={ref}
        aria-hidden="true"
        className="relative h-24 w-full touch-none rounded-md bg-surface-well shadow-well"
        onPointerDown={(event) => {
          if (disabled) return;
          event.currentTarget.setPointerCapture(event.pointerId);
          fromPointer(event);
        }}
        onPointerMove={(event) => {
          if (event.currentTarget.hasPointerCapture(event.pointerId)) fromPointer(event);
        }}
      >
        <span
          className="pointer-events-none absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-surface-rim bg-primary shadow-knob"
          style={{
            left: `${((current.x - min) / span) * 100}%`,
            top: `${100 - ((current.y - min) / span) * 100}%`,
          }}
        />
      </div>
      <div className="mt-1.5 grid grid-cols-2 gap-1.5">
        <ControlNumber
          label="X"
          value={current.x}
          onValueChange={(x) => change({ ...current, x })}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
        />
        <ControlNumber
          label="Y"
          value={current.y}
          onValueChange={(y) => change({ ...current, y })}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
        />
      </div>
    </div>
  );
}

type SpringValue =
  | { type: "spring"; visualDuration: number; bounce: number }
  | { type: "spring"; stiffness: number; damping: number; mass: number };
type EasingValue = { type: "easing"; duration: number; ease: [number, number, number, number] };
type TransitionValue = SpringValue | EasingValue;
type SpringProps = CommonProps & {
  value?: SpringValue;
  defaultValue?: SpringValue;
  onValueChange?: (value: SpringValue) => void;
};
type TransitionProps = CommonProps & {
  value?: TransitionValue;
  defaultValue?: TransitionValue;
  onValueChange?: (value: TransitionValue) => void;
};

const defaultTimeSpring: SpringValue = { type: "spring", visualDuration: 0.3, bounce: 0.2 };
const defaultPhysicsSpring: SpringValue = { type: "spring", stiffness: 200, damping: 25, mass: 1 };
const defaultEasing: EasingValue = { type: "easing", duration: 0.3, ease: [0.25, 0.1, 0.25, 1] };

function springIsTime(
  value: SpringValue,
): value is Extract<SpringValue, { visualDuration: number }> {
  return "visualDuration" in value;
}

function SpringCurve({ value }: { value: SpringValue }) {
  const time = springIsTime(value);
  const stiffness = time ? 200 : value.stiffness;
  const mass = time ? 1 : value.mass;
  const damping = time
    ? 2 * Math.sqrt(stiffness * mass) * (1 - value.bounce * 0.75)
    : value.damping;
  const omega = Math.sqrt(stiffness / mass);
  const ratio = damping / (2 * Math.sqrt(stiffness * mass));
  const duration = time ? Math.max(0.1, value.visualDuration) * 2 : 1.5;
  const points = Array.from({ length: 65 }, (_, index) => {
    const t = (index / 64) * duration;
    const response =
      ratio < 1
        ? 1 -
          Math.exp(-ratio * omega * t) *
            (Math.cos(omega * Math.sqrt(1 - ratio * ratio) * t) +
              (ratio / Math.sqrt(1 - ratio * ratio)) *
                Math.sin(omega * Math.sqrt(1 - ratio * ratio) * t))
        : 1 - (1 + omega * t) * Math.exp(-omega * t);
    return `${index === 0 ? "M" : "L"}${(index / 64) * 100} ${80 - response * 60}`;
  });
  return <CurveFrame path={points.join(" ")} />;
}

function CurveFrame({ path }: { path: string }) {
  return (
    <div
      aria-hidden="true"
      className="h-24 overflow-hidden rounded-lg border border-surface-rim bg-surface-control shadow-control"
    >
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="size-full text-primary">
        <path
          d="M0 20 H100 M0 80 H100"
          stroke="currentColor"
          strokeOpacity="0.12"
          strokeWidth="0.5"
          strokeDasharray="2 2"
        />
        <path
          d={path}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}

function Spring({
  label,
  value,
  defaultValue = defaultTimeSpring,
  onValueChange,
  disabled,
  className,
}: SpringProps) {
  const [local, setLocal] = React.useState<SpringValue>(defaultValue);
  const current = value ?? local;
  const cache = React.useRef({ time: defaultTimeSpring, physics: defaultPhysicsSpring });
  cache.current[springIsTime(current) ? "time" : "physics"] = current;
  const change = (next: SpringValue) => {
    setLocal(next);
    onValueChange?.(next);
  };
  return (
    <Section title={label} className={className}>
      <SpringCurve value={current} />
      <Segmented
        label="Type"
        value={springIsTime(current) ? "time" : "physics"}
        options={[
          { value: "time", label: "Time" },
          { value: "physics", label: "Physics" },
        ]}
        onValueChange={(mode) => change(cache.current[mode === "time" ? "time" : "physics"])}
        disabled={disabled}
      />
      {springIsTime(current) ? (
        <>
          <ControlNumber
            label="Duration"
            value={current.visualDuration}
            onValueChange={(visualDuration) => change({ ...current, visualDuration })}
            min={0.1}
            max={2}
            step={0.01}
            formatValue={(v) => `${v.toFixed(2)} s`}
            disabled={disabled}
          />
          <ControlNumber
            label="Bounce"
            value={current.bounce}
            onValueChange={(bounce) => change({ ...current, bounce })}
            min={0}
            max={1}
            step={0.01}
            disabled={disabled}
          />
        </>
      ) : (
        <>
          <ControlNumber
            label="Stiffness"
            value={current.stiffness}
            onValueChange={(stiffness) => change({ ...current, stiffness })}
            min={1}
            max={1000}
            step={1}
            disabled={disabled}
          />
          <ControlNumber
            label="Damping"
            value={current.damping}
            onValueChange={(damping) => change({ ...current, damping })}
            min={1}
            max={100}
            step={1}
            disabled={disabled}
          />
          <ControlNumber
            label="Mass"
            value={current.mass}
            onValueChange={(mass) => change({ ...current, mass })}
            min={0.1}
            max={10}
            step={0.1}
            disabled={disabled}
          />
        </>
      )}
    </Section>
  );
}

function Transition({
  label,
  value,
  defaultValue = defaultEasing,
  onValueChange,
  disabled,
  className,
}: TransitionProps) {
  const [local, setLocal] = React.useState<TransitionValue>(defaultValue);
  const current = value ?? local;
  const cache = React.useRef<{ easing: EasingValue; time: SpringValue; physics: SpringValue }>({
    easing: defaultEasing,
    time: defaultTimeSpring,
    physics: defaultPhysicsSpring,
  });
  const mode = current.type === "easing" ? "easing" : springIsTime(current) ? "time" : "physics";
  if (current.type === "easing") cache.current.easing = current;
  else if (springIsTime(current)) cache.current.time = current;
  else cache.current.physics = current;
  const change = (next: TransitionValue) => {
    setLocal(next);
    onValueChange?.(next);
  };
  const updateEase = (index: number, next: number) => {
    if (current.type !== "easing") return;
    const ease = [...current.ease] as [number, number, number, number];
    ease[index] = next;
    change({ ...current, ease });
  };
  return (
    <Section title={label} className={className}>
      {current.type === "easing" ? (
        <CurveFrame
          path={`M0 80 C${current.ease[0] * 100} ${80 - current.ease[1] * 60}, ${current.ease[2] * 100} ${80 - current.ease[3] * 60}, 100 20`}
        />
      ) : (
        <SpringCurve value={current} />
      )}
      <Segmented
        label="Type"
        value={mode}
        options={[
          { value: "easing", label: "Easing" },
          { value: "time", label: "Time" },
          { value: "physics", label: "Physics" },
        ]}
        onValueChange={(next) => change(cache.current[next as keyof typeof cache.current])}
        disabled={disabled}
      />
      {current.type === "easing" ? (
        <>
          <ControlNumber
            label="Duration"
            value={current.duration}
            onValueChange={(duration) => change({ ...current, duration })}
            min={0.1}
            max={2}
            step={0.01}
            formatValue={(v) => `${v.toFixed(2)} s`}
            disabled={disabled}
          />
          <div className="grid grid-cols-2 gap-1.5">
            {(["X1", "Y1", "X2", "Y2"] as const).map((axis, index) => (
              <ControlNumber
                key={axis}
                label={axis}
                value={current.ease[index]}
                onValueChange={(next) => updateEase(index, next)}
                min={index % 2 === 0 ? 0 : -1}
                max={index % 2 === 0 ? 1 : 2}
                step={0.01}
                disabled={disabled}
              />
            ))}
          </div>
        </>
      ) : springIsTime(current) ? (
        <>
          <ControlNumber
            label="Duration"
            value={current.visualDuration}
            onValueChange={(visualDuration) => change({ ...current, visualDuration })}
            min={0.1}
            max={2}
            step={0.01}
            disabled={disabled}
          />
          <ControlNumber
            label="Bounce"
            value={current.bounce}
            onValueChange={(bounce) => change({ ...current, bounce })}
            min={0}
            max={1}
            step={0.01}
            disabled={disabled}
          />
        </>
      ) : (
        <>
          <ControlNumber
            label="Stiffness"
            value={current.stiffness}
            onValueChange={(stiffness) => change({ ...current, stiffness })}
            min={1}
            max={1000}
            step={1}
            disabled={disabled}
          />
          <ControlNumber
            label="Damping"
            value={current.damping}
            onValueChange={(damping) => change({ ...current, damping })}
            min={1}
            max={100}
            step={1}
            disabled={disabled}
          />
          <ControlNumber
            label="Mass"
            value={current.mass}
            onValueChange={(mass) => change({ ...current, mass })}
            min={0.1}
            max={10}
            step={0.1}
            disabled={disabled}
          />
        </>
      )}
    </Section>
  );
}

type ActionProps = CommonProps & Omit<React.ComponentProps<"button">, "children" | "disabled">;
function Action({ label, disabled, className, ...props }: ActionProps) {
  return (
    <button
      type="button"
      data-slot="control-action"
      disabled={disabled}
      className={cn(
        rowClass,
        "justify-center font-medium outline-none hover:tint-hover active:shadow-pressed focus-visible:ring-2 focus-visible:ring-ring/40",
        className,
      )}
      {...props}
    >
      {label}
    </button>
  );
}

type SectionProps = {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
};
function Section({
  title,
  children,
  defaultOpen = true,
  open,
  onOpenChange,
  className,
}: SectionProps) {
  return (
    <Collapsible
      data-slot="control-section"
      defaultOpen={defaultOpen}
      open={open}
      onOpenChange={onOpenChange}
      className={cn("w-full min-w-0", className)}
    >
      <Separator fade={false} className="mb-2" />
      <CollapsibleTrigger className="group/section flex w-full items-center justify-between text-start text-sm font-medium text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/40">
        {title}
        <HugeiconsIcon
          icon={ChevronDownIcon}
          aria-hidden="true"
          className="size-4 -rotate-90 transition-transform duration-200 group-data-panel-open/section:rotate-0 motion-reduce:transition-none"
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="data-open:overflow-visible">
        <Separator fade={false} className="mt-2" />
        <Group className="py-2">{children}</Group>
      </CollapsibleContent>
    </Collapsible>
  );
}

const Control = {
  Group,
  Row,
  Number: ControlNumber,
  Text,
  Textarea,
  Boolean,
  Segmented,
  Select,
  Color,
  Image,
  Pad,
  Spring,
  Transition,
  Action,
  Section,
};

export { Control };
export type {
  NumberProps,
  TextProps,
  TextareaProps,
  BooleanProps,
  ChoiceProps,
  ColorProps,
  ImageProps,
  PadProps,
  SpringProps,
  TransitionProps,
  SpringValue,
  EasingValue,
  TransitionValue,
  SectionProps,
};
