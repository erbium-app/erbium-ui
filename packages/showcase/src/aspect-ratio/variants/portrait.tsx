import { AspectRatio } from "@erbium/ui/components/aspect-ratio";

export default function AspectRatioPortraitExample() {
  return (
    <div className="w-40">
      <AspectRatio ratio={9 / 16}>
        <div className="flex size-full items-center justify-center rounded-lg bg-muted">
          Portrait 9:16
        </div>
      </AspectRatio>
    </div>
  );
}
