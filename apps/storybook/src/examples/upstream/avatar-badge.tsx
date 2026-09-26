import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from "@erbium/ui/components/avatar";

export function AvatarWithBadge() {
  return (
    <Avatar>
      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
      <AvatarFallback>CN</AvatarFallback>
      <AvatarBadge className="bg-success" />
    </Avatar>
  );
}
