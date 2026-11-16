# 13 — anti-slop fork rules

## Current status (2026-11-17)

`oxlint.config.ts` already extends `ultracite/oxlint/anti-slop`. That preset is Ultracite 8.2.1's bundled build of [dmmulroy/anti-slop](https://github.com/dmmulroy/anti-slop). It enables 18 rules and tunes a few: `no-runtime-typeof` gets `allowInTypeGuards`, and three core rules are turned off because their autofixes loop against anti-slop (`typescript/consistent-indexed-object-style`, `unicorn/no-immediate-mutation`, `unicorn/prefer-reflect-apply`).

[K-Mistele/anti-slop](https://github.com/K-Mistele/anti-slop) is a fork of that project with more rule sets. Nothing from the fork is integrated yet. The fork is not published to npm; upstream's model is to copy `src/` into the consuming repository.

## What the fork adds

| Set                                     | Rules                                                                                                                                       | Fit for Erbium                                                                                                                                                                            |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Core `anti-slop` (21)                   | Ultracite's rules plus `max-ternary-depth`, `no-conditional-spread`, `no-disabled-type-assertion-rules` and `no-reprovide-ambient-service`. | `max-ternary-depth` fills a gap: Ultracite core sets `unicorn/no-nested-ternary` to `off`. `no-disabled-type-assertion-rules` blocks disabling the type-assertion rules to get past them. |
| `anti-slop-effect` (14, error)          | Effect patterns such as `prefer-effect-match`, `require-cause-when-narrowing`, `require-operation-span` and `no-service-parameters`.        | `effect` 4.1.4 is a dependency of `packages/ui`, `cli`, `infra` and `showcase`. Check whether the rules target Effect 4 or Effect 3 before enabling them.                                 |
| `anti-slop-martinfowler` (8, warn)      | `long-function`, `long-parameter-list`, `message-chains`, `mutable-data`, `mysterious-name`, `repeated-switches`, `global-data`, `loops`.   | Ultracite core enables no `max-params`, `max-lines-per-function` or `complexity` rule, so nothing duplicates these. `long-function` will likely warn on many React components.            |
| Jev (23, LLM-judged) and diff rules (4) | A model answers yes/no questions about code or a whole branch.                                                                              | Need API keys and cost money per run. Keep them out of `vp check`; at most an opt-in script.                                                                                              |

## Integration issues

1. **Plugin name clash.** The fork's core plugin registers as `anti-slop`, the same name as Ultracite's bundled plugin, so both cannot load under that name.
   - Replace: drop `antiSlop` from `extends`, vendor the fork, and copy Ultracite's tuning listed above. Future Ultracite preset updates stop reaching the repo.
   - Add alongside (preferred): keep the Ultracite preset, vendor the fork to `tools/oxlint/anti-slop-km/` under a different plugin name, and enable only the rules Ultracite lacks. `anti-slop-effect` and `anti-slop-martinfowler` already have distinct names.
2. **Dependency.** The fork imports `@oxlint/plugins`, which Ultracite inlines in its bundle. Add `@oxlint/plugins@1.93.0` at the exact `oxlint` version. The fork pins 1.86.0, so confirm it works on 1.93.0.
3. **TypeScript source.** oxlint loads the vendored `.ts` files through Node type stripping, which needs Node 22.18 or later. The root `package.json` already has `"type": "module"`.
4. **oxfmt.** No change. The only formatting-related rule, `require-readable-spacing`, already runs.
5. **Repository checks.** Add the vendored directory to the Knip and oxfmt ignore lists, or lint it deliberately. New error-level rules raise the existing-error count recorded in `CLAUDE.md`; update it in the same change.

## Plan

1. Vendor the fork's core plugin under a distinct name and enable `max-ternary-depth` and `no-disabled-type-assertion-rules` as errors.
2. Confirm Effect 4 support, then trial `anti-slop-effect` as warnings on the packages that use Effect.
3. Trial `anti-slop-martinfowler` as warnings and count findings before keeping it.
4. Leave out the Jev and diff rules.
5. Before each step, run the plugin alone and record the finding count per rule set.

Alternative: propose the new core rules to Ultracite's bundled preset or upstream dmmulroy/anti-slop so no fork needs to be vendored.
