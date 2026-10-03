---
title: "Tabs"
description: "Switch between related panels of content."
---

## Usage

Display one tab panel at a time, switching between related sections of content.

**Import:** `@erbium/ui/components/tabs`

## Usage

```tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@erbium/ui/components/tabs";
```

```tsx
<Tabs defaultValue="account" className="w-[400px]">
  <TabsList>
    <TabsTrigger value="account">Account</TabsTrigger>
    <TabsTrigger value="password">Password</TabsTrigger>
  </TabsList>
  <TabsContent value="account">Make changes to your account here.</TabsContent>
  <TabsContent value="password">Change your password here.</TabsContent>
</Tabs>
```

## Composition

Use the following composition to build `Tabs`:

```text
Tabs
├── TabsList
│   ├── TabsTrigger
│   └── TabsTrigger
├── TabsContent
└── TabsContent
```
