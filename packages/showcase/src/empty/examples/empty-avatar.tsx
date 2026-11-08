import { Avatar, AvatarFallback, AvatarImage } from "@erbium/ui/components/avatar";
import { Button } from "@erbium/ui/components/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@erbium/ui/components/empty";

const EmptyAvatar = () => (
  <Empty>
    <EmptyHeader>
      <EmptyMedia variant="default">
        <Avatar className="[--avatar-size:3rem]">
          <AvatarImage
            src="https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=256&h=256&fit=crop"
            alt="John Doe"
            className="grayscale"
          />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
      </EmptyMedia>
      <EmptyTitle>User Offline</EmptyTitle>
      <EmptyDescription>
        This user is currently offline. You can leave a message to notify them or try again later.
      </EmptyDescription>
    </EmptyHeader>
    <EmptyContent>
      <Button size="sm">Leave Message</Button>
    </EmptyContent>
  </Empty>
);

export default EmptyAvatar;
