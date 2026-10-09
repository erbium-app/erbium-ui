import { Button } from "@erbium/ui/components/button";
import { toast } from "@erbium/ui/components/toast";

export function ToastTypes() {
  return (
    <div className="flex flex-wrap gap-related">
      <Button
        variant="outline"
        onClick={() =>
          toast.add({ id: "toast-type-default", description: "Event has been created." })
        }
      >
        Default
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.add({
            id: "toast-type-success",
            type: "success",
            description: "Event has been created.",
          })
        }
      >
        Success
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.add({
            id: "toast-type-info",
            type: "info",
            description: "Arrive 10 minutes before the event.",
          })
        }
      >
        Info
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.add({
            id: "toast-type-warning",
            type: "warning",
            description: "The event cannot start before 8:00 AM.",
          })
        }
      >
        Warning
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.add({
            id: "toast-type-error",
            type: "error",
            description: "The event could not be created.",
            priority: "high",
          })
        }
      >
        Error
      </Button>
    </div>
  );
}
