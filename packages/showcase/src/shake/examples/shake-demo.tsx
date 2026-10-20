import { useRef } from "react";
import { shake } from "@erbium/ui/lib/shake";
import { Button } from "@erbium/ui/components/button";

const Demo = () => {
  const ref = useRef<HTMLButtonElement>(null);

  return (
    <Button
      ref={ref}
      variant="error"
      onClick={() => {
        shake(ref.current);
      }}
    >
      Replay error feedback
    </Button>
  );
};

export default Demo;
