# Erbium CLI

Install source-owned Erbium UI in a TypeScript React project configured with shadcn. Use Node 22.18 or later and Git for comparisons and merges.

```sh
bunx --package @erbium-app/cli erbium init
bunx --package @erbium-app/cli erbium search button
bunx --package @erbium-app/cli erbium docs button
bunx --package @erbium-app/cli erbium add styles button
bunx --package @erbium-app/cli erbium status
bunx --package @erbium-app/cli erbium diff button
bunx --package @erbium-app/cli erbium update --dry-run
bunx --package @erbium-app/cli erbium update
bunx --package @erbium-app/cli erbium check
```

By default, overlapping edits abort the whole operation before any source, baseline, lock or dependency changes. For `add` and `update`, choose one of these options when you need to resolve the overlap explicitly.

- `--conflict-markers` writes Git conflict markers into tracked files and records the incoming revision as the baseline. Resolve the marked sections and run `erbium check`. The check fails while markers remain.
- `--overwrite` replaces selected files with the registry version, including existing unmanaged files and missing tracked files. Use `erbium update <item> --overwrite` to reset a tracked item even when its revision is already current.

Both options support `--dry-run`. The write plan still checks file ownership, shared targets and dependency constraints.

Use `add --skip-install` or `update --skip-install` if you manage package dependencies separately. The command reports what to install, and `check` verifies the declarations afterward.

Use `adopt` with items already installed by shadcn. Their source must match a published revision. Use `history <item>` and `adopt <item> --at <commit>` for an older release. Managed installs use the TypeScript path aliases and explicit targets used by Erbium's two registries. Use shadcn for other registries and framework-specific shadcn transforms.

Commit the installed source and `.erbium/lock.json` and `.erbium/bases/`. The lock tracks item revisions, file owners, and exact upstream file hashes. The baseline files make the exact installed bytes available offline. If a baseline file is missing, Erbium checks the working file and local Git history. Upstream diffs and merges can also reconstruct the baseline from a verified registry snapshot. Changes in unrelated project code are outside the scope of `check`.

Use `--cwd` to select a project and `--json` for scripting. An interrupted file operation can be resumed by removing the empty `.erbium/operation` directory after confirming the process stopped, then rerunning the write command. Keep the pending journal until recovery succeeds.

The docs build publishes both ordinary shadcn catalogs and the managed registry at `/r/erbium`. Production builds require a full Git checkout to reproduce snapshots from the registry's first-parent history.

## Custom registries

```sh
erbium init --registry ../registry/dist/registry/r/erbium
erbium init --registry https://ui.example.com/r/erbium \
  --header 'Authorization: Bearer ${ERBIUM_INTERNAL_TOKEN}' \
  --header 'X-Project: ${ERBIUM_PROJECT_ID}'
erbium add button
erbium docs button
```

`init --registry` saves the managed registry in `erbium.config.json` at the project root. You can edit that file directly. Its `registry` field accepts a path, an HTTP(S) URL, or an object with `url` and `headers`. Relative paths resolve from `--cwd`. Pass `--registry` on a command to override the saved location for that invocation. With a saved registry, `docs` opens registry item documentation. Use `docs --site https://ui.erbium.app` to read public guides.

Every configured header value must contain a `${VARIABLE}` placeholder. Erbium reads the process environment first, then `.env.local`, then `.env`. Missing values fail before the request. Configured headers apply only to the saved endpoint, require HTTPS or loopback HTTP, and disable redirects. For older setups, `ERBIUM_REGISTRY_TOKEN` remains a bearer-token fallback for custom HTTP(S) registries without configured headers.

The shadcn namespace entries in `components.json` are configured independently. `init` preserves existing entries and fills in any missing public Erbium defaults. For shadcn installs from a custom host, point the entries to that host’s `/r/ui/{name}.json` and `/r/examples/{name}.json` endpoints and configure [shadcn authentication](https://ui.shadcn.com/docs/registry/authentication) there.

## Registry tooling

```sh
erbium registry build ./registry.json --examples ./examples/registry.json --history --out dist/registry
erbium registry validate --registry dist/registry/r/erbium
erbium registry serve dist/registry
```

Build takes Shadcn catalogs with inlined file content and emits Shadcn item endpoints at `/r/ui` and `/r/examples` alongside the managed registry at `/r/erbium`. It checks that relative and Erbium registry imports resolve to files shipped by the item or its registry dependencies. Use `--history` with committed catalogs in a full Git checkout to publish first-parent revisions for `history` and `adopt --at`. Without it, the build publishes the current snapshots. Run `erbium docs <item> --registry <location>` to read an item’s metadata, dependencies and source without the public docs site.

Open the output directory's `index.html` through a static host or `registry serve` to browse items, source and revisions. The build also generates an agent index at `llms.txt`. Serve listens on loopback for local testing.

```sh
erbium usage --offline --json > usage.json
erbium check --json > verify.json
erbium registry build registry.json --storybook storybook-static --usage usage.json --verify verify.json
```

- `--storybook` copies a built Storybook with `index.json` and `iframe.html` to `storybook/`. Item pages link to stories whose `<item>.stories.*` filename matches the item name, preferring the Default story when available.
- `--usage` publishes the output of `erbium usage --json` at `usage.json`. Usage reports include project and file paths, so keep the site private when the report covers private code.
- `--verify` publishes the output of `erbium check --json` at `verify.json`, including failed checks when supplied. The build validates the report format and publishes the supplied results.

Pass `--no-site` to write only the managed and shadcn registry files. Rebuilding removes optional site artifacts when their flags are omitted.

`usage --offline --json` scans a local Git checkout. Its report lists direct importers and consuming workspaces reachable through local imports and resolvable workspace packages. Run it after installing workspace dependencies so package exports can be resolved. Use `--repo <git-url>` to scan a temporary checkout of another repository through its committed files and TypeScript aliases. Use `--github <organization>` to scan the repositories visible to your authenticated GitHub CLI. Remote scans use your configured Git credentials and clone one repository at a time.

[CLI guide](https://ui.erbium.app/docs/cli) · [Installation guide](https://ui.erbium.app/docs/installation)
