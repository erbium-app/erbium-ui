import * as React from "react";

/**
 * State a consumer may own. While `controlled` is not `undefined` the consumer owns it, and
 * `setValue` only updates the uncontrolled copy, which takes over if control is released.
 */
const useControlledState = <T>(
  controlled: T | undefined,
  defaultValue: T | (() => T),
): [T, (next: T) => void] => {
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue);
  const isControlled = controlled !== undefined;

  const setValue = React.useCallback((next: T) => {
    setUncontrolled(() => next);
  }, []);

  return [isControlled ? controlled : uncontrolled, setValue];
};

export { useControlledState };
