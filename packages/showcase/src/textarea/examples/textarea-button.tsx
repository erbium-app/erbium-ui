import { Button } from "@erbium/ui/components/button";
import { Textarea } from "@erbium/ui/components/textarea";

export default function TextareaButtonExample() {
  return (
    <div className="grid w-full gap-related">
      <Textarea placeholder="Type your message here." />
      <Button>Send message</Button>
    </div>
  );
}
