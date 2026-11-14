# Erbium CLI

Install source-owned Erbium UI in a TypeScript React project configured with shadcn. Use Node 22.18 or later and Git for comparisons and merges.

```sh
bunx --package @erbium/cli erbium init
bunx --package @erbium/cli erbium search button
bunx --package @erbium/cli erbium docs button
bunx --package @erbium/cli erbium add styles button
bunx --package @erbium/cli erbium status
bunx --package @erbium/cli erbium diff button
bunx --package @erbium/cli erbium update --dry-run
bunx --package @erbium/cli erbium update
bunx --package @erbium/cli erbium check
```

Use `adopt` with items already installed by shadcn. Their source must match a published revision. Use `history <item>` and `adopt <item> --at <commit>` for an older release. Managed installs use the TypeScript path aliases and explicit targets used by Erbium's two registries. Use shadcn for other registries and framework-specific shadcn transforms.

Commit the installed source and `.erbium/lock.json` and `.erbium/bases/`. The lock tracks item revisions, file owners, and exact upstream file hashes. The baseline files make the exact installed bytes available offline. If a baseline file is missing, Erbium checks the working file and local Git history. Upstream diffs and merges can also reconstruct the baseline from a verified registry snapshot. Changes in unrelated project code are outside the scope of `check`.

Use `--cwd` to select a project, `--registry` to select a local directory or URL containing the Erbium revision index, and `--json` for scripting. An interrupted file operation can be resumed by removing the empty `.erbium/operation` directory after confirming the process stopped, then rerunning the write command. Keep the pending journal until recovery succeeds.

The docs build publishes both ordinary shadcn catalogs and the managed registry at `/r/erbium`. Production builds require a full Git checkout to reproduce snapshots from the registry's first-parent history.

## Registry tooling

```sh
erbium registry build ./registry.json --examples ./examples/registry.json --out dist/registry
erbium registry validate --registry dist/registry/r/erbium
erbium registry serve dist/registry
```

Build takes Shadcn catalogs with inlined file content and emits Shadcn item endpoints at `/r/ui` and `/r/examples` alongside the managed registry at `/r/erbium`. Serve listens on loopback for local testing. For a private managed registry, set `ERBIUM_REGISTRY_TOKEN` alongside an explicit `--registry` URL. Erbium sends the bearer token over HTTPS or to loopback and refuses redirects while using it.

`usage --offline --json` scans a local Git checkout. Its report lists direct importers and consuming workspaces reachable through local imports and resolvable workspace packages. Run it after installing workspace dependencies so package exports can be resolved. Use `--repo <git-url>` to scan a temporary checkout of another repository through its committed files and TypeScript aliases. Use `--github <organization>` to scan the repositories visible to your authenticated GitHub CLI. Remote scans use your configured Git credentials and clone one repository at a time.

[Installation guide](https://ui.erbium.app/docs/installation)
