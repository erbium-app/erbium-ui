import { useRender } from "@base-ui/react/use-render";
import { mergeProps } from "@base-ui/react/merge-props";
import { Icon } from "../components/icon";
import { createContext, use, useEffect, useRef } from "react";
import type { ComponentProps } from "react";
import { Button } from "../components/button";
import { StatefulIcon } from "../components/stateful-icon";
import { useCopyToClipboard } from "../hooks/use-copy-to-clipboard";
import type { CopyToClipboardValue } from "../hooks/use-copy-to-clipboard";

interface CopyButtonState {
  copied: boolean;
  pending: boolean;
  status: "idle" | "copied" | "error";
  revision: number;
}

const CopyButtonContext = createContext<CopyButtonState | null>(null);

const useCopyButtonState = () => {
  const state = use(CopyButtonContext);

  if (!state) {
    throw new Error("Copy button content must be inside CopyButton.");
  }

  return state;
};

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

const CopyButtonIcon = (
  props: Omit<ComponentProps<typeof StatefulIcon>, "state" | "icons" | "labels">,
) => {
  const { status } = useCopyButtonState();

  return (
    <StatefulIcon
      {...props}
      state={status}
      icons={{
        copied: <Icon name="check" />,
        error: <Icon name="cancel-01" />,
        idle: <Icon name="copy" />,
      }}
    />
  );
};

const CopyButton = ({
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
}: CopyButtonProps) => {
  const clipboard = useCopyToClipboard({ onCopy: onCopied, onError, timeout });
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
    revision: clipboard.revision,
    status: clipboard.status,
  };

  const element = useRender({
    defaultTagName: "button",
    props: {
      ...mergeProps<"button">(
        {
          "aria-busy": state.pending,
          "aria-label": children == null ? "Copy" : undefined,
          children: children ?? <CopyButtonIcon />,
          onClick(event) {
            if (!event.defaultPrevented && !disabled && !loading) {
              void clipboard.copyToClipboard(value);
            }
          },
          type: "button",
        },
        { ...props, disabled, onClick },
      ),
      ...(render
        ? {}
        : {
            size: props.size ?? (children == null ? "icon" : "default"),
            variant: props.variant ?? "ghost",
          }),
      loading: loading || state.pending,
    },
    render: render ?? <Button />,
    state,
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
};

const CopyLabelState = ({
  state,
  children,
  className,
  ...props
}: ComponentProps<"span"> & { state: CopyButtonState["status"] }) => {
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
};

const CopyButtonLabelIdle = ({ children = "Copy", ...props }: ComponentProps<"span">) => (
  <CopyLabelState {...props} state="idle">
    {children}
  </CopyLabelState>
);

const CopyButtonLabelCopied = ({ children = "Copied", ...props }: ComponentProps<"span">) => (
  <CopyLabelState {...props} state="copied">
    {children}
  </CopyLabelState>
);

const CopyButtonLabelError = ({ children = "Failed", ...props }: ComponentProps<"span">) => (
  <CopyLabelState {...props} state="error">
    {children}
  </CopyLabelState>
);

const CopyButtonLabel = ({ children, className, ...props }: ComponentProps<"span">) => (
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

export {
  CopyButton,
  CopyButtonIcon,
  CopyButtonLabel,
  CopyButtonLabelIdle,
  CopyButtonLabelCopied,
  CopyButtonLabelError,
};

export type { CopyButtonProps, CopyButtonState };
