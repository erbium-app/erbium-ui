import { useState } from "react";
import { Control } from "@erbium/ui/components/control";

export default function ControlActionExample() {
  const [reset, setReset] = useState(false);

  return (
    <Control.Action
      label={reset ? "Settings reset" : "Reset settings"}
      className="w-72"
      onClick={() => {
        setReset(true);
      }}
    />
  );
}
