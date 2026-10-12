import { useRender } from "@base-ui/react/use-render";
import { mergeProps } from "@base-ui/react/merge-props";
import { Icon } from "../components/icon";
import { createContext, use, useEffect, useRef } from "react";
import type { ComponentProps } from "react";
import { Button } from "../components/button";
import { StatefulIcon } from "../components/stateful-icon";
import { useCopyToClipboard } from "../hooks/use-copy-to-clipboard";
import type { CopyToClipboardValue } from "../hooks/use-copy-to-clipboard";

type CopyButtonState = {
  copied: boolean;
  pending: boolean;
  status: "idle" | "copied" | "error";
  revision: number;
};
const CopyButtonContext = createContext<CopyButtonState | null>(null);
function useCopyButtonState() {
  const state = use(CopyButtonContext);
  if (!state) throw new Error("Copy button content must be inside CopyButton.");
  return state;
}

type CopyButtonProps = Omit<ComponentProps<"button">, "onCopy" | "value"> &
  Pick<ComponentProps<typeof Button>, "variant" | "size" | "loading" | "focusableWhenDisabled"> & {
    /** Fetch content on demand while using the same pending, success and error lifecycle. */
    value: CopyToClipboardValue;
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
  loading,
  ...props
}: CopyButtonProps) {
  const clipboard = useCopyToClipboard({ timeout, onCopy: onCopied, onError });
  const { reset } = clipboard;
  const previousValue = useRef(value);
  useEffect(() => {
    if (previousValue.current !== value) {
      previousValue.current = value;
      reset();
    }
  }, [value, reset]);
  const state = {
    copied: clipboard.isCopied,
    pending: clipboard.isPending,
    status: clipboard.status,
    revision: clipboard.revision,
  };
  const element = useRender({
    defaultTagName: "button",
    render: render ?? <Button />,
    state,
    props: {
      ...mergeProps<"button">(
        {
          type: "button",
          "aria-label": children == null ? "Copy" : undefined,
          "aria-busy": state.pending,
          children: children ?? <CopyButtonIcon />,
          onClick(event) {
            if (!event.defaultPrevented && !disabled && !loading)
              void clipboard.copyToClipboard(value);
          },
        },
        { ...props, disabled, onClick },
      ),
      ...(!render
        ? {
            variant: props.variant ?? "ghost",
            size: props.size ?? (children == null ? "icon" : "default"),
          }
        : {}),
      loading: loading || state.pending,
    },
  });
  return (
    <CopyButtonContext value={state}>
      {element}
      <span className="sr-only" role="status" aria-atomic="true">
        <span key={state.revision}>
          {state.status === "error" ? errorMessage : state.copied ? successMessage : ""}
        </span>
      </span>
    </CopyButtonContext>
  );
}

function CopyButtonIcon(
  props: Omit<ComponentProps<typeof StatefulIcon>, "state" | "icons" | "labels">,
) {
  const { status } = useCopyButtonState();
  return (
    <StatefulIcon
      {...props}
      state={status}
      icons={{
        idle: <Icon name="copy" />,
        copied: <Icon name="check" />,
        error: <Icon name="cancel-01" />,
      }}
    />
  );
}
function CopyButtonLabel({ children, className, ...props }: ComponentProps<"span">) {
  return (
    <span
      {...props}
      data-slot="copy-button-label"
      className={["inline-grid items-center justify-items-center", className]
        .filter(Boolean)
        .join(" ")}
    >
      {children ?? (
        <>
          <CopyButtonLabelIdle />
          <CopyButtonLabelCopied />
          <CopyButtonLabelError />
        </>
      )}
    </span>
  );
}
function CopyLabelState({
  state,
  children,
  className,
  ...props
}: ComponentProps<"span"> & { state: CopyButtonState["status"] }) {
  const active = useCopyButtonState().status === state;
  return (
    <span
      {...props}
      aria-hidden={!active}
      data-active={active}
      data-slot={`copy-button-label-${state}`}
      className={[
        "col-start-1 row-start-1 whitespace-nowrap opacity-0 translate-y-1 transition duration-150 data-[active=true]:translate-y-0 data-[active=true]:opacity-100 motion-reduce:transition-none",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </span>
  );
}
function CopyButtonLabelIdle({ children = "Copy", ...props }: ComponentProps<"span">) {
  return (
    <CopyLabelState {...props} state="idle">
      {children}
    </CopyLabelState>
  );
}
function CopyButtonLabelCopied({ children = "Copied", ...props }: ComponentProps<"span">) {
  return (
    <CopyLabelState {...props} state="copied">
      {children}
    </CopyLabelState>
  );
}
function CopyButtonLabelError({ children = "Failed", ...props }: ComponentProps<"span">) {
  return (
    <CopyLabelState {...props} state="error">
      {children}
    </CopyLabelState>
  );
}
export {
  CopyButton,
  CopyButtonIcon,
  CopyButtonLabel,
  CopyButtonLabelIdle,
  CopyButtonLabelCopied,
  CopyButtonLabelError,
};
export type { CopyButtonProps, CopyButtonState };
