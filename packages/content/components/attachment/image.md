---
title: "Image"
story: Image
---

Set `variant="image"` on `AttachmentMedia` and render an `<img>` inside it. Use `orientation="vertical"` to stack the media above the content. Vertical image media sits flush with the card's top edge like `CardMedia`, as a 4:3 photo above the content or a square that fills the card on its own.

Image attachments open in a [Lightbox](/docs/components/lightbox). Wrap the media in `LightboxTrigger`, render it as an `AttachmentTrigger`, and attach the trigger's `imageRef` to the thumbnail. The trigger takes the media's place, so the open transition grows the thumbnail into the slide and reuses its pixels until the full image loads, while the whole card stays clickable. Give each trigger the same `itemId` as its `LightboxItem`.

```tsx
<Lightbox>
  <AttachmentGroup>
    {images.map((image) => (
      <Attachment key={image.name} orientation="vertical">
        <LightboxTrigger
          aria-label={`Open ${image.name}`}
          itemId={image.id}
          render={<AttachmentTrigger />}
        >
          {({ imageRef }) => (
            <AttachmentMedia variant="image">
              <img ref={imageRef} src={image.thumbnail} alt={image.alt} />
            </AttachmentMedia>
          )}
        </LightboxTrigger>
        <AttachmentContent>{/* title and description */}</AttachmentContent>
        <AttachmentRemove aria-label={`Remove ${image.name}`} />
      </Attachment>
    ))}
  </AttachmentGroup>
  <LightboxContent aria-label="Attached images">{/* one LightboxItem per image */}</LightboxContent>
</Lightbox>
```
