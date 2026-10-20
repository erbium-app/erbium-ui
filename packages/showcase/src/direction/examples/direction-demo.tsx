import { DirectionProvider } from "@erbium/ui/components/direction";
import { Button } from "@erbium/ui/components/button";

const Demo = () => (
  <div className="flex gap-8">
    <DirectionProvider direction="ltr">
      <Button>Left to right</Button>
    </DirectionProvider>
    <DirectionProvider direction="rtl">
      <Button>من اليمين إلى اليسار</Button>
    </DirectionProvider>
  </div>
);

export default Demo;
