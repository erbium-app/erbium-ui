import type { FulfilledReactPromise, PendingReactPromise, RejectedReactPromise } from "react";

/**
 * A promise that React's `use` reads synchronously once settled, so data loaded
 * ahead of render (by a route loader or a hover prefetch) renders in the same pass.
 */
export type TrackedRequest<T> =
  | PendingReactPromise<T>
  | FulfilledReactPromise<T>
  | RejectedReactPromise<T>;

const track = async <T>(request: TrackedRequest<T>) => {
  try {
    Object.assign(request, { status: "fulfilled", value: await request });
  } catch (error) {
    Object.assign(request, { reason: error, status: "rejected" });
  }
};

/** Caches one request per key. A rejected request is replaced on the next read so retries work. */
export const createRequestCache = <T>(load: (key: string) => Promise<T>) => {
  const requests = new Map<string, TrackedRequest<T>>();

  return (key: string): TrackedRequest<T> => {
    const cached = requests.get(key);

    if (cached && cached.status !== "rejected") {
      return cached;
    }

    const request: TrackedRequest<T> = Object.assign(load(key), { status: "pending" as const });

    void track(request);
    requests.set(key, request);

    return request;
  };
};
