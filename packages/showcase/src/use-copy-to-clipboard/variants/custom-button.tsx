import { CopyButton, CopyButtonIcon, CopyButtonLabel } from "@erbium/ui/blocks/copy-button";
import { Button } from "@erbium/ui/components/button";

const Example = () => (
  <CopyButton value="Erbium UI" render={<Button size="sm" variant="outline" />}>
    <CopyButtonIcon data-icon="inline-start" />
    <CopyButtonLabel />
  </CopyButton>
);

export default Example;
