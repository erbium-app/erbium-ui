import { Button } from "@erbium/ui/components/button";
import { toast } from "@erbium/ui/components/toast";

const Example = () => (
  <Button
    variant="outline"
    onClick={() => {
      for (let index = 1; index <= 5; index += 1) {
        toast.add({ timeout: 0, title: `Queue item ${index}` });
      }
    }}
  >
    Show five toasts
  </Button>
);

export default Example;
