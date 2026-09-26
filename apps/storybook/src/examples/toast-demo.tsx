import { Button } from "@erbium/ui/components/button";
import { toast } from "@erbium/ui/components/toast";
export default function Demo() {
  return (
    <>
      <Button
        onClick={() => toast.add({ title: "Saved", description: "Your changes have been saved." })}
      >
        Show toast
      </Button>
    </>
  );
}
