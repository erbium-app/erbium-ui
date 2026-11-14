import { useId } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@erbium/ui/components/avatar";
import { Badge } from "@erbium/ui/components/badge";
import { Button } from "@erbium/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@erbium/ui/components/card";
import { FieldGroup, FieldLabel } from "@erbium/ui/components/field";
import { Form, useAppForm } from "@erbium/ui/components/form";
import { Icon } from "@erbium/ui/components/icon";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@erbium/ui/components/item";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@erbium/ui/components/select";
import { Skeleton } from "@erbium/ui/components/skeleton";
import { useSimulatedFetch } from "../loading";

/*
 * An account page whose three sections come from three requests. Each section owns its loading
 * state, so a slow request holds back only its own section, and each skeleton is measured from a
 * sample of that section's data.
 */

interface Account {
  name: string;
  email: string;
  plan: string;
  avatar: string;
  memberSince: string;
}

const account: Account = {
  avatar:
    "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=256&h=256&fit=crop",
  email: "maya@example.com",
  memberSince: "Member since March 2024",
  name: "Maya Okafor",
  plan: "Pro",
};

const sampleAccount: Account = {
  avatar: "",
  email: "name@example.com",
  memberSince: "Member since Month 0000",
  name: "Full Name",
  plan: "Plan",
};

interface Settings {
  displayName: string;
  timezone: string;
  productUpdates: boolean;
  securityAlerts: boolean;
}

const settings: Settings = {
  displayName: "Maya Okafor",
  productUpdates: false,
  securityAlerts: true,
  timezone: "Europe/Berlin",
};

const sampleSettings: Settings = {
  displayName: "Display name",
  productUpdates: true,
  securityAlerts: true,
  timezone: "Europe/Berlin",
};

interface Session {
  id: string;
  device: string;
  location: string;
  lastActive: string;
  current: boolean;
}

const sessions: Session[] = [
  {
    current: true,
    device: "Safari on macOS",
    id: "1",
    lastActive: "Active now",
    location: "Berlin, Germany",
  },
  {
    current: false,
    device: "Erbium for iOS",
    id: "2",
    lastActive: "2 hours ago",
    location: "Berlin, Germany",
  },
  {
    current: false,
    device: "Chrome on Windows",
    id: "3",
    lastActive: "Nov 2",
    location: "Lisbon, Portugal",
  },
];

const sampleSessions: Session[] = sessions.map((session, index) => ({
  ...session,
  device: "Browser on System",
  id: `sample-${index}`,
  lastActive: "Some time ago",
  location: "City, Country",
}));

const timezones = [
  { label: "Berlin (GMT+1)", value: "Europe/Berlin" },
  { label: "Lisbon (GMT)", value: "Europe/Lisbon" },
  { label: "New York (GMT−5)", value: "America/New_York" },
  { label: "Tokyo (GMT+9)", value: "Asia/Tokyo" },
];

const ProfileHeader = ({ value }: { value: Account }) => (
  <div className="flex flex-wrap items-center gap-group">
    <Avatar size="lg" className="[--avatar-size:3.5rem]">
      <AvatarImage src={value.avatar} alt="" />
      <AvatarFallback>{value.name.charAt(0)}</AvatarFallback>
    </Avatar>
    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
      <div className="flex items-center gap-related">
        <h2 className="text-title font-semibold">{value.name}</h2>
        <Badge variant="info">{value.plan}</Badge>
      </div>
      <p className="text-caption text-muted-foreground">
        {value.email} · {value.memberSince}
      </p>
    </div>
    <Button variant="outline" size="sm">
      Change photo
    </Button>
  </div>
);

const SettingsForm = ({ initial }: { initial: Settings }) => {
  const timezoneId = useId();
  const form = useAppForm({ defaultValues: initial });

  return (
    <Form form={form}>
      <FieldGroup>
        <form.AppField
          name="displayName"
          validators={{
            onDynamic: ({ value }) => (value.trim() === "" ? "Enter a display name." : undefined),
          }}
        >
          {(field) => <field.TextField label="Display name" autoComplete="name" required />}
        </form.AppField>
        <form.AppField name="timezone">
          {(field) => (
            <field.Field>
              <FieldLabel htmlFor={timezoneId}>Time zone</FieldLabel>
              <Select
                items={timezones}
                value={field.state.value}
                onValueChange={(value) => {
                  field.handleChange(value ?? initial.timezone);
                }}
              >
                <SelectTrigger id={timezoneId} className="w-full" onBlur={field.handleBlur}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {timezones.map((timezone) => (
                      <SelectItem key={timezone.value} value={timezone.value}>
                        {timezone.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </field.Field>
          )}
        </form.AppField>
        <form.AppField name="securityAlerts">
          {(field) => (
            <field.SwitchField
              label="Security alerts"
              description="Email me when someone signs in from a new device."
            />
          )}
        </form.AppField>
        <form.AppField name="productUpdates">
          {(field) => <field.SwitchField label="Product updates" />}
        </form.AppField>
        <form.SubmitButton className="self-start">Save changes</form.SubmitButton>
      </FieldGroup>
    </Form>
  );
};

const SessionList = ({ value }: { value: Session[] }) => (
  <ItemGroup>
    {value.map((session) => (
      <Item key={session.id} size="sm" variant="card">
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
    ))}
  </ItemGroup>
);

interface AccountSettingsProps {
  /** How long each section's request takes, in milliseconds. The sections answer in turn. */
  latency?: number;
  /** The sessions request fails, while the other sections load. */
  failSessions?: boolean;
}

const AccountSettings = ({ latency = 1200, failSessions = false }: AccountSettingsProps) => {
  const accountRequest = useSimulatedFetch(account, { latency });
  const settingsRequest = useSimulatedFetch(settings, { latency: latency * 1.5 });
  const sessionsRequest = useSimulatedFetch(sessions, { fail: failSessions, latency: latency * 2 });

  return (
    <div className="flex w-full flex-col gap-section">
      <Skeleton
        data={accountRequest.data}
        sample={sampleAccount}
        loading={accountRequest.loading}
        id="account-settings-profile"
        label="Loading profile"
      >
        {(value) => <ProfileHeader value={value} />}
      </Skeleton>
      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
          <CardDescription>How your name appears and when we contact you.</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton
            data={settingsRequest.data}
            sample={sampleSettings}
            loading={settingsRequest.loading}
            id="account-settings-preferences"
            label="Loading preferences"
          >
            {(value) => <SettingsForm initial={value} />}
          </Skeleton>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Sessions</CardTitle>
          <CardDescription>Devices signed in to your account.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-group">
          <Skeleton
            data={sessionsRequest.data}
            sample={sampleSessions}
            loading={sessionsRequest.loading}
            error={sessionsRequest.error}
            id="account-settings-sessions"
            label="Loading sessions"
          >
            {(value) => <SessionList value={value} />}
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
        </CardContent>
      </Card>
    </div>
  );
};

export { AccountSettings };

export type { AccountSettingsProps };
