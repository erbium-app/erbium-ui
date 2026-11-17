import { AspectRatio } from "@erbium/ui/components/aspect-ratio";

export default function AspectRatioSquareExample() {
  return (
    <div className="w-60">
      <AspectRatio ratio={1}>
        <div className="flex size-full items-center justify-center rounded-lg bg-muted">
          Square 1:1
        </div>
      </AspectRatio>
    </div>
  );
}
