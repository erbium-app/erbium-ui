import { Button } from "@erbium/ui/components/button";
import { toast } from "@erbium/ui/components/toast";

export default function Demo() {
  return (
    <>
      <Button
        onClick={() =>
          toast.add({
            description: "Your changes have been saved.",
            id: "toast-demo-saved",
            title: "Saved",
          })
        }
      >
        Show toast
      </Button>
    </>
  );
}
