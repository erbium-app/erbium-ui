import { Badge } from "@erbium/ui/components/badge";

export const BadgeWithSpinner = () => (
  <div className="flex flex-wrap gap-section">
    {(["ltr", "rtl"] as const).map((direction) => (
      <div key={direction} dir={direction} className="flex flex-wrap gap-related">
        <Badge variant="error" loading>
          {direction === "rtl" ? "در حال حذف" : "Deleting"}
        </Badge>
        <Badge variant="secondary" loading>
          {direction === "rtl" ? "در حال تولید" : "Generating"}
        </Badge>
      </div>
    ))}
  </div>
);
