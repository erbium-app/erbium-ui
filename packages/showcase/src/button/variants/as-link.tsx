import { buttonVariants } from "@erbium/ui/components/button";

const Example = () => (
  <a className={buttonVariants({ variant: "outline" })} href="#button-as-link">
    Open section
  </a>
);

export default Example;
