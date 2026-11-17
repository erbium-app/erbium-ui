import { AvatarFallback, AvatarImage, Avatar } from "@erbium/ui/components/avatar";

export const defaultProps = {
  alt: "Profile photo",
  className: "",
  fallback: "AN",
  size: "default",
  src: "",
} satisfies {
  size: "default" | "sm" | "lg";
  src: string;
  alt: string;
  fallback: string;
  className: string;
};

export default function AvatarPlaygroundExample(
  args: {
    size: "default" | "sm" | "lg";
    src: string;
    alt: string;
    fallback: string;
    className: string;
  } = defaultProps,
) {
  return (
    <Avatar size={args.size} className={args.className}>
      {args.src && <AvatarImage src={args.src} alt={args.alt} />}
      <AvatarFallback>{args.fallback}</AvatarFallback>
    </Avatar>
  );
}
