---
title: "Table"
story: Table
---

Pages kept in state, for a table that fetches each page from the server. `onPageChange` moves the table to the page, and `onPageIntent` requests it before the click. A cache shared by both, such as TanStack Query's or an atom family's, lets the click reuse the request.
