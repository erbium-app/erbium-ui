import { useState } from "react";
import { Button } from "@erbium/ui/components/button";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@erbium/ui/components/empty";
import { Skeleton } from "@erbium/ui/components/skeleton";
import { ToggleGroup, ToggleGroupItem } from "@erbium/ui/components/toggle-group";
import { useSimulatedFetch } from "../../loading";
import { members, sampleMembers } from "../fixtures";
import type { Member } from "../fixtures";
import { SkeletonMemberList } from "./skeleton-avatar";

// Stable, so the request only restarts when the outcome changes.
const noMembers: Member[] = [];

type Outcome = "rows" | "empty" | "error";

/**
 * One region, every state. An `Error` renders Erbium's error alert with its message; `empty` shows
 * `emptyMessage`. Each replaces the skeleton with the same crossfade as content.
 */
export const defaultProps = {} satisfies { latency?: number };

export default function SkeletonStatesExample({ latency }: { latency?: number } = defaultProps) {
  const [outcome, setOutcome] = useState<Outcome>("rows");

  const request = useSimulatedFetch(outcome === "empty" ? noMembers : members, {
    fail: outcome === "error",
    latency,
  });

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-group">
      <ToggleGroup
        aria-label="Response"
        value={[outcome]}
        onValueChange={(value) => {
          const [next] = value;

          if (next === "rows" || next === "empty" || next === "error") {
            setOutcome(next);
            request.reload();
          }
        }}
      >
        <ToggleGroupItem value="rows">Rows</ToggleGroupItem>
        <ToggleGroupItem value="empty">Empty</ToggleGroupItem>
        <ToggleGroupItem value="error">Error</ToggleGroupItem>
      </ToggleGroup>
      <Skeleton
        data={request.data}
        sample={sampleMembers}
        loading={request.loading}
        error={request.error}
        empty={request.data?.length === 0}
        emptyMessage={
          <Empty>
            <EmptyHeader>
              <EmptyTitle>No members yet</EmptyTitle>
              <EmptyDescription>Invite someone to start collaborating.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        }
        label="Loading members"
        className="w-full"
      >
        {(value) => <SkeletonMemberList members={value} />}
      </Skeleton>
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          request.reload();
        }}
        disabled={request.loading}
      >
        Try again
      </Button>
    </div>
  );
}
