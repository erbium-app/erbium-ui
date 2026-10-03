import { ButtonGroup } from "@erbium/ui/components/button-group";
import { Button } from "@erbium/ui/components/button";

const Example = (args: {
  orientation: "horizontal" | "vertical";
  size: "default" | "xs" | "sm" | "lg";
}) => (
  <ButtonGroup aria-label="Example actions" orientation={args.orientation}>
    <Button variant="outline" size={args.size}>
      First
    </Button>
    <Button variant="outline" size={args.size}>
      Second
    </Button>
    <Button variant="outline" size={args.size}>
      Third
    </Button>
  </ButtonGroup>
);

export default Example;
