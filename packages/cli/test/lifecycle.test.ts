import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { test } from "node:test";
import { hash, revision, snapshotFor } from "../src/revision.ts";

const bin = path.resolve(import.meta.dirname, "../dist/index.js");
const source = path.join("src", "primitives", "button.tsx");
const base = 'export const label = "base";\n\n\n\nexport const style = "base";\n';

const fixture = async () => {
  const root = await mkdtemp(path.join(tmpdir(), "erbium-test-"));
  const project = path.join(root, "app");
  const registry = path.join(root, "registry");
  await mkdir(path.join(project, "src", "primitives"), { recursive: true });
  await mkdir(path.join(registry, "revisions"), { recursive: true });
  await Promise.all([
    writeFile(path.join(project, "package.json"), JSON.stringify({ name: "cli-fixture" })),
    writeFile(
      path.join(project, "components.json"),
      JSON.stringify({
        tsx: true,
        aliases: { components: "@app/components", ui: "@app/primitives" },
      }),
    ),
    writeFile(
      path.join(project, "tsconfig.json"),
      JSON.stringify({
        compilerOptions: { paths: { "@app/*": ["./src/*"] } },
      }),
    ),
  ]);

  const release = async (content: string, shared?: string) => {
    const sources =
      shared === undefined
        ? [["@erbium/button", "button", content]]
        : [
            ["@erbium/button", "button", content],
            ["@erbium-examples/button-demo", "button-demo", shared],
          ];

    const entries = await Promise.all(
      sources.map(async ([id, name, code]) => {
        const item = snapshotFor(id, {
          name,
          type: "registry:ui",
          files: [
            {
              path: "src/button.tsx",
              target: "@ui/button.tsx",
              type: "registry:ui",
              content: code,
            },
          ],
        });

        const digest = revision(item);
        await writeFile(path.join(registry, "revisions", `${digest}.json`), JSON.stringify(item));

        return [id, digest] as const;
      }),
    );

    const items = Object.fromEntries(entries);
    await writeFile(path.join(registry, "index.json"), JSON.stringify({ version: 1, items }));

    return items;
  };

  const args = (...command: string[]) => [
    bin,
    ...command,
    "--cwd",
    project,
    "--registry",
    registry,
  ];

  const run = (...command: string[]) =>
    execFileSync(process.execPath, args(...command), { encoding: "utf-8" });

  const fail = (...command: string[]) =>
    spawnSync(process.execPath, args(...command), { encoding: "utf-8" });

  await release(base);

  return { root, project, registry, release, run, fail };
};

void test("adopts an existing file, then merges successive revisions and refuses overlapping edits", async (context) => {
  const { root, project, release, run, fail } = await fixture();
  context.after(async () => {
    await rm(root, { recursive: true, force: true });
  });
  const file = path.join(project, source);
  await release(`/* Registry-only leading comment. */\n${base}`);
  await writeFile(file, base);
  run("adopt", "button");
  assert.equal(await readFile(file, "utf-8"), base);

  const local = base.replace('label = "base"', 'label = "local"');
  const upstream = base.replace('style = "base"', 'style = "new"');
  await writeFile(file, local);
  await release(upstream);
  assert.match(run("status", "--json"), /"updateAvailable": true/u);
  assert.match(run("diff", "button"), /style = "new"/u);
  assert.match(run("diff", "button", "--local"), /label = "local"/u);
  run("update", "--dry-run");
  assert.equal(await readFile(file, "utf-8"), local);
  run("update");
  assert.equal(
    await readFile(file, "utf-8"),
    upstream.replace('label = "base"', 'label = "local"'),
  );

  const next = upstream.replace('style = "new"', 'style = "newer"');
  await release(next);
  run("update");
  const merged = next.replace('label = "base"', 'label = "local"');
  assert.equal(await readFile(file, "utf-8"), merged);

  await release(next.replace('label = "base"', 'label = "upstream"'));
  const conflict = fail("update");
  assert.notEqual(conflict.status, 0);
  assert.match(conflict.stdout + conflict.stderr, /Both sides edited the same lines/u);
  assert.equal(await readFile(file, "utf-8"), merged);
  assert.match(run("check", "--json"), /"modified": true/u);
});

void test("adds a tracked file and reports missing files offline", async (context) => {
  const { root, project, run, fail } = await fixture();
  context.after(async () => {
    await rm(root, { recursive: true, force: true });
  });
  const file = path.join(project, source);
  run("add", "button");
  assert.equal(await readFile(file, "utf-8"), base);
  run("check");
  await rm(file);
  const check = fail("check");
  assert.notEqual(check.status, 0);
  assert.match(check.stdout + check.stderr, /Missing files/u);
});

void test("tracks shared files once and requires shared updates to agree", async (context) => {
  const { root, project, release, run, fail } = await fixture();
  context.after(async () => {
    await rm(root, { recursive: true, force: true });
  });

  const file = path.join(project, source);
  await release(base, base);
  run("add", "button", "@erbium-examples/button-demo");
  assert.equal(await readFile(file, "utf-8"), base);

  const upstream = base.replace('style = "base"', 'style = "shared"');
  await release(upstream, upstream);
  const conflict = fail("update", "button");
  assert.notEqual(conflict.status, 0);
  assert.match(conflict.stdout + conflict.stderr, /Update the affected items together/u);
  assert.equal(await readFile(file, "utf-8"), base);

  run("update");
  assert.equal(await readFile(file, "utf-8"), upstream);
  run("check");
});

void test("initializes, discovers historical revisions, and recovers a missing stored baseline", async (context) => {
  const { root, project, registry, release, run } = await fixture();
  context.after(async () => {
    await rm(root, { recursive: true, force: true });
  });

  const before = await release(base);
  const upstream = base.replace('style = "base"', 'style = "upstream"');
  const after = await release(upstream);
  const oldCommit = "a".repeat(40);

  await writeFile(
    path.join(registry, "history.json"),
    JSON.stringify([
      { commit: "b".repeat(40), date: "2026-11-02", changes: after },
      { commit: oldCommit, date: "2026-11-01", changes: before },
    ]),
  );

  execFileSync(process.execPath, [bin, "init", "--cwd", project, "--agents"]);
  const agents = await readFile(path.join(project, "AGENTS.md"), "utf-8");
  execFileSync(process.execPath, [bin, "init", "--cwd", project, "--agents"]);
  assert.equal(await readFile(path.join(project, "AGENTS.md"), "utf-8"), agents);
  assert.match(run("search", "button", "--json"), /@erbium\/button/u);
  assert.match(run("history", "button", "--json"), new RegExp(oldCommit, "u"));

  const file = path.join(project, source);
  await writeFile(file, base);
  run("adopt", "button", "--at", oldCommit);
  await rm(path.join(project, ".erbium", "bases", `${hash(base)}.txt`));
  const local = base.replace('label = "base"', 'label = "local"');
  await writeFile(file, local);
  run("update");
  assert.equal(
    await readFile(file, "utf-8"),
    local.replace('style = "base"', 'style = "upstream"'),
  );
});

void test("checks local imports offline and reports usage from Git", async (context) => {
  const { root, project, run, fail } = await fixture();
  context.after(async () => {
    await rm(root, { recursive: true, force: true });
  });

  execFileSync("git", ["-C", project, "init", "--quiet"], { cwd: project });
  run("add", "button");
  const importer = path.join(project, "src", "consumer.tsx");
  await writeFile(importer, 'import { label } from "@app/primitives/button";\nexport { label };\n');
  assert.match(run("usage", "--offline", "--json"), /src\/consumer.tsx/u);

  const app = path.join(project, "apps", "consumer");
  await mkdir(app, { recursive: true });
  await writeFile(path.join(app, "package.json"), '{"name":"fixture-app"}');
  await writeFile(path.join(app, "index.ts"), 'export { label } from "../../src/consumer";\n');
  assert.match(
    run("usage", "--offline", "--json"),
    /"usedByProjects"\s*:\s*\[[^\]]*"apps\/consumer"/u,
  );

  const target = path.join(project, source);
  await writeFile(target, `import "./missing";\n${base}`);
  const check = fail("check", "--only", "imports", "--json");
  assert.notEqual(check.status, 0);
  assert.match(check.stdout, /does not resolve/u);
  assert.doesNotMatch(check.stdout, /"step"\s*:\s*"provenance"/u);
  run("check", "--only", "provenance");
});

void test("builds and validates managed and shadcn artifacts from a catalog", async (context) => {
  const { root, project } = await fixture();
  context.after(async () => {
    await rm(root, { recursive: true, force: true });
  });

  const catalog = path.join(root, "registry.json");
  const out = path.join(root, "published");

  await writeFile(
    catalog,
    JSON.stringify({
      name: "erbium",
      items: [
        {
          name: "button",
          type: "registry:ui",
          title: "Button",
          keywords: ["action"],
          files: [
            {
              path: "src/button.tsx",
              target: "@ui/button.tsx",
              type: "registry:ui",
              content: base,
            },
          ],
        },
      ],
    }),
  );

  const invoke = (...args: string[]) =>
    execFileSync(process.execPath, [bin, ...args, "--cwd", project], { encoding: "utf-8" });

  assert.match(invoke("registry", "build", catalog, "--out", out), /Built 1 items/u);
  await readFile(path.join(out, "r", "ui", "button.json"));
  const location = path.join(out, "r", "erbium");
  assert.match(invoke("registry", "validate", "--registry", location), /Validated 1 items/u);
  assert.match(invoke("search", "action", "--registry", location), /@erbium\/button/u);
});
