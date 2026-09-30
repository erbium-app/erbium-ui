import { useDebouncer } from "@tanstack/react-pacer/debouncer";
import { HugeiconsIcon } from "@hugeicons/react";
import CheckIcon from "@hugeicons/core-free-icons/CheckIcon";

import { useCallback, useEffect, useRef, useState } from "react";
import type { MouseEvent, ReactNode } from "react";
import { cn } from "../lib/utils";
import { Button } from "./button";
import { Spinner } from "./spinner";

type ButtonStatus = "idle" | "loading" | "success";

type StatusButtonProps = Omit<
  React.ComponentProps<typeof Button>,
  "children" | "nativeButton" | "onClick" | "render"
> & {
  children: ReactNode;
  /** An async click handler drives the status when `status` is uncontrolled. */
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void | Promise<void>;
  onError?: (error: unknown) => void;
  onStatusChange?: (status: ButtonStatus) => void;
  status?: ButtonStatus;
  successDuration?: number;
  successLabel?: ReactNode;
};

function StatusButton({
  children,
  className,
  disabled,
  focusableWhenDisabled,
  onClick,
  onError,
  onStatusChange,
  status: controlledStatus,
  successDuration = 1500,
  successLabel,
  ...props
}: StatusButtonProps) {
  const [internalStatus, setInternalStatus] = useState<ButtonStatus>("idle");
  const status = controlledStatus ?? internalStatus;
  const inFlight = useRef(false);

  const changeStatus = useCallback(
    (nextStatus: ButtonStatus) => {
      if (controlledStatus === undefined) {
        setInternalStatus(nextStatus);
      }
      onStatusChange?.(nextStatus);
    },
    [controlledStatus, onStatusChange],
  );

  const successReset = useDebouncer(() => changeStatus("idle"), { wait: successDuration });

  useEffect(() => {
    if (status === "success") {
      successReset.maybeExecute();
    } else {
      successReset.cancel();
    }

    return () => successReset.cancel();
  }, [status, successReset]);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (status !== "idle" || inFlight.current) {
      event.preventDefault();
      return;
    }

    if (!onClick) {
      return;
    }

    const result = onClick(event);
    if (controlledStatus !== undefined || !result || typeof result.then !== "function") {
      return;
    }

    inFlight.current = true;
    changeStatus("loading");
    void result.then(
      () => {
        inFlight.current = false;
        changeStatus("success");
      },
      (error: unknown) => {
        inFlight.current = false;
        changeStatus("idle");
        onError?.(error);
      },
    );
  };

  const busy = status !== "idle";

  return (
    <Button
      {...props}
      data-status={status}
      aria-busy={status === "loading"}
      disabled={disabled || busy}
      focusableWhenDisabled={busy || focusableWhenDisabled}
      onClick={handleClick}
      className={cn(
        "group/status-button data-[status=loading]:data-disabled:opacity-100 data-[status=success]:data-disabled:opacity-100",
        className,
      )}
    >
      <span className="grid gap-[inherit] items-center justify-items-center *:col-start-1 *:row-start-1 *:flex *:items-center *:justify-center *:gap-[inherit]">
        <span
          aria-hidden={status !== "idle"}
          className="pointer-events-none opacity-0 transition-[opacity,translate] duration-150 -translate-y-1 group-data-[status=idle]/status-button:translate-y-0 group-data-[status=idle]/status-button:opacity-100 motion-reduce:transition-none"
        >
          {children}
        </span>
        <span
          aria-hidden={status !== "loading"}
          aria-label="Loading"
          className="pointer-events-none translate-y-1 opacity-0 transition-[opacity,translate] duration-150 group-data-[status=loading]/status-button:translate-y-0 group-data-[status=loading]/status-button:opacity-100 motion-reduce:transition-none"
          role="status"
        >
          <Spinner aria-hidden />
          <span className="sr-only">Loading</span>
        </span>
        <span
          aria-hidden={status !== "success"}
          aria-label={typeof successLabel === "string" ? successLabel : "Success"}
          className="pointer-events-none translate-y-1 opacity-0 transition-[opacity,translate] duration-150 group-data-[status=success]/status-button:translate-y-0 group-data-[status=success]/status-button:opacity-100 motion-reduce:transition-none"
          role="status"
        >
          <HugeiconsIcon icon={CheckIcon} aria-hidden />
          {successLabel ?? <span className="sr-only">Success</span>}
        </span>
      </span>
    </Button>
  );
}

export { StatusButton };
export type { ButtonStatus, StatusButtonProps };
