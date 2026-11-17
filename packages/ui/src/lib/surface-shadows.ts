// Pierre renders into shadow roots where Tailwind's surface utilities do not
// reach. These stacks restate the control and field rims from surfaces.css with
// the same tokens, so the raised look has one definition outside that file.
const controlShadow = [
  "0 -1px 0 var(--surface-highlight)",
  "0 0 0 1px var(--surface-edge)",
  "0 1px 1px -0.5px var(--surface-shadow-strong)",
  "0 2px 4px -1px var(--surface-shadow)",
].join(", ");

const fieldShadow = [
  "0 -1px 0 var(--surface-highlight)",
  "0 0 0 1px var(--surface-edge)",
  "0 0 0 1px var(--surface-input)",
  "0 1px 1px -0.5px var(--surface-shadow-strong)",
  "0 2px 4px -1px var(--surface-shadow)",
].join(", ");

export { controlShadow, fieldShadow };
