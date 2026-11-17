import { Icon } from "@erbium/ui/components/icon";

import { Avatar, AvatarFallback, AvatarGroup, AvatarImage } from "@erbium/ui/components/avatar";
import { Button } from "@erbium/ui/components/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@erbium/ui/components/item";

export default function ItemAvatarExample() {
  return (
    <div className="flex w-full max-w-lg flex-col gap-section">
      <Item variant="card">
        <ItemMedia>
          <Avatar size="lg">
            <AvatarImage
              src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=256&h=256&fit=crop"
              alt="Alex Smith"
            />
            <AvatarFallback>AS</AvatarFallback>
          </Avatar>
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Alex Smith</ItemTitle>
          <ItemDescription>Last seen 5 months ago</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button size="icon-sm" variant="outline" className="rounded-full" aria-label="Invite">
            <Icon name="plus" />
          </Button>
        </ItemActions>
      </Item>
      <Item variant="card">
        <ItemMedia>
          <AvatarGroup className="grayscale">
            <Avatar className="hidden sm:flex">
              <AvatarImage
                src="https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=256&h=256&fit=crop"
                alt="John Doe"
              />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <Avatar className="hidden sm:flex">
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
        </ItemMedia>
        <ItemContent>
          <ItemTitle>No Team Members</ItemTitle>
          <ItemDescription>Invite your team to collaborate on this project.</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button size="sm" variant="outline">
            Invite
          </Button>
        </ItemActions>
      </Item>
    </div>
  );
}
