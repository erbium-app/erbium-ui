import { useDebouncer } from "@tanstack/react-pacer/debouncer";
import { Icon } from "./icon";
import { useCallback, useEffect, useRef, useState } from "react";
import type { MouseEvent, ReactNode } from "react";
import { cn } from "../lib/utils";
import { Button } from "./button";
import { LoadingIndicator } from "./spinner";

type StatefulButtonState = "idle" | "loading" | "success";

type StatefulButtonProps = Omit<
  React.ComponentProps<typeof Button>,
  "children" | "loading" | "nativeButton" | "onClick" | "render"
> & {
  children: ReactNode;
  /** An async click handler drives the state when `state` is uncontrolled. */
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void | Promise<void>;
  onError?: (error: unknown) => void;
  onStateChange?: (state: StatefulButtonState) => void;
  state?: StatefulButtonState;
  successDuration?: number;
  successLabel?: ReactNode;
};

function StatefulButton({
  children,
  className,
  disabled,
  focusableWhenDisabled,
  onClick,
  onError,
  onStateChange,
  state: stateProp,
  successDuration = 1500,
  successLabel,
  ...props
}: StatefulButtonProps) {
  const [internalState, setInternalState] = useState<StatefulButtonState>("idle");
  const controlledState = stateProp;
  const state = controlledState ?? internalState;
  const inFlight = useRef(false);

  const changeState = useCallback(
    (nextState: StatefulButtonState) => {
      if (controlledState === undefined) {
        setInternalState(nextState);
      }
      onStateChange?.(nextState);
    },
    [controlledState, onStateChange],
  );

  const successReset = useDebouncer(() => changeState("idle"), { wait: successDuration });

  useEffect(() => {
    if (state === "success") {
      successReset.maybeExecute();
    } else {
      successReset.cancel();
    }

    return () => successReset.cancel();
  }, [state, successReset]);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (state !== "idle" || inFlight.current) {
      event.preventDefault();
      return;
    }

    if (!onClick) {
      return;
    }

    const result = onClick(event);
    if (controlledState !== undefined || !result || typeof result.then !== "function") {
      return;
    }

    inFlight.current = true;
    changeState("loading");
    void result.then(
      () => {
        inFlight.current = false;
        changeState("success");
      },
      (error: unknown) => {
        inFlight.current = false;
        changeState("idle");
        onError?.(error);
      },
    );
  };

  const busy = state !== "idle";

  return (
    <Button
      {...props}
      data-state={state}
      aria-busy={state === "loading"}
      disabled={disabled || busy}
      focusableWhenDisabled={busy || focusableWhenDisabled}
      onClick={handleClick}
      className={cn(
        "group/stateful-button data-[state=loading]:data-disabled:opacity-100 data-[state=success]:data-disabled:opacity-100",
        className,
      )}
    >
      <span className="grid gap-[inherit] items-center justify-items-center *:col-start-1 *:row-start-1 *:flex *:items-center *:justify-center *:gap-[inherit]">
        <span
          aria-hidden={state !== "idle"}
          className="pointer-events-none opacity-0 transition-[opacity,translate] duration-150 -translate-y-1 group-data-[state=idle]/stateful-button:translate-y-0 group-data-[state=idle]/stateful-button:opacity-100 motion-reduce:transition-none"
        >
          {children}
        </span>
        <span
          aria-hidden={state !== "loading"}
          aria-label="Loading"
          className="pointer-events-none translate-y-1 opacity-0 transition-[opacity,translate] duration-150 group-data-[state=loading]/stateful-button:translate-y-0 group-data-[state=loading]/stateful-button:opacity-100 motion-reduce:transition-none"
          role="status"
        >
          <LoadingIndicator />
          <span className="sr-only">Loading</span>
        </span>
        <span
          aria-hidden={state !== "success"}
          aria-label={typeof successLabel === "string" ? successLabel : "Success"}
          className="pointer-events-none translate-y-1 opacity-0 transition-[opacity,translate] duration-150 group-data-[state=success]/stateful-button:translate-y-0 group-data-[state=success]/stateful-button:opacity-100 motion-reduce:transition-none"
          role="status"
        >
          <Icon name="check" aria-hidden />
          {successLabel ?? <span className="sr-only">Success</span>}
        </span>
      </span>
    </Button>
  );
}

export { StatefulButton };
export type { StatefulButtonProps, StatefulButtonState };
