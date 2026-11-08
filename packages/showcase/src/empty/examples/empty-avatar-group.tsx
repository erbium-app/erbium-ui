import { Icon } from "@erbium/ui/components/icon";

import { Avatar, AvatarFallback, AvatarGroup, AvatarImage } from "@erbium/ui/components/avatar";
import { Button } from "@erbium/ui/components/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@erbium/ui/components/empty";

const EmptyAvatarGroup = () => (
  <Empty>
    <EmptyHeader>
      <EmptyMedia>
        <AvatarGroup className="[--avatar-size:3rem] grayscale">
          <Avatar>
            <AvatarImage
              src="https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=256&h=256&fit=crop"
              alt="John Doe"
            />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarImage
              src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=256&h=256&fit=crop"
              alt="Jane Doe"
            />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarImage
              src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=256&h=256&fit=crop"
              alt="Alex Smith"
            />
            <AvatarFallback>AS</AvatarFallback>
          </Avatar>
        </AvatarGroup>
      </EmptyMedia>
      <EmptyTitle>No Team Members</EmptyTitle>
      <EmptyDescription>Invite your team to collaborate on this project.</EmptyDescription>
    </EmptyHeader>
    <EmptyContent>
      <Button size="sm">
        <Icon name="plus" />
        Invite Members
      </Button>
    </EmptyContent>
  </Empty>
);

export default EmptyAvatarGroup;
