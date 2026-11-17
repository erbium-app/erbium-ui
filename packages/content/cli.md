---
title: CLI
description: Install, track, and update component source, or publish your own Erbium registry.
---

The Erbium CLI copies components, styles, and examples into your project as source files. Edit them alongside the rest of your app. Erbium records the original bytes of each managed file so you can see what changed locally, review new releases, and merge upstream changes when you choose to update.

Use Node.js 22.18 or later and Git in a TypeScript React project with shadcn configured. Follow [Installation](/docs/installation) for the app setup, global styles, and icon sprite.

## Work with an agent

Agents build with Erbium through the CLI: they find an existing item, read its documentation, install the source, and verify the result. Copy this prompt into your coding agent, or add it to your project’s agent instructions. [Set up with an agent](/docs/installation#set-up-with-an-agent) covers the first install.

```prompt
Use Erbium UI and its CLI for all UI work in this project. Run `erbium` through the project's package manager.

1. Before building UI, run `erbium search <terms>` to find an existing component, block, or example. Read the match with `erbium docs <item>` and follow its composition, accessibility, and loading guidance.
2. Install with `erbium add <item>`. A bare name such as `combobox` means `@erbium/combobox`; use the full `@erbium-examples/<name>` for an example. Never copy registry files by hand.
3. Compose new UI from the installed Erbium components and the tokens in src/styles/. Edit the installed source when a change belongs in the component itself. Keep labels inside fields, use `error` rather than `destructive`, and preserve RTL support.
4. To update, run `erbium status`, review `erbium diff <item>`, then run `erbium update <item>`. If edits overlap, stop and show me the conflict instead of using `--overwrite`.
5. After changing UI, run `erbium check`, the project's lint and type checks, and its build. Keep .erbium/lock.json and .erbium/bases/ with the source.
```

`erbium init --agents` writes a short Erbium skill to `.agents/skills/erbium-ui/SKILL.md` and points to it from `AGENTS.md`. Each documentation page is also available as Markdown at its URL with `.md` appended, and [llms.txt](/llms.txt) lists every page.

## Install and track source

Run these commands from the app directory. Like [Installation](/docs/installation), the examples use Bun, and each command block offers npm, pnpm, and Yarn. Later sections show the bare `erbium` command, which you run through your package manager. To try the CLI without adding a dependency, use `bunx --package @erbium-app/cli erbium`.

```sh
bun add -d @erbium-app/cli
bunx erbium init
bunx erbium search button
bunx erbium add styles button
bunx erbium check
```

`init` adds the Erbium namespaces to `components.json` where missing and initializes `.erbium/lock.json`. Use `--agents` to add a local Erbium skill and an entry in `AGENTS.md`.

`add` resolves registry dependencies and uses the aliases in `components.json` and your TypeScript config to place files and rewrite their imports. It installs missing packages with the project’s declared package manager, or detects Bun, pnpm, or Yarn from its lockfile and falls back to npm. Use `--skip-install` to handle package declarations yourself. A bare item name such as `button` means `@erbium/button`. Use the full `@erbium-examples/` name for an example.

If you installed files with shadcn, as the Installation guide does, use `erbium adopt styles button` to record them once they match the selected registry revision and their packages are declared. For an older install, use `erbium history button` to find a published commit and pass it to `erbium adopt button --at <commit>`.

## Review and merge updates

Commit your installed source, `.erbium/lock.json`, and `.erbium/bases/` together. The lock records the registry revision, dependencies, and upstream hash of each tracked file. The stored baselines let Erbium compare against what you received even after you edit the source. If a baseline is missing, Erbium can look for the exact bytes in the working tree or Git history, and online operations can try to reconstruct them from a published revision.

```sh
erbium status
erbium diff button
erbium diff button --local
erbium update button --dry-run
erbium update button
erbium check
```

The first diff compares the baseline with the latest registry version. The local diff compares the same baseline with your working files and runs offline. Without item names, `update` selects tracked items with newer registry revisions.

Erbium plans every file change before applying an update. It merges edits that touch different lines and aborts when edits overlap. For both `add` and `update`, choose one explicit option when you want a different result.

- `--conflict-markers` writes the conflicted merge and records the incoming baseline. Resolve the marked sections before running `check` again.
- `--overwrite` takes the registry copy for selected files. It can replace unmanaged files, restore missing tracked files, or reset a named item whose registry revision is already current.

Both options work with `--dry-run`. When a revision stops shipping a file, Erbium reports the path and leaves the file in your project.

If a write is interrupted, confirm the process has stopped, remove the empty `.erbium/operation` directory if it remains, and rerun the write command. Keep `.erbium/pending.json` until the command finishes applying the recorded changes.

`check` runs offline to verify aliases, tracked files and baselines, dependencies, and local imports. It reports local edits in JSON and exits with a failure status for issues such as missing files or unresolved conflict markers. Run it alongside your project’s lint, type checks, and build.

## Command reference

Every command that works in a project accepts `--cwd <dir>`, which defaults to the current directory. Use `erbium --help`, `erbium update --help`, or `erbium registry build --help` to see the flags supported by your installed version. The top-level help also lists version, wizard, shell completion, and logging options.

| Command            | What it does                                                                                                                                                          | Options                                                                                                                                                                                                                                                       |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `init`             | Set up tracking and the shadcn namespaces.                                                                                                                            | `--registry <location>` saves a managed registry. `--header <header>` saves a repeatable header template and requires `--registry`. `--agents` writes agent guidance. `--json` lists the files changed.                                                       |
| `search [term...]` | List registry items matching every term, ordered by relevance. Omit terms to list the catalog.                                                                        | `--registry <location>`, `--json`                                                                                                                                                                                                                             |
| `docs [topic]`     | Print a guide or registry item as Markdown. The default topic is `installation`. With a saved or explicit registry, it shows item metadata, dependencies, and source. | `--site <url>` reads guides from a docs site. `--registry <location>` selects item documentation and takes precedence over `--site`.                                                                                                                          |
| `history <item>`   | List known revisions of an item, including published commits and dates when available.                                                                                | `--registry <location>`, `--json`                                                                                                                                                                                                                             |
| `add <item...>`    | Install and track items and their registry dependencies.                                                                                                              | `--registry <location>`, `--dry-run`, `--skip-install`, `--conflict-markers`, `--overwrite`, `--json`                                                                                                                                                         |
| `adopt <item...>`  | Track an existing install that matches the registry.                                                                                                                  | `--registry <location>`, `--at <commit>`, `--dry-run`, `--json`                                                                                                                                                                                               |
| `status [item...]` | Show local edits, missing files, and available revisions.                                                                                                             | `--registry <location>`, `--json`                                                                                                                                                                                                                             |
| `diff <item>`      | Show a unified diff for one tracked item.                                                                                                                             | `--local`, `--registry <location>`, `--json`                                                                                                                                                                                                                  |
| `update [item...]` | Merge new registry source into tracked files.                                                                                                                         | `--registry <location>`, `--dry-run`, `--skip-install`, `--conflict-markers`, `--overwrite`, `--json`                                                                                                                                                         |
| `check [item...]`  | Verify the managed install offline. Item names filter the tracked-file report. The checks still cover the project.                                                    | `--only <steps>` selects comma-separated checks from `config`, `provenance`, `dependencies`, and `imports`. `--json` includes check results and tracked file state.                                                                                           |
| `usage`            | Find files and workspaces that import tracked items in a Git checkout.                                                                                                | `--offline` skips registry lookups. `--repo <git-url>` scans a temporary checkout. `--github <organization>` scans repositories visible to your authenticated GitHub CLI. Use one remote option at a time. Also accepts `--registry <location>` and `--json`. |

Use `--json` on supported commands when scripting. For example, save `erbium usage --offline --json` for a dependency audit, or use `erbium check --only imports,provenance --json` to collect specific checks in CI. Install workspace dependencies before scanning usage so Erbium can follow imports through package exports.

## Configure a custom registry

`erbium init --registry <location>` saves a local directory or HTTP(S) URL in `erbium.config.json` at the project root. A relative directory resolves from the project. Commands that read the registry use the saved location or the public Erbium registry by default. Pass `--registry` to override that choice for a command.

```sh
erbium init --registry https://ui.example.com/r/erbium \
  --header 'Authorization: Bearer ${ERBIUM_INTERNAL_TOKEN}'
erbium search button
erbium docs cli --site https://ui.erbium.app
```

The file stores the URL and the header template.

```json
{
  "registry": {
    "url": "https://ui.example.com/r/erbium",
    "headers": {
      "Authorization": "Bearer ${ERBIUM_INTERNAL_TOKEN}"
    }
  }
}
```

Set the variable in the process environment, `.env.local`, or `.env`, in that order of precedence. Erbium expands the template when it requests the configured registry. Missing variables fail before any request. Requests with authentication headers require HTTPS or loopback HTTP and refuse redirects. For existing setups, `ERBIUM_REGISTRY_TOKEN` is also supported as a bearer-token fallback for custom HTTP(S) registries without configured headers.

Managed installs read `/r/erbium`. For direct shadcn installs from the same host, configure the namespaces in `components.json` to use `/r/ui/{name}.json` and `/r/examples/{name}.json`. Add private shadcn headers there using [shadcn’s registry authentication format](https://ui.shadcn.com/docs/registry/authentication).

## Build and host a registry

Start with a shadcn catalog containing inlined file content and explicit install targets. The build verifies dependency references and imports, publishes managed snapshots alongside the shadcn endpoints, and generates a site and an `llms.txt` index.

```sh
erbium registry build registry.json --history --out dist/registry
erbium registry validate --registry dist/registry/r/erbium
erbium registry serve dist/registry
```

Open `http://127.0.0.1:4178/` to browse the local build. Publish the output directory to a static host and give consumers its managed `/r/erbium` URL. Build from a full Git checkout with committed catalogs when publishing history. Older snapshots support `history`, `adopt --at`, and recovery of missing baselines.

| Command                      | Options                                                                                                                                                                               |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `registry build <catalog>`   | `--examples <catalog>` adds an examples catalog. `--out <dir>` defaults to `dist/registry`. `--history` publishes first-parent Git history. `--no-site` produces registry files only. |
| `registry validate`          | `--registry <location>` selects a managed registry. Validation reads the revision index, verifies snapshots, and checks dependencies and imports.                                     |
| `registry serve [directory]` | The directory defaults to `dist/registry`. `--port <number>` defaults to `4178`. The server listens on loopback.                                                                      |

Add these build flags when you want previews or reports on the registry site.

- `--storybook <dir>` copies a static Storybook build under `storybook/` and links item pages to stories with matching `<item>.stories.*` filenames. Include `index.json` and `iframe.html` in the Storybook output.
- `--usage <file>` publishes `erbium usage --json` output at `usage.json`. Keep the site private when the report includes private project or file paths.
- `--verify <file>` publishes `erbium check --json` output at `verify.json`. It includes the supplied check results, including any failures.
