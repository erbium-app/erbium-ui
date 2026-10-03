---
title: "Progress"
description: "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar."
---

Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.

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
