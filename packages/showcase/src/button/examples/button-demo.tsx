import { Icon } from "@erbium/ui/components/icon";

import { Button } from "@erbium/ui/components/button";

export default function ButtonDemo() {
  return (
    <div className="flex flex-wrap items-center gap-related md:flex-row">
      <Button variant="outline">Button</Button>
      <Button variant="outline" size="icon" aria-label="Submit">
        <Icon name="arrow-up-01" />
      </Button>
    </div>
  );
}
