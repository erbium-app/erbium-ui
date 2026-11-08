import { Avatar, AvatarFallback, AvatarImage } from "@erbium/ui/components/avatar";

export const AvatarSizeExample = () => (
  <div className="flex flex-wrap items-center gap-related grayscale">
    <Avatar size="sm">
      <AvatarImage
        src="https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=256&h=256&fit=crop"
        alt="John Doe"
      />
      <AvatarFallback>JD</AvatarFallback>
    </Avatar>
    <Avatar>
      <AvatarImage
        src="https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=256&h=256&fit=crop"
        alt="John Doe"
      />
      <AvatarFallback>JD</AvatarFallback>
    </Avatar>
    <Avatar size="lg">
      <AvatarImage
        src="https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=256&h=256&fit=crop"
        alt="John Doe"
      />
      <AvatarFallback>JD</AvatarFallback>
    </Avatar>
  </div>
);
