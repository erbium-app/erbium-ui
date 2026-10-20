import { CopyButton } from "@erbium/ui/blocks/copy-button";

const StatefulIconDemo = () => (
  <CopyButton
    value="Stateful icons animate between states."
    aria-label="Copy example text"
    variant="outline"
    timeout={1200}
  />
);

export default StatefulIconDemo;
