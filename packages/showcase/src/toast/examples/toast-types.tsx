import { Button } from "@erbium/ui/components/button";
import { toast } from "@erbium/ui/components/toast";

export default function ToastTypesExample() {
  return (
    <div className="flex flex-wrap gap-related">
      <Button
        variant="outline"
        onClick={() => {
          void toast.add({ description: "Event has been created.", id: "toast-type-default" });
        }}
      >
        Default
      </Button>
      <Button
        variant="success"
        onClick={() => {
          void toast.add({
            description: "Event has been created.",
            id: "toast-type-success",
            type: "success",
          });
        }}
      >
        Success
      </Button>
      <Button
        variant="info"
        onClick={() => {
          void toast.add({
            description: "Arrive 10 minutes before the event.",
            id: "toast-type-info",
            type: "info",
          });
        }}
      >
        Info
      </Button>
      <Button
        variant="warning"
        onClick={() => {
          void toast.add({
            description: "The event cannot start before 8:00 AM.",
            id: "toast-type-warning",
            type: "warning",
          });
        }}
      >
        Warning
      </Button>
      <Button
        variant="error"
        onClick={() => {
          void toast.add({
            description: "The event could not be created.",
            id: "toast-type-error",
            priority: "high",
            type: "error",
          });
        }}
      >
        Error
      </Button>
    </div>
  );
}
