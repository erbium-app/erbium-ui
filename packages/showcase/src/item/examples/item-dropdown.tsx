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
    username: "John Doe",
    avatar:
      "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2264%22%20height%3D%2264%22%20viewBox%3D%220%200%2064%2064%22%3E%3Crect%20width%3D%2264%22%20height%3D%2264%22%20rx%3D%2232%22%20fill%3D%22%23475569%22%2F%3E%3Ctext%20x%3D%2232%22%20y%3D%2233%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20font-family%3D%22sans-serif%22%20font-size%3D%2222%22%20fill%3D%22white%22%3EJD%3C%2Ftext%3E%3C%2Fsvg%3E",
    email: "john.doe@example.com",
  },
  {
    username: "Jane Doe",
    avatar:
      "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2264%22%20height%3D%2264%22%20viewBox%3D%220%200%2064%2064%22%3E%3Crect%20width%3D%2264%22%20height%3D%2264%22%20rx%3D%2232%22%20fill%3D%22%2364748b%22%2F%3E%3Ctext%20x%3D%2232%22%20y%3D%2233%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20font-family%3D%22sans-serif%22%20font-size%3D%2222%22%20fill%3D%22white%22%3EJD%3C%2Ftext%3E%3C%2Fsvg%3E",
    email: "jane.doe@example.com",
  },
  {
    username: "Alex Smith",
    avatar:
      "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2264%22%20height%3D%2264%22%20viewBox%3D%220%200%2064%2064%22%3E%3Crect%20width%3D%2264%22%20height%3D%2264%22%20rx%3D%2232%22%20fill%3D%22%23334155%22%2F%3E%3Ctext%20x%3D%2232%22%20y%3D%2233%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20font-family%3D%22sans-serif%22%20font-size%3D%2222%22%20fill%3D%22white%22%3EAS%3C%2Ftext%3E%3C%2Fsvg%3E",
    email: "alex.smith@example.com",
  },
];

export default function ItemDropdown() {
  return (
    <div className="flex min-h-64 w-full max-w-md flex-col items-center gap-section">
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="outline" size="sm" className="group group/item-menu-trigger w-fit">
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
                    <Avatar className="size-8">
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
