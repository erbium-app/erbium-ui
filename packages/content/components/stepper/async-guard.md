---
title: "Async Guard"
description: "Check a step on the server before moving on."
---

A guard can return a promise. Next shows a spinner and stays focusable with `aria-busy` while it runs, and a second click is ignored. The guard's `signal` aborts if the move is cancelled.
