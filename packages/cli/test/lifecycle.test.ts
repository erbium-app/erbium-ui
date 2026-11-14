import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { test } from "node:test";
import { revision, snapshotFor } from "../src/revision.ts";

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

  const release = async (content: string) => {
    const id = "@erbium/button";

    const item = snapshotFor(id, {
      name: "button",
      type: "registry:ui",
      files: [{ path: "src/button.tsx", target: "@ui/button.tsx", type: "registry:ui", content }],
    });

    const digest = revision(item);
    await writeFile(path.join(registry, "revisions", `${digest}.json`), JSON.stringify(item));
    await writeFile(
      path.join(registry, "index.json"),
      JSON.stringify({ version: 1, items: { [id]: digest } }),
    );
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

  return { root, project, release, run, fail };
};

void test("adopts an existing file, then merges successive revisions and refuses overlapping edits", async (context) => {
  const { root, project, release, run, fail } = await fixture();
  context.after(async () => {
    await rm(root, { recursive: true, force: true });
  });
  const file = path.join(project, source);
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
