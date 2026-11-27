# 20 — Chat experience: scrolling and rendering

Reviewed 2026-11-27. The goal is an agent chat whose transcript scrolls and renders correctly while replies stream. Erbium already has the message surfaces; the scroll behavior and the pieces that render an agent's work come next.

## References

| Source                                             | Revision                               | What it contributes                                              |
| -------------------------------------------------- | -------------------------------------- | ---------------------------------------------------------------- |
| `/Volumes/AlirezaDev/Codes/Packages/ui`            | `968d8cb9d`, `@shadcn/react` 0.3.1     | Message Scroller primitive and docs, Trace, styled chat parts    |
| `.../Codes/Packages/chatbot-template`              | `4106041`                              | A working AI SDK chat built from those parts                     |
| `.../Codes/Packages/coss`                          | `106c20b6`                             | Chat between people, a scroll hook, a token composer             |
| `.../Codes/Chat/opencode` (MIT)                    | `907b3bc518`, `packages/session-ui`    | A coding agent session: timeline, tool rows, docks, prompt input |
| <https://ui.shadcn.com/docs/ai-elements/base/chat> | read 2026-11-27                        | Composition, plus the Message Scroller, Tool and Reasoning pages |
| `.../Codes/Chat/t3code` (MIT)                      | `2292cca56a`, `apps/web`               | A larger agent client: work log, scroll follow, composer states  |
| `.../Codes/Chat/pierre`                            | see [11](./11-files-and-session-ui.md) | Markdown, code, diff and file rendering                          |

## Where Erbium stands

| Concern                              | State                                                    |
| ------------------------------------ | -------------------------------------------------------- |
| Message, Bubble, Marker, Attachment  | Shipped                                                  |
| Questionnaire                        | Shipped, on `@shadcn/react/questionnaire`                |
| Streaming Markdown                   | Shipped: `StreamingResponse` and `useTextStream`         |
| Code, diff and file blocks           | Shipped                                                  |
| Message Scroller                     | Shipped on `@shadcn/react` 0.3.1, with the defects below |
| Reasoning and tool steps (Trace)     | Missing                                                  |
| Rendering a list of message parts    | Missing; `useTextStream` handles text only               |
| Composer                             | Missing; `InputGroup` is the starting point              |
| Question, permission and queue docks | Missing as compositions                                  |

## Message Scroller defects

Measured 2026-11-27 in headless Chromium, on a test page that used the `@shadcn/react` primitive with the layout rules of Erbium's styled parts copied into plain CSS. The viewport was 600px tall, and rows had uneven heights.

| Scenario                                                            | Measured                                                                                | Cause                        |
| ------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | ---------------------------- |
| `scrollToMessage` to a distant row, first call                      | Off by up to 2,232px; the second call lands                                             | `content-visibility`         |
| Open with `defaultScrollPosition="last-anchor"`                     | The anchor is 456px above the view, expected 64px below its top                         | `content-visibility`         |
| Prepend history                                                     | The reading position moves 128–168px (0px at the very top with native scroll anchoring) | `content-visibility`         |
| Prepend history below a persistent "load earlier" row               | Jumps 2,100–2,700px, with or without `content-visibility`                               | Primitive                    |
| Sideways wheel over a code block, or a downward wheel at the bottom | Following stops: 720px behind after 30 new lines                                        | Primitive, with `autoScroll` |
| Open a 500px disclosure while at the bottom                         | Its button moves 500px, off the top                                                     | Primitive, with `autoScroll` |
| Hold the pointer to select text while a reply grows                 | The held line moves 360px                                                               | Primitive, with `autoScroll` |
| Streamed growth                                                     | 20 of 20 updates painted one frame behind (24px)                                        | Primitive                    |
| An anchored row appended while reading history                      | The reader is moved to it                                                               | By design                    |

With `content-visibility` turned off, jumps landed at 0px, `last-anchor` opened at 64px, and prepending without the extra row moved nothing.

Causes, by source. Line numbers for the primitive refer to `packages/react/src/message-scroller/` in the shadcn checkout.

- **`content-visibility`:** `packages/ui/src/components/message-scroller.tsx:64` sets `content-visibility: auto` with a 10rem estimate on every row, so positions are computed from estimates. shadcn's styled component has the same rule.
- **"Load earlier" row:** `use-message-scroller-controller.ts:429` detects a prepend only when the previous first row has moved. A row that stays first hides the prepend, and the new rows are treated as appended.
- **Follow release:** `userScrollIntent` (`:716`) runs for every wheel and touch move on the viewport, whatever its direction or target. When the viewport does not move, nothing re-arms following.
- **Disclosure:** `handleResize` (`:581`) scrolls to the end for any growth while following.
- **Selection:** no pointer or selection handling.
- **Frame lag:** the resize observer defers scrolling to the next animation frame, to avoid a resize loop error from the tail spacer.

Not tested: the styled component itself, real Safari (imitated with `overflow-anchor: none`), touch devices, window resizing, late image loading, and the cost of removing `content-visibility`. How far a jump misses depends on how much row heights differ from the estimate.

## Scrolling compared

| Concern           | shadcn primitive                               | coss `useChatScroll`           | OpenCode                                                                     |
| ----------------- | ---------------------------------------------- | ------------------------------ | ---------------------------------------------------------------------------- |
| Release following | Any wheel, touch or scroll key; scrollbar drag | More than 64px from the bottom | User gestures only; upward wheel; nested scrollers excluded until their edge |
| Turn anchoring    | Yes, with a peek of the previous turn          | No                             | None found; it follows the bottom                                            |
| Older history     | One correction when the first row moves        | None                           | Holds a visible row, corrected over several frames                           |
| Jump to message   | `scrollToMessage`, queued until rows mount     | `scrollIntoView` in the demo   | Virtualizer index and URL hash; loads older pages until found                |
| Long transcripts  | `content-visibility` in the styled component   | Nothing                        | TanStack Virtual                                                             |
| Composer height   | Follows viewport resizes while following       | Observes the viewport          | Observes the dock and keeps the bottom                                       |
| Per-session state | None                                           | Pause and reset                | Caches row sizes and open tools for 16 sessions                              |

## OpenCode session UI

Paths are relative to the OpenCode checkout. OpenCode is Solid, so these are behaviors to reproduce, not code to copy.

### Timeline model

`packages/app/src/pages/session/timeline/rows.ts` flattens messages into one list of rows, grouped into turns (a user message and its replies). Row kinds: turn gap, comment strip, user message, divider (compaction or interrupted), assistant part, thinking, retry, changed-file summary and error.

- Consecutive `read`, `glob`, `grep` and `list` calls collapse into one "Gathering context" row with counts (`groupParts`, `ContextToolGroup`).
- Empty text and reasoning are skipped. Reasoning can be hidden by a setting, and the thinking row then shows a heading taken from it.
- Pending questions are left out of the transcript and shown in the dock.
- The thinking row shows only for the active turn while it is busy. The file summary shows after the turn finishes.
- Row keys are stable, so a row keeps its identity while its content streams.

### Scrolling

Files: `ui/src/hooks/create-auto-scroll.tsx`, `app/src/pages/session.tsx`, `timeline/message-timeline.tsx` and `use-session-hash-scroll.ts`.

- A scroll event counts as the reader's only within 250ms of a wheel, touch, pointer or scroll key. The hook also ignores the scroll events its own writes cause.
- A wheel or touch inside a nested `[data-scrollable]` region counts only when it would pass that region's edge.
- A click that leaves text selected pauses following.
- Following runs from a resize observer, before paint. `overflow-anchor` is off.
- Older history loads within 200px of the top, and keeps loading while the transcript is too short to scroll.
- While history loads, the first visible row is held in place until it stays still for 30 frames, at most 180.
- The jump button appears only after more than one viewport, and at least 400px, from the bottom.
- Commands step to the previous and next user message. `session-ui` also ships a `MessageNav` list.
- A row that changes by more than the viewport keeps the visible rows mounted for two frames.
- Virtualization needs care: the repository patches `@tanstack/virtual-core` 3.17.3 for end padding and offset clamping.

Not verified: whether OpenCode keeps a disclosure button in place when it is opened at the bottom, or stops following during a selection drag. Neither app was run for this review.

### Tool and reply rendering

Files: `session-ui/src/components/message-part.tsx`, `basic-tool.tsx`, `part-default-open.ts`, `tool-error-card.tsx`, `session-retry.tsx` and `markdown-stream.ts`.

- A registry maps each part type and tool name to a renderer, with a generic fallback showing the tool name and up to three arguments.
- A pending tool shimmers its title and cannot be opened unless the tool allows it.
- Heavy bodies mount a frame after opening. Bodies open at load mount one per frame, from the bottom up.
- Shell and edit output open according to user preferences; edits that only delete stay closed.
- Open state is controlled and keyed by part ID, so it survives virtualization.
- Failed calls use an error card. Retries show the message, a countdown and the attempt number. Session errors unwrap provider JSON.
- The last text part carries copy, agent, model, duration and "interrupted".
- Text arriving in bursts over 512 characters is revealed in steps every 24ms, breaking at punctuation. `useTextStream` publishes once a frame but does not pace bursts.
- Streaming Markdown is split into settled and live blocks. `StreamingResponse` already covers this through Pierre.

### Composer region

Files: `app/src/pages/session/composer/` and `session-ui/src/v2/components/prompt-input/`.

- The region sits below the transcript and stacks question, permission, to-do, revert and follow-up docks around the prompt.
- The prompt is hidden while a question or permission is pending.
- Permission choices are deny, allow always and allow once.
- Question answers are cached per request, and the dock can be minimized.
- A setting queues follow-ups sent while the agent is busy, to be edited or sent later.
- The prompt input has history on the arrow keys, a shell mode, mentions and command suggestions, image attachments, file comments as context, and stop.

## t3code: what is worth keeping

Read from source in `apps/web/src/components/chat` and `packages/client-runtime/src/work-log`; the app was not run. Its components depend on t3code's data model, translation, themes and LegendList (which it patches), so port the behavior and layout ideas. Keep the MIT notice with any copied code.

Names below are file names in the first folder unless a path says otherwise.

### Take with the core plan

| Primitive           | Source                                                     | Keep                                                                                                      |
| ------------------- | ---------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Follow state        | `timelineViewport.ts`                                      | Pure following and released states, fed by one signal for wheel, touch, scrollbar, key and command input  |
| Disclosure hold     | `preserveDisclosurePosition` in `MessagesTimeline.tsx`     | Anchor the pressed row before it opens, unless a live reply is being followed                             |
| Settle after a jump | `settleListScroll` in `useTimelinePositionRestore.ts`      | Correct until still for two frames, at most 60; reader input cancels                                      |
| Position per thread | `timelineScrollAnchoring.ts`                               | Row ID, offset in the row, at-end flag and open disclosures, for 100 threads                              |
| Selection hold      | `useSelectedTimelineRowIds`                                | Keep selected rows mounted; needed only with virtualization                                               |
| Work log row        | `WorkLog.tsx`                                              | Icon, one-line label and trailing slot; only the header toggles, so details stay selectable               |
| Live step           | `LiveActivityRow` in `TimelineWorkGroupRows.tsx`           | One row showing the current step, shimmering only while visible, with a failed state                      |
| Output pane         | `WorkLogDetails`, `CommandOutputPanel.tsx`                 | Bounded height, follows the end until scrolled away, loading, empty, error and truncated states           |
| Tool call body      | `V2ItemInspector.tsx`, `ShellCommandBlock.tsx`             | Command, arguments, output and exit code; plain text first, highlighted in place                          |
| Summary label       | `work-log/presentation.ts`, `commandLabel.ts`              | One sentence per call or group, with failure marked; copy the idea, not the 1,500-line command parser     |
| Inline approval     | `TimelinePendingApprovalRow.tsx`                           | The request in the work log, with provider-defined choices, extra ones in a menu, and a can't-reply state |
| Question card       | `ComposerPendingUserInputPanel.tsx`                        | Number keys, single choice advances, custom answer, collapse; compare with Questionnaire                  |
| Divider             | `TimelineSystemDivider.tsx`                                | Labelled rule with detail, error tone and an optional action; extend Marker                               |
| Jump to latest      | `ScrollToEndButton`                                        | Names what waits below; pressing it does not take focus                                                   |
| Folded message      | `CollapsibleUserMessageBody`, `useTallEnoughToFold.ts`     | Fold only content at least twice the folded height                                                        |
| Elapsed time        | `AgentElapsed.tsx`, `lib/tickTextContent.ts`               | One shared timer writing text without re-rendering                                                        |
| Announcements       | `ThreadActivityAnnouncer.tsx`, `turnDetailAnnouncement.ts` | Separate polite regions for status and detail, paced by text length                                       |

Also keep these rules:

- Rows are derived from data and keep their identity while unchanged. A streaming update replaces only its own row (`computeStableMessagesTimelineRows`).
- A finished turn folds its work and leaves the reply; an interrupted turn stays open.
- A request that arrives while the reader is typing is held until 1.5s of idle time, so a keystroke cannot answer it (`composerTypingGuard.ts`).
- Stop has pending, confirmed and timed-out states.
- Messages show before the server confirms them, and reconcile by ID.

### Take later

| Primitive         | Source                                          | When                                         |
| ----------------- | ----------------------------------------------- | -------------------------------------------- |
| Follow-up queue   | `QueuedRunsControl.tsx`                         | Composer docks: send now, edit, cancel       |
| Notice stack      | `ComposerBanner.tsx`, `ComposerBannerStack.tsx` | Fixed order above the composer               |
| Command menu      | `ComposerCommandMenu.tsx`                       | Mentions and commands, on Autocomplete       |
| Prompt history    | `composerPromptHistory.ts`                      | With the composer; skip automated messages   |
| Draft stash       | `useComposerStash.ts`                           | After drafts persist                         |
| Plan card         | `ProposedPlanCard.tsx`                          | Plan mode: collapse, copy, download          |
| Turn minimap      | `TimelineMinimap.tsx`                           | After previous and next message commands     |
| Find in thread    | `threadFind.ts`, `threadFindHighlights.ts`      | Long threads; CSS highlights, opens folds    |
| Quote a selection | `AssistantSelectionToolbar.tsx`                 | When the composer accepts context chips      |
| Page keys         | `pageScrollController.ts`                       | Page Up and Down scroll from the composer    |
| Diff counts       | `DiffStatLabel.tsx`                             | Changed-file summary                         |
| Fresh turn anchor | `observeTimelineRun`                            | A queued turn anchors when it starts running |

### Skip

- Product features: workspaces and branches, worktree setup, pull requests, issues, terminals, previews, devices, provider and model pickers, usage limits, voice, guest sharing, subagent lineage, automations and MCP apps.
- The large files (`ChatView`, `ChatComposer`, `MessagesTimeline.logic`): they join those features together.
- The Tiptap prompt editor, unless inline chips become a requirement. Start with a text area.
- The Markdown renderer, code highlighter and file icons: `StreamingResponse` and the existing blocks cover them.
- Base UI wrappers in `components/ui`: Erbium has its own.

## Ideas from the other references

- **shadcn Trace:** one list of steps for reasoning and tools. A running, failed or denied call is a line; a call awaiting approval is an item with Approve and Deny. Reasoning is open while it runs, unless the reader chose otherwise (`open ?? running`). Duration comes from server metadata.
- **Chatbot template:** group consecutive steps into one Trace, join adjacent text parts, show sources and actions after streaming, and pin a pending question to the bottom of the scroll area.
- **coss:** pause following while an overlay is open, and collapse very long messages. Its composer is the reference if mentions need a token editor.

| Tool part state                      | Shown as                                |
| ------------------------------------ | --------------------------------------- |
| `input-streaming`, `input-available` | Running; failed if the chat has stopped |
| `approval-requested`                 | Approve and Deny                        |
| `approval-responded`                 | Running if approved, otherwise denied   |
| `output-available`                   | Done                                    |
| `output-error`                       | Failed                                  |
| `output-denied`                      | Denied                                  |

A tool the user answers in the interface stays `input-available` after the stream stops. Show it as waiting, not failed.

## Plan

In order. The application owns messages, transport, persistence and permissions throughout.

### 1. Scroller

- [ ] Turn the measured scenarios into real-browser tests that fail today.
- [ ] Remove `content-visibility` from `MessageScrollerItem` after measuring a long transcript with and without it, and update the performance section of the Message Scroller docs.
- [ ] Until the primitive is fixed, keep "load earlier" outside the viewport, as the Load Earlier History example does, and stop suggesting it as a row in the Message Scroller docs.
- [ ] Rebuild the behavior as `@erbium-ui/react/message-scroller`, following [19](./19-erbium-ui-react.md), with follow state in `core.ts` as t3code's `timelineViewport.ts` does:
  - release following only on vertical movement away from the end, ignoring nested scrollers until their edge;
  - hold still during a selection drag, and keep a pressed disclosure in place;
  - follow in the same frame as the growth;
  - detect a prepend behind rows that stay put, and correct until the layout settles;
  - keep turn anchoring, jumps and visibility, and let the app choose which turns anchor;
  - keep the bottom when the composer or dock changes height.
- [ ] Later: restore a position per thread, load older history into a short transcript, and virtualize only after a measured need.

### 2. Trace

- [ ] Headless open state and status, styled lines, and Reasoning and Tool compositions covering the states above.
- [ ] Controlled open state keyed by part ID, with per-tool default-open preferences.
- [ ] Show pending, running, completed and failed states, summaries, duration and actions.
- [ ] Reuse code, file and diff blocks for output. Cover streaming, cancellation, errors and grouped calls.
- [ ] Mount heavy output only when opened.
- [ ] Give output a bounded pane that follows its end, and announce step changes to screen readers.

### 3. Message parts and turns

- [ ] A block that renders ordered text, reasoning, tool, source and file parts, with a renderer per tool and a generic fallback. Decide the part shape first.
- [ ] Group consecutive steps; hide empty parts.
- [ ] Add thinking, retry, interrupted and error states to the Message compositions.
- [ ] Show actions and metadata once a reply finishes, and a changed-file summary using [11](./11-files-and-session-ui.md).
- [ ] Decide whether `useTextStream` should pace large bursts.

### 4. Composer

- [ ] Controlled text, attachments, submit, pending and cancel.
- [ ] Enter to submit, Shift+Enter for a new line, no submit during IME composition.
- [ ] Show stop as pending until the app confirms it.
- [ ] Attachment paste and drop, and prompt history on the arrow keys.
- [ ] Later: mentions and command suggestions.

### 5. Docks and navigation

- [ ] Compose question (Questionnaire) and permission docks that hide the prompt while pending and keep partial answers.
- [ ] Hold a request that arrives while the reader is typing until they pause.
- [ ] Compose a follow-up queue and a to-do list.
- [ ] Jump to latest after a distance threshold, previous and next message commands, and a message navigator.

### 6. Showcase

- [ ] Build a full session showcase before deciding whether a dedicated session package is needed.

## Decisions to make

- **Where the scroller lives:** [19](./19-erbium-ui-react.md) does not list it. Rebuilding it in `@erbium-ui/react` is recommended over patching or waiting for upstream, and adds a real-browser test environment.
- **Default reading position:** anchor each new turn near the top (shadcn), follow the bottom (OpenCode), or anchor first and follow the end once reasoning or tool work starts (t3code, `shouldReleaseTimelineAnchorForToolActivity`). Support the first two; choose the showcase default.
- **Part shape:** accept the AI SDK's message parts, or a smaller Erbium shape with an adapter.
- **Approval placement:** inline in the work log (t3code, shadcn) or in a dock that replaces the prompt (OpenCode). t3code docks questions and puts approvals inline.

## Not planned

Reactions, read receipts, member lists and focused replies serve chat between people. Revisit them only for a product that needs them.

## Validation

Check long transcripts, streaming, keyboard access, screen-reader announcements (a log that waits for the finished reply), RTL, light and dark, text zoom, touch devices and real Safari. Follow [04](./04-validation.md).
