# 11 — Files, review, and session UI

Use OpenCode's session UI and Pierre's rendering capabilities as references. Prefer compositions of existing blocks; applications own loading, execution, and persistence.

## 1. Changed-file review

- [ ] Compose FileTree, DiffView, and FileView with controlled file selection, Git status, rename paths, and added/deleted counts.
- [ ] Add source/diff switching, split/unified controls, and next/previous file navigation.
- [ ] Cover loading, error, no changes, no Git, added/deleted, empty, and unsupported files.

## 2. Review comments

- [ ] Add reusable comment threads and editors through file/diff annotation slots.
- [ ] Define controlled IDs, file paths, side-aware line ranges, and create/update/delete callbacks; consider resolve/reopen.
- [ ] Support gutter and selected-line comments, drafts, cancellation, and focus restoration without intercepting editor keys.

## 3. Multi-file review

- [ ] Add collapsible file sections, expand/collapse controls, and controlled reviewed state.
- [ ] Evaluate Pierre MultiFileDiff, Virtualizer, shared workers, and SSR preloading against the installed version.
- [ ] Verify large reviews, wrapping, context expansion, and stable selection/comment anchors.
- [ ] Evaluate conflict rendering when a consumer needs it.

## 4. Tool output

- [ ] Compose expandable tool entries with pending/running/completed/failed states, summaries, duration, and actions.
- [ ] Reuse code, file, and diff blocks for output; cover streaming, cancellation, errors, and grouped calls.
- [ ] Defer heavy output until opened where useful.

## 5. Messages and composer

- [ ] Compose user/assistant messages, Markdown, attachments, tool groups, timestamps, copy actions, and streaming states.
- [ ] Define controlled composer text, attachments, submit, pending, and cancel behavior.
- [ ] Build a full session showcase before deciding whether a dedicated session package is needed.

## Design and validation

Keep APIs minimal and reuse shared surfaces, input styles, and sidebar sizing. Validate keyboard access, RTL, light/dark, text zoom, touch sizing, and large content. Keep Pierre virtualization measurements aligned with rendered rows.

Include documentation and useful stories, regenerate affected registries, run `bun run check`, and verify interactions manually.

## References

- OpenCode checkout: `/Volumes/AlirezaDev/Codes/Chat/opencode`. Review `packages/session-ui/src/components/session-review.tsx`, `line-comment-annotations.tsx`, `message-part.tsx`, and `v2/components/session-review-v2.tsx`.
- Pierre checkout: `/Volumes/AlirezaDev/Codes/Chat/pierre`. Review `packages/diffs/src/react` and `packages/trees/src`.

OpenCode supplies session workflow examples; Pierre supplies file/diff/tree rendering. Comments, review progress, tool state, and message composition remain application or Erbium concerns. Check dependency versions and licenses before adopting more capabilities.
