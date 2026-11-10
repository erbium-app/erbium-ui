import type { ShowcaseStory } from "@erbium/showcase/catalog";
import type { FulfilledReactPromise, PendingReactPromise, RejectedReactPromise } from "react";

interface ExampleModule {
  default: ShowcaseStory["render"];
}

// React reads `status` and `value` synchronously, so a module loaded by the route
// loader renders in the same pass instead of suspending. Server rendering awaits the
// same promise, which puts the example markup in the prerendered HTML.
type ExampleRequest =
  | PendingReactPromise<ExampleModule>
  | FulfilledReactPromise<ExampleModule>
  | RejectedReactPromise<ExampleModule>;

const examples = import.meta.glob<ExampleModule>(
  "../../../../packages/showcase/src/*/variants/*.tsx",
);

const track = async (request: ExampleRequest) => {
  try {
    Object.assign(request, { status: "fulfilled", value: await request });
  } catch (error) {
    Object.assign(request, { reason: error, status: "rejected" });
  }
};

const requests = new Map<string, ExampleRequest>();

export const exampleRequest = (name: string, slug: string): ExampleRequest => {
  const key = `../../../../packages/showcase/src/${name}/variants/${slug}.tsx`;
  const cached = requests.get(key);

  // A failed chunk request stays retryable; the error boundary resets with a new request.
  if (cached && cached.status !== "rejected") {
    return cached;
  }

  const load = Object.hasOwn(examples, key) ? examples[key] : undefined;

  const request: ExampleRequest = Object.assign(
    load ? load() : Promise.reject(new Error(`Missing interactive example: ${name}/${slug}`)),
    { status: "pending" as const },
  );

  void track(request);
  requests.set(key, request);

  return request;
};

/** Starts every example request for a page; failures surface in each preview's boundary. */
export const preloadExamples = async (name: string, slugs: readonly string[]) => {
  await Promise.allSettled(slugs.map(async (slug) => await exampleRequest(name, slug)));
};
