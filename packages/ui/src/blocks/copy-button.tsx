import { useRender } from "@base-ui/react/use-render";
import { mergeProps } from "@base-ui/react/merge-props";
import { Icon } from "../components/icon";
import { createContext, use, useEffect, useMemo, useRef } from "react";
import type { ComponentProps } from "react";
import { Button } from "../components/button";
import { Spinner } from "../components/spinner";
import { StatefulIcon } from "../components/stateful-icon";
import { useCopyToClipboard } from "../hooks/use-copy-to-clipboard";
import type { CopyToClipboardOptions, CopyToClipboardValue } from "../hooks/use-copy-to-clipboard";

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
    onError?: CopyToClipboardOptions["onError"];
    successMessage?: string;
    errorMessage?: string;
    render?: useRender.RenderProp<CopyButtonState>;
  };

const CopyButtonIcon = ({
  className,
  "data-icon": placement = "inline-start",
}: Omit<ComponentProps<typeof StatefulIcon>, "state" | "icons" | "labels">) => {
  const { pending, status } = useCopyButtonState();

  return (
    <span
      aria-hidden="true"
      className={["inline-grid shrink-0 *:col-start-1 *:row-start-1", className]
        .filter(Boolean)
        .join(" ")}
      data-icon={placement}
    >
      {/* Keep the icon mounted so the settled state can animate from the prior state. */}
      <StatefulIcon
        className={pending ? "invisible" : undefined}
        state={status}
        icons={{
          copied: <Icon name="check" />,
          error: <Icon name="cancel-01" />,
          idle: <Icon name="copy" />,
        }}
      />
      {pending && (
        <Spinner
          size="sm"
          className="place-self-center group-[:is([data-size=xs],[data-size=sm],[data-size=icon-xs],[data-size=icon-sm])]/button:size-control-icon-sm group-[:is([data-size=lg],[data-size=icon-lg])]/button:size-control-icon-lg"
        />
      )}
    </span>
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
  focusableWhenDisabled,
  ...props
}: CopyButtonProps) => {
  const clipboard = useCopyToClipboard({ onCopy: onCopied, onError, timeout });
  const { isCopied, isPending, reset, revision, status } = clipboard;
  const iconOnly = children === null || children === undefined;
  const previousValue = useRef(value);
  useEffect(() => {
    if (previousValue.current !== value) {
      previousValue.current = value;
      reset();
    }
  }, [value, reset]);

  const state = useMemo(
    () => ({ copied: isCopied, pending: loading === true || isPending, revision, status }),
    [isCopied, isPending, loading, revision, status],
  );

  const isDisabled = disabled === true || state.pending;
  const announcement = { copied: successMessage, error: errorMessage, idle: "" }[status];

  const element = useRender({
    defaultTagName: "button",
    props: {
      ...mergeProps<"button">(
        {
          "aria-busy": state.pending,
          "aria-label": iconOnly ? "Copy" : undefined,
          children: children ?? <CopyButtonIcon />,
          onClick(event) {
            if (!event.defaultPrevented && !isDisabled) {
              void clipboard.copyToClipboard(value);
            }
          },
          type: "button",
        },
        { ...props, disabled: isDisabled, onClick },
      ),
      "data-loading": state.pending ? "" : undefined,
      focusableWhenDisabled: focusableWhenDisabled === true || state.pending,
      size: render ? props.size : (props.size ?? (iconOnly ? "icon" : "default")),
      variant: render ? props.variant : (props.variant ?? "ghost"),
    },
    render: render ?? <Button />,
    state,
  });

  return (
    <CopyButtonContext value={state}>
      {element}
      <output className="sr-only" aria-atomic="true">
        <span key={revision}>{announcement}</span>
      </output>
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
