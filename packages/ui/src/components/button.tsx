import * as React from "react";
import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { useMergedRefs } from "@base-ui/utils/useMergedRefs";
import { useHotkey } from "@tanstack/react-hotkeys";
import type { RegisterableHotkey } from "@tanstack/react-hotkeys";
import type { VariantProps } from "class-variance-authority";
import { toAriaKeyShortcuts, useHotkeyPlatform } from "../lib/hotkeys";
import { skeletonBlock } from "../lib/skeleton-hints";
import { cn } from "../lib/utils";
import { buttonVariants } from "../lib/button-variants";
import { Kbd, KbdHint } from "./kbd";
import { Spinner } from "./spinner";

type ButtonSize = NonNullable<VariantProps<typeof buttonVariants>["size"]>;

/* Spinners follow the control's icon size rather than the control height. */
const spinnerSizes = {
  default: "sm",
  icon: "sm",
  "icon-lg": "default",
  "icon-sm": "xs",
  "icon-xs": "xs",
  lg: "default",
  sm: "xs",
  xs: "xs",
} as const satisfies Record<ButtonSize, NonNullable<React.ComponentProps<typeof Spinner>["size"]>>;

interface ButtonHotkeyContextValue {
  hotkey: RegisterableHotkey | undefined;
  /** Counts mounted `ButtonShortcut`s; while one labels the shortcut, the hint stays hidden. */
  setLabelCount: React.Dispatch<React.SetStateAction<number>>;
}

/* The button's hotkey, so a `ButtonShortcut` inside it labels the same binding. */
const ButtonHotkeyContext = React.createContext<ButtonHotkeyContextValue | null>(null);

type ButtonProps = ButtonPrimitive.Props &
  VariantProps<typeof buttonVariants> & {
    loading?: boolean;
    /**
     * A shortcut that clicks the button while it is mounted, enabled and not loading. While the
     * user holds one of its modifiers, a badge shows it on the top end corner of the button,
     * unless a `ButtonShortcut` already labels it. Sets `aria-keyshortcuts` for chords.
     */
    hotkey?: RegisterableHotkey;
  };

const Button = ({
  children,
  className,
  disabled,
  focusableWhenDisabled,
  hotkey,
  loading = false,
  variant = "default",
  size = "default",
  "aria-busy": ariaBusy,
  "aria-keyshortcuts": ariaKeyShortcuts,
  ref,
  ...props
}: ButtonProps) => {
  const iconOnly = size?.startsWith("icon") ?? false;
  const spinnerSize = size === null ? "default" : spinnerSizes[size];
  const inactive = disabled === true || loading;
  const buttonRef = React.useRef<HTMLElement>(null);
  const mergedRef = useMergedRefs(ref, buttonRef);
  const platform = useHotkeyPlatform();
  const [labelCount, setLabelCount] = React.useState(0);
  const hotkeyContext = React.useMemo(() => ({ hotkey, setLabelCount }), [hotkey]);
  // Names the registration for devtools and shortcut lists.
  const name = props["aria-label"] ?? props.title;

  // Clicking the element runs the consumer's onClick, a form submit, or a rendered link.
  useHotkey(
    hotkey,
    () => {
      buttonRef.current?.click();
    },
    { enabled: !inactive, meta: name === undefined ? undefined : { name } },
  );

  return (
    <ButtonHotkeyContext.Provider value={hotkeyContext}>
      <ButtonPrimitive
        data-slot="button"
        {...skeletonBlock}
        data-size={size}
        data-variant={variant}
        data-loading={loading ? "" : undefined}
        aria-busy={loading || ariaBusy === true}
        aria-keyshortcuts={ariaKeyShortcuts ?? toAriaKeyShortcuts(hotkey, platform)}
        disabled={inactive}
        focusableWhenDisabled={loading || focusableWhenDisabled === true}
        className={cn(
          buttonVariants({ size, variant }),
          hotkey !== undefined && "relative",
          className,
        )}
        ref={mergedRef}
        {...props}
      >
        {loading && (
          <Spinner
            aria-hidden
            data-icon={iconOnly ? undefined : "inline-start"}
            size={spinnerSize}
          />
        )}
        {loading && iconOnly ? null : children}
        {labelCount === 0 && <KbdHint hotkey={hotkey} />}
      </ButtonPrimitive>
    </ButtonHotkeyContext.Provider>
  );
};

/** Labels a shortcut inside a button. Without `hotkey`, it labels the hotkey of its button. */
const ButtonShortcut = ({ className, hotkey, ...props }: React.ComponentProps<typeof Kbd>) => {
  const buttonHotkey = React.useContext(ButtonHotkeyContext);
  const setLabelCount = buttonHotkey?.setLabelCount;

  React.useLayoutEffect(() => {
    setLabelCount?.((count) => count + 1);

    return () => {
      setLabelCount?.((count) => count - 1);
    };
  }, [setLabelCount]);

  return (
    <span
      data-slot="button-shortcut"
      className="ms-1.5 -me-(--button-shortcut-inset) inline-flex shrink-0"
    >
      <Kbd
        aria-hidden
        hotkey={hotkey ?? buttonHotkey?.hotkey}
        className={cn(
          "group-data-[size=xs]/button:h-4 group-data-[size=xs]/button:min-w-4 group-data-[size=xs]/button:text-control-sm",
          className,
        )}
        {...props}
      />
    </span>
  );
};

export { Button, ButtonShortcut };

export { buttonVariants } from "../lib/button-variants";
