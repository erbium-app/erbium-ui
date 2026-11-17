import { Button } from "@erbium/ui/components/button";
import { toast } from "@erbium/ui/components/toast";

export default function ToastProgressExample() {
  return (
    <Button
      variant="outline"
      onClick={() => {
        const id = toast.add({ timeout: 0, title: "Syncing changes…", type: "loading" });
        window.setTimeout(() => {
          toast.update(id, { timeout: 4000, title: "Changes synced", type: "success" });
        }, 1200);
      }}
    >
      Show progress toast
    </Button>
  );
}
