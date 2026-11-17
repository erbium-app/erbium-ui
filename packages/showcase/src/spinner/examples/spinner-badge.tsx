import { Badge } from "@erbium/ui/components/badge";

export default function SpinnerBadgeExample() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-group">
      <Badge loading variant="default">
        default
      </Badge>
      <Badge loading variant="secondary">
        secondary
      </Badge>
      <Badge loading variant="outline">
        outline
      </Badge>
      <Badge loading variant="ghost">
        ghost
      </Badge>
      <Badge loading variant="link">
        link
      </Badge>
      <Badge loading variant="error">
        error
      </Badge>
      <Badge loading variant="info">
        info
      </Badge>
      <Badge loading variant="success">
        success
      </Badge>
      <Badge loading variant="warning">
        warning
      </Badge>
      <Badge loading variant="ghost-error">
        ghost-error
      </Badge>
      <Badge loading variant="ghost-info">
        ghost-info
      </Badge>
      <Badge loading variant="ghost-success">
        ghost-success
      </Badge>
      <Badge loading variant="ghost-warning">
        ghost-warning
      </Badge>
      <Badge loading variant="tag-blue">
        tag-blue
      </Badge>
      <Badge loading variant="tag-cyan">
        tag-cyan
      </Badge>
      <Badge loading variant="tag-gray">
        tag-gray
      </Badge>
      <Badge loading variant="tag-green">
        tag-green
      </Badge>
      <Badge loading variant="tag-magenta">
        tag-magenta
      </Badge>
      <Badge loading variant="tag-orange">
        tag-orange
      </Badge>
      <Badge loading variant="tag-purple">
        tag-purple
      </Badge>
      <Badge loading variant="tag-red">
        tag-red
      </Badge>
      <Badge loading variant="tag-yellow">
        tag-yellow
      </Badge>
    </div>
  );
}
