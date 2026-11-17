import { useId } from "react";
import { FieldGroup, FieldLabel } from "@erbium/ui/components/field";
import { Form, useAppForm } from "@erbium/ui/components/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@erbium/ui/components/select";
import { Skeleton } from "@erbium/ui/components/skeleton";
import { LoadingControls, useSimulatedFetch } from "../../loading";
import { preferences, samplePreferences } from "../fixtures";
import type { Preferences } from "../fixtures";

const languages = [
  { label: "English", value: "en" },
  { label: "Deutsch", value: "de" },
  { label: "فارسی", value: "fa" },
];

const PreferencesForm = ({ initial }: { initial: Preferences }) => {
  const languageId = useId();
  const form = useAppForm({ defaultValues: initial });

  return (
    <Form form={form} className="w-full">
      <FieldGroup>
        <form.AppField name="displayName">
          {(field) => <field.TextField label="Display name" autoComplete="name" />}
        </form.AppField>
        <form.AppField name="email">
          {(field) => <field.TextField label="Email" type="email" autoComplete="email" />}
        </form.AppField>
        <form.AppField name="language">
          {(field) => (
            <field.Field>
              <FieldLabel htmlFor={languageId}>Language</FieldLabel>
              <Select
                items={languages}
                value={field.state.value}
                onValueChange={(value) => {
                  field.handleChange(value ?? "en");
                }}
              >
                <SelectTrigger id={languageId} className="w-full" onBlur={field.handleBlur}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {languages.map((language) => (
                      <SelectItem key={language.value} value={language.value}>
                        {language.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </field.Field>
          )}
        </form.AppField>
        <form.AppField name="weeklyDigest">
          {(field) => (
            <field.SwitchField
              label="Weekly digest"
              description="A summary of activity every Monday."
            />
          )}
        </form.AppField>
        <form.AppField name="mentions">
          {(field) => <field.SwitchField label="Email me when I am mentioned" />}
        </form.AppField>
        <form.SubmitButton className="self-start">Save preferences</form.SubmitButton>
      </FieldGroup>
    </Form>
  );
};

/**
 * Controls are drawn as blocks at their own size and labels as bars, so the form keeps its layout.
 * The form mounts with the loaded values, so there is no empty form to flash first.
 */
export const defaultProps = {} satisfies { latency?: number };

export default function SkeletonFormExample({ latency }: { latency?: number } = defaultProps) {
  const request = useSimulatedFetch(preferences, { latency });

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-group">
      <Skeleton
        data={request.data}
        sample={samplePreferences}
        loading={request.loading}
        id="skeleton-preferences"
        label="Loading preferences"
        className="w-full"
      >
        {(value) => <PreferencesForm initial={value} />}
      </Skeleton>
      <LoadingControls {...request} />
    </div>
  );
}
