import { Icon } from "@erbium/ui/components/icon";

import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from "@erbium/ui/components/avatar";

export const AvatarBadgeIconExample = () => (
  <Avatar className="grayscale">
    <AvatarImage
      src="https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=256&h=256&fit=crop"
      alt="Sam Taylor"
    />
    <AvatarFallback>ST</AvatarFallback>
    <AvatarBadge>
      <Icon name="plus" />
    </AvatarBadge>
  </Avatar>
);
