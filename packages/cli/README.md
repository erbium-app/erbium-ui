# Erbium CLI

Install source-owned Erbium UI in a TypeScript React project configured with shadcn. Use Node 22.18 or later and Git for comparisons and merges.

```sh
bunx --package @erbium/cli erbium add styles button
bunx --package @erbium/cli erbium status
bunx --package @erbium/cli erbium diff button
bunx --package @erbium/cli erbium update --dry-run
bunx --package @erbium/cli erbium update
bunx --package @erbium/cli erbium check
```

Use `adopt` with items already installed by shadcn. Their source must match the current revision. Managed installs use the TypeScript path aliases and explicit targets used by Erbium's two registries. Use shadcn for other registries and framework-specific shadcn transforms.

Commit the installed source and `.erbium/lock.json` and `.erbium/bases/`. The lock tracks item revisions, file owners, and exact upstream file hashes. The baseline files make the exact installed bytes available offline. Changes in unrelated project code are outside the scope of `check`.

Use `--cwd` to select a project, `--registry` to select a local directory or URL containing the Erbium revision index, and `--json` for scripting. An interrupted file operation can be resumed by removing the empty `.erbium/operation` directory after confirming the process stopped, then rerunning the write command. Keep the pending journal until recovery succeeds.

The docs build publishes both ordinary shadcn catalogs and the managed registry at `/r/erbium`. Production builds require a full Git checkout to reproduce snapshots from the registry's first-parent history.

[Installation guide](https://ui.erbium.app/docs/installation)
