import { iconDefinitions } from "@erbium/icons";
import type { IconName } from "@erbium/icons";
import type { ComponentProps } from "react";
import { cn } from "../lib/utils";

type IconProps = Omit<ComponentProps<"svg">, "children" | "dangerouslySetInnerHTML"> & {
  name: IconName;
};

function Icon({ name, className, ...props }: IconProps) {
  const { id, viewBox } = iconDefinitions[name];
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      data-slot="icon"
      {...props}
      viewBox={viewBox}
      className={cn("size-4 shrink-0", className)}
    >
      <use href={`#${id}`} />
    </svg>
  );
}

export { Icon };
export type { IconProps };
