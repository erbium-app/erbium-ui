import { Button } from "@erbium/ui/components/button";
import { toast } from "@erbium/ui/components/toast";

export function ToastTypes() {
  return (
    <div className="flex flex-wrap gap-related">
      <Button
        variant="outline"
        onClick={() =>
          toast.add({ description: "Event has been created.", id: "toast-type-default" })
        }
      >
        Default
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.add({
            description: "Event has been created.",
            id: "toast-type-success",
            type: "success",
          })
        }
      >
        Success
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.add({
            description: "Arrive 10 minutes before the event.",
            id: "toast-type-info",
            type: "info",
          })
        }
      >
        Info
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.add({
            description: "The event cannot start before 8:00 AM.",
            id: "toast-type-warning",
            type: "warning",
          })
        }
      >
        Warning
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.add({
            description: "The event could not be created.",
            id: "toast-type-error",
            priority: "high",
            type: "error",
          })
        }
      >
        Error
      </Button>
    </div>
  );
}
