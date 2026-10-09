import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { writeFileSync, unlinkSync } from "node:fs";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const invalid = `import { cn } from "@erbium/ui/lib/utils";
import { cva } from "class-variance-authority";
export const labelClass = "text-sm";
export const labelOptions = { fontSize: 13 };
export function SvgProbe() { return <svg><text fontSize={14}>SVG</text></svg>; }
export function HtmlProbe() { const element = document.createElement("div"); element.innerHTML = '<p class="text-sm">HTML</p>'; }

const tiny = "text-xs";
const alias = tiny;
export function Aliased() { return <p className={alias}>Alias</p>; }
export const variants = cva("md:text-base", { variants: { size: { small: "text-xs" } } });
export function Probe() { return <div className={cn("text-[14px]", "hover:tracking-wide", "text-body/6", "font-light", "font-serif")} style={{fontSize:14}}>Example</div>; }
`;
const valid = `import { cn } from "@erbium/ui/lib/utils";
import { cva } from "class-variance-authority";
export const labelClass = "text-control";
export const variants = cva("text-caption", { variants: { size: { small: "text-metadata" } } });
export function Probe() { return <div className={cn("text-body", "md:text-title", "text-code-block", "text-field", "font-semibold", "text-error")} style={{width:14}}>Example</div>; }
`;

function lint(path) {
  try {
    execFileSync("bunx", ["--no-install", "oxlint", "--config", "oxlint.config.ts", path], {
      cwd: root,
      encoding: "utf8",
      stdio: "pipe",
    });
    return { passed: true, output: "" };
  } catch (error) {
    return { passed: false, output: `${error.stdout ?? ""}${error.stderr ?? ""}` };
  }
}

// Exercise the actual Oxlint bridge and both policies, including the component
// override where shadcn's general arbitrary-value rule is intentionally off.
for (const directory of ["packages/ui/src", "packages/showcase/src"]) {
  const path = `${root}${directory}/typography-policy-probe-${randomUUID()}.tsx`;
  try {
    writeFileSync(path, invalid);
    const rejected = lint(path);
    assert.equal(rejected.passed, false, rejected.output);
    assert.equal(
      (rejected.output.match(/erbium-typography\(use-roles\)/g) ?? []).length,
      12,
      rejected.output,
    );
    assert.match(rejected.output, /Typography comes from Erbium text roles/);
    writeFileSync(path, valid);
    const accepted = lint(path);
    assert.equal(accepted.passed, true, accepted.output);
  } finally {
    unlinkSync(path);
  }
}

const astroPath = `${root}apps/docs/src/typography-policy-probe-${randomUUID()}.astro`;
const cssPath = `${root}apps/docs/src/styles/typography-policy-probe-${randomUUID()}.css`;
try {
  writeFileSync(
    astroPath,
    '<p class:list={["text-sm"]} style={{fontSize:14}}>Example</p><p style="font:14px monospace">Example</p>',
  );
  writeFileSync(cssPath, ".probe { font-size: 15px; @apply text-sm; }");
  assert.throws(
    () =>
      execFileSync("node", ["scripts/check-astro-typography.mjs"], { cwd: root, stdio: "pipe" }),
    (error) => {
      const output = `${error.stdout ?? ""}${error.stderr ?? ""}`;
      return (
        output.includes("text-sm") &&
        output.includes("fontSize") &&
        output.includes('"font"') &&
        output.includes("font-size")
      );
    },
  );
  writeFileSync(astroPath, '<p class:list={["text-body"]}>Example</p>');
  writeFileSync(cssPath, ".probe { @apply text-caption text-muted-foreground; }");
  execFileSync("node", ["scripts/check-astro-typography.mjs"], { cwd: root, stdio: "pipe" });
} finally {
  unlinkSync(astroPath);
  unlinkSync(cssPath);
}

process.stdout.write(
  "Typography policy rejects drift and accepts roles in React, Astro, stories, and CSS recipes.\n",
);
