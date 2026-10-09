import { HugeiconsIcon } from "@hugeicons/react";
import ArrowUp01Icon from "@hugeicons/core-free-icons/ArrowUp01Icon";
import { Button } from "@erbium/ui/components/button";
import { DirectionProvider } from "@erbium/ui/components/direction";

const Example = () => (
  <div className="flex gap-section">
    {(["ltr", "rtl"] as const).map((direction) => (
      <DirectionProvider direction={direction} key={direction}>
        <div dir={direction} className="flex flex-col items-start gap-related">
          <Button loading>{direction === "rtl" ? "در حال ذخیره" : "Saving"}</Button>
          <Button loading size="sm" variant="outline">
            {direction === "rtl" ? "لطفاً صبر کنید" : "Please wait"}
          </Button>
          <Button aria-label={direction === "rtl" ? "تازه‌سازی" : "Refresh"} loading size="icon">
            <HugeiconsIcon icon={ArrowUp01Icon} />
          </Button>
        </div>
      </DirectionProvider>
    ))}
  </div>
);

export default Example;
