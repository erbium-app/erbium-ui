import { Marker, MarkerContent } from "@erbium/ui/components/marker";

const Demo = () => (
  <div className="flex gap-3">
    <Marker>
      <MarkerContent>New</MarkerContent>
    </Marker>
    <Marker variant="border">
      <MarkerContent>Updated</MarkerContent>
    </Marker>
  </div>
);

export default Demo;
