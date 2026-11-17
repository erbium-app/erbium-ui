import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from "@erbium/ui/components/avatar";

export default function AvatarWithBadgeExample() {
  return (
    <Avatar>
      <AvatarImage
        src="https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=256&h=256&fit=crop"
        alt="John Doe"
      />
      <AvatarFallback>JD</AvatarFallback>
      <AvatarBadge className="bg-success" />
    </Avatar>
  );
}
