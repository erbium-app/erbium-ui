import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { OTPField } from "@erbium/ui/components/otp-field";
import Demo from "../examples/otp-field-demo";
import ExampleOtpFieldSeparator from "../examples/otp-field-separator";
import ExampleOtpFieldControlled from "../examples/otp-field-controlled";
import { OTPFieldAlphanumeric } from "../examples/upstream/otp-field-alphanumeric";
import { OTPFieldDisabled } from "../examples/upstream/otp-field-disabled";
import { OTPFieldForm } from "../examples/upstream/otp-field-form";
import { OTPFieldFourDigits } from "../examples/upstream/otp-field-four-digits";
import { OTPFieldInvalid } from "../examples/upstream/otp-field-invalid";
import { OTPFieldPattern } from "../examples/upstream/otp-field-pattern";
import { OTPFieldStatusDemo } from "../examples/upstream/otp-field-status";

const meta = {
  title: "UI/OTP Field",
  component: OTPField,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'Accessible one-time password field built on Base UI\'s [OTP Field](https://base-ui.com/react/components/otp-field), with `status` for loading, success and error.\n\n**Import:** `@erbium/ui/components/otp-field`\n\n### Usage\n\n```tsx\nimport { OTPField } from "@erbium/ui/components/otp-field"\n\n<OTPField aria-label="One-time password" length={6} groups={[3, 3]} status="idle" />\n```\n\n### Composition\n\nWithout children the field renders `length` inputs. Pass children to compose them yourself:\n\n```text\nOTPField\n\u251c\u2500\u2500 OTPFieldGroup\n\u2502   \u2514\u2500\u2500 OTPFieldInput (\u00d7n)\n\u251c\u2500\u2500 OTPFieldSeparator\n\u2514\u2500\u2500 OTPFieldGroup\n```\n\nSlots after the first need an `aria-label` such as `Character 2 of 6` when composed by hand.',
      },
    },
  },
} satisfies Meta<typeof OTPField>;

export default meta;
type Story = StoryObj;

export const Playground: StoryObj<{
  length: number;
  disabled: boolean;
  validationType: "numeric" | "alphanumeric" | "none";
  status: "idle" | "loading" | "success" | "error";
}> = {
  args: { length: 6, disabled: false, validationType: "numeric", status: "idle" },
  argTypes: {
    length: { control: { type: "number", min: 1, max: 8 } },
    disabled: { control: "boolean" },
    validationType: { control: "select", options: ["numeric", "alphanumeric", "none"] },
    status: { control: "select", options: ["idle", "loading", "success", "error"] },
  },
  render: (args) => (
    <OTPField
      key={`${args.length}-${args.validationType}`}
      aria-label="One-time password"
      length={args.length}
      disabled={args.disabled}
      validationType={args.validationType}
      status={args.status}
    />
  ),
};

export const Overview: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Default six-slot field with two groups of three. Pass `length` and the field renders the inputs, labelled per slot, for you.",
      },
      source: {
        code: 'import { OTPField } from "@erbium/ui/components/otp-field";\n\nexport default function OTPFieldDemo() {\n  return <OTPField aria-label="One-time password" length={6} groups={[3, 3]} />;\n}\n',
      },
    },
  },
  render: () => <Demo />,
};

export const Separator: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Use `groups` to split the slots with separators, or compose `OTPFieldGroup` and `OTPFieldSeparator` yourself.",
      },
      source: {
        code: 'import { OTPField } from "@erbium/ui/components/otp-field";\n\nexport default function OTPFieldWithSeparator() {\n  return <OTPField aria-label="One-time password" length={6} groups={[2, 2, 2]} />;\n}\n',
      },
    },
  },
  render: () => <ExampleOtpFieldSeparator />,
};

export const Controlled: Story = {
  parameters: {
    docs: {
      description: {
        story: "Control the value with `value` and `onValueChange`.",
      },
      source: {
        code: 'import * as React from "react";\n\nimport { OTPField } from "@erbium/ui/components/otp-field";\n\nexport default function OTPFieldControlled() {\n  const [value, setValue] = React.useState("");\n\n  return (\n    <div className="space-y-2">\n      <OTPField\n        aria-label="One-time password"\n        length={6}\n        value={value}\n        onValueChange={setValue}\n      />\n      <div className="text-center text-sm">\n        {value === "" ? <>Enter your one-time password.</> : <>You entered: {value}</>}\n      </div>\n    </div>\n  );\n}\n',
      },
    },
  },
  render: () => <ExampleOtpFieldControlled />,
};

export const Form: Story = {
  parameters: {
    docs: {
      description: {
        story: "A verification card with a labelled field.",
      },
      source: {
        code: 'import { HugeiconsIcon } from "@hugeicons/react";\nimport RefreshCwIcon from "@hugeicons/core-free-icons/RefreshCwIcon";\n\nimport { Button } from "@erbium/ui/components/button";\nimport {\n  Card,\n  CardAction,\n  CardContent,\n  CardDescription,\n  CardFooter,\n  CardHeader,\n  CardTitle,\n} from "@erbium/ui/components/card";\nimport { Field, FieldDescription, FieldLabel } from "@erbium/ui/components/field";\nimport { OTPField } from "@erbium/ui/components/otp-field";\n\nexport function OTPFieldForm() {\n  return (\n    <Card className="mx-auto w-full max-w-sm">\n      <CardHeader>\n        <CardTitle>Verify your login</CardTitle>\n        <CardDescription>\n          Enter the verification code we sent to{" "}\n          <span className="font-medium text-foreground">m@example.com</span>.\n        </CardDescription>\n        <CardAction>\n          <Button type="button" variant="outline" size="xs">\n            <HugeiconsIcon icon={RefreshCwIcon} />\n            Resend\n          </Button>\n        </CardAction>\n      </CardHeader>\n      <CardContent>\n        <form id="otp-verification-form" onSubmit={(event) => event.preventDefault()}>\n          <Field>\n            <FieldLabel htmlFor="otp-verification">Verification code</FieldLabel>\n            <OTPField id="otp-verification" length={6} groups={[3, 3]} required />\n            <FieldDescription>\n              <a href="#">I no longer have access to this email address.</a>\n            </FieldDescription>\n          </Field>\n        </form>\n      </CardContent>\n      <CardFooter className="flex-col items-stretch gap-3">\n        <Button type="submit" form="otp-verification-form">\n          Verify\n        </Button>\n        <p className="text-center text-sm text-muted-foreground">\n          Having trouble signing in?{" "}\n          <a\n            href="#"\n            className="underline underline-offset-4 transition-colors hover:text-foreground"\n          >\n            Contact support\n          </a>\n        </p>\n      </CardFooter>\n    </Card>\n  );\n}\n',
      },
    },
  },
  render: () => <OTPFieldForm />,
};

export const Disabled: Story = {
  parameters: {
    docs: {
      description: {
        story: "`disabled` dims the field and removes it from the tab order.",
      },
      source: {
        code: 'import { OTPField } from "@erbium/ui/components/otp-field";\n\nexport function OTPFieldDisabled() {\n  return (\n    <OTPField aria-label="Verification code" length={6} groups={[3, 3]} disabled value="123456" />\n  );\n}\n',
      },
    },
  },
  render: () => <OTPFieldDisabled />,
};

export const Invalid: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '`status="error"` marks every slot invalid and shakes the field once. Pair it with `FieldError` for the message; a correct code switches to `status="success"`.',
      },
      source: {
        code: 'import * as React from "react";\n\nimport { Field, FieldError, FieldLabel } from "@erbium/ui/components/field";\nimport { OTPField, type OTPFieldStatus } from "@erbium/ui/components/otp-field";\n\nexport function OTPFieldInvalid() {\n  const [value, setValue] = React.useState("");\n  const [status, setStatus] = React.useState<OTPFieldStatus>("idle");\n  const invalid = status === "error";\n  const errorId = React.useId();\n\n  function handleValueChange(nextValue: string) {\n    setValue(nextValue);\n    setStatus("idle");\n  }\n\n  function handleValueComplete(code: string) {\n    setStatus(code === "123456" ? "success" : "error");\n  }\n\n  return (\n    <Field className="w-fit" data-invalid={invalid}>\n      <FieldLabel htmlFor="invalid-code">Verification code</FieldLabel>\n      <p className="text-sm text-muted-foreground">Demo code: 123456</p>\n      <OTPField\n        id="invalid-code"\n        aria-describedby={errorId}\n        groups={[2, 2, 2]}\n        length={6}\n        onValueChange={handleValueChange}\n        onValueComplete={handleValueComplete}\n        status={status}\n        value={value}\n      />\n      <FieldError id={errorId} errors={invalid ? ["Incorrect code. Try 123456."] : []} />\n    </Field>\n  );\n}\n',
      },
    },
  },
  render: () => <OTPFieldInvalid />,
};

export const Status: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`status` is `idle`, `loading`, `success` or `error`. `loading` and `success` lock the field with `readOnly` rather than `disabled`, so it keeps focus and its value. `error` shakes the field. Nothing renders outside the slots, so the layout never shifts.",
      },
      source: {
        code: 'import * as React from "react";\n\nimport { OTPField, type OTPFieldStatus } from "@erbium/ui/components/otp-field";\n\nconst VERIFY_DELAY = 900;\n\nexport function OTPFieldStatusDemo() {\n  const [value, setValue] = React.useState("");\n  const [status, setStatus] = React.useState<OTPFieldStatus>("idle");\n  const timer = React.useRef<ReturnType<typeof setTimeout>>(undefined);\n\n  React.useEffect(() => () => clearTimeout(timer.current), []);\n\n  function handleValueChange(nextValue: string) {\n    setValue(nextValue);\n    clearTimeout(timer.current);\n    setStatus("idle");\n  }\n\n  function handleValueComplete(code: string) {\n    setStatus("loading");\n    timer.current = setTimeout(() => {\n      setStatus(code === "123456" ? "success" : "error");\n    }, VERIFY_DELAY);\n  }\n\n  return (\n    <div className="flex flex-col gap-2">\n      <p className="text-sm text-muted-foreground">Demo code: 123456</p>\n      <OTPField\n        aria-label="Verification code"\n        groups={[3, 3]}\n        length={6}\n        onValueChange={handleValueChange}\n        onValueComplete={handleValueComplete}\n        status={status}\n        value={value}\n      />\n    </div>\n  );\n}\n',
      },
    },
  },
  render: () => <OTPFieldStatusDemo />,
};

export const Pattern: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`validationType` limits accepted characters: `numeric` (default), `alphanumeric` or `none`.",
      },
      source: {
        code: 'import { Field, FieldLabel } from "@erbium/ui/components/field";\nimport { OTPField } from "@erbium/ui/components/otp-field";\n\nexport function OTPFieldPattern() {\n  return (\n    <Field className="w-fit">\n      <FieldLabel htmlFor="digits-only">Digits Only</FieldLabel>\n      <OTPField id="digits-only" length={6} validationType="numeric" />\n    </Field>\n  );\n}\n',
      },
    },
  },
  render: () => <OTPFieldPattern />,
};

export const FourDigits: Story = {
  parameters: {
    docs: {
      description: {
        story: "Any `length` works.",
      },
      source: {
        code: 'import { OTPField } from "@erbium/ui/components/otp-field";\n\nexport function OTPFieldFourDigits() {\n  return <OTPField aria-label="PIN" length={4} />;\n}\n',
      },
    },
  },
  render: () => <OTPFieldFourDigits />,
};

export const Alphanumeric: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Use `validationType="alphanumeric"` with `normalizeValue` for recovery codes.',
      },
      source: {
        code: 'import { OTPField } from "@erbium/ui/components/otp-field";\n\nexport function OTPFieldAlphanumeric() {\n  return (\n    <OTPField\n      aria-label="Recovery code"\n      length={6}\n      groups={[3, 3]}\n      validationType="alphanumeric"\n      normalizeValue={(value) => value.toUpperCase()}\n    />\n  );\n}\n',
      },
    },
  },
  render: () => <OTPFieldAlphanumeric />,
};
