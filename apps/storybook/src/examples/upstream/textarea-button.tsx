import { Button } from "@erbium/ui/components/button";
import { Textarea } from "@erbium/ui/components/textarea";

export function TextareaButton() {
  return (
    <div className="grid w-full gap-2">
      <Textarea placeholder="Type your message here." />
      <Button>Send message</Button>
    </div>
  );
}
