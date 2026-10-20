import { Icon } from "@erbium/ui/components/icon";

import { toast } from "@erbium/ui/components/toast";

import { Marker, MarkerContent, MarkerIcon } from "@erbium/ui/components/marker";

export const MarkerLinkButtonDemo = () => (
  <div className="flex w-full max-w-sm flex-col gap-8 py-12">
    <Marker render={<a href="#links-and-buttons" />}>
      <MarkerIcon>
        <Icon name="git-branch" />
      </MarkerIcon>
      <MarkerContent>View the pull request</MarkerContent>
    </Marker>
    <Marker
      render={
        <button
          type="button"
          className="transition-colors hover:text-foreground"
          onClick={() => toast.add({ title: "You clicked the revert button" })}
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
