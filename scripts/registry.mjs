/// <reference types="node" />

/*
 * Rebuilds every generated registry file. App dev servers, builds, deploys and dependency
 * updates run it, so the committed output doesn't drift from its sources.
 *
 *   (no flag)  rebuild
 *   --check    rebuild, then fail when that changed what is committed (CI)
 *   --staged   rebuild and stage the output (pre-commit)
 */
import { execFileSync } from "node:child_process";
import path from "node:path";

const root = path.dirname(import.meta.dirname);
const vp = path.join(root, "node_modules/.bin/vp");

// In build order: the showcase registry reads the UI registry and the generated catalogs.
const tasks = ["ui:registry", "showcase:generate", "showcase:registry"];

const sources = [
  "package.json",
  "packages/content",
  "packages/react/package.json",
  "packages/showcase/package.json",
  "packages/showcase/scripts",
  "packages/showcase/src",
  "packages/ui/package.json",
  "packages/ui/scripts",
  "packages/ui/src",
];

const outputs = [
  "apps/storybook/src/stories",
  "packages/showcase/manifest.json",
  "packages/showcase/public/r",
  "packages/showcase/registry.json",
  "packages/ui/public/r",
  "packages/ui/registry.json",
];

/**
 * @param {string[]} args - Git arguments.
 * @returns {string[]} The non-empty output lines.
 */
const git = (args) =>
  // oxlint-disable-next-line sonarjs/no-os-command-from-path -- git has no fixed install path; it is the one running this checkout's hooks.
  execFileSync("git", args, { cwd: root, encoding: "utf-8" }).split("\n").filter(Boolean);

/**
 * @param {string[]} paths - Files or directories.
 * @returns {string[]} The files below them that differ from the index, including new ones.
 */
const unstaged = (paths) => [
  ...git(["diff", "--name-only", "--", ...paths]),
  ...git(["ls-files", "--others", "--exclude-standard", "--", ...paths]),
];

const build = () => {
  for (const task of tasks) {
    execFileSync(vp, ["run", task], { cwd: root, stdio: "inherit" });
  }
};

/**
 * @param {string} heading - What happened.
 * @param {string[]} files - The files it concerns.
 * @returns {string} A message listing the first few files.
 */
const report = (heading, files) => {
  const shown = files.slice(0, 10).map((file) => `  ${file}`);
  const hidden = files.length - shown.length;

  return [heading, ...shown, ...(hidden > 0 ? [`  and ${hidden} more`] : []), ""].join("\n");
};

const syncStaged = () => {
  if (git(["diff", "--cached", "--name-only", "--", ...sources]).length === 0) {
    return;
  }

  // A build reads the working tree, so it would put unstaged edits into this commit.
  const pending = unstaged(sources);

  if (pending.length > 0) {
    process.stderr.write(
      report(
        "Registry not updated: stage or stash these sources, or run `vp run registry` later.",
        pending,
      ),
    );

    return;
  }

  build();
  git(["add", "--all", "--", ...outputs]);
};

const check = () => {
  build();

  const stale = unstaged(outputs);

  if (stale.length > 0) {
    process.stderr.write(report("The registry was stale. Commit the rebuilt files:", stale));
    process.exitCode = 1;
  }
};

if (process.argv.includes("--staged")) {
  syncStaged();
} else if (process.argv.includes("--check")) {
  check();
} else {
  build();
}
