/// <reference lib="es2024.promise" />
import { Button } from "@erbium/ui/components/button";
import { toast } from "@erbium/ui/components/toast";

const showToast = () => {
  const { promise, resolve } = Promise.withResolvers<{ name: string }>();
  window.setTimeout(() => {
    resolve({ name: "Event" });
  }, 2000);
  void toast.promise(promise, {
    error: "Could not create event.",
    loading: "Creating event…",
    success: (data) => `${data.name} created.`,
  });
};

export default function ToastPromiseExample() {
  return (
    <Button variant="outline" onClick={showToast}>
      Create Event
    </Button>
  );
}
