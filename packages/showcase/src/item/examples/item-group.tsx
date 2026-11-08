import * as React from "react";
import { Icon } from "@erbium/ui/components/icon";

import { Avatar, AvatarFallback, AvatarImage } from "@erbium/ui/components/avatar";
import { Button } from "@erbium/ui/components/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@erbium/ui/components/item";

const people = [
  {
    avatar:
      "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=256&h=256&fit=crop",
    email: "john.doe@example.com",
    username: "John Doe",
  },
  {
    avatar:
      "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=256&h=256&fit=crop",
    email: "jane.doe@example.com",
    username: "Jane Doe",
  },
  {
    avatar:
      "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=256&h=256&fit=crop",
    email: "alex.smith@example.com",
    username: "Alex Smith",
  },
];

const ItemGroupExample = () => (
  <div className="flex w-full max-w-md flex-col gap-section">
    <ItemGroup>
      {people.map((person, index) => (
        <React.Fragment key={person.username}>
          <Item>
            <ItemMedia>
              <Avatar>
                <AvatarImage alt={person.username} src={person.avatar} className="grayscale" />
                <AvatarFallback>
                  {person.username
                    .split(" ")
                    .map((part) => part[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </ItemMedia>
            <ItemContent className="gap-1">
              <ItemTitle>{person.username}</ItemTitle>
              <ItemDescription>{person.email}</ItemDescription>
            </ItemContent>
            <ItemActions>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Icon name="plus" />
              </Button>
            </ItemActions>
          </Item>
          {index !== people.length - 1 && <ItemSeparator />}
        </React.Fragment>
      ))}
    </ItemGroup>
  </div>
);

export default ItemGroupExample;
