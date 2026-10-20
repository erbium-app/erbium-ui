import { Badge } from "@erbium/ui/components/badge";

const BadgeDemo = () => (
  <div className="flex flex-col items-center gap-related">
    <div className="flex w-full flex-wrap gap-related">
      <Badge>Badge</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="error">Error</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>
    <div className="flex w-full flex-wrap gap-related">
      <Badge variant="success" statusIcon>
        Verified
      </Badge>
      <Badge className="min-w-5 rounded-full font-mono tabular-nums">8</Badge>
      <Badge className="min-w-5 rounded-full font-mono tabular-nums" variant="error">
        99
      </Badge>
      <Badge className="min-w-5 rounded-full font-mono tabular-nums" variant="outline">
        20+
      </Badge>
    </div>
  </div>
);

export default BadgeDemo;
