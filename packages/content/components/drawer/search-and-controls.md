---
title: "Search and controls"
description: "A searchable mobile surface with a gesture-aware slider."
---

Search the project list, choose a project, and adjust the preview scale. The Command input remains flush with its result surface and is separated from results by the shared separator. Only the content scrolls; the drawer header and footer stay in place. The slider uses `data-base-ui-swipe-ignore="x"` to reserve horizontal touch gestures for the control while allowing the drawer to handle the other axis. Verify swipe dismissal and virtual-keyboard behavior on a real touch device.
