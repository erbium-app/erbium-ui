import { Button } from "@erbium/ui/components/button";

const SpinnerButton = () => (
  <div className="flex flex-wrap items-center justify-center gap-group">
    <Button loading variant="default">
      default
    </Button>
    <Button loading variant="secondary">
      secondary
    </Button>
    <Button loading variant="outline">
      outline
    </Button>
    <Button loading variant="ghost">
      ghost
    </Button>
    <Button loading variant="link">
      link
    </Button>
    <Button loading variant="embedded">
      embedded
    </Button>
    <Button loading variant="error">
      error
    </Button>
    <Button loading variant="info">
      info
    </Button>
    <Button loading variant="success">
      success
    </Button>
    <Button loading variant="warning">
      warning
    </Button>
    <Button loading variant="ghost-error">
      ghost-error
    </Button>
    <Button loading variant="ghost-info">
      ghost-info
    </Button>
    <Button loading variant="ghost-success">
      ghost-success
    </Button>
    <Button loading variant="ghost-warning">
      ghost-warning
    </Button>
  </div>
);

export default SpinnerButton;
