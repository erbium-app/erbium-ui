import { Icon } from "@erbium/ui/components/icon";

import { Button } from "@erbium/ui/components/button";

const ButtonRounded = () => (
  <div className="flex flex-col gap-section">
    <Button variant="outline" size="icon" className="rounded-full">
      <Icon name="arrow-up-01" />
    </Button>
  </div>
);

export default ButtonRounded;
