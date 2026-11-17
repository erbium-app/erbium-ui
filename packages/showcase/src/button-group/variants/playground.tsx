import { ButtonGroup } from "@erbium/ui/components/button-group";
import { Button } from "@erbium/ui/components/button";

export const defaultProps = { orientation: "horizontal", size: "default" } satisfies {
  orientation: "horizontal" | "vertical";
  size: "default" | "xs" | "sm" | "lg";
};

export default function ButtonGroupPlaygroundExample(
  args: {
    orientation: "horizontal" | "vertical";
    size: "default" | "xs" | "sm" | "lg";
  } = defaultProps,
) {
  return (
    <ButtonGroup aria-label="ButtonGroupPlaygroundExample actions" orientation={args.orientation}>
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
}
