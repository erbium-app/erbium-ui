import { Component, use, Suspense, useState, useEffect, useRef, type ReactNode } from "react";
import type { ShowcaseStory } from "@erbium/showcase/catalog";
import { ShowcaseProviders, ShowcaseSurface } from "@erbium/showcase/preview";
import { Spinner } from "@erbium/ui/components/spinner";

const examples = import.meta.glob<{ default: ShowcaseStory["render"] }>(
  "../../../../../packages/showcase/src/*/variants/*.tsx",
);
const previews = new Map<string, Promise<{ default: ShowcaseStory["render"] }>>();
function exampleResource(name: string, slug: string) {
  const key = `../../../../../packages/showcase/src/${name}/variants/${slug}.tsx`;
  const loader = examples[key];
  if (!loader) throw new Error(`Missing interactive example: ${name}/${slug}`);
  let resource = previews.get(key);
  if (!resource) {
    resource = loader();
    previews.set(key, resource);
  }
  return resource;
}
function LoadedPreview({
  name,
  slug,
  args,
}: {
  name: string;
  slug: string;
  args: Record<string, unknown>;
}) {
  const { default: Example } = use(exampleResource(name, slug));
  return <Preview story={{ render: Example, args }} />;
}
class PreviewErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed)
      return (
        <div role="alert">
          <p>This preview could not load.</p>
          <button type="button" onClick={() => window.location.reload()}>
            Reload page
          </button>
        </div>
      );
    return this.props.children;
  }
}
function Preview({ story }: { story: ShowcaseStory }) {
  const [args, setArgs] = useState(story.args ?? {});
  const [revision, setRevision] = useState(0);
  const container = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const showcase = container.current?.closest("showcase-tabs");
    const controls =
      showcase?.querySelector<import("@/features/showcase/controls").ControlsElement>(
        "showcase-controls",
      );
    if (controls?.values) setArgs(controls.values);
    const update = (event: Event) => {
      if (event instanceof CustomEvent) setArgs(event.detail);
    };
    const reset = () => setRevision((value) => value + 1);
    showcase?.addEventListener("showcase-preview-reset", reset);
    showcase?.addEventListener("showcase-args-change", update);
    return () => {
      showcase?.removeEventListener("showcase-args-change", update);
      showcase?.removeEventListener("showcase-preview-reset", reset);
    };
  }, []);
  const Example = story.render;
  return (
    <div ref={container} className="w-full min-w-0">
      <ShowcaseSurface>
        <Example
          key={`${revision}-${JSON.stringify(Object.entries(args).filter(([name]) => name.startsWith("default")))}`}
          {...args}
        />
      </ShowcaseSurface>
    </div>
  );
}
export default function ComponentPreview({
  name,
  slug,
  args = {},
  loading,
}: {
  name: string;
  slug: string;
  args?: Record<string, unknown>;
  loading?: ReactNode;
}) {
  const key = `${name}/${slug}`;
  return (
    <ShowcaseProviders>
      <PreviewErrorBoundary key={key}>
        <Suspense fallback={loading ?? <Spinner aria-label="Loading preview" />}>
          <LoadedPreview name={name} slug={slug} args={args} />
        </Suspense>
      </PreviewErrorBoundary>
    </ShowcaseProviders>
  );
}
