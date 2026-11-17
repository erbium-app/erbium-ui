# 16 — Async states

Reviewed 2026-11-18. Covers loading, empty, error and success states in the Base UI integrations that run async work: button, stateful button, form submit, dialog, toast, avatar, progress, combobox and autocomplete. Replaces the root `ASYNC-STATE-AUDIT-TODO.md`.

The reference is the local Base UI checkout at `/Volumes/AlirezaDev/Codes/Packages/base-ui` (`@base-ui/react` ^1.9.0 in `packages/ui`). Its async demos live in `docs/src/app/(docs)/react/components/{autocomplete,combobox}/demos/async*`.

## Already done (commit `5f66bef3`, not yet verified interactively)

- Autocomplete async example (`packages/showcase/src/autocomplete/helpers.tsx`, `AsyncAutocomplete`): each response records the request it answers; `loading` is "the latest response is not for the current request", so stale results never show. Clearing the query resets the response immediately.
- Combobox async example (`packages/showcase/src/combobox/variants/async-search.tsx`): same idea with `response.query !== query`. While loading it passes `items={[]}`.
- Status and empty regions stay mounted and only their children change (comment on `ComboboxStatus`, `packages/ui/src/components/combobox.tsx:202`).
- Progress gained an indeterminate variant (`packages/showcase/src/progress/variants/indeterminate.tsx`): indicator at one third width with `animate-pulse`, disabled under `motion-reduce`.
- Autocomplete start-addon spacing (commit `e6130e3e`) pads the input from its size and addons.

## Decisions

Recorded 2026-11-18. Implement these; do not reopen them without the owner.

1. **StatefulButton gets an `"error"` state.**
   - `StatefulButtonState` becomes `"idle" | "loading" | "success" | "error"`.
   - New props: `errorLabel?: ReactNode` (default sr-only "Failed") and `errorDuration?: number` (default 3000 ms; error stays visible longer than success).
   - Visual: an error icon in the same stacked slot as the spinner and check, using the `error` role colour (never `destructive`, see the vocabulary rule in memory). Respect `motion-reduce`.
   - On rejection: switch to `"error"`, call `onError(error)`. When no `onError` is passed, call `reportError(error)` so the failure reaches global error handlers. Never swallow it.
   - After `errorDuration` return to `"idle"`, using the same debouncer pattern as the success reset.
   - Controlled mode (`state` prop) accepts `"error"` too.
2. **One live region in StatefulButton.**
   - Replace the two `role="status"` spans that toggle `aria-hidden` (`stateful-button.tsx:124-145`) with one always-mounted sr-only `role="status"` element whose text changes: empty in idle, "Loading", the success label, the error label. Error text may use `role="alert"` only if VoiceOver testing shows polite is missed.
   - The visual layers become `aria-hidden` decoration. Remove the `aria-label` on the status spans (it duplicates the sr-only text).
   - The button's accessible name must stay the idle label in every state (keep the idle children in the accessibility tree, or set `aria-label` from them when they are a string; verify which works).
3. **SubmitButton shows the error state on a failed submit.** `form.SubmitButton` (`packages/ui/src/components/form.tsx:457`) maps a submit whose handler threw or rejected to `"error"`. The message itself is the consumer's job: field errors through `field.FieldError`, request failures through a toast or an inline alert. Shared primitives own the state and the announcement; consumers own the message text and recovery.
4. **Progress renders its default track only when no `ProgressTrack` child is passed.**
   - In `Progress` (`packages/ui/src/components/progress.tsx:29`), scan direct `children` with `React.Children.toArray` and `isValidElement` for an element whose `type === ProgressTrack`. If found, render children as-is; otherwise append the default track.
   - `<Progress value={40} />` keeps working unchanged. No in-repo consumer passes a custom track today, so nothing breaks.
   - Document that a custom track must be a direct child (a wrapper component hides it and you get two tracks). Update the anatomy tree in `packages/content/components/progress/index.md` and add a "Custom track" example.
5. **Async search examples follow Base UI's pattern, keeping Erbium's stale-result guard.**
   - One `Status` region carries every message: searching, error, no match, and "N results". `Empty` is not used in async examples (Base UI renders both `Status` and `Empty` as `role="status" aria-live="polite"`, so two regions compete).
   - Clear results while a new query loads (do not show obsolete results). This differs from Base UI's demo, which keeps old results; the audit required obsolete results not to appear.
   - Show an error with a retry action, and a way to force failure in the demo.
   - Docs show a real `fetch` with `AbortController` (abort the previous request on each query change, ignore aborted responses). The demo keeps a timer.
6. **Testing: Storybook play functions run through Vitest.**
   - Add `@storybook/addon-vitest` and `@storybook/addon-a11y` to `apps/storybook`, run in Chromium through `vp test` (Vite+ 1.7 ships Vitest). Pin exact versions.
   - This changes repository policy: update `CLAUDE.md` (Validation policy), `todo/04-validation.md` (line 3) and add a `test` script. Do this in its own commit with an intent body.
   - Do not use jsdom for these behaviours; it cannot check layout or live-region timing.

## Findings still open

### StatefulButton (`packages/ui/src/components/stateful-button.tsx`)

- A rejected promise returns to `idle` and only calls the optional `onError` (lines 97-101). Without `onError` the failure is lost. Fixed by decisions 1-2.
- The status spans never change text; they only flip `aria-hidden`. Screen readers announce that inconsistently.
- Focus retention works: `focusableWhenDisabled` is set while busy. Keep it.

### Form

- `SubmitButton` drops to idle on failure; there is no form-level error component in `form.tsx`. Decision 3 covers the button. Decide separately (later) whether a `FormError` for `errorMap.onSubmit` is worth adding; record it in [02](./02-base-ui-api.md) if so.

### Button (`packages/ui/src/components/button.tsx:95-102`)

- With `loading` and an icon-only button, `children` are removed. An icon-only button named by an sr-only child loses its accessible name while loading; one named by `aria-label` is fine. Verify, then keep the sr-only children (hide only visible icons) if the name is lost.
- `aria-busy` alone announces nothing. Document that the consumer announces the outcome (toast or status text).

### Progress (`packages/ui/src/components/progress.tsx`)

- Passing `ProgressTrack` as a child renders a second track. Decision 4.
- Check that the indeterminate state exposes no `aria-valuenow` and that the accessible name comes from `aria-label` or `ProgressLabel`.

### Combobox and autocomplete examples

- Neither example has an error path. `useSimulatedFetch` (`packages/showcase/src/loading.tsx`) already supports `fail` and `error`; reuse its shape or extend it for query-driven requests rather than writing a second helper.
- Combobox announces no result count; autocomplete does. Align via decision 5.
- Combobox clears `items` on every keystroke, so the highlight resets; `autoHighlight` re-highlights after results arrive. Confirm keyboard selection still works with fast typing.
- Autocomplete mounts the popup only when `query` is non-empty, so its live regions unmount on clear. Acceptable; nothing needs announcing then.

### Avatar (`packages/ui/src/components/avatar.tsx`)

- The image is invisible during `data-loading` and `data-error`, and the fallback shows at once. Base UI's `AvatarFallback` has a `delay` prop that Erbium does not set, so fast images flash initials first. Initials are known content, so this is allowed by the loading rule. Decide whether to set a small default `delay` (for example 300 ms) only when the fallback is an icon rather than initials; low priority.

### Toast (`packages/ui/src/components/toast.tsx`)

- `toast.promise` is wired and the loading, success and error types match Base UI. Not yet verified with a screen reader or reduced motion (`packages/showcase/src/toast/examples/toast-promise.tsx`).

### Dialog and alert dialog

- No async-confirm example: the action shows loading, the dialog stays open, focus stays on the action, an error is shown inside the dialog, and success closes it. Add one to alert dialog using `StatefulButton` once decision 1 lands.

## Work, in order

Each step: edit, run `bunx vp check <edited files>` (and `bunx stylelint` on edited CSS) until clean, then regenerate registries.

1. [ ] StatefulButton error state and single live region (decisions 1-2). Update its docs and add an error example in `packages/showcase/src/stateful-button`.
2. [ ] SubmitButton error mapping (decision 3) plus a form example whose submit fails.
3. [ ] Progress track detection, docs and custom-track example (decision 4).
4. [ ] Button icon-only loading name: verify, fix if needed.
5. [ ] Rewrite both async search examples (decision 5). Add an "Async search" section to the autocomplete and combobox docs in `packages/content/components/` covering failures, retries, cancellation, stale responses, status messages, and what the consumer owns.
6. [ ] Alert dialog async-confirm example.
7. [ ] Avatar fallback delay: decide and implement or drop.
8. [ ] Regenerate: `bun run ui:registry` for `packages/ui/src`; `bun run showcase:generate` and `bun run showcase:registry` for showcase and content; `bun run showcase:check` must pass. Never hand-edit generated files.
9. [ ] Testing setup (decision 6) in its own commit, then play functions for: autocomplete and combobox fast typing, stale responses, no match, error and retry, clearing, keyboard selection; StatefulButton success and error; Progress single track in all three states; axe on each story.
10. [ ] Manual verification in Storybook, recorded here:
    - [ ] Autocomplete start-addon spacing with placeholder and typed text at `sm`, `default`, `lg`, in LTR and RTL, with clear and trigger.
    - [ ] Progress determinate, complete and indeterminate; reduced motion; one track in the playground.
    - [ ] VoiceOver: loading, empty, error and success announcements for combobox, autocomplete, StatefulButton, SubmitButton and toast. Loading must not announce "no results".
11. [ ] Run `bun run check` and confirm the `Found N errors` count did not rise above the baseline (257 on 2026-11-17). List unrelated failures separately.

## Commit notes

- The working tree has unrelated uncommitted changes (control variant removal, catalog edits across `packages/showcase/src`). Commit this work separately.
- Lowercase conventional commits, no AI attribution.
