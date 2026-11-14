import { Button } from "@erbium/ui/components/button";
import { ButtonGroup } from "@erbium/ui/components/button-group";
import { useEffect, useState } from "react";

/*
 * A stand-in for a data request, so loading examples show the skeleton and then the reveal. In an
 * app the data comes from a route loader, TanStack Query or `use(promise)`; the UI only needs the
 * value and whether a request is in flight.
 */

/** How long the example "server" takes to answer, in milliseconds. */
const defaultLatency = 1600;

interface SimulatedFetchOptions {
  latency?: number;
  /** The request rejects instead of resolving. */
  fail?: boolean;
}

interface SimulatedFetch<T> {
  /** The loaded value; `undefined` until the first response. */
  data: T | undefined;
  /** A request is in flight, the first one or a refetch. */
  loading: boolean;
  error: Error | undefined;
  /** Drops the data and loads again, as on a first visit. */
  reload: () => void;
  /** Loads again while the current data stays on screen. */
  refetch: () => void;
}

const useSimulatedFetch = <T,>(
  value: T,
  { latency = defaultLatency, fail = false }: SimulatedFetchOptions = {},
): SimulatedFetch<T> => {
  const [request, setRequest] = useState({ id: 0 });

  // What the last response answered: the request and the value it was for. A new value (say, a new
  // page or sort order) is a new request, while the last response stays on screen.
  const [settled, setSettled] = useState<{
    id: number;
    value: T;
    data?: T;
    error?: Error;
  } | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSettled(
        fail
          ? { error: new Error("The server did not respond. Try again."), id: request.id, value }
          : { data: value, id: request.id, value },
      );
    }, latency);

    return () => {
      clearTimeout(timer);
    };
  }, [request, latency, fail, value]);

  const current = settled?.id === request.id && settled.value === value ? settled : null;
  // `reload` clears the last response, so only refetches keep data on screen.
  const previous = settled?.data;

  return {
    data: current === null ? previous : current.data,
    error: current?.error,
    loading: current === null,
    refetch: () => {
      setRequest((last) => ({ id: last.id + 1 }));
    },
    reload: () => {
      setSettled(null);
      setRequest((last) => ({ id: last.id + 1 }));
    },
  };
};

/** Replays the example's request: `Reload` from nothing, `Refetch` over the data on screen. */
const LoadingControls = ({
  loading,
  reload,
  refetch,
}: Pick<SimulatedFetch<unknown>, "loading" | "reload" | "refetch">) => (
  <ButtonGroup aria-label="Replay the request">
    <Button variant="outline" size="sm" onClick={reload} disabled={loading}>
      Reload
    </Button>
    <Button variant="outline" size="sm" onClick={refetch} disabled={loading}>
      Refetch
    </Button>
  </ButtonGroup>
);

/** Playground controls shared by loading examples. */
const latencyArgType = {
  latency: { control: { max: 5000, min: 0, step: 100, type: "number" } },
} as const;

export { defaultLatency, latencyArgType, LoadingControls, useSimulatedFetch };

export type { SimulatedFetch, SimulatedFetchOptions };
