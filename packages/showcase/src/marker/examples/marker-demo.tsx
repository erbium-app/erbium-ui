import { Marker, MarkerContent } from "@erbium/ui/components/marker";

export default function MarkerExample() {
  return (
    <div className="flex gap-3">
      <Marker>
        <MarkerContent>New</MarkerContent>
      </Marker>
      <Marker variant="border">
        <MarkerContent>Updated</MarkerContent>
      </Marker>
    </div>
  );
}
