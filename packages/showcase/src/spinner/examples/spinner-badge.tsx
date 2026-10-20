import { Badge } from "@erbium/ui/components/badge";

const SpinnerBadge = () => (
  <div className="flex items-center gap-group [--radius:1.2rem]">
    <Badge loading>Syncing</Badge>
    <Badge variant="secondary" loading>
      Updating
    </Badge>
    <Badge variant="outline" loading>
      Processing
    </Badge>
  </div>
);

export default SpinnerBadge;
