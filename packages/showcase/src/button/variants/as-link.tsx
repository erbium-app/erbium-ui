import { buttonVariants } from "@erbium/ui/components/button";

export default function ButtonAsLinkExample() {
  return (
    <a className={buttonVariants({ variant: "outline" })} href="#button-as-link">
      Open section
    </a>
  );
}
