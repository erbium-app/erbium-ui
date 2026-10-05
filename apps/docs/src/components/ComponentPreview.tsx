import { Component, use, Suspense, useState, useEffect, useRef, type ReactNode } from "react";
import { loadShowcase, type ShowcaseStory } from "@erbium/showcase/catalog";
import { ShowcaseProviders, ShowcaseSurface } from "@erbium/showcase/preview";
import { Spinner } from "@erbium/ui/components/spinner";

const previews = new Map<string, Promise<ShowcaseStory>>();
function storyResource(name: string, variant: string) {
  const key = `${name}/${variant}`;
  let resource = previews.get(key);
  if (!resource) {
    resource = loadShowcase(name).then((catalog) => {
      const story = catalog[variant] as ShowcaseStory | undefined;
      if (!story) throw new Error(`Missing interactive showcase: ${key}`);
      return story;
    });
    previews.set(key, resource);
  }
  return resource;
}
function LoadedPreview({ name, variant }: { name: string; variant: string }) {
  const story = use(storyResource(name, variant));
  return <Preview story={story} />;
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
      showcase?.querySelector<import("../lib/showcase-controls").ControlsElement>(
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
  variant = "Overview",
  loading,
}: {
  name: string;
  variant?: string;
  loading?: ReactNode;
}) {
  const key = `${name}/${variant}`;
  return (
    <ShowcaseProviders>
      <PreviewErrorBoundary key={key}>
        <Suspense fallback={loading ?? <Spinner aria-label="Loading preview" />}>
          <LoadedPreview name={name} variant={variant} />
        </Suspense>
      </PreviewErrorBoundary>
    </ShowcaseProviders>
  );
}
