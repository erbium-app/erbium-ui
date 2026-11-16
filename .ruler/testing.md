# Validation policy

- This project has no automated test suite or test runner configuration.
- Use `bunx vp check <edited files>` for formatting, linting, and type-aware validation of your changes (`bun run check` runs the whole repository, which has existing errors); use `bun run ready` to also build all applications.
- Verify interactive component behavior manually in Storybook or the docs playground.
