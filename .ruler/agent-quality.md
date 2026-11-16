# Agent quality workflow

- When asked to validate, typecheck, clean up, run Knip, or prepare changes for review, use the repository checks below.
- The default command is `bunx vp check <edited files>`, scoped to the files you changed (see Existing lint errors). Fix actionable failures and repeat the same command until it passes. `bun run check` covers the whole repository and fails on existing errors.
- Use `bun run ready` for release-readiness checks covering checks and builds.
- Run `bun run knip` only when unused files or dependencies are in scope.
