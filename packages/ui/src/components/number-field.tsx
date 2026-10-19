import * as React from "react";
import { Icon } from "./icon";
import { NumberField as NumberFieldPrimitive } from "@base-ui/react/number-field";
import { useReducedMotion } from "motion/react";
import { FieldLabel } from "./field";
import { TextMorph } from "./text-morph";
import { cn } from "../lib/utils";

/** Reasons that mean the person typed the text, so it must show as typed. */
const typedReasons = new Set<NumberFieldPrimitive.Root.ChangeEventReason>([
  "input-change",
  "input-clear",
  "input-paste",
]);

/** Keys Base UI turns into a new value rather than an edit of the text. */
const stepKeys = new Set(["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End"]);

interface Grouping {
  group: string;
  digits: string[];
  format: (digits: bigint) => string;
}

/** The locale's group separator and digits, and a formatter that groups whole numbers. */
function createGrouping(
  locale: Intl.LocalesArgument,
  format: Intl.NumberFormatOptions | undefined,
): Grouping | null {
  if (format?.useGrouping === false || format?.notation) {
    return null;
  }

  const formatter = new Intl.NumberFormat(locale, {
    maximumFractionDigits: 0,
    useGrouping: format?.useGrouping ?? true,
  });

  const group = formatter.formatToParts(1_234_567).find((part) => part.type === "group")?.value;

  if (!group) {
    return null;
  }

  const digits = Array.from({ length: 10 }, (_, digit) => formatter.format(digit));

  return { digits, format: (value) => formatter.format(value), group };
}

/**
 * Regroups the integer digits of typed text, the way Base UI would on blur, and
 * keeps the caret after the same digit. Prefixes, suffixes, and the fraction are
 * left as typed. Returns null when there is nothing to change.
 */
function regroup(text: string, caret: number, grouping: Grouping) {
  const digitOf = (character: string) => {
    const localeDigit = grouping.digits.indexOf(character);

    return localeDigit === -1
      ? "0123456789".includes(character)
        ? Number(character)
        : -1
      : localeDigit;
  };

  const start = [...text].findIndex((character) => digitOf(character) !== -1);

  if (start === -1) {
    return null;
  }

  let end = start;

  while (end < text.length && (digitOf(text[end]) !== -1 || text[end] === grouping.group)) {
    end++;
  }

  // Character-wise string ops rather than `Array.from`: spreading or
  // converting a string is flagged by typescript/no-misused-spread.
  const digits = text
    .slice(start, end)
    .replaceAll(grouping.group, "")
    .replaceAll(/./gu, (character) => `${digitOf(character)}`);

  // A leading zero is mid-edit ("0.5", "05"); grouping would swallow it.
  if (digits.length > 1 && digits.startsWith("0")) {
    return null;
  }

  const next = text.slice(0, start) + grouping.format(BigInt(digits)) + text.slice(end);

  if (next === text) {
    return null;
  }

  // Count of non-grouping characters before the caret.
  const kept = text.slice(0, caret).replaceAll(grouping.group, "").length;

  let position = 0;

  for (let count = 0; position < next.length && count < kept; position++) {
    if (next[position] !== grouping.group) {
      count++;
    }
  }

  return { caret: position, text: next };
}

interface NumberFieldContextValue {
  fieldId: string;
  /** True while the person edits the text; their edits never animate. */
  typing: boolean;
  setTyping: (typing: boolean) => void;
  /** Morph values that change by stepping, scrubbing, or from outside. */
  animated: boolean;
  grouping: Grouping | null;
}

const NumberFieldContext = React.createContext<NumberFieldContextValue | null>(null);

function useNumberFieldContext(part: string) {
  const context = React.useContext(NumberFieldContext);

  if (!context) {
    throw new Error(`${part} must be used within NumberField.`);
  }

  return context;
}

type NumberFieldProps = NumberFieldPrimitive.Root.Props & {
  size?: "sm" | "default" | "lg";
  animated?: boolean;
  /** Regroup digits as they are typed, instead of only once the field blurs. */
  groupWhileTyping?: boolean;
};

function NumberField({
  id,
  className,
  size = "default",
  animated = true,
  groupWhileTyping = true,
  format,
  locale,
  onValueChange,
  ...props
}: NumberFieldProps) {
  const generatedId = React.useId();
  const fieldId = id ?? generatedId;
  const [typing, setTyping] = React.useState(false);
  // `format` is usually an inline object, so key the grouping on its contents.
  const formatKey = format ? JSON.stringify(format) : "";

  const grouping = React.useMemo(
    () =>
      groupWhileTyping
        ? createGrouping(locale, formatKey ? JSON.parse(formatKey) : undefined)
        : null,
    [groupWhileTyping, locale, formatKey],
  );

  const context = React.useMemo(
    () => ({ animated, fieldId, grouping, setTyping, typing }),
    [fieldId, typing, animated, grouping],
  );

  return (
    <NumberFieldContext.Provider value={context}>
      <NumberFieldPrimitive.Root
        id={fieldId}
        data-slot="number-field"
        data-size={size}
        className={cn(
          "group/number-field flex w-full min-w-0 flex-col items-start gap-related",
          className,
        )}
        format={format}
        locale={locale}
        onValueChange={(value, details) => {
          setTyping(typedReasons.has(details.reason));
          onValueChange?.(value, details);
        }}
        {...props}
      />
    </NumberFieldContext.Provider>
  );
}

function NumberFieldGroup({ className, ...props }: NumberFieldPrimitive.Group.Props) {
  return (
    <NumberFieldPrimitive.Group
      data-slot="number-field-group"
      className={cn(
        "relative flex min-h-control control-adaptive w-full min-w-0 items-stretch rounded-lg border surface-field text-field text-foreground tabular-nums transition-[color,background-color,box-shadow] duration-150 group-data-[size=lg]/number-field:min-h-control-lg group-data-[size=sm]/number-field:min-h-control-sm motion-reduce:transition-none has-aria-invalid:border-error has-aria-invalid:ring-[1.5px] has-aria-invalid:ring-invalid-halo data-disabled:pointer-events-none data-disabled:opacity-50 dark:has-aria-invalid:border-invalid [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    />
  );
}

const stepperClass =
  "relative flex shrink-0 cursor-pointer items-center justify-center px-2 text-muted-foreground transition-colors duration-150 outline-none group-data-[size=sm]/number-field:px-1.5 hover:bg-foreground/5 hover:text-foreground focus-visible:bg-foreground/5 data-disabled:pointer-events-none data-disabled:opacity-50 motion-reduce:transition-none pointer-coarse:after:absolute pointer-coarse:after:size-full pointer-coarse:after:min-h-11 pointer-coarse:after:min-w-11";

function NumberFieldDecrement({
  className,
  children,
  ...props
}: NumberFieldPrimitive.Decrement.Props) {
  return (
    <NumberFieldPrimitive.Decrement
      data-slot="number-field-decrement"
      className={cn(stepperClass, "rounded-s-[calc(var(--radius-lg)-1px)]", className)}
      {...props}
    >
      {children ?? <Icon name="minus-sign" aria-hidden />}
    </NumberFieldPrimitive.Decrement>
  );
}

function NumberFieldIncrement({
  className,
  children,
  ...props
}: NumberFieldPrimitive.Increment.Props) {
  return (
    <NumberFieldPrimitive.Increment
      data-slot="number-field-increment"
      className={cn(stepperClass, "rounded-e-[calc(var(--radius-lg)-1px)]", className)}
      {...props}
    >
      {children ?? <Icon name="plus-sign" aria-hidden />}
    </NumberFieldPrimitive.Increment>
  );
}

const layerClass =
  "pointer-events-none absolute inset-0 content-center overflow-hidden px-2.5 whitespace-pre group-data-[size=sm]/number-field:px-2";

type NumberFieldInputProps = Omit<NumberFieldPrimitive.Input.Props, "className" | "render"> & {
  /** Styles the text box. Alignment and font reach both the input and its morph. */
  className?: string;
};

function NumberFieldInput({
  className,
  onBlur,
  onChange,
  onCompositionEnd,
  onCompositionStart,
  onKeyDown,
  onPointerDown,
  onScroll,
  ...props
}: NumberFieldInputProps) {
  const { typing, setTyping, animated, grouping } = useNumberFieldContext("NumberFieldInput");
  const [composing, setComposing] = React.useState(false);
  const textRef = React.useRef<HTMLSpanElement>(null);
  const morphRef = React.useRef<HTMLSpanElement>(null);

  return (
    <NumberFieldPrimitive.Input
      data-slot="number-field-input"
      onChange={(event) => {
        // Runs before Base UI's own handler, which then reads the regrouped text.
        const input = event.currentTarget;
        const composing = (event.nativeEvent as InputEvent).isComposing;

        const next =
          grouping && !composing && input.selectionStart !== null
            ? regroup(input.value, input.selectionStart, grouping)
            : null;

        if (next) {
          input.value = next.text;
          input.setSelectionRange(next.caret, next.caret);
        }

        // Also covers partial text, like a lone "-", that Base UI can't parse yet.
        setTyping(true);
        onChange?.(event);
      }}
      onPointerDown={(event) => {
        // Placing the caret or selecting needs the real glyphs under the pointer.
        setTyping(true);
        onPointerDown?.(event);
      }}
      onKeyDown={(event) => {
        setTyping(!stepKeys.has(event.key));
        onKeyDown?.(event);
      }}
      onBlur={(event) => {
        setTyping(false);
        onBlur?.(event);
      }}
      onCompositionStart={(event) => {
        setComposing(true);
        onCompositionStart?.(event);
      }}
      onCompositionEnd={(event) => {
        setComposing(false);
        onCompositionEnd?.(event);
      }}
      onScroll={(event) => {
        // Each layer is its own clipped scroller; mirroring keeps it on the caret.
        for (const layer of [textRef.current, morphRef.current]) {
          if (layer) {
            layer.scrollLeft = event.currentTarget.scrollLeft;
          }
        }

        onScroll?.(event);
      }}
      render={(inputProps, state) => (
        <NumberFieldInputLayers
          inputProps={inputProps}
          value={state.inputValue}
          typing={typing}
          composing={composing}
          animated={animated}
          className={className}
          textRef={textRef}
          morphRef={morphRef}
        />
      )}
      {...props}
    />
  );
}

/**
 * An <input> places its text about a pixel off from the same text in any other
 * element, so the visible text is always drawn by these layers and the input
 * only supplies the caret, selection, and editing. Plain text shows at rest and
 * while typing; the morph layer takes over only while a value animates, where
 * its slightly different glyph spacing is lost in the motion.
 */
function NumberFieldInputLayers({
  inputProps,
  value,
  typing,
  composing,
  animated,
  className,
  textRef,
  morphRef,
}: {
  inputProps: React.ComponentPropsWithRef<"input">;
  value: string;
  typing: boolean;
  composing: boolean;
  animated: boolean;
  className?: string;
  textRef: React.Ref<HTMLSpanElement>;
  morphRef: React.Ref<HTMLSpanElement>;
}) {
  const reducedMotion = useReducedMotion();
  const [shownValue, setShownValue] = React.useState(value);
  const [morphing, setMorphing] = React.useState(false);

  // Decided while rendering, so the plain layer never paints a new value first.
  if (value !== shownValue) {
    setShownValue(value);
    setMorphing(animated && !reducedMotion && !typing);
  }

  React.useEffect(() => {
    if (!morphing) {
      return;
    }

    // In case the morph never reports back, e.g. text torph left unanimated.
    const timeout = window.setTimeout(() => {
      setMorphing(false);
    }, 1000);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [morphing, value]);

  return (
    <span
      data-slot="number-field-input-wrapper"
      data-typing={typing || undefined}
      data-morphing={morphing || undefined}
      data-composing={composing || undefined}
      className={cn("group/number-field-input relative flex min-w-0 grow text-center", className)}
    >
      <span
        ref={textRef}
        aria-hidden="true"
        data-slot="number-field-text"
        className={cn(
          layerClass,
          "group-data-composing/number-field-input:invisible group-data-morphing/number-field-input:invisible",
        )}
      >
        {value}
      </span>
      <span
        ref={morphRef}
        aria-hidden="true"
        data-slot="number-field-display"
        className={cn(
          layerClass,
          "invisible group-data-morphing/number-field-input:visible group-data-composing/number-field-input:invisible",
        )}
      >
        <TextMorph
          disabled={!animated}
          onAnimationComplete={() => {
            setMorphing(false);
          }}
        >
          {value}
        </TextMorph>
      </span>
      <input
        {...inputProps}
        className={cn(
          // Composition text isn't in Base UI's value yet, so it shows natively.
          "relative size-full min-w-0 bg-transparent px-2.5 text-transparent caret-foreground outline-none [text-align:inherit] placeholder:text-muted-foreground selection:bg-ring/25 group-data-composing/number-field-input:text-foreground group-data-[size=sm]/number-field:px-2",
          inputProps.className,
        )}
      />
    </span>
  );
}

function NumberFieldScrubArea({
  className,
  label,
  ...props
}: NumberFieldPrimitive.ScrubArea.Props & { label: string }) {
  const { fieldId } = useNumberFieldContext("NumberFieldScrubArea");

  return (
    <NumberFieldPrimitive.ScrubArea
      data-slot="number-field-scrub-area"
      className={cn("flex cursor-ew-resize", className)}
      {...props}
    >
      <FieldLabel htmlFor={fieldId} className="cursor-ew-resize">
        {label}
      </FieldLabel>
      <NumberFieldPrimitive.ScrubAreaCursor className="drop-shadow-[0_1px_1px_var(--cursor-shadow)]">
        <svg
          aria-hidden="true"
          width="26"
          height="14"
          viewBox="0 0 24 14"
          fill="var(--color-cursor-fill)"
          stroke="var(--color-cursor-stroke)"
        >
          <path d="M19.5 5.5L6.49737 5.51844V2L1 6.9999L6.5 12L6.49737 8.5L19.5 8.5V12L25 6.9999L19.5 2V5.5Z" />
        </svg>
      </NumberFieldPrimitive.ScrubAreaCursor>
    </NumberFieldPrimitive.ScrubArea>
  );
}

export {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
  NumberFieldScrubArea,
};

export type { NumberFieldInputProps, NumberFieldProps };
