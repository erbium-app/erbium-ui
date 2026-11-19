import { useDebouncer } from "@tanstack/react-pacer/debouncer";
import { Icon } from "./icon";
import { useCallback, useEffect, useRef, useState } from "react";
import type { MouseEvent, ReactNode } from "react";
import { cn } from "../lib/utils";
import { Button } from "./button";
import { Spinner } from "./spinner";

type StatefulButtonState = "idle" | "loading" | "success";

type StatefulButtonProps = Omit<
  React.ComponentProps<typeof Button>,
  "children" | "loading" | "nativeButton" | "onClick" | "render"
> & {
  children: ReactNode;
  /** An async click handler drives the state when `state` is uncontrolled. */
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void | Promise<void>;
  // oxlint-disable-next-line anti-slop/no-unknown-parameters -- the rejection reason of the caller's own onClick promise is passed back to the caller unchanged; the button never reads it.
  onError?: (error: unknown) => void;
  onStateChange?: (state: StatefulButtonState) => void;
  state?: StatefulButtonState;
  successDuration?: number;
  successLabel?: ReactNode;
};

const StatefulButton = ({
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
}: StatefulButtonProps) => {
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

  const successReset = useDebouncer(
    () => {
      changeState("idle");
    },
    { wait: successDuration },
  );

  useEffect(() => {
    if (state === "success") {
      successReset.maybeExecute();
    } else {
      successReset.cancel();
    }

    return () => {
      successReset.cancel();
    };
  }, [state, successReset]);

  // Awaits the click handler's promise. The success branch stays outside `try`, as with
  // `then(onFulfilled, onRejected)`, so an error thrown while entering success is not reported
  // through onError; an error thrown by onError itself still rejects the returned promise.
  const settle = async (pending: PromiseLike<void>) => {
    try {
      await pending;
    } catch (error) {
      inFlight.current = false;
      changeState("idle");
      onError?.(error);

      return;
    }

    inFlight.current = false;
    changeState("success");
  };

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (state !== "idle" || inFlight.current) {
      event.preventDefault();

      return;
    }

    if (!onClick) {
      return;
    }

    const result = onClick(event);

    if (
      controlledState !== undefined ||
      !result ||
      // oxlint-disable-next-line anti-slop/no-runtime-typeof -- a thenable is identified by its callable `then` (the Promises/A+ contract), which also accepts promises from other realms that `instanceof Promise` would miss.
      typeof result.then !== "function"
    ) {
      return;
    }

    inFlight.current = true;
    changeState("loading");
    void settle(result);
  };

  const busy = state !== "idle";

  return (
    <Button
      {...props}
      data-state={state}
      aria-busy={state === "loading"}
      disabled={disabled === true || busy}
      focusableWhenDisabled={busy || focusableWhenDisabled}
      onClick={handleClick}
      className={cn(
        "group/stateful-button data-[state=loading]:data-disabled:opacity-100 data-[state=success]:data-disabled:opacity-100",
        className,
      )}
    >
      <span className="grid items-center justify-items-center gap-[inherit] *:col-start-1 *:row-start-1 *:flex *:items-center *:justify-center *:gap-[inherit]">
        <span
          aria-hidden={state !== "idle"}
          className="pointer-events-none -translate-y-1 opacity-0 transition-[opacity,translate] duration-150 group-data-[state=idle]/stateful-button:translate-y-0 group-data-[state=idle]/stateful-button:opacity-100 motion-reduce:transition-none"
        >
          {children}
        </span>
        <output
          aria-hidden={state !== "loading"}
          aria-label="Loading"
          className="pointer-events-none translate-y-1 opacity-0 transition-[opacity,translate] duration-150 group-data-[state=loading]/stateful-button:translate-y-0 group-data-[state=loading]/stateful-button:opacity-100 motion-reduce:transition-none"
        >
          <Spinner aria-hidden />
          <span className="sr-only">Loading</span>
        </output>
        <output
          aria-hidden={state !== "success"}
          // oxlint-disable-next-line anti-slop/no-runtime-typeof -- successLabel is a ReactNode; only a plain string can serve as the accessible name.
          aria-label={typeof successLabel === "string" ? successLabel : "Success"}
          className="pointer-events-none translate-y-1 opacity-0 transition-[opacity,translate] duration-150 group-data-[state=success]/stateful-button:translate-y-0 group-data-[state=success]/stateful-button:opacity-100 motion-reduce:transition-none"
        >
          <Icon name="check" aria-hidden />
          {successLabel ?? <span className="sr-only">Success</span>}
        </output>
      </span>
    </Button>
  );
};

export { StatefulButton };

export type { StatefulButtonProps, StatefulButtonState };
