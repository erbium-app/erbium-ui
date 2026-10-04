import { CopyButton, CopyIcon } from "@erbium/ui/blocks/copy-button";
import { Button } from "@erbium/ui/components/button";
export default function Example() {
  return (
    <div className="flex items-center gap-3">
      <CopyButton value="Small" size="icon-xs" variant="outline" />
      <CopyButton value="Medium" size="icon-sm" variant="secondary" />
      <CopyButton value="Large" size="icon-lg" />
      <CopyButton
        value="Erbium UI"
        render={(props, state) => (
          <Button {...props} size="sm" variant="outline">
            <CopyIcon copied={state.copied} data-icon="inline-start" />
            {state.copied ? "Copied" : "Copy name"}
          </Button>
        )}
      />
    </div>
  );
}
