import { Component, lazy, Suspense, useState, type ReactNode } from "react";
import { loadShowcase, type ShowcaseStory } from "@erbium/showcase/catalog";
import { ShowcaseProviders, ShowcaseSurface } from "@erbium/showcase/preview";

function optionLabel(value: unknown) {
  if (value === undefined) return "Default";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return JSON.stringify(value) ?? "Default";
}

const previews = new Map<string, ReturnType<typeof lazy>>();
export class PreviewErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
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
function ObjectControl({
  value,
  onChange,
}: {
  value: unknown;
  onChange: (value: unknown) => void;
}) {
  const [draft, setDraft] = useState(JSON.stringify(value));
  const [error, setError] = useState("");
  function commit() {
    try {
      const parsed: unknown = JSON.parse(draft);
      if (
        Array.isArray(value) &&
        (!Array.isArray(parsed) ||
          parsed.some((item: unknown) => typeof item !== "number" || !Number.isFinite(item)))
      )
        throw new Error("Enter an array of numbers.");
      onChange(parsed);
      setError("");
    } catch {
      setError("Enter a valid JSON value matching this control.");
    }
  }
  return (
    <>
      <textarea
        aria-label="JSON value"
        value={draft}
        aria-invalid={Boolean(error)}
        onChange={(event) => setDraft(event.target.value)}
        onBlur={commit}
      />
      <span role="status">{error}</span>
    </>
  );
}

function Preview({ story }: { story: ShowcaseStory }) {
  const [args, setArgs] = useState(story.args ?? {});
  const Example = story.render;
  return (
    <>
      <ShowcaseSurface>
        <Example {...args} />
      </ShowcaseSurface>
      {story.argTypes && (
        <fieldset className="preview-controls">
          <legend>Controls</legend>
          {Object.entries(story.argTypes).map(([name, settings]) => {
            const type =
              typeof settings.control === "string"
                ? settings.control
                : settings.control && settings.control.type;
            if (!type) return null;
            const value = args[name];
            return (
              <label key={name}>
                {name}
                {settings.description && <span>{settings.description}</span>}
                {settings.options ? (
                  <select
                    value={String(settings.options.indexOf(value))}
                    onChange={(event) =>
                      setArgs({ ...args, [name]: settings.options?.[Number(event.target.value)] })
                    }
                  >
                    {settings.options.map((option, index) => (
                      <option key={index} value={index}>
                        {optionLabel(option)}
                      </option>
                    ))}
                  </select>
                ) : type === "boolean" ? (
                  <input
                    type="checkbox"
                    checked={Boolean(value)}
                    onChange={(event) => setArgs({ ...args, [name]: event.target.checked })}
                  />
                ) : type === "object" ? (
                  <ObjectControl
                    value={value}
                    onChange={(value) => setArgs({ ...args, [name]: value })}
                  />
                ) : ["text", "number", "range"].includes(type) ? (
                  <input
                    type={type}
                    value={typeof value === "string" || typeof value === "number" ? value : ""}
                    {...(typeof settings.control === "object"
                      ? {
                          min: settings.control.min,
                          max: settings.control.max,
                          step: settings.control.step,
                        }
                      : {})}
                    onChange={(event) =>
                      setArgs({
                        ...args,
                        [name]: type === "text" ? event.target.value : event.target.valueAsNumber,
                      })
                    }
                  />
                ) : null}
              </label>
            );
          })}
        </fieldset>
      )}
    </>
  );
}
export default function ComponentPreview({
  name,
  variant = "Overview",
}: {
  name: string;
  variant?: string;
}) {
  const key = `${name}/${variant}`;
  if (!previews.has(key))
    previews.set(
      key,
      lazy(async () => {
        const catalog = await loadShowcase(name);
        const story = catalog[variant] as ShowcaseStory | undefined;
        if (!story) throw new Error(`Missing interactive showcase: ${key}`);
        return { default: () => <Preview story={story} /> };
      }),
    );
  const Example = previews.get(key)!;
  return (
    <ShowcaseProviders>
      <PreviewErrorBoundary key={key}>
        <Suspense fallback={<p role="status">Loading preview…</p>}>
          <Example />
        </Suspense>
      </PreviewErrorBoundary>
    </ShowcaseProviders>
  );
}
