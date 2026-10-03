import { Button } from "@erbium/ui/components/button";
import { toast } from "@erbium/ui/components/toast";

const Example = () => (
  <Button
    variant="outline"
    onClick={() => {
      const id = toast.add({ title: "Syncing changes…", type: "loading", timeout: 0 });
      window.setTimeout(() => {
        toast.update(id, { title: "Changes synced", type: "success", timeout: 4000 });
      }, 1200);
    }}
  >
    Show progress toast
  </Button>
);

export default Example;
