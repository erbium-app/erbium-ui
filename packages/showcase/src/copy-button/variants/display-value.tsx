import { CopyButton } from "@erbium/ui/blocks/copy-button";

const username = "jane-doe";

const Example = () => (
  <dl>
    <dt className="text-caption text-muted-foreground">Username</dt>
    <dd className="flex items-center gap-related">
      <code>{username}</code>
      <CopyButton aria-label="Copy username" size="icon-xs" value={username} variant="embedded" />
    </dd>
  </dl>
);

export default Example;
