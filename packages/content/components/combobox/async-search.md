---
title: "Async search"
description: "Delayed results, automatic highlighting, and a thin scrolling list."
---

Open the project picker and type a query. This story simulates a delayed request locally, cancels obsolete requests, and hides stale results while searching. The first arriving match is highlighted; use arrow keys and Enter to choose it. Search for a missing project to see the empty state, then clear the query to restore the longer list and its thin scrollbar.

The flush search header stays outside the scrolling list and retains its separator. Header height follows our search sizing on desktop and mobile; the list uses the space left by the actual header rather than subtracting a fixed height. For a real service, cancel the request and use `filter={null}` when the service already filters results.

Show a centered spinner while results are pending, with an accessible search status. Use `ComboboxStatus` for loading or error announcements and `ComboboxEmpty` for a completed search with no matches. Keep Status mounted while the popup is open and update its children; hiding or conditionally mounting the live region can prevent announcements. The list's `aria-busy` communicates that results are still arriving.
