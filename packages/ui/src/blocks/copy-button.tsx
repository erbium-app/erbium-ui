import { useRender } from "@base-ui/react/use-render";
import { mergeProps } from "@base-ui/react/merge-props";
import { HugeiconsIcon } from "@hugeicons/react";
import CopySvg from "@hugeicons/core-free-icons/CopyIcon";
import CheckIcon from "@hugeicons/core-free-icons/CheckIcon";
import type { ComponentProps } from "react";
import { Button } from "../components/button";
import { StatefulIcon } from "../components/stateful-icon";
import { useCopyToClipboard } from "../hooks/use-copy-to-clipboard";

type CopyIconProps = {
  copied: boolean;
  className?: string;
  "data-icon"?: "inline-start" | "inline-end";
};

function CopyIcon({ copied, ...props }: CopyIconProps) {
  return (
    <StatefulIcon
      {...props}
      state={copied ? "copied" : "idle"}
      icons={{ idle: <HugeiconsIcon icon={CopySvg} />, copied: <HugeiconsIcon icon={CheckIcon} /> }}
    />
  );
}

type CopyButtonState = { copied: boolean; pending: boolean };
type CopyButtonProps = Omit<ComponentProps<"button">, "onCopy" | "value"> &
  Pick<ComponentProps<typeof Button>, "variant" | "size" | "loading" | "focusableWhenDisabled"> & {
    value: string;
    timeout?: number;
    onCopied?: () => void;
    onError?: (error: unknown) => void;
    successMessage?: string;
    errorMessage?: string;
    render?: useRender.RenderProp<CopyButtonState>;
  };

function CopyButton({
  value,
  timeout,
  onCopied,
  onError,
  successMessage = "Copied to clipboard.",
  errorMessage = "Unable to copy. Please try again.",
  render,
  children,
  onClick,
  disabled,
  ...props
}: CopyButtonProps) {
  const { copyToClipboard, isCopied, isPending, error } = useCopyToClipboard({
    timeout,
    onCopy: onCopied,
    onError,
  });
  const state = { copied: isCopied, pending: isPending };
  const element = useRender({
    defaultTagName: "button",
    render: render ?? <Button />,
    state,
    props: mergeProps<"button">(
      {
        type: "button",
        "aria-label": "Copy",
        "aria-busy": isPending,
        children: children ?? <CopyIcon copied={isCopied} />,
        onClick(event) {
          if (!event.defaultPrevented && !disabled && !isPending) void copyToClipboard(value);
        },
      },
      { ...(!render ? { variant: "ghost", size: "icon" } : {}), ...props, disabled, onClick },
    ),
  });

  return (
    <>
      {element}
      <span className="sr-only" role="status" aria-atomic="true">
        {error ? errorMessage : isCopied ? successMessage : ""}
      </span>
    </>
  );
}

export { CopyButton, CopyIcon };
export type { CopyButtonProps, CopyButtonState, CopyIconProps };
