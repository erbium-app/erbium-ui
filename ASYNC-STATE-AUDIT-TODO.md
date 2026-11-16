# Async state audit: remaining work

The initial review compared Erbium with the local Base UI source at `/Volumes/AlirezaDev/Codes/Packages/base-ui`. The current changes address autocomplete spacing and stale results, combobox and autocomplete empty-region mounting, and indeterminate progress visibility. They have passed scoped source checks, but have not been verified interactively.

## Verify the current changes

- [ ] In Storybook or the docs playground, verify autocomplete start-addon spacing with placeholder and typed text at all sizes, in LTR and RTL, and with clear and trigger controls.
- [ ] Exercise async autocomplete and combobox with fast query changes, successful results, no matches, and clearing the query. Confirm obsolete results do not appear and keyboard selection still works.
- [ ] Check loading and empty announcements with a screen reader. Confirm live regions remain mounted while their content changes and loading does not announce an empty result.
- [ ] Verify determinate, complete, and indeterminate progress visually, including reduced motion and accessible names and values. Confirm the playground shows one track.
- [ ] Add meaningful regression coverage for these behaviors using the project's supported testing approach. The repository currently documents no automated UI test runner; determine an appropriate approach without weakening existing checks.

## Resolve API and feedback gaps

- [ ] Review `StatefulButton` rejection behavior: a rejected promise returns it to idle and calls the optional `onError` callback. Decide how consumers should provide visible and announced error feedback, then implement and document the chosen contract without silently losing failures.
- [ ] Resolve the `Progress` composition ambiguity: `Progress` always renders a track, so passing a custom `ProgressTrack` as a child creates a second track. Choose and document an API that supports customization without duplication, accounting for existing consumers.
- [ ] Review async search examples and documentation for request failures, retries, cancellation, stale responses, and accessible status messages. Add representative error handling and guidance where needed.

## Complete the audit and validation

- [ ] Complete the accessibility and design review of async-capable Base UI integrations, including button, form, dialog, toast, avatar, progress, combobox, and autocomplete. Check loading, empty, error, and success states where applicable, including focus retention, announcements, reduced motion, and exposed APIs.
- [ ] Record any additional gaps and implement those that apply to Erbium's design system. Distinguish states owned by a consumer from behavior the shared primitive should provide.
- [ ] Run scoped checks on every changed source file and verify generated showcase and registry artifacts are synchronized. Run broader checks where appropriate and report existing unrelated failures separately.
