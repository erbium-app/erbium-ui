import { AvatarFallback, AvatarImage, Avatar } from "@erbium/ui/components/avatar";

export default function AvatarImageExample() {
  return (
    <Avatar>
      <AvatarImage
        src="https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=256&h=256&fit=crop"
        alt="Profile"
      />
      <AvatarFallback>AN</AvatarFallback>
    </Avatar>
  );
}
