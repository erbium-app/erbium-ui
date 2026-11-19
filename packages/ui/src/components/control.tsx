import * as React from "react";
import { Icon } from "./icon";
import { RotatingChevron } from "./stateful-icon";
import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { Field as FieldPrimitive } from "@base-ui/react/field";
import { Input as InputPrimitive } from "@base-ui/react/input";
import { mergeProps } from "@base-ui/react/merge-props";
import { Radio as RadioPrimitive } from "@base-ui/react/radio";
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group";
import { Select as SelectPrimitive } from "@base-ui/react/select";
import { Switch as SwitchPrimitive } from "@base-ui/react/switch";
import { Slider as SliderPrimitive } from "@erbium-ui/react/slider";
import {
  decimalPlaces,
  getSliderAxis,
  isLinear,
  positionOf,
  snapValue,
} from "@erbium-ui/react/slider/core";
import type { SliderAxis, SliderScaleOption } from "@erbium-ui/react/slider/core";
import { animate, domMax, LazyMotion, useReducedMotion } from "motion/react";
import type { AnimationPlaybackControls } from "motion/react";
import * as m from "motion/react-m";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./collapsible";
import { Separator } from "./separator";
import { ScrollArea } from "./scroll-area";
import { TextMorph } from "./text-morph";
import { cn } from "../lib/utils";
import type { CSSVariableStyle } from "../lib/utils";

const rowClass =
  "group/control relative flex control-size w-full min-w-0 items-center rounded-lg border surface-control text-control-sm text-foreground transition-[background-color,box-shadow] duration-150 motion-reduce:transition-none has-[:disabled]:opacity-50 has-[[data-disabled]]:opacity-50";

const labelClass = "min-w-0 shrink-0 truncate text-control text-muted-foreground";

const valueClass =
  "ms-auto min-w-0 flex-1 text-end text-field text-foreground outline-none placeholder:text-muted-foreground";

const monoClass = "font-mono tabular-nums";

// A segmented track sits 2px inside the row, so its 18px segments plus the track's
// own 2px padding fill the row's content box without growing it.
const segmentedRowClass = "py-0.5 pe-0.5";

interface CommonProps {
  label: string;
  disabled?: boolean;
  className?: string;
}

interface Option {
  value: string;
  label: string;
}

// Group, Section

const Group = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div
    data-slot="control-group"
    className={cn("flex w-full min-w-0 flex-col gap-1.5", className)}
    {...props}
  />
);

interface SectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

const Section = ({
  title,
  children,
  defaultOpen = true,
  open,
  onOpenChange,
  className,
}: SectionProps) => (
  <Collapsible
    data-slot="control-section"
    defaultOpen={defaultOpen}
    open={open}
    onOpenChange={onOpenChange}
    className={cn("w-full min-w-0", className)}
  >
    <Separator className="mb-2" />
    <CollapsibleTrigger className="group group/section flex w-full items-center justify-between text-start text-control text-muted-foreground outline-none hover:text-foreground">
      {title}
      <RotatingChevron scope="collapsible" className="size-4" />
    </CollapsibleTrigger>
    <CollapsibleContent className="data-open:overflow-visible">
      <Group className="py-2">{children}</Group>
    </CollapsibleContent>
  </Collapsible>
);

// Row

interface RowContextValue {
  label: string;
  /** The id of the row's label, for `aria-labelledby`. */
  labelId: string;
}

const RowContext = React.createContext<RowContextValue | null>(null);

/** The label of the surrounding `Control.Row`, for parts composed inside it. */
const useControlRow = (part: string) => {
  const row = React.use(RowContext);

  if (row === null) {
    throw new Error(`<${part}> must be inside <Control.Row>.`);
  }

  return row;
};

type RowProps = React.ComponentProps<"div"> & { label: string };

/**
 * A labelled row. Compose any content after the label; parts such as `Control.ImageSelect`
 * read the label from it, so they are named without extra props.
 */
const Row = ({ label, className, children, ...props }: RowProps) => {
  const labelId = React.useId();
  const row = React.useMemo(() => ({ label, labelId }), [label, labelId]);

  return (
    <RowContext value={row}>
      <div data-slot="control-row" className={cn(rowClass, className)} {...props}>
        <span id={labelId} className={labelClass}>
          {label}
        </span>
        {children}
      </div>
    </RowContext>
  );
};

// Segments

interface SegmentsProps {
  options: readonly Option[];
  value?: string | undefined;
  defaultValue?: string | undefined;
  onValueChange?: ((value: string) => void) | undefined;
  disabled?: boolean | undefined;
  name?: string | undefined;
  className?: string | undefined;
}

const segmentTransition = { damping: 35, stiffness: 400, type: "spring" } as const;

/** A radio group drawn as segments, labelled by its row. The selection slides between them. */
const Segments = ({ options, className, onValueChange, ...props }: SegmentsProps) => {
  const { labelId } = useControlRow("Control.Segments");
  const layoutId = React.useId();
  const shouldReduceMotion = useReducedMotion();

  return (
    <LazyMotion features={domMax}>
      <RadioGroupPrimitive
        aria-labelledby={labelId}
        onValueChange={onValueChange}
        className={cn(
          "relative isolate ms-auto flex min-w-0 self-stretch rounded-md surface-well p-0.5",
          className,
        )}
        {...props}
      >
        {options.map((option) => (
          <RadioPrimitive.Root
            key={option.value}
            value={option.value}
            className="relative flex min-w-0 items-center justify-center rounded-sm px-2 text-center text-control-sm text-muted-foreground transition-colors duration-150 outline-none hover:text-foreground motion-reduce:transition-none data-checked:text-foreground"
            render={(radioProps, state) => (
              <span {...radioProps}>
                {state.checked ? (
                  <m.span
                    data-slot="control-segment-indicator"
                    aria-hidden="true"
                    layoutId={layoutId}
                    initial={false}
                    transition={shouldReduceMotion === true ? { duration: 0 } : segmentTransition}
                    className="pointer-events-none absolute inset-0 z-0 rounded-sm border surface-control"
                  />
                ) : null}
                <span className="relative z-10 min-w-0 truncate">{option.label}</span>
              </span>
            )}
          />
        ))}
      </RadioGroupPrimitive>
    </LazyMotion>
  );
};

type ChoiceProps = CommonProps & {
  options: readonly Option[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  name?: string;
};

const Segmented = ({ label, className, ...props }: ChoiceProps) => (
  <Row data-slot="control-segmented" label={label} className={cn(segmentedRowClass, className)}>
    <Segments className="max-w-[65%]" {...props} />
  </Row>
);

// On/off

interface CheckedProps extends CommonProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  name?: string;
}

const onOff: readonly Option[] = [
  { label: "Off", value: "off" },
  { label: "On", value: "on" },
];

const toOnOff = (checked: boolean) => (checked ? "on" : "off");

/** An Off/On pair of segments. Use `Control.Switch` for a compact switch. */
const Toggle = ({
  label,
  checked,
  defaultChecked = false,
  onCheckedChange,
  className,
  ...props
}: CheckedProps) => (
  <Row data-slot="control-toggle" label={label} className={cn(segmentedRowClass, className)}>
    <Segments
      options={onOff}
      value={checked === undefined ? undefined : toOnOff(checked)}
      defaultValue={toOnOff(defaultChecked)}
      onValueChange={(next) => onCheckedChange?.(next === "on")}
      className="shrink-0 **:[[role=radio]]:min-w-9"
      {...props}
    />
  </Row>
);

const SwitchPart = (props: Omit<CheckedProps, "label" | "className">) => {
  const { labelId } = useControlRow("Control.Switch");

  return (
    <SwitchPrimitive.Root
      aria-labelledby={labelId}
      className="ms-auto inline-flex h-5 w-9 shrink-0 items-center rounded-full surface-well p-0.5 transition-colors outline-none data-checked:bg-selection"
      {...props}
    >
      <SwitchPrimitive.Thumb className="size-4 rounded-full surface-knob transition-transform duration-200 motion-reduce:transition-none data-checked:translate-x-4 rtl:data-checked:-translate-x-4" />
    </SwitchPrimitive.Root>
  );
};

const Switch = ({ label, className, ...props }: CheckedProps) => (
  <Row data-slot="control-switch" label={label} className={className}>
    <SwitchPart {...props} />
  </Row>
);

// Text

type TextProps = CommonProps &
  Omit<
    React.ComponentProps<"input">,
    "type" | "onChange" | "value" | "defaultValue" | "disabled"
  > & {
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
  };

// `Field.Label` names the control through `htmlFor`. Its overlay covers the row, so a
// click anywhere on the row focuses the control; the control sits above the overlay.
const rowLabelClass = "after:absolute after:inset-0 after:rounded-lg";

const Text = ({
  label,
  value,
  defaultValue,
  onValueChange,
  disabled,
  className,
  ...props
}: TextProps) => (
  // Field tracks the control's dirty, touched and invalid state.
  <FieldPrimitive.Root
    data-slot="control-text"
    disabled={disabled}
    className={cn(rowClass, className)}
  >
    <FieldPrimitive.Label className={cn(labelClass, rowLabelClass)}>{label}</FieldPrimitive.Label>
    <InputPrimitive
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      className={cn(valueClass, "relative self-stretch bg-transparent")}
      {...props}
    />
  </FieldPrimitive.Root>
);

type TextareaProps = CommonProps &
  Omit<React.ComponentProps<"textarea">, "onChange" | "value" | "defaultValue" | "disabled"> & {
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
  };

/**
 * Base UI has no textarea part, so `Field.Control` renders the `<textarea>` (the
 * same pattern as the shared `Textarea`): value, disabled, name and id go to the
 * control so the Field tracks it, the rest merge onto the element.
 */
const Textarea = ({
  label,
  value,
  defaultValue,
  onValueChange,
  disabled,
  className,
  ...props
}: TextareaProps) => (
  <FieldPrimitive.Root
    data-slot="control-textarea"
    disabled={disabled}
    className={cn(rowClass, "items-start", className)}
  >
    <FieldPrimitive.Label className={cn(labelClass, rowLabelClass)}>{label}</FieldPrimitive.Label>
    <FieldPrimitive.Control
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      id={props.id}
      name={props.name}
      render={(defaultProps: React.ComponentProps<"textarea">) => (
        <textarea
          rows={1}
          className={cn(
            valueClass,
            "relative field-sizing-content max-h-40 min-h-5 resize-none bg-transparent",
          )}
          {...mergeProps(defaultProps, props)}
        />
      )}
    />
  </FieldPrimitive.Root>
);

// Number

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

const prefersReducedMotion = () => window.matchMedia?.(REDUCED_MOTION_QUERY).matches;

/** How far a pointer has travelled past either horizontal edge of `bounds`. */
const overflowPast = (x: number, bounds: DOMRect) => {
  if (x < bounds.left) {
    return x - bounds.left;
  }

  if (x > bounds.right) {
    return x - bounds.right;
  }

  return 0;
};

/**
 * Drags past either end of the row stretch its surface a few pixels, and it springs back on
 * release. `scrubbing` is true once the pointer has moved, so the value tracks the hand.
 */
const useElasticScrub = () => {
  const surfaceRef = React.useRef<HTMLDivElement>(null);
  const pointerRef = React.useRef<{ x: number; y: number; bounds: DOMRect } | null>(null);
  const stretchRef = React.useRef(0);
  const settleRef = React.useRef<AnimationPlaybackControls | null>(null);
  const [scrubbing, setScrubbing] = React.useState(false);

  React.useEffect(() => () => settleRef.current?.stop(), []);

  // A transform, so the stretch never lays the row out again.
  const stretch = (pixels: number) => {
    stretchRef.current = pixels;
    const surface = surfaceRef.current;

    if (surface === null) {
      return;
    }

    surface.style.transformOrigin = pixels > 0 ? "left" : "right";
    surface.style.scale = pixels === 0 ? "" : `${1 + Math.abs(pixels) / surface.offsetWidth} 1`;
  };

  const release = () => {
    if (pointerRef.current === null) {
      return;
    }

    pointerRef.current = null;
    setScrubbing(false);

    if (stretchRef.current === 0 || prefersReducedMotion()) {
      stretch(0);

      return;
    }

    settleRef.current = animate(stretchRef.current, 0, {
      damping: 26,
      onUpdate: stretch,
      stiffness: 360,
      type: "spring",
    });
  };

  const handlers = {
    onLostPointerCapture: release,
    onPointerCancel: release,
    onPointerDown: (event: React.PointerEvent<HTMLDivElement>) => {
      if (event.button !== 0) {
        return;
      }

      settleRef.current?.stop();
      pointerRef.current = {
        bounds: event.currentTarget.getBoundingClientRect(),
        x: event.clientX,
        y: event.clientY,
      };
    },
    onPointerMove: (event: React.PointerEvent<HTMLDivElement>) => {
      const pointer = pointerRef.current;

      if (!pointer || Math.hypot(event.clientX - pointer.x, event.clientY - pointer.y) <= 3) {
        return;
      }

      setScrubbing(true);

      const overflow = overflowPast(event.clientX, pointer.bounds);
      const distance = Math.max(0, Math.abs(overflow) - 32);

      stretch(
        prefersReducedMotion()
          ? 0
          : Math.sign(overflow) * 8 * Math.sqrt(Math.min(distance / 200, 1)),
      );
    },
    onPointerUp: release,
  };

  return { handlers, scrubbing, surfaceRef };
};

/** Shows a value at the precision its axis allows. */
const formatAxisValue = (value: number, axis: SliderAxis) => {
  if (axis.steps.length > 0) {
    return String(value);
  }

  if (axis.step !== undefined && axis.step > 0) {
    return value.toFixed(decimalPlaces(axis.step));
  }

  return String(Number(value.toPrecision(4)));
};

// Marks, fill and handle share one mapping: 4px in from each edge of the row.
const handleStyle: CSSVariableStyle = {
  "--control-number-offset": "calc(4px + var(--control-number-position) * (100% - 8px))",
};

const markStyle: CSSVariableStyle = {
  "--control-number-mark": "calc(4px + var(--slider-mark-position) * (100% - 8px))",
};

interface NumberSurfaceProps {
  ref: React.Ref<HTMLDivElement>;
  /** The current value, whose mark is highlighted. */
  value: number;
}

const NumberSurface = ({ ref, value }: NumberSurfaceProps) => (
  <div
    ref={ref}
    aria-hidden="true"
    data-slot="control-number-surface"
    className="pointer-events-none absolute inset-0 rounded-lg border surface-control"
  >
    <div className="absolute -inset-px overflow-hidden rounded-[inherit]">
      <div
        data-slot="control-number-fill"
        className="absolute inset-0 origin-left scale-x-(--control-number-position) bg-foreground/8 transition-[background-color,scale] duration-300 ease-ui-out group-hover/number:bg-foreground/12 group-data-scrubbing/number:duration-0 motion-reduce:transition-none rtl:origin-right dark:bg-foreground/12 dark:group-hover/number:bg-foreground/16"
      />
      <SliderPrimitive.Marks>
        {(mark) => (
          <SliderPrimitive.Mark
            mark={mark}
            data-slot="control-number-step"
            data-active={mark.value === value || undefined}
            className="absolute inset-s-(--control-number-mark) top-1/2 size-1.25 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground/35 transition-[background-color,scale] duration-150 motion-reduce:transition-none rtl:translate-x-1/2 data-active:scale-125 data-active:bg-foreground/80"
            style={markStyle}
          />
        )}
      </SliderPrimitive.Marks>
    </div>
    <div
      data-slot="control-number-handle"
      className="absolute inset-y-0 inset-s-0 w-full translate-x-(--control-number-offset) transition-[translate] duration-300 ease-ui-out group-data-scrubbing/number:duration-0 motion-reduce:transition-none rtl:-translate-x-(--control-number-offset)"
      style={handleStyle}
    >
      <div className="absolute inset-s-0 top-1/2 h-5 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground/70 opacity-0 transition-opacity duration-150 group-hover/number:opacity-70 group-data-scrubbing/number:opacity-100 motion-reduce:transition-none rtl:translate-x-1/2" />
    </div>
  </div>
);

interface NumberValueProps {
  label: string;
  /** The value as shown. */
  text: string;
  value: number;
  disabled: boolean | undefined;
  scrubbing: boolean;
  onCommit: (value: number) => void;
}

/** The value at the end of the row. Clicking it opens an input for an exact number. */
const NumberValue = ({ label, text, value, disabled, scrubbing, onCommit }: NumberValueProps) => {
  // The typed text while editing; null when the value shows.
  const [draft, setDraft] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const editing = draft !== null;

  React.useEffect(() => {
    if (editing) {
      inputRef.current?.select();
    }
  }, [editing]);

  const commit = () => {
    const typed = draft?.trim() ?? "";
    const parsed = Number(typed);

    if (typed !== "" && Number.isFinite(parsed)) {
      onCommit(parsed);
    }

    setDraft(null);
  };

  return (
    <>
      {editing ? (
        <InputPrimitive
          ref={inputRef}
          aria-label={`${label} value`}
          className={cn(
            "absolute inset-e-2.5 top-1/2 z-30 w-20 -translate-y-1/2 border-b border-ring bg-surface-control text-end text-field outline-none",
            monoClass,
          )}
          inputMode="decimal"
          value={draft}
          onValueChange={setDraft}
          onBlur={commit}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              commit();
            }

            if (event.key === "Escape") {
              event.preventDefault();
              setDraft(null);
            }
          }}
        />
      ) : null}
      {/* Stays mounted under the editor, so a committed value morphs from the old one. */}
      <ButtonPrimitive
        disabled={disabled}
        aria-label={`Edit ${label} value`}
        className={cn(
          "absolute inset-e-2.5 top-1/2 z-20 -translate-y-1/2 rounded-sm px-0.5 text-control text-muted-foreground hover:text-foreground",
          monoClass,
          editing && "invisible",
        )}
        onClick={() => {
          setDraft(String(value));
        }}
      >
        {/* A drag changes the value every frame, so it tracks the hand; jumps morph. */}
        <TextMorph disabled={scrubbing}>{text}</TextMorph>
      </ButtonPrimitive>
    </>
  );
};

type NumberProps = CommonProps & {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  onValueCommitted?: (value: number) => void;
  min?: number;
  max?: number;
  /** The grid values snap to. Defaults to 1 on a linear row; a fine step drags almost freely. */
  step?: number;
  /** Allowed values, including uneven intervals. Replaces `min`, `max` and `step`. */
  steps?: readonly number[];
  /**
   * How values spread along the row: `"linear"` (default), `"log"` for ranges that
   * span orders of magnitude (needs `min > 0`), or a custom `{ toPosition, toValue }`.
   */
  scale?: SliderScaleOption;
  /** Dots for each allowed value: each of `steps`, or each step of a grid of ten or fewer. */
  marks?: boolean;
  formatValue?: (value: number) => string;
  name?: string;
};

/**
 * A slider drawn as a full-width row: drag anywhere on it, use the arrow keys, or click the
 * value to type an exact number. Steps, scales and marks come from `@erbium-ui/react/slider`.
 */
const ControlNumber = ({
  label,
  value,
  defaultValue,
  onValueChange,
  onValueCommitted,
  min,
  max,
  step: stepOption,
  steps,
  scale,
  marks,
  formatValue,
  disabled,
  className,
  name,
}: NumberProps) => {
  const step = stepOption ?? (isLinear(scale) ? 1 : undefined);

  const axis = React.useMemo(
    () => getSliderAxis({ max, min, scale, step, steps }),
    [max, min, scale, step, steps],
  );

  const [localValue, setLocalValue] = React.useState(defaultValue ?? axis.lower);
  const current = value ?? localValue;
  const text = formatValue?.(current) ?? formatAxisValue(current, axis);
  const labelId = React.useId();
  const { handlers, scrubbing, surfaceRef } = useElasticScrub();

  const change = (next: number) => {
    setLocalValue(next);
    onValueChange?.(next);
  };

  const position: CSSVariableStyle = {
    "--control-number-position": String(positionOf(axis, current)),
  };

  return (
    <SliderPrimitive.Root
      data-slot="control-number"
      data-scrubbing={scrubbing || undefined}
      aria-labelledby={labelId}
      className={cn(
        "group/number relative block min-h-control w-full min-w-0 data-disabled:opacity-50",
        className,
      )}
      style={position}
      disabled={disabled}
      min={min}
      max={max}
      step={step}
      steps={steps}
      scale={scale}
      marks={marks}
      name={name}
      value={current}
      onValueChange={change}
      onValueCommitted={onValueCommitted}
    >
      <NumberSurface ref={surfaceRef} value={current} />
      <SliderPrimitive.Control
        className="absolute inset-0 z-10 flex cursor-ew-resize touch-none items-center rounded-lg outline-none select-none"
        {...(disabled === true ? {} : handlers)}
      >
        <SliderPrimitive.Track className="relative h-full w-full rounded-lg">
          <SliderPrimitive.Thumb
            aria-label={label}
            getAriaValueText={() => text}
            className="absolute top-1/2 size-5 rounded-full outline-none"
          />
        </SliderPrimitive.Track>
      </SliderPrimitive.Control>
      <span
        id={labelId}
        aria-hidden="true"
        className={cn(
          labelClass,
          "pointer-events-none absolute inset-s-2.5 top-1/2 z-20 max-w-[55%] -translate-y-1/2",
        )}
      >
        {label}
      </span>
      <NumberValue
        label={label}
        text={text}
        value={current}
        disabled={disabled}
        scrubbing={scrubbing}
        onCommit={(typed) => {
          const next = snapValue(axis, typed);

          change(next);
          onValueCommitted?.(next);
        }}
      />
    </SliderPrimitive.Root>
  );
};

// Select

/** The shared popup for Select and ImageSelect: portal, positioner, and scrollable list. */
const OptionsPopup = ({
  className,
  children,
}: {
  className: string;
  children: React.ReactNode;
}) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Positioner sideOffset={5} align="end" className="z-50">
      <SelectPrimitive.Popup className={className}>
        <ScrollArea
          className="min-h-0 overscroll-contain"
          fade="vertical"
          scrollbar="thin"
          viewportRole="listbox"
          viewportRender={<SelectPrimitive.List />}
          contentClassName="p-1 in-data-has-overflow-y:pe-3"
        >
          {children}
        </ScrollArea>
      </SelectPrimitive.Popup>
    </SelectPrimitive.Positioner>
  </SelectPrimitive.Portal>
);

const Select = ({
  label,
  options,
  value,
  defaultValue,
  onValueChange,
  disabled,
  className,
  name,
}: ChoiceProps) => (
  <SelectPrimitive.Root
    value={value}
    defaultValue={defaultValue}
    onValueChange={(next) => {
      if (next !== null) {
        onValueChange?.(next);
      }
    }}
    disabled={disabled}
    name={name}
    items={options}
  >
    <SelectPrimitive.Trigger
      data-slot="control-select"
      aria-label={label}
      className={cn(rowClass, "group group/control-select justify-between outline-none", className)}
    >
      <span className={labelClass}>{label}</span>
      <span className="ms-auto flex min-w-0 items-center gap-related text-muted-foreground">
        <SelectPrimitive.Value className="truncate text-end text-foreground" />
        <SelectPrimitive.Icon>
          <RotatingChevron className="size-3.5" />
        </SelectPrimitive.Icon>
      </span>
    </SelectPrimitive.Trigger>
    <OptionsPopup className="flex max-h-(--available-height) min-w-(--anchor-width) origin-(--transform-origin) flex-col overflow-hidden rounded-lg surface-overlay text-control transition-[opacity,transform] duration-150 outline-none data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0 motion-reduce:transition-none">
      {options.map((option) => (
        <SelectPrimitive.Item
          key={option.value}
          value={option.value}
          className="flex cursor-default items-center justify-between gap-3 rounded-md px-2.5 py-1.5 outline-none data-highlighted:bg-accent data-highlighted:text-accent-foreground"
        >
          <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
          <SelectPrimitive.ItemIndicator>
            <Icon name="check" className="size-3.5" />
          </SelectPrimitive.ItemIndicator>
        </SelectPrimitive.Item>
      ))}
    </OptionsPopup>
  </SelectPrimitive.Root>
);

// Image

const ImagePreview = ({ src }: { src: string }) => (
  <span className="image-hairline size-5 shrink-0 overflow-hidden rounded-sm">
    <img alt="" src={src} className="size-full object-cover" />
  </span>
);

interface ImageOption extends Option {
  src: string;
}

interface ImageSelectProps {
  options: readonly ImageOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  name?: string;
}

/** Picks one of a set of images, shown with its preview. Goes inside `Control.Row`. */
const ImageSelect = ({
  options,
  value,
  defaultValue,
  onValueChange,
  disabled,
  name,
}: ImageSelectProps) => {
  const { label } = useControlRow("Control.ImageSelect");
  const [first] = options;

  return (
    <SelectPrimitive.Root
      items={options}
      value={value}
      defaultValue={defaultValue ?? first?.value}
      onValueChange={(next) => {
        if (next !== null) {
          onValueChange?.(next);
        }
      }}
      disabled={disabled}
      name={name}
    >
      <SelectPrimitive.Trigger
        data-slot="control-image-select"
        aria-label={label}
        className="group group/control-select ms-auto flex min-w-0 items-center gap-related rounded-sm text-control text-muted-foreground outline-none hover:text-foreground"
      >
        <SelectPrimitive.Value className="flex min-w-0 items-center gap-related">
          {(selected: string | null) => {
            const option = options.find((candidate) => candidate.value === selected);

            return option === undefined ? null : (
              <>
                <ImagePreview src={option.src} />
                <span className="max-w-24 truncate">{option.label}</span>
              </>
            );
          }}
        </SelectPrimitive.Value>
        <SelectPrimitive.Icon>
          <RotatingChevron className="size-3.5" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
      <OptionsPopup className="flex max-h-(--available-height) min-w-(--anchor-width) flex-col overflow-hidden rounded-lg surface-overlay outline-none">
        {options.map((option) => (
          <SelectPrimitive.Item
            key={option.value}
            value={option.value}
            className="flex cursor-default items-center gap-related rounded-md px-2 py-1.5 text-control outline-none data-highlighted:bg-accent data-highlighted:text-accent-foreground"
          >
            <ImagePreview src={option.src} />
            <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
            <SelectPrimitive.ItemIndicator className="ms-auto">
              <Icon name="check" className="size-3.5" />
            </SelectPrimitive.ItemIndicator>
          </SelectPrimitive.Item>
        ))}
      </OptionsPopup>
    </SelectPrimitive.Root>
  );
};

interface ImageUploadProps {
  /** The current image, shown before the children. */
  src?: string;
  onFileChange?: (file: File | null) => void;
  accept?: string;
  disabled?: boolean;
  name?: string;
  /** Text after the image or icon, such as "Change". Omit for an icon button. */
  children?: React.ReactNode;
}

/** Opens the file picker. Goes inside `Control.Row`, alone or after `Control.ImageSelect`. */
const ImageUpload = ({
  src,
  onFileChange,
  accept = "image/*",
  disabled,
  name,
  children,
}: ImageUploadProps) => {
  const { label } = useControlRow("Control.ImageUpload");
  const inputRef = React.useRef<HTMLInputElement>(null);

  const pick = (event: React.ChangeEvent<HTMLInputElement>) => {
    const [file = null] = event.target.files ?? [];

    onFileChange?.(file);
  };

  return (
    <>
      <ButtonPrimitive
        data-slot="control-image-upload"
        disabled={disabled}
        aria-label={`Upload ${label}`}
        onClick={() => inputRef.current?.click()}
        className="ms-auto flex min-w-0 items-center gap-related rounded-sm text-control text-muted-foreground hover:text-foreground [[data-slot=control-image-select]~&]:ms-2"
      >
        {src === undefined || src === "" ? (
          <Icon name="image-plus" className="size-4" />
        ) : (
          <ImagePreview src={src} />
        )}
        {children === undefined ? null : <span>{children}</span>}
      </ButtonPrimitive>
      <input
        ref={inputRef}
        type="file"
        name={name}
        accept={accept}
        disabled={disabled}
        tabIndex={-1}
        className="sr-only"
        onChange={pick}
      />
    </>
  );
};

// Action

type ActionProps = CommonProps & Omit<React.ComponentProps<"button">, "children" | "disabled">;

const Action = ({ label, disabled, className, ...props }: ActionProps) => (
  <ButtonPrimitive
    data-slot="control-action"
    disabled={disabled}
    className={cn(rowClass, "justify-center font-medium outline-none", className)}
    {...props}
  >
    {label}
  </ButtonPrimitive>
);

const Control = {
  Number: ControlNumber,
  Action,
  Group,
  ImageSelect,
  ImageUpload,
  Row,
  Section,
  Segmented,
  Select,
  Switch,
  Text,
  Textarea,
  Toggle,
};

export { Control };

export type {
  ActionProps,
  CheckedProps,
  ChoiceProps,
  ImageOption,
  ImageSelectProps,
  ImageUploadProps,
  NumberProps,
  RowProps,
  SectionProps,
  TextareaProps,
  TextProps,
};
