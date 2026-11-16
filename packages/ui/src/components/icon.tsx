import { iconDefinitions } from "@erbium/icons";
import type { IconName } from "@erbium/icons";
import * as React from "react";
import { cn } from "../lib/utils";

// An empty URL points `<use>` at symbols in the current document (`IconSprite`).
const IconSpriteContext = React.createContext("");

interface IconSpriteProviderProps {
  children?: React.ReactNode;
  /** Same-origin URL of the `@erbium/icons/sprite.svg` file. Icons inside reference it instead of an inline sprite. */
  href: string;
}

/**
 * Draws icons from a sprite file the browser can cache instead of the inline `IconSprite` sheet.
 * Use it when the app serves `@erbium/icons/sprite.svg` from its own origin.
 */
const IconSpriteProvider = ({ children, href }: IconSpriteProviderProps) => (
  <IconSpriteContext.Provider value={href}>{children}</IconSpriteContext.Provider>
);

type IconProps = Omit<React.ComponentProps<"svg">, "children" | "dangerouslySetInnerHTML"> & {
  name: IconName;
};

const Icon = ({ name, className, ...props }: IconProps) => {
  const spriteHref = React.useContext(IconSpriteContext);
  const { id, viewBox } = iconDefinitions[name];

  // Size comes from width/height attributes so a parent's
  // `[&_svg:not([class*='size-'])]:size-*` rule can resize the icon.
  // A loading skeleton takes the icon's radius, so `rounded-full` draws it as a dot instead of a
  // square; `overflow-visible` keeps that radius from clipping the glyph itself.
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width={16}
      height={16}
      data-slot="icon"
      {...props}
      viewBox={viewBox}
      className={cn("shrink-0 overflow-visible rounded-full", className)}
    >
      <use href={`${spriteHref}#${id}`} />
    </svg>
  );
};

export { Icon, IconSpriteProvider };

export type { IconProps, IconSpriteProviderProps };
