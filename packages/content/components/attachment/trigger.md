---
title: "Trigger"
story: Trigger
---

Add an `AttachmentTrigger` to make the whole card open a link or dialog. Empty, it fills the card behind the actions, so the actions stay clickable.

```tsx
<Dialog>
  <Attachment>
    {/* media, content, actions */}
    <DialogTrigger render={<AttachmentTrigger aria-label="Preview research-summary.pdf" />} />
  </Attachment>
  <DialogPanel>{/* ... */}</DialogPanel>
</Dialog>
```

Wrap `AttachmentMedia` in the trigger instead when the opened view grows out of the media, as a lightbox does. The trigger then takes the media's place and is the box the transition starts from, and its hit area still stretches over the whole card. See [Image](#image) for the lightbox composition.
