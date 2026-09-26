// @ts-nocheck
import { DirectionProvider } from "../components/direction";
import { Button } from "../components/button";
export default function Demo() {
  return (
    <div className="flex gap-8">
      <DirectionProvider direction="ltr">
        <Button>Left to right</Button>
      </DirectionProvider>
      <DirectionProvider direction="rtl">
        <Button>من اليمين إلى اليسار</Button>
      </DirectionProvider>
    </div>
  );
}
