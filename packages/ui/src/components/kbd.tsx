import * as React from "react";
import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip";
import { normalizeHotkey, useFormatForDisplay, useHotkeyHint } from "@tanstack/react-hotkeys";
import type { DisplayHotkey, RegisterableHotkey } from "@tanstack/react-hotkeys";
import { useHotkeyPlatform } from "../lib/hotkeys";
import { kbdClassName } from "../lib/kbd-styles";
import { skeletonBlock } from "../lib/skeleton-hints";
import { cn } from "../lib/utils";
import { Badge } from "./badge";

type KbdProps = React.ComponentProps<"kbd"> & {
  hotkey?: DisplayHotkey;
  useSymbols?: boolean;
};

const isShortcutText = (value: React.ReactNode): value is string => typeof value === "string";

const Kbd = ({ className, hotkey, useSymbols = true, children, ...props }: KbdProps) => {
  const platform = useHotkeyPlatform();
  // Fills in the provider's platform and, in Chromium, the user's keyboard layout, so a
  // physical binding such as `[KeyW]` reads `Z` on an AZERTY keyboard.
  const formatForDisplay = useFormatForDisplay();

  const binding =
    hotkey ?? (isShortcutText(children) ? normalizeHotkey(children, platform) : undefined);

  return (
    <kbd
      data-slot="kbd"
      {...skeletonBlock}
      dir="ltr"
      className={cn(kbdClassName, className)}
      {...props}
    >
      {binding === undefined ? children : formatForDisplay(binding, { platform, useSymbols })}
    </kbd>
  );
};

type KbdHintProps = Pick<
  TooltipPrimitive.Positioner.Props,
  "align" | "alignOffset" | "side" | "sideOffset"
> & {
  className?: string;
  /** The registered hotkey to reveal. A hotkey that nothing registers never shows. */
  hotkey: RegisterableHotkey | null | undefined;
  /** Show only while every modifier of the hotkey is held, not any one of them. */
  exact?: boolean;
  useSymbols?: boolean;
};

/**
 * A shortcut badge outside its container, shown only while the user holds a modifier of a hotkey
 * that can fire right now. Hotkeys in a suspended scope, such as page shortcuts behind an open
 * dialog, and hotkeys without a modifier never show. The container needs `position: relative`.
 *
 * The badge is anchored with Base UI's positioner rather than drawn inside the container: it
 * never covers the container's content, flips and shifts at viewport edges, and renders in a
 * portal, so `overflow: hidden` ancestors such as button groups do not clip it. It is centred
 * above the container by default, so badges of adjacent controls do not run into each other;
 * `side` and `align` are logical and follow the reading direction (`align="end"` sits on the
 * top right in LTR and the top left in RTL).
 */
const KbdHint = ({
  className,
  hotkey,
  exact = false,
  side = "top",
  align = "center",
  sideOffset = 4,
  alignOffset = 0,
  useSymbols = true,
}: KbdHintProps) => {
  const visible = useHotkeyHint(hotkey, { exact });
  const [anchor, setAnchor] = React.useState<HTMLSpanElement | null>(null);
  const platform = useHotkeyPlatform();
  const formatForDisplay = useFormatForDisplay();

  if (hotkey === null || hotkey === undefined) {
    return null;
  }

  return (
    <>
      {/* Covers the container, so the positioner anchors to it without a ref from the parent. */}
      <span
        ref={setAnchor}
        aria-hidden
        data-slot="kbd-hint-anchor"
        className="pointer-events-none absolute inset-0"
      />
      <TooltipPrimitive.Root open={visible}>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Positioner
            anchor={anchor}
            side={side}
            align={align}
            sideOffset={sideOffset}
            alignOffset={alignOffset}
            className="pointer-events-none isolate z-50"
          >
            <TooltipPrimitive.Popup
              aria-hidden
              data-slot="kbd-hint"
              className={cn(
                "origin-(--transform-origin) transition-[opacity,scale] duration-100 data-ending-style:scale-90 data-ending-style:opacity-0 data-starting-style:scale-90 data-starting-style:opacity-0 motion-reduce:transition-none",
                className,
              )}
            >
              <Badge variant="outline" className="font-sans shadow-sm" render={<kbd dir="ltr" />}>
                {formatForDisplay(hotkey, { platform, useSymbols })}
              </Badge>
            </TooltipPrimitive.Popup>
          </TooltipPrimitive.Positioner>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </>
  );
};

export { Kbd, KbdHint };
