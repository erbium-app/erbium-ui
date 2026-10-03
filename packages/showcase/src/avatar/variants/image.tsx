import { AvatarFallback, AvatarImage } from "@erbium/ui/components/avatar";
import { Avatar } from "@erbium/ui/components/avatar";

const Example = () => (
  <Avatar>
    <AvatarImage src="https://github.com/shadcn.png" alt="Profile" />
    <AvatarFallback>AN</AvatarFallback>
  </Avatar>
);

export default Example;
