import { Icon } from "@erbium/ui/components/icon";

import { Button } from "@erbium/ui/components/button";

export default function ButtonSize() {
  return (
    <div className="flex flex-col items-start gap-section sm:flex-row">
      <div className="flex items-start gap-related">
        <Button size="sm" variant="outline">
          Small
        </Button>
        <Button size="icon-sm" aria-label="Submit" variant="outline">
          <Icon name="arrow-up-right-01" />
        </Button>
      </div>
      <div className="flex items-start gap-related">
        <Button variant="outline">Default</Button>
        <Button size="icon" aria-label="Submit" variant="outline">
          <Icon name="arrow-up-right-01" />
        </Button>
      </div>
      <div className="flex items-start gap-related">
        <Button variant="outline" size="lg">
          Large
        </Button>
        <Button size="icon-lg" aria-label="Submit" variant="outline">
          <Icon name="arrow-up-right-01" />
        </Button>
      </div>
    </div>
  );
}
