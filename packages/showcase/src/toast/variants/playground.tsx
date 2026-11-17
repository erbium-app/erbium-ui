import { Button } from "@erbium/ui/components/button";
import { toast } from "@erbium/ui/components/toast";

export const defaultProps = {
  description: "Saved successfully",
  type: "success",
} satisfies { type: "success" | "info" | "warning" | "error"; description: string };

export default function ToastPlaygroundExample(
  args: { type: "success" | "info" | "warning" | "error"; description: string } = defaultProps,
) {
  return (
    <Button
      variant={args.type}
      onClick={() => {
        void toast.add({
          description: args.description,
          id: `toast-playground-${args.type}`,
          type: args.type,
        });
      }}
    >
      Show toast
    </Button>
  );
}
