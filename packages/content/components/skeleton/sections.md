---
title: "Sections"
story: Sections
---

Each section comes from its own request and wraps only its own data in its own `Skeleton`. A slow request holds back only its section, and a failed one shows its error and a retry while the rest of the page stays usable. Section headings are known before any request answers, so they render at once outside the skeleton.
