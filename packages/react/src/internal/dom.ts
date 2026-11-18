import type * as React from "react";

/** A boolean state as a data attribute: present and empty when true, absent when false. */
const dataFlag = (value: boolean) => (value ? "" : undefined);

/**
 * Hides text visually while keeping it for screen readers. Inline, so it works without any
 * stylesheet.
 */
const visuallyHidden: React.CSSProperties = {
  border: 0,
  clipPath: "inset(50%)",
  height: 1,
  margin: -1,
  overflow: "hidden",
  padding: 0,
  position: "absolute",
  whiteSpace: "nowrap",
  width: 1,
};

/** Throws the error every part raises when it is rendered outside its root. */
const missingContext = (part: string, root: string): never => {
  throw new Error(`${part} must be placed within ${root}.`);
};

export { dataFlag, missingContext, visuallyHidden };
