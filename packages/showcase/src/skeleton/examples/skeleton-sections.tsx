import { Fragment, useId, useState } from "react";
import type { ReactNode } from "react";
import { Badge } from "@erbium/ui/components/badge";
import { Button } from "@erbium/ui/components/button";
import { Field, FieldLabel } from "@erbium/ui/components/field";
import { Icon } from "@erbium/ui/components/icon";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
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
import { Skeleton } from "@erbium/ui/components/skeleton";
import { Switch } from "@erbium/ui/components/switch";
import { useSimulatedFetch } from "../../loading";
import { sampleSessions, sampleSettings, sessions, settings } from "../fixtures";
import type { Session, Settings } from "../fixtures";

const timezones = [
  { label: "Berlin (GMT+1)", value: "Europe/Berlin" },
  { label: "Lisbon (GMT)", value: "Europe/Lisbon" },
  { label: "New York (GMT−5)", value: "America/New_York" },
  { label: "Tokyo (GMT+9)", value: "Asia/Tokyo" },
];

const PreferenceRows = ({ value }: { value: Settings }) => (
  <ItemGroup variant="panel">
    <Item>
      <ItemContent>
        <ItemTitle>Time zone</ItemTitle>
        <ItemDescription>Used for dates and reminders</ItemDescription>
      </ItemContent>
      <ItemActions>
        <Select items={timezones} defaultValue={value.timezone}>
          <SelectTrigger size="sm" aria-label="Time zone">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {timezones.map((timezone) => (
              <SelectItem key={timezone.value} value={timezone.value}>
                {timezone.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </ItemActions>
    </Item>
    <ItemSeparator />
    <Item render={<Field orientation="horizontal" />}>
      <ItemContent>
        <ItemTitle>
          <FieldLabel>Security alerts</FieldLabel>
        </ItemTitle>
        <ItemDescription>Email me when someone signs in from a new device</ItemDescription>
      </ItemContent>
      <ItemActions>
        <Switch defaultChecked={value.securityAlerts} />
      </ItemActions>
    </Item>
    <ItemSeparator />
    <Item render={<Field orientation="horizontal" />}>
      <ItemContent>
        <ItemTitle>
          <FieldLabel>Product updates</FieldLabel>
        </ItemTitle>
        <ItemDescription>A short note when we ship something new</ItemDescription>
      </ItemContent>
      <ItemActions>
        <Switch defaultChecked={value.productUpdates} />
      </ItemActions>
    </Item>
  </ItemGroup>
);

const SessionRows = ({ value }: { value: Session[] }) => (
  <ItemGroup variant="panel">
    {value.map((session, index) => (
      <Fragment key={session.id}>
        {index > 0 && <ItemSeparator />}
        <Item>
          <ItemMedia variant="icon">
            <Icon name="globe" aria-hidden="true" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>
              {session.device}
              {session.current ? <Badge variant="success">This device</Badge> : null}
            </ItemTitle>
            <ItemDescription>
              {session.location} · {session.lastActive}
            </ItemDescription>
          </ItemContent>
          {session.current ? null : (
            <ItemActions>
              <Button variant="ghost" size="sm">
                Sign out
              </Button>
            </ItemActions>
          )}
        </Item>
      </Fragment>
    ))}
  </ItemGroup>
);

const Section = ({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) => {
  const headingId = useId();

  return (
    <section aria-labelledby={headingId} className="flex flex-col gap-group">
      {/* Known before any request answers, so it renders at once, outside the skeleton. */}
      <div className="flex flex-col gap-0.5 px-4">
        <h3 id={headingId} className="text-subtitle">
          {title}
        </h3>
        <p className="text-caption text-muted-foreground">{description}</p>
      </div>
      {children}
    </section>
  );
};

/**
 * A page whose sections come from separate requests. Each section wraps only its own data in its own
 * `Skeleton`, so a slow request holds back only that section and a failed one shows its error
 * while the rest of the page stays usable. Headings are known, so they stay outside the skeleton.
 */
export const defaultProps = {} satisfies { latency?: number };

export default function SkeletonSectionsExample({
  latency = 1200,
}: { latency?: number } = defaultProps) {
  const [failSessions, setFailSessions] = useState(false);
  const failId = useId();

  const settingsRequest = useSimulatedFetch(settings, { latency });

  const sessionsRequest = useSimulatedFetch(sessions, {
    fail: failSessions,
    latency: latency * 2,
  });

  return (
    <div className="flex w-full max-w-lg flex-col gap-section">
      <div className="flex flex-wrap items-center justify-center gap-group">
        <Field orientation="horizontal" className="w-auto">
          <Switch
            id={failId}
            checked={failSessions}
            onCheckedChange={(checked) => {
              setFailSessions(checked);
              sessionsRequest.reload();
            }}
          />
          <FieldLabel htmlFor={failId}>Fail the sessions request</FieldLabel>
        </Field>
        <Button
          variant="outline"
          size="sm"
          disabled={settingsRequest.loading || sessionsRequest.loading}
          onClick={() => {
            settingsRequest.reload();
            sessionsRequest.reload();
          }}
        >
          Reload page
        </Button>
      </div>
      <Section title="Preferences" description="How dates appear and when we contact you.">
        <Skeleton
          data={settingsRequest.data}
          sample={sampleSettings}
          loading={settingsRequest.loading}
          id="skeleton-sections-preferences"
          label="Loading preferences"
        >
          {(value) => <PreferenceRows value={value} />}
        </Skeleton>
      </Section>
      <Section title="Sessions" description="Devices signed in to your account.">
        <Skeleton
          data={sessionsRequest.data}
          sample={sampleSessions}
          loading={sessionsRequest.loading}
          error={sessionsRequest.error}
          id="skeleton-sections-sessions"
          label="Loading sessions"
        >
          {(value) => <SessionRows value={value} />}
        </Skeleton>
        {sessionsRequest.error === undefined ? null : (
          <Button
            variant="outline"
            size="sm"
            className="self-start"
            onClick={() => {
              sessionsRequest.reload();
            }}
          >
            Try again
          </Button>
        )}
      </Section>
    </div>
  );
}
