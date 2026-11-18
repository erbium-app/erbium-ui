import type * as React from "react";

/** A prop that takes a value, or a function that derives the value from the part's state. */
type StateProp<TValue, TState> = TValue | ((state: TState) => TValue);

/**
 * Whether a state prop is in its deriving form. The values these props take are never functions,
 * so a function is always the deriving form.
 */
const isDeriving = <TValue, TState>(
  prop: StateProp<TValue, TState>,
): prop is (state: TState) => TValue =>
  // oxlint-disable-next-line anti-slop/no-runtime-typeof -- "a value or a function of state" is this package's prop contract (as in Base UI); the guard reads that contract, not unparsed input.
  typeof prop === "function";

/** Reads a prop that is a value or a function of state, as Base UI's `className` is. */
const resolveStateProp = <TValue, TState>(prop: StateProp<TValue, TState>, state: TState): TValue =>
  isDeriving(prop) ? prop(state) : prop;

/** Sets a ref of either kind. */
const assignRef = <T>(ref: React.Ref<T> | undefined, value: T | null) => {
  // oxlint-disable-next-line anti-slop/no-runtime-typeof -- React's `Ref` type is a callback or an object; this branches on React's own contract.
  if (typeof ref === "function") {
    ref(value);
  } else if (ref !== null && ref !== undefined) {
    ref.current = value;
  }
};

export { assignRef, resolveStateProp };

export type { StateProp };
