import { use, useState } from "react";
import { Button } from "@erbium/ui/components/button";
import { SkeletonSuspense } from "@erbium/ui/components/skeleton";
import { defaultLatency } from "../../loading";
import { profile, sampleProfile } from "../fixtures";
import type { Profile } from "../fixtures";
import { ProfileCard } from "./skeleton-demo";

const wait = async (ms: number) => {
  // Browsers have no promise-based timer, so the delay wraps `setTimeout`.
  // oxlint-disable-next-line promise/avoid-new
  await new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

const fetchProfile = async (latency: number): Promise<Profile> => {
  await wait(latency);

  return profile;
};

const LoadedProfile = ({ request }: { request: Promise<Profile> }) => (
  <ProfileCard profile={use(request)} />
);

/**
 * A Suspense boundary whose fallback is the component rendered from sample data, measured into a
 * skeleton. Use it where the data comes from `use(promise)` or a suspending query.
 */
export const SkeletonSuspenseExample = ({ latency = defaultLatency }: { latency?: number }) => {
  const [suspended, setSuspended] = useState(() => ({
    attempt: 0,
    request: fetchProfile(latency),
  }));

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-group">
      <SkeletonSuspense
        key={suspended.attempt}
        skeleton={<ProfileCard profile={sampleProfile} />}
        label="Loading profile"
        className="w-full"
      >
        <LoadedProfile request={suspended.request} />
      </SkeletonSuspense>
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          setSuspended((last) => ({ attempt: last.attempt + 1, request: fetchProfile(latency) }));
        }}
      >
        Suspend again
      </Button>
    </div>
  );
};
