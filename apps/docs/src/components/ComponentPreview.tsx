import { Badge } from "@erbium/ui/components/badge";
import { Button } from "@erbium/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@erbium/ui/components/card";
import { Input } from "@erbium/ui/components/input";
import { Switch } from "@erbium/ui/components/switch";
import { useState } from "react";

export default function ComponentPreview({ name }: { name: string }) {
  const [enabled, setEnabled] = useState(true);
  if (name === "button")
    return (
      <div className="preview-row">
        <Button>Continue</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
      </div>
    );
  if (name === "badge")
    return (
      <div className="preview-row">
        <Badge>New</Badge>
        <Badge variant="secondary">Stable</Badge>
        <Badge variant="outline">Outline</Badge>
        <Badge variant="destructive">Deprecated</Badge>
      </div>
    );
  if (name === "input")
    return (
      <div className="preview-form">
        <label htmlFor="preview-email">Email address</label>
        <Input id="preview-email" placeholder="you@example.com" />
        <small>We'll never share your email.</small>
      </div>
    );
  if (name === "switch")
    return (
      <div className="preview-row">
        <Switch checked={enabled} onCheckedChange={setEnabled} />
        <span>{enabled ? "Notifications enabled" : "Notifications disabled"}</span>
      </div>
    );
  if (name === "card")
    return (
      <Card className="demo-card">
        <CardHeader>
          <CardTitle>Ship faster</CardTitle>
          <CardDescription>Production-ready primitives for your next interface.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button size="sm">Get started</Button>
        </CardContent>
      </Card>
    );
  return (
    <div className="fallback-preview">
      <span className="fallback-dot" /> Interactive preview coming soon{" "}
      <a href="https://github.com/erbium-app/erbium-ui">View source ↗</a>
    </div>
  );
}
