import { Icon } from "@erbium/ui/components/icon";
import { Button } from "@erbium/ui/components/button";
import { DirectionProvider } from "@erbium/ui/components/direction";

export default function ButtonLoadingDirectionsExample() {
  return (
    <div className="flex gap-section">
      {(["ltr", "rtl"] as const).map((direction) => (
        <DirectionProvider direction={direction} key={direction}>
          <div dir={direction} className="flex flex-col items-start gap-related">
            <Button loading>{direction === "rtl" ? "در حال ذخیره" : "Saving"}</Button>
            <Button loading size="sm" variant="outline">
              {direction === "rtl" ? "لطفاً صبر کنید" : "Please wait"}
            </Button>
            <Button aria-label={direction === "rtl" ? "تازه‌سازی" : "Refresh"} loading size="icon">
              <Icon name="arrow-up-01" />
            </Button>
          </div>
        </DirectionProvider>
      ))}
    </div>
  );
}
