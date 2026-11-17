import { Icon } from "@erbium/ui/components/icon";

import { Button } from "@erbium/ui/components/button";

export default function ButtonIconExample() {
  return (
    <Button variant="outline" size="icon">
      <Icon name="circle-fading-arrow-up" />
    </Button>
  );
}
