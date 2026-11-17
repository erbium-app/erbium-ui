import { Skeleton } from "@erbium/ui/components/skeleton";
import { useSimulatedFetch } from "../../loading";
import { profile, sampleProfile } from "../fixtures";
import { ProfileCard } from "./skeleton-demo";

/**
 * Pass `loading` with the data still on screen. The skeleton is drawn from that data, so it matches
 * exactly, and the new data crossfades in. Refetches that answer within 150 ms show no skeleton.
 */
export const defaultProps = {} satisfies { latency?: number };

export default function SkeletonRefetchExample({ latency }: { latency?: number } = defaultProps) {
  const request = useSimulatedFetch(profile, { latency });

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-group">
      <Skeleton
        data={request.data}
        sample={sampleProfile}
        loading={request.loading}
        label="Refreshing profile"
        className="w-full"
      >
        {(value) => <ProfileCard profile={value} />}
      </Skeleton>
    </div>
  );
}
