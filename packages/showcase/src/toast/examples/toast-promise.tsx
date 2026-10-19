import { Button } from "@erbium/ui/components/button";
import { toast } from "@erbium/ui/components/toast";

export function ToastPromise() {
  function showToast() {
    void toast.promise(
      new Promise<{ name: string }>((resolve) => {
        window.setTimeout(() => {
          resolve({ name: "Event" });
        }, 2000);
      }),
      {
        error: "Could not create event.",
        loading: "Creating event…",
        success: (data) => `${data.name} created.`,
      },
    );
  }

  return (
    <Button variant="outline" onClick={showToast}>
      Create Event
    </Button>
  );
}
