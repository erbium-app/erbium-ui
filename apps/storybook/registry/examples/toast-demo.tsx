// @ts-nocheck
import { Button } from "../components/button";
import { toast } from "../components/toast";
export default function Demo() {
  return (
    <>
      <Button
        onClick={() => toast.add({ title: "Saved", description: "Your changes have been saved." })}
      >
        Show toast
      </Button>
    </>
  );
}
