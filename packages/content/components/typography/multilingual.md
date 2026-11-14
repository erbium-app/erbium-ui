---
title: "Multilingual"
description: Vazirmatn in Arabic and Farsi, alongside Latin text.
---

[Vazirmatn](https://github.com/rastikerdar/vazirmatn), created by [Saber Rastikerdar](https://github.com/rastikerdar), brings Arabic and Farsi into the same text hierarchy. These settings panels show the font in headings, descriptions, fields, and actions, alongside Latin project names.

We want to expand Erbium’s typography to support more languages and scripts. We believe AI has made internationalization easier, and everyone should be able to enjoy their apps in a language they know. That means making room for each script’s letterforms, reading direction, and spacing as we grow the system.

Set `lang` and `dir` at the content boundary. Arabic, Farsi, and Urdu keep the shared sizes but receive extra line height for their marks, each a whole pixel: 48px for display, 36px for title, 28px for subtitle and body, 24px for caption, and 22px and 20px for the two control sizes.

Keep natural letter spacing in Arabic-script text, avoid uppercase transformations, and use semibold emphasis rather than synthesized italics. Wrap mixed-direction identifiers and numbers in `bdi`; code blocks remain left-to-right. Try editing the fields and narrowing the preview to see how the text wraps.
