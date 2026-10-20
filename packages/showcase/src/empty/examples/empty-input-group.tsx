import { Icon } from "@erbium/ui/components/icon";

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@erbium/ui/components/empty";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@erbium/ui/components/input-group";
import { Kbd } from "@erbium/ui/components/kbd";

const EmptyInputGroup = () => (
  <Empty>
    <EmptyHeader>
      <EmptyTitle>404 - Not Found</EmptyTitle>
      <EmptyDescription>
        The page you&apos;re looking for doesn&apos;t exist. Try searching for what you need below.
      </EmptyDescription>
    </EmptyHeader>
    <EmptyContent>
      <InputGroup className="sm:w-3/4">
        <InputGroupInput placeholder="Try searching for pages..." />
        <InputGroupAddon>
          <Icon name="search-01" />
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
          <Kbd hotkey="/" />
        </InputGroupAddon>
      </InputGroup>
      <EmptyDescription>
        Need help? <a href="#">Contact support</a>
      </EmptyDescription>
    </EmptyContent>
  </Empty>
);

export default EmptyInputGroup;
