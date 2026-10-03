---
title: "Trigger"
story: Trigger
---

Add an `AttachmentTrigger` to make the whole card open a link or dialog. It fills the card behind the actions, so the actions stay clickable.

```tsx
<Dialog>
  <Attachment>
    {/* media, content, actions */}
    <DialogTrigger render={<AttachmentTrigger aria-label="Preview research-summary.pdf" />} />
  </Attachment>
  <DialogPanel>{/* ... */}</DialogPanel>
</Dialog>
```
