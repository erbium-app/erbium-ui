import { mkdir } from "node:fs/promises";
import path from "node:path";
import { atomicWrite } from "./project.ts";
import { openRegistry } from "./registry.ts";

const html = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const page = (title: string, body: string) =>
  `<!doctype html>
<html lang="en">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${html(title)}</title>
<style>
  :root { color-scheme: light dark; }
  body { font: 1rem/1.6 system-ui, sans-serif; max-width: 72ch; margin: 2rem auto; padding: 0 1rem; overflow-wrap: anywhere; }
  pre { padding: 1rem; border: 1px solid; overflow: auto; }
  summary { cursor: pointer; }
</style>
<main>${body}</main>
</html>
`;

const itemPage = (id: string) => `items/${id.slice(1)}.html`;

export const writeRegistrySite = async (output: string, location: string) => {
  const registry = await openRegistry(output, location);
  const history = await registry.history();
  const releases = history.toReversed();
  const entries = Object.entries(registry.items);

  const summaries = entries.map(([id]) => {
    const info = registry.catalog[id];

    return { id, title: info?.title ?? id, description: info?.description ?? "" };
  });

  await Promise.all(
    summaries.map(async ({ id, title, description }) => {
      const digest = registry.items[id];

      if (digest === undefined) {
        throw new Error(`Missing current revision for ${id}.`);
      }

      const { item } = await registry.load(id, digest);

      const files = (item.files ?? []).map(
        ({ target, content }) =>
          `<details><summary><code>${html(target)}</code></summary><pre><code>${html(content)}</code></pre></details>`,
      );

      let previous: string | undefined;

      const revisions = releases
        .flatMap(({ commit, date, items }) => {
          const next = items[id];
          const changed = next !== previous;
          previous = next;

          return changed && next !== undefined
            ? [
                `<li><a href="../../r/erbium/revisions/${next}.json">${html(date)} · ${html(commit.slice(0, 12))}</a></li>`,
              ]
            : [];
        })
        .toReversed();

      const dependencyLinks = (item.registryDependencies ?? []).map(
        (dependency) => `<li><code>${html(dependency)}</code></li>`,
      );

      const file = path.join(output, itemPage(id));
      await mkdir(path.dirname(file), { recursive: true });
      await atomicWrite(
        file,
        page(
          title,
          `<p><a href="../../index.html">Registry</a></p>
<h1>${html(title)}</h1><p>${html(description)}</p>
<p><code>erbium add ${html(id)} --registry &lt;url&gt;/r/erbium</code></p>
<p><a href="../../r/erbium/revisions/${digest}.json">Current snapshot</a></p>
${dependencyLinks.length > 0 ? `<h2>Registry dependencies</h2><ul>${dependencyLinks.join("")}</ul>` : ""}
${files.length > 0 ? `<h2>Source</h2>${files.join("\n")}` : ""}
${revisions.length > 0 ? `<h2>Published revisions</h2><ol>${revisions.join("")}</ol>` : ""}`,
        ),
      );
    }),
  );

  await Promise.all([
    atomicWrite(
      path.join(output, "index.html"),
      page(
        "Erbium registry",
        `<h1>Erbium registry</h1>
<p><a href="llms.txt">Agent index</a> · <a href="r/erbium/index.json">Registry index</a></p>
<ul>${summaries.map(({ id, title }) => `<li><a href="${itemPage(id)}">${html(title)}</a> <code>${html(id)}</code></li>`).join("\n")}</ul>`,
      ),
    ),
    atomicWrite(
      path.join(output, "llms.txt"),
      `# Erbium registry\n\n> Source, dependencies, and revisions for each installable item.\n\n## Items\n\n${summaries
        .map(({ id }) => `- [${id}](${itemPage(id)})`)
        .join("\n")}\n`,
    ),
  ]);
};
