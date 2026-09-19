# Agent quality workflow

- When asked to validate, typecheck, clean up, run Knip, or prepare changes for review, use the repository checks below.
- The default command is `bun run check`. Fix actionable failures and repeat the same command until it passes.
- Use `bun run ready` for release-readiness checks covering check, tests, and builds.
- Run `bun run knip` only when unused files or dependencies are in scope.
