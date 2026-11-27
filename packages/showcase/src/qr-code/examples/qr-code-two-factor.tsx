import { CopyButton } from "@erbium/ui/blocks/copy-button";
import { Card, CardContent, CardHeader, CardTitle } from "@erbium/ui/components/card";
import { FieldLabel } from "@erbium/ui/components/field";
import { Form, useAppForm } from "@erbium/ui/components/form";
import { QRCode, QRCodeImage } from "@erbium/ui/components/qr-code";

const secret = "JBSWY3DPEHPK3PXP";

const link = `otpauth://totp/Erbium:demo?secret=${secret}&issuer=Erbium`;

// Grouped in fours, which is easier to type into an authenticator by hand.
const groupedSecret = secret.match(/.{4}/gu)?.join(" ") ?? secret;

export default function QRCodeTwoFactorExample() {
  const form = useAppForm({ defaultValues: { code: "" } });

  return (
    <Card className="w-80">
      <CardHeader className="text-center">
        <CardTitle>Set up two-factor</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-group">
        <QRCode value={link}>
          <QRCodeImage aria-label="Scan to add Erbium to your authenticator app" />
        </QRCode>
        <div className="flex items-center gap-1">
          <code dir="ltr" className="font-mono text-caption text-muted-foreground">
            {groupedSecret}
          </code>
          <CopyButton value={secret} aria-label="Copy setup key" size="icon-xs" />
        </div>
        <Form form={form} className="flex w-full flex-col gap-group">
          <form.AppField
            name="code"
            validators={{
              onSubmit: ({ value }) => (value.length === 6 ? undefined : "Enter all 6 digits."),
            }}
          >
            {(field) => (
              <field.Field required>
                <FieldLabel>Enter the code</FieldLabel>
                <field.OTPField length={6} groups={[3, 3]} />
                <field.FieldError />
              </field.Field>
            )}
          </form.AppField>
          <form.SubmitButton successLabel="Turned on">Turn on</form.SubmitButton>
        </Form>
      </CardContent>
    </Card>
  );
}
