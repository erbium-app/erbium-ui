import { execFileSync } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as Schema from "effect/Schema";
import { atomicWrite } from "./project.ts";
import { parseJson, revision, snapshotFor } from "./revision.ts";

const root = fileURLToPath(new URL("../../..", import.meta.url));

const decodeCatalog = Schema.decodeUnknownSync(
  Schema.Struct({ items: Schema.Array(Schema.Record(Schema.String, Schema.Json)) }),
);

const itemName = Schema.decodeUnknownSync(Schema.Struct({ name: Schema.String }));

// Catalogs from this commit onward are eligible for adoption and baseline lookup.
const firstRegistryCommit = "886b33bb9fb8d66dfd5e6a9a2ffe687ac341b88a";

const catalogs = [
  ["erbium", "packages/ui/public/r/registry.json"],
  ["erbium-examples", "packages/showcase/public/r/registry.json"],
] as const;

const git = (args: string[]): string =>
  execFileSync("git", args, { cwd: root, encoding: "utf-8", maxBuffer: 50 * 1024 * 1024 });

export const publishRevisions = async (output: string, history: boolean): Promise<void> => {
  const revisions = path.join(output, "revisions");
  await mkdir(revisions, { recursive: true });
  const written = new Set<string>();
  const items: Record<string, string> = {};

  const collect = (namespace: string, text: string, current: boolean) => {
    const records = decodeCatalog(parseJson(text)).items;
    const snapshots = [];

    for (const record of records) {
      const id = `@${namespace}/${itemName(record).name}`;
      const value = snapshotFor(id, record);
      const digest = revision(value);

      if (current) {
        items[id] = digest;
      }

      if (!written.has(digest)) {
        written.add(digest);
        snapshots.push({ digest, value });
      }
    }

    return snapshots;
  };

  if (history && git(["rev-parse", "--is-shallow-repository"]).trim() !== "false") {
    throw new Error("Registry publishing requires full Git history. Use fetch-depth: 0.");
  }

  const current = await Promise.all(
    catalogs.map(async ([namespace, file]) =>
      collect(namespace, await readFile(path.join(root, file), "utf-8"), true),
    ),
  );

  const previous = history
    ? catalogs.flatMap(([namespace, file]) => {
        const commits = [
          firstRegistryCommit,
          ...git([
            "log",
            "--first-parent",
            "--format=%H",
            `${firstRegistryCommit}..HEAD`,
            "--",
            file,
          ])
            .trim()
            .split("\n")
            .filter(Boolean),
        ];

        return commits.flatMap((commit) =>
          collect(namespace, git(["show", `${commit}:${file}`]), false),
        );
      })
    : [];

  await Promise.all(
    [...current.flat(), ...previous].map(async ({ digest, value }) => {
      await writeFile(path.join(revisions, `${digest}.json`), `${JSON.stringify(value)}\n`, {
        flag: "wx",
      }).catch(async () => {
        const existing = await readFile(path.join(revisions, `${digest}.json`), "utf-8");

        if (existing !== `${JSON.stringify(value)}\n`) {
          throw new Error(`Published snapshot differs from revision ${digest}.`);
        }
      });
    }),
  );

  const ordered = Object.fromEntries(
    Object.entries(items).toSorted(([left], [right]) => left.localeCompare(right, "en")),
  );

  await atomicWrite(
    path.join(output, "index.json"),
    `${JSON.stringify({ version: 1, items: ordered })}\n`,
  );
};
