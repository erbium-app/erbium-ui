import { Button } from "@erbium/ui/components/button";
import { toast } from "@erbium/ui/components/toast";

const Example = (args: { type: "success" | "info" | "warning" | "error"; description: string }) => (
  <Button
    onClick={() =>
      toast.add({
        id: `toast-playground-${args.type}`,
        type: args.type,
        description: args.description,
      })
    }
  >
    Show toast
  </Button>
);

export default Example;
