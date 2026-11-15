---
title: "Alert Dialog"
description: "A confirmation dialog for important decisions."
---

## Usage

Use a modal dialog to interrupt the current task with important content that requires a response.

**Import:** `@erbium/ui/components/alert-dialog`

## Usage

```tsx
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@erbium/ui/components/alert-dialog"
import {{ Button }} from "@erbium/ui/components/button"
```

```tsx
<AlertDialog>
  <AlertDialogTrigger render={<Button variant="outline" />}>Show Dialog</AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone. This will permanently delete your account from our servers.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction>Continue</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

## Composition

Use the following composition to build an `AlertDialog`:

```text
AlertDialog
├── AlertDialogTrigger
└── AlertDialogContent
    ├── AlertDialogHeader
    │   ├── AlertDialogMedia
    │   ├── AlertDialogTitle
    │   └── AlertDialogDescription
    └── AlertDialogFooter
        ├── AlertDialogCancel
        └── AlertDialogAction
```

## Interaction ownership

Keep destructive-action confirmation controlled at the application boundary. Programmatic opening must restore focus to the actual opening control; do not force focus to an unrelated trigger. See the Dialog programmatic-opening story for the shared focus contract. While the alert dialog is open, the page's hotkeys pause, so a shortcut cannot run the action behind the confirmation; hotkeys registered inside `AlertDialogContent` keep working.
