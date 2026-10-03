import { AvatarFallback, AvatarImage } from "@erbium/ui/components/avatar";
import { Avatar } from "@erbium/ui/components/avatar";

const Example = (args: {
  size: "default" | "sm" | "lg";
  src: string;
  alt: string;
  fallback: string;
  className: string;
}) => (
  <Avatar size={args.size} className={args.className}>
    {args.src && <AvatarImage src={args.src} alt={args.alt} />}
    <AvatarFallback>{args.fallback}</AvatarFallback>
  </Avatar>
);

export default Example;
