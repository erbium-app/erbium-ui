---
title: "Controlled"
description: "Keep the current step in your state or the URL."
---

Pass `value` and `onValueChange`. A value the flow cannot reach, such as a deep link past unfinished steps, is refused: `onValueChange` answers with the step it stays on and the reason `unreachable`.
