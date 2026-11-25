import { RotatingChevron } from "@erbium/ui/components/stateful-icon";
import { Avatar, AvatarFallback, AvatarImage } from "@erbium/ui/components/avatar";
import { Button } from "@erbium/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuList,
} from "@erbium/ui/components/dropdown-menu";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
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

export default function ItemDropdownExample() {
  return (
    <div className="flex min-h-64 w-full max-w-md flex-col items-center gap-section">
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="outline" size="sm" className="w-fit">
              Select <RotatingChevron />
            </Button>
          }
        />
        <DropdownMenuContent className="w-72 [--radius:0.65rem]" align="end">
          <DropdownMenuList>
            {people.map((person) => (
              <DropdownMenuItem key={person.username} className="p-0">
                <Item size="sm" className="w-full p-2">
                  <ItemMedia>
                    <Avatar>
                      <AvatarImage
                        alt={person.username}
                        src={person.avatar}
                        className="grayscale"
                      />
                      <AvatarFallback>
                        {person.username
                          .split(" ")
                          .map((part) => part[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                  </ItemMedia>
                  <ItemContent className="gap-0.5">
                    <ItemTitle>{person.username}</ItemTitle>
                    <ItemDescription>{person.email}</ItemDescription>
                  </ItemContent>
                </Item>
              </DropdownMenuItem>
            ))}
          </DropdownMenuList>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
