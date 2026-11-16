# 14 — CI and Cloudflare deploy

## Current status (2026-11-17)

Nothing below is implemented yet. Approve items by number, ship each as its own commit, and record before and after timings from real runs.

### Cloudflare deploy (Workers Builds, prod, 2026-11-16 log): 1m54s total

| Phase                                         | Time  | Notes                                                                        |
| --------------------------------------------- | ----- | ---------------------------------------------------------------------------- |
| Environment init, clone, node and bun install | ~17s  | Mostly on Cloudflare's side                                                  |
| `bun install --frozen-lockfile`               | 9.6s  | No cache; installs all 818 packages, including tooling the deploy never uses |
| `packages/infra/scripts/prepare-history.sh`   | ~6s   | Full unshallow with blobs; grows with history                                |
| Alchemy state and plan                        | 8.5s  | 4s refreshing state store credentials                                        |
| Vite client and server builds                 | ~35s  | Largest bucket; chunks over 500 kB warning                                   |
| Prerender and sitemap                         | ~7s   | 101 pages                                                                    |
| Asset upload                                  | ~9.5s | "Uploaded 216 of 216"; unclear whether unchanged assets are re-sent          |
| Script upload and custom domain reconcile     | ~13s  | Runs on every deploy, even when the domain is unchanged                      |

### GitHub Actions (`.github/workflows/quality.yml`)

- Last 120 runs: 93 failed, 19 succeeded, 8 cancelled. The latest failure is `bun run check` with `Found 1520 errors`. A check that is always red gives no signal.
- The workflow triggers only on `pull_request`. Work lands directly on `main`, so CI has not run since 2026-11-08.
- Workers Builds deploys every push to `main` to prod without waiting for any check.
- Already in place: oxlint, oxfmt, bun only, TypeScript 7, and cancel-in-progress concurrency. The only test suite is `packages/cli`, so test sharding does not apply.

## Remaining work

### A. Make CI truthful (first)

1. Replace the all-files check on PRs with a check of changed files plus an error-count ratchet that fails when the repository total rises above a committed baseline. Alternative: fix the existing errors and keep the full check.
2. Add a `push: main` trigger so `main` is checked and seeds caches for PRs.
3. Gate prod deploys on green checks: either deploy from a GitHub Actions job that `needs:` the checks and turn off Workers Builds auto-deploy, or keep Workers Builds and protect `main` behind PRs.
4. Merge queue running the full suite. Applies only if work moves to a PR flow; decide first.

### B. Cloudflare deploy speed (target about 1m10s)

5. Install only deploy dependencies: `bun install --frozen-lockfile --filter docs --filter @erbium/infra` (confirm workspace dependencies resolve), and enable the Workers Builds build cache. Expected 5–8s.
6. Make the unshallow blobless: `git fetch --filter=blob:none --unshallow`. Registry publishing needs first-parent commits, not old blobs. About 4s now, more as history grows. The CI fixture step still verifies it.
7. Check whether asset upload re-sends unchanged files and whether the custom domain reconcile can be skipped when nothing changed. May need an upstream Alchemy issue (2.0.0-beta.87). Up to ~15s.
8. Confirm the Alchemy `memo` skips the double Vite build (35s) on commits that do not touch docs inputs; add missing inputs if it does not.
9. Confirm the deploy runs `apps/docs/verify-build.ts`. The docs `build` script runs it, but Alchemy's Vite resource may call `vite build` directly and the log shows no verify step.
10. Align bun versions: `devEngines` declares 1.4.4, while CI and Workers Builds use 1.4.2.

### C. GitHub CI speed (after A)

11. Use `filter: blob:none` instead of `fetch-depth: 0` in `actions/checkout`.
12. Cache `node_modules` keyed on `bun.lock`, seeded from `main` (needs 2).
13. Split into parallel jobs: check, docs build, other app builds, CLI test, infra typecheck. Set each job's `timeout-minutes` to its measured budget so slowdowns fail.
14. Run only affected packages on PRs with Vite+ filtering, and the full suite on `main`. Hide a real change from the selection on purpose and confirm CI goes red.
15. Add a pre-push hook in `.vite-hooks/` that runs format, lint and typecheck on changed files, next to the `vp staged` pre-commit hook.

### Needs an account or spend

- Blacksmith runners for GitHub Actions. The free tier (about 3,000 minutes per month) should cover this repository, so expected cost is $0. Low priority, because queue time is small today.
