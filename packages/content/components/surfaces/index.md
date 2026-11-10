---
title: Surfaces
description: "Surface styles for layers and interaction states."
---

Surface utilities express the role of an element: a panel, control, field, overlay, modal, or well. Each role supplies the shared face, edge, shadow, and highlight treatment used by Erbium components.

Explore the surface ladder, colored surfaces, nested roles, and interaction states below. Compose the existing roles when creating application layouts so their visual treatment stays consistent with the component library.

## Image hairlines

Apply `image-hairline` to a wrapper that fits the visible image. The utility paints a 0.5px inset shadow on an overlay that follows the wrapper’s radius. The edge uses translucent black at 10% in light mode and white at 12% in dark mode. The image pixels show through the shadow, so its appearance changes with the photo. The overlay takes up no layout space and lets pointer events pass through.

```tsx
<div className="image-hairline overflow-hidden rounded-lg">
  <img className="block w-full object-cover" src={photo.src} alt={photo.alt} />
</div>
```

Avatars, image attachments, item media, image controls, CardMedia, and Lightbox apply the treatment where they own the image surface. Keep focus and selection borders on the interactive control, outside the image edge. For custom layouts, put the utility on the image wrapper so the hairline follows the photo even when the surrounding control has padding.

The treatment follows the [Ramka default Lightbox preset](https://ramka.dev/presets/default).
