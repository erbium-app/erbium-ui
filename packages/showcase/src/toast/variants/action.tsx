import { Button } from "@erbium/ui/components/button";
import { toast } from "@erbium/ui/components/toast";

const Example = () => (
  <Button
    onClick={() =>
      toast.add({
        actionProps: {
          children: "Undo",
          onClick: () => toast.add({ title: "Draft restored" }),
        },
        title: "Draft saved",
      })
    }
  >
    Show action toast
  </Button>
);

export default Example;
