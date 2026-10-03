import { Button } from "@erbium/ui/components/button";
import { toast } from "@erbium/ui/components/toast";

const Example = () => (
  <Button
    onClick={() =>
      toast.add({
        title: "Draft saved",
        actionProps: {
          children: "Undo",
          onClick: () => toast.add({ title: "Draft restored" }),
        },
      })
    }
  >
    Show action toast
  </Button>
);

export default Example;
