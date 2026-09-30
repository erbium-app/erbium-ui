// @ts-nocheck
import { Badge } from "../components/badge";

export default function SpinnerBadge() {
  return (
    <div className="flex items-center gap-4 [--radius:1.2rem]">
      <Badge loading>Syncing</Badge>
      <Badge variant="secondary" loading>
        Updating
      </Badge>
      <Badge variant="outline" loading>
        Processing
      </Badge>
    </div>
  );
}
