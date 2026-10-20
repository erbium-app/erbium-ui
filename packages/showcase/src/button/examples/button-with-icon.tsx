import { Icon } from "@erbium/ui/components/icon";

import { Button } from "@erbium/ui/components/button";

const ButtonWithIcon = () => (
  <div className="flex gap-related">
    <Button variant="outline">
      <Icon name="git-branch" data-icon="inline-start" /> New Branch
    </Button>
    <Button variant="outline">
      Fork
      <Icon name="git-fork" data-icon="inline-end" />
    </Button>
  </div>
);

export default ButtonWithIcon;
