import { iconDefinitions } from "@erbium/icons";
import type { IconName } from "@erbium/icons";
import type { ComponentProps } from "react";
import { cn } from "../lib/utils";

type IconProps = Omit<ComponentProps<"svg">, "children" | "dangerouslySetInnerHTML"> & {
  name: IconName;
};

function Icon({ name, className, ...props }: IconProps) {
  const { id, viewBox } = iconDefinitions[name];
  // Size comes from width/height attributes so a parent's
  // `[&_svg:not([class*='size-'])]:size-*` rule can resize the icon.
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width={16}
      height={16}
      data-slot="icon"
      {...props}
      viewBox={viewBox}
      className={cn("shrink-0", className)}
    >
      <use href={`#${id}`} />
    </svg>
  );
}

export { Icon };
export type { IconProps };
