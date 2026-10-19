import { AspectRatio } from "@erbium/ui/components/aspect-ratio";

export default function Demo() {
  return (
    <div className="w-80">
      <AspectRatio ratio={16 / 9}>
        <div className="flex size-full items-center justify-center rounded-lg bg-muted">
          16:9 media area
        </div>
      </AspectRatio>
    </div>
  );
}
