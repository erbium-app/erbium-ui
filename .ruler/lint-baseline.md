# Existing lint errors

- The repository has existing lint and type errors in files unrelated to most tasks (262 as of 2026-11-17), so `bun run check` fails on a clean checkout. Do not treat that failure as caused by your change, and do not fix unrelated files unless the task asks for it.
- Check only the files you edited: `bunx vp check <files>` for formatting, linting, and type-aware checks, and `bunx stylelint <css files>` for edited CSS. Use `bunx vp check --fix <files>` for mechanical fixes. Every file you edited must pass.
- When you change an exported API (props, types, function signatures), also check the files that import it, since their errors would not show in your edited files.
- Optionally confirm you added no errors elsewhere: the `Found N errors` count from `bun run check` must not rise above the count before your change.
