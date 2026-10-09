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
  process.stdout.write("Sizing lint rejects raw control geometry and accepts shared recipes.\n");
} finally {
  rmSync(directory, { recursive: true, force: true });
}
