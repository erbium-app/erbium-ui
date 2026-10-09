import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const directory = mkdtempSync(join(tmpdir(), "erbium-sizing-"));
const fixture = join(directory, "probe.tsx");
const config = join(directory, "oxlint.json");
try {
  writeFileSync(
    config,
    JSON.stringify({
      jsPlugins: [{ name: "erbium-sizing", specifier: join(root, "scripts/sizing-lint.mjs") }],
      rules: { "erbium-sizing/use-geometry": "error" },
    }),
  );
  writeFileSync(
    fixture,
    'const dimensions = "h-8"; const alias = dimensions; export function Probe() { return <button className={alias}>Save</button>; }',
  );
  assert.throws(
    () =>
      execFileSync("bunx", ["--no-install", "oxlint", "--config", config, fixture], {
        cwd: root,
        stdio: "pipe",
      }),
    (error) => `${error.stdout}`.includes("erbium-sizing(use-geometry)"),
  );
  writeFileSync(
    fixture,
    'export function Probe() { return <button className="control-size control-adaptive text-control-sm">Save</button>; }',
  );
  execFileSync("bunx", ["--no-install", "oxlint", "--config", config, fixture], {
    cwd: root,
    stdio: "pipe",
  });
  writeFileSync(
    config,
    JSON.stringify({
      jsPlugins: [{ name: "erbium-sizing", specifier: join(root, "scripts/sizing-lint.mjs") }],
      rules: { "erbium-sizing/use-component-geometry": "error" },
    }),
  );
  writeFileSync(
    fixture,
    'import { Button as Action } from "@erbium/ui/components/button"; const dimensions = "h-8"; const alias = dimensions; export function Probe() { return <Action className={alias}>Save</Action>; }',
  );
  assert.throws(
    () =>
      execFileSync("bunx", ["--no-install", "oxlint", "--config", config, fixture], {
        cwd: root,
        stdio: "pipe",
      }),
    (error) => `${error.stdout}`.includes("erbium-sizing(use-component-geometry)"),
  );
  writeFileSync(
    fixture,
    'import { Button } from "@erbium/ui/components/button"; export function Probe() { return <div className="h-8"><Button size="lg">Save</Button></div>; }',
  );
  execFileSync("bunx", ["--no-install", "oxlint", "--config", config, fixture], {
    cwd: root,
    stdio: "pipe",
  });
  writeFileSync(
    fixture,
    'export function Probe() { return <div className="[&_.docs-search-trigger]:p-2" />; }',
  );
  assert.throws(
    () =>
      execFileSync("bunx", ["--no-install", "oxlint", "--config", config, fixture], {
        cwd: root,
        stdio: "pipe",
      }),
    (error) => `${error.stdout}`.includes("erbium-sizing(use-component-geometry)"),
  );
  process.stdout.write(
    "Sizing lint rejects recipe and component-usage drift while accepting layout dimensions.\n",
  );
} finally {
  rmSync(directory, { recursive: true, force: true });
}
