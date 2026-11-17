import { Icon } from "@erbium/ui/components/icon";

import { toast } from "@erbium/ui/components/toast";

import { Marker, MarkerContent, MarkerIcon } from "@erbium/ui/components/marker";

export default function MarkerLinkButtonExample() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-8 py-12">
      <Marker
        aria-label="Choose option"
        render={<a aria-label="View details" href="#links-and-buttons" />}
      >
        <MarkerIcon>
          <Icon name="git-branch" />
        </MarkerIcon>
        <MarkerContent>View the pull request</MarkerContent>
      </Marker>
      <Marker
        aria-label="Choose option"
        render={
          <button
            aria-label="Choose option"
            type="button"
            className="transition-colors hover:text-foreground"
            onClick={() => {
              toast.add({ title: "You clicked the revert button" });
            }}
          />
        }
      >
        <MarkerIcon>
          <Icon name="rotate-ccw" />
        </MarkerIcon>
        <MarkerContent>Revert this change</MarkerContent>
      </Marker>
    </div>
  );
}
