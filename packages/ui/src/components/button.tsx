import * as React from "react";
import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { useMergedRefs } from "@base-ui/utils/useMergedRefs";
import { useFormatForAria, useHotkey } from "@tanstack/react-hotkeys";
import type { RegisterableHotkey } from "@tanstack/react-hotkeys";
import type { AnyRouter, RegisteredRouter } from "@tanstack/react-router";
import type { VariantProps } from "class-variance-authority";
import { skeletonBlock } from "../lib/skeleton-hints";
import { cn } from "../lib/utils";
import { buttonVariants } from "../lib/button-variants";
import { Kbd, KbdHint } from "./kbd";
import { hasLinkTarget, TargetLink } from "./link";
import type { AnyLinkTargetProps, HrefTargetProps, LinkTargetProps, NoTargetProps } from "./link";
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

const ButtonHotkeyContext = React.createContext<RegisterableHotkey | undefined>(undefined);

interface ButtonOwnProps extends VariantProps<typeof buttonVariants> {
  /**
   * A shortcut that clicks the button while it is mounted, enabled and not loading. While the
   * user holds one of its modifiers, a badge shows it above the button,
   * unless a `ButtonShortcut` already labels it. Sets `aria-keyshortcuts` while the
   * shortcut can fire.
   */
  hotkey?: RegisterableHotkey;
}

type ButtonProps = ButtonPrimitive.Props &
  NoTargetProps &
  ButtonOwnProps & {
    loading?: boolean;
  };

// A link styled as a button. Its children are plain content, so the hotkey badge can follow.
type ButtonLinkProps = (AnyLinkTargetProps | HrefTargetProps) &
  ButtonOwnProps & { children?: React.ReactNode };

/* Clicks the control on its hotkey while it is enabled, and names the registration for
   devtools and shortcut lists. */
const useButtonHotkey = (
  hotkey: RegisterableHotkey | undefined,
  enabled: boolean,
  name: string | undefined,
) => {
  const ref = React.useRef<HTMLElement>(null);
  const formatForAria = useFormatForAria();

  // Clicking the element runs the consumer's onClick, a form submit, or the link.
  useHotkey(
    hotkey,
    () => {
      ref.current?.click();
    },
    { enabled, meta: name === undefined ? undefined : { name } },
  );

  // The formatter also announces keys that another control holds, so check this one is enabled.
  return { ariaKeyShortcuts: enabled ? formatForAria(hotkey) : undefined, ref };
};

const hotkeyClassName =
  "relative has-[[data-slot=button-shortcut]]:[&>[data-slot=kbd-hint-anchor]]:hidden";

/**
 * A link that looks like a button. It keeps the link role, which a Base UI `Button` would
 * replace with `role="button"`.
 */
const ButtonLink = ({
  className,
  hotkey,
  variant = "default",
  size = "default",
  children,
  ...target
}: ButtonLinkProps) => (
  <TargetLink
    data-slot="button"
    data-size={size}
    data-variant={variant}
    className={cn(
      buttonVariants({ size, variant }),
      hotkey !== undefined && hotkeyClassName,
      className,
    )}
    {...target}
  >
    {children}
    {hotkey !== undefined && <KbdHint hotkey={hotkey} />}
  </TargetLink>
);

const HotkeyButtonLink = ({
  "aria-keyshortcuts": ariaKeyShortcuts,
  ref,
  ...props
}: ButtonLinkProps) => {
  const binding = useButtonHotkey(
    props.hotkey,
    !("disabled" in props && props.disabled === true),
    props["aria-label"] ?? props.title,
  );

  return (
    <ButtonHotkeyContext.Provider value={props.hotkey}>
      <ButtonLink
        {...props}
        aria-keyshortcuts={ariaKeyShortcuts ?? binding.ariaKeyShortcuts}
        ref={useMergedRefs(ref, binding.ref)}
      />
    </ButtonHotkeyContext.Provider>
  );
};

const ButtonElement = ({
  children,
  className,
  disabled,
  focusableWhenDisabled,
  hotkey,
  loading = false,
  variant = "default",
  size = "default",
  "aria-busy": ariaBusy,
  ...props
}: ButtonProps) => {
  const iconOnly = size?.startsWith("icon") ?? false;
  const spinnerSize = size === null ? "default" : spinnerSizes[size];

  return (
    <ButtonPrimitive
      data-slot="button"
      {...skeletonBlock}
      data-size={size}
      data-variant={variant}
      data-loading={loading ? "" : undefined}
      aria-busy={loading || ariaBusy === true}
      disabled={disabled === true || loading}
      focusableWhenDisabled={loading || focusableWhenDisabled === true}
      className={cn(
        buttonVariants({ size, variant }),
        // KbdHint hides its badge when Base UI marks the anchor hidden.
        hotkey !== undefined && hotkeyClassName,
        className,
      )}
      {...props}
    >
      {loading && (
        <Spinner aria-hidden data-icon={iconOnly ? undefined : "inline-start"} size={spinnerSize} />
      )}
      {loading && iconOnly ? null : children}
      {hotkey !== undefined && <KbdHint hotkey={hotkey} />}
    </ButtonPrimitive>
  );
};

const HotkeyButtonElement = ({
  "aria-keyshortcuts": ariaKeyShortcuts,
  ref,
  ...props
}: ButtonProps) => {
  const binding = useButtonHotkey(
    props.hotkey,
    props.disabled !== true && props.loading !== true,
    props["aria-label"] ?? props.title,
  );

  return (
    <ButtonHotkeyContext.Provider value={props.hotkey}>
      <ButtonElement
        {...props}
        aria-keyshortcuts={ariaKeyShortcuts ?? binding.ariaKeyShortcuts}
        ref={useMergedRefs(ref, binding.ref)}
      />
    </ButtonHotkeyContext.Provider>
  );
};

/**
 * A button. Given Router's link options it is a link that looks like a button: `to` names a
 * route, which preloads ahead of the click, and `href` a fully built or external URL.
 */
function Button<
  TRouter extends AnyRouter = RegisteredRouter,
  const TFrom extends string = string,
  const TTo extends string | undefined = undefined,
  const TMaskFrom extends string = TFrom,
  const TMaskTo extends string = "",
>(
  props: (
    | (LinkTargetProps<TRouter, TFrom, TTo, TMaskFrom, TMaskTo> & { to: string })
    | HrefTargetProps
  ) &
    ButtonOwnProps & { children?: React.ReactNode },
): React.ReactElement;

// The button signature comes last, so `ComponentProps<typeof Button>` reads a button's props.
function Button(props: ButtonProps): React.ReactElement;

function Button(props: ButtonProps | ButtonLinkProps) {
  // Only a button given `hotkey` registers and follows shortcuts, so the others never re-render
  // for them. Testing the prop's presence keeps the element mounted while its value comes and goes.
  const bound = "hotkey" in props;

  if (hasLinkTarget(props)) {
    return bound ? <HotkeyButtonLink {...props} /> : <ButtonLink {...props} />;
  }

  return bound ? <HotkeyButtonElement {...props} /> : <ButtonElement {...props} />;
}

/** Labels a shortcut inside a button. Without `hotkey`, it labels the hotkey of its button. */
const ButtonShortcut = ({ className, hotkey, ...props }: React.ComponentProps<typeof Kbd>) => {
  const buttonHotkey = React.useContext(ButtonHotkeyContext);

  return (
    <span
      data-slot="button-shortcut"
      className="ms-1.5 -me-(--button-shortcut-inset) inline-flex shrink-0"
    >
      <Kbd
        aria-hidden
        hotkey={hotkey ?? buttonHotkey}
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
