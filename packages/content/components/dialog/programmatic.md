---
title: "Programmatic opening"
description: "Focus follows the actual control that opened the dialog."
---

Open the same dialog from the external application-state button and from its registered trigger. Close it with Done or Escape. Focus should return to the control that actually opened it. Keep controlled open state at the application boundary; use the existing Dialog API rather than an additional overlay context.
