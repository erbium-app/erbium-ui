---
title: "Progress"
description: "Shows how far a task has progressed."
---

## Usage

Display task completion with a progress indicator, typically a progress bar.

**Import:** `@erbium/ui/components/progress`

## Usage

```tsx
import { Progress } from "@erbium/ui/components/progress";
```

```tsx
<Progress value={33} />
```

## Composition

Use `ProgressLabel` and `ProgressValue` to add a label and value display.

```tsx
import { Progress, ProgressLabel, ProgressValue } from "@erbium/ui/components/progress";

<Progress value={56} className="w-full max-w-sm">
  <ProgressLabel>Upload progress</ProgressLabel>
  <ProgressValue />
</Progress>;
```

```text
Progress
├── ProgressLabel
├── ProgressValue
└── ProgressTrack
    └── ProgressIndicator
```

For an operation without a known completion percentage, pass `value={null}` and give the progress bar an accessible label:

```tsx
<Progress value={null} aria-label="Uploading" />
```
