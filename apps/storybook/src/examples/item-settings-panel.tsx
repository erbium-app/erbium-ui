import { Fragment } from "react";
import { Button } from "@erbium/ui/components/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
} from "@erbium/ui/components/item";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@erbium/ui/components/select";
import { Switch } from "@erbium/ui/components/switch";

const preferenceSelects = [
  {
    title: "Default home view",
    description: "Select which view to display when launching Linear",
    options: ["Linear Agent (default)", "Inbox", "My issues"],
  },
  {
    title: "Display names",
    description: "Select how names are displayed in the Linear interface",
    options: ["Username", "Full name"],
  },
  {
    title: "First day of the week",
    description: "Used for date pickers",
    options: ["Sunday", "Monday"],
  },
] as const;

const interfaceSwitches = [
  {
    id: "pointer-cursors",
    title: "Use pointer cursors",
    description: "Change the cursor to a pointer when hovering over any interactive elements",
  },
  {
    id: "underline-links",
    title: "Underline links",
    description: "Always underline links in text content",
  },
  {
    id: "disable-animation",
    title: "Disable animated images & emoji",
    description:
      "When enabled, GIFs and animated emojis will be static by default and animate only on hover.",
  },
] as const;

export default function ItemSettingsPanel() {
  return (
    <div className="dark w-full max-w-2xl space-y-12 bg-surface-canvas p-6 text-foreground">
      <ItemGroup variant="panel">
        {preferenceSelects.map((preference, index) => (
          <Fragment key={preference.title}>
            {index > 0 && <ItemSeparator />}
            <Item role="listitem">
              <ItemContent>
                <ItemTitle>{preference.title}</ItemTitle>
                <ItemDescription>{preference.description}</ItemDescription>
              </ItemContent>
              <ItemActions>
                <Select defaultValue={preference.options[0]}>
                  <SelectTrigger size="sm" aria-label={preference.title}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {preference.options.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </ItemActions>
            </Item>
          </Fragment>
        ))}
        <ItemSeparator />
        <Item role="listitem">
          <ItemContent>
            <ItemTitle>
              <label htmlFor="convert-emoticons">Convert text emoticons into emojis</label>
            </ItemTitle>
            <ItemDescription>Strings like :) will be converted to 🙂</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Switch id="convert-emoticons" defaultChecked />
          </ItemActions>
        </Item>
        <ItemSeparator />
        <Item role="listitem">
          <ItemContent>
            <ItemTitle>Send comments on...</ItemTitle>
            <ItemDescription>Choose which key press is used to submit comments</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Select defaultValue="⌘ + Enter">
              <SelectTrigger size="sm" aria-label="Send comments on">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="⌘ + Enter">⌘ + Enter</SelectItem>
                <SelectItem value="Enter">Enter</SelectItem>
              </SelectContent>
            </Select>
          </ItemActions>
        </Item>
      </ItemGroup>

      <section className="space-y-4" aria-labelledby="interface-heading">
        <h2 id="interface-heading" className="px-4 text-sm font-medium">
          Interface and theme
        </h2>
        <ItemGroup variant="panel">
          <Item role="listitem">
            <ItemContent>
              <ItemTitle>App sidebar</ItemTitle>
              <ItemDescription>
                Customize sidebar item visibility, ordering, and badge style
              </ItemDescription>
            </ItemContent>
            <ItemActions>
              <Button variant="ghost" size="sm">
                Customize
              </Button>
            </ItemActions>
          </Item>
          <ItemSeparator />
          <Item role="listitem">
            <ItemContent>
              <ItemTitle>Font size</ItemTitle>
              <ItemDescription>Adjust the size of text across the app</ItemDescription>
            </ItemContent>
            <ItemActions>
              <Select defaultValue="Default">
                <SelectTrigger size="sm" aria-label="Font size">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Default">Default</SelectItem>
                  <SelectItem value="Small">Small</SelectItem>
                  <SelectItem value="Large">Large</SelectItem>
                </SelectContent>
              </Select>
            </ItemActions>
          </Item>
          {interfaceSwitches.map((preference) => (
            <ItemGroupSection key={preference.id} {...preference} />
          ))}
        </ItemGroup>
      </section>
    </div>
  );
}

function ItemGroupSection({ id, title, description }: (typeof interfaceSwitches)[number]) {
  return (
    <>
      <ItemSeparator />
      <Item role="listitem">
        <ItemContent>
          <ItemTitle>
            <label htmlFor={id}>{title}</label>
          </ItemTitle>
          <ItemDescription>{description}</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Switch id={id} />
        </ItemActions>
      </Item>
    </>
  );
}
