import { InputOTPAlphanumeric } from "../examples/upstream/input-otp-alphanumeric";
import { InputOTPFourDigits } from "../examples/upstream/input-otp-four-digits";
import { InputOTPPattern } from "../examples/upstream/input-otp-pattern";
import { InputOTPDisabled } from "../examples/upstream/input-otp-disabled";
import { InputOTPInvalid } from "../examples/upstream/input-otp-invalid";
import { InputOTPForm } from "../examples/upstream/input-otp-form";
import ExampleInputOtpSeparator from "../examples/input-otp-separator";
import ExampleInputOtpControlled from "../examples/input-otp-controlled";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@erbium/ui/components/input-otp";
import Demo from "../examples/input-otp-demo";

const meta = {
  title: "UI/Input OTP",
  component: InputOTP,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'Accessible one-time password component with copy-paste functionality.\n\n**Import:** `@erbium/ui/components/input-otp`  \n\n**shadcn/ui page:** [Input OTP](https://ui.shadcn.com/docs/components/base/input-otp)\n\n### About\n\nInput OTP is built on top of [input-otp](https://github.com/guilhermerodz/input-otp) by [@guilherme_rodz](https://twitter.com/guilherme_rodz).\n\n### Usage\n\n```tsx\nimport {\n  InputOTP,\n  InputOTPGroup,\n  InputOTPSeparator,\n  InputOTPSlot,\n} from "@erbium/ui/components/input-otp"\n```\n\n```tsx\n<InputOTP maxLength={6}>\n  <InputOTPGroup>\n    <InputOTPSlot index={0} />\n    <InputOTPSlot index={1} />\n    <InputOTPSlot index={2} />\n  </InputOTPGroup>\n  <InputOTPSeparator />\n  <InputOTPGroup>\n    <InputOTPSlot index={3} />\n    <InputOTPSlot index={4} />\n    <InputOTPSlot index={5} />\n  </InputOTPGroup>\n</InputOTP>\n```\n\n### Composition\n\nUse the following composition to build an `InputOTP`:\n\n```text\nInputOTP\n├── InputOTPGroup\n│   ├── InputOTPSlot\n│   ├── InputOTPSlot\n│   └── InputOTPSlot\n├── InputOTPSeparator\n├── InputOTPGroup\n│   ├── InputOTPSlot\n│   ├── InputOTPSlot\n│   └── InputOTPSlot\n├── InputOTPSeparator\n└── InputOTPGroup\n    ├── InputOTPSlot\n    └── InputOTPSlot\n```',
      },
    },
  },
} satisfies Meta<typeof InputOTP>;

export default meta;
type Story = StoryObj;

export const Playground: StoryObj<{
  maxLength: number;
  disabled: boolean;
  patternMode: "digits" | "alphanumeric" | "any";
}> = {
  args: { maxLength: 6, disabled: false, patternMode: "digits" },
  argTypes: {
    maxLength: { control: { type: "number", min: 1, max: 8 } },
    disabled: { control: "boolean" },
    patternMode: { control: "select", options: ["digits", "alphanumeric", "any"] },
  },
  render: (args) => (
    <InputOTP
      key={`${args.maxLength}-${args.patternMode}`}
      maxLength={args.maxLength}
      disabled={args.disabled}
      pattern={
        args.patternMode === "digits"
          ? "^\\d+$"
          : args.patternMode === "alphanumeric"
            ? "^[a-zA-Z0-9]+$"
            : undefined
      }
    >
      <InputOTPGroup>
        {Array.from({ length: args.maxLength ?? 6 }, (_, index) => (
          <InputOTPSlot key={index} index={index} />
        ))}
      </InputOTPGroup>
    </InputOTP>
  ),
};

export const Overview: Story = {
  parameters: {
    docs: {
      source: {
        code: 'import {\n  InputOTP,\n  InputOTPGroup,\n  InputOTPSeparator,\n  InputOTPSlot,\n} from "@erbium/ui/components/input-otp";\n\nexport default function InputOTPDemo() {\n  return (\n    <InputOTP maxLength={6}>\n      <InputOTPGroup>\n        <InputOTPSlot index={0} />\n        <InputOTPSlot index={1} />\n        <InputOTPSlot index={2} />\n      </InputOTPGroup>\n      <InputOTPSeparator />\n      <InputOTPGroup>\n        <InputOTPSlot index={3} />\n        <InputOTPSlot index={4} />\n        <InputOTPSlot index={5} />\n      </InputOTPGroup>\n    </InputOTP>\n  );\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <Demo />
    </div>
  ),
};

export const Separator: Story = {
  parameters: {
    docs: {
      description: {
        story: "Use the `<InputOTPSeparator />` component to add a separator between input groups.",
      },

      source: {
        code: 'import React from "react"\n\nimport {\n  InputOTP,\n  InputOTPGroup,\n  InputOTPSeparator,\n  InputOTPSlot,\n} from "@erbium/ui/components/input-otp"\n\nexport default function InputOTPWithSeparator() {\n  return (\n    <InputOTP maxLength={6}>\n      <InputOTPGroup>\n        <InputOTPSlot index={0} />\n        <InputOTPSlot index={1} />\n      </InputOTPGroup>\n      <InputOTPSeparator />\n      <InputOTPGroup>\n        <InputOTPSlot index={2} />\n        <InputOTPSlot index={3} />\n      </InputOTPGroup>\n      <InputOTPSeparator />\n      <InputOTPGroup>\n        <InputOTPSlot index={4} />\n        <InputOTPSlot index={5} />\n      </InputOTPGroup>\n    </InputOTP>\n  )\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <ExampleInputOtpSeparator />
    </div>
  ),
};
export const Controlled: Story = {
  parameters: {
    docs: {
      description: { story: "Use the `value` and `onChange` props to control the input value." },

      source: {
        code: '\nimport * as React from "react"\n\nimport {\n  InputOTP,\n  InputOTPGroup,\n  InputOTPSlot,\n} from "@erbium/ui/components/input-otp"\n\nexport default function InputOTPControlled() {\n  const [value, setValue] = React.useState("")\n\n  return (\n    <div className="space-y-2">\n      <InputOTP\n        maxLength={6}\n        value={value}\n        onChange={(value) => setValue(value)}\n      >\n        <InputOTPGroup>\n          <InputOTPSlot index={0} />\n          <InputOTPSlot index={1} />\n          <InputOTPSlot index={2} />\n          <InputOTPSlot index={3} />\n          <InputOTPSlot index={4} />\n          <InputOTPSlot index={5} />\n        </InputOTPGroup>\n      </InputOTP>\n      <div className="text-center text-sm">\n        {value === "" ? (\n          <>Enter your one-time password.</>\n        ) : (\n          <>You entered: {value}</>\n        )}\n      </div>\n    </div>\n  )\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <ExampleInputOtpControlled />
    </div>
  ),
};

export const Form: Story = {
  parameters: {
    docs: {
      description: { story: "Use an OTP input in a validated form." },
      source: {
        code: 'import { HugeiconsIcon } from "@hugeicons/react";\nimport RefreshCwIcon from "@hugeicons/core-free-icons/RefreshCwIcon";\n\n\nimport { Button } from "@erbium/ui/components/button";\nimport {\n  Card,\n  CardContent,\n  CardDescription,\n  CardFooter,\n  CardHeader,\n  CardTitle,\n} from "@erbium/ui/components/card";\nimport { Field, FieldDescription, FieldLabel } from "@erbium/ui/components/field";\nimport {\n  InputOTP,\n  InputOTPGroup,\n  InputOTPSeparator,\n  InputOTPSlot,\n} from "@erbium/ui/components/input-otp";\n\nexport function InputOTPForm() {\n  return (\n    <Card className="mx-auto max-w-md">\n      <CardHeader>\n        <CardTitle>Verify your login</CardTitle>\n        <CardDescription>\n          Enter the verification code we sent to your email address:{" "}\n          <span className="font-medium">m@example.com</span>.\n        </CardDescription>\n      </CardHeader>\n      <CardContent>\n        <Field>\n          <div className="flex items-center justify-between">\n            <FieldLabel htmlFor="otp-verification">Verification code</FieldLabel>\n            <Button variant="outline" size="xs">\n              <HugeiconsIcon icon={RefreshCwIcon} />\n              Resend Code\n            </Button>\n          </div>\n          <InputOTP maxLength={6} id="otp-verification" required>\n            <InputOTPGroup>\n              <InputOTPSlot index={0} />\n              <InputOTPSlot index={1} />\n              <InputOTPSlot index={2} />\n            </InputOTPGroup>\n            <InputOTPSeparator />\n            <InputOTPGroup>\n              <InputOTPSlot index={3} />\n              <InputOTPSlot index={4} />\n              <InputOTPSlot index={5} />\n            </InputOTPGroup>\n          </InputOTP>\n          <FieldDescription>\n            <a href="#">I no longer have access to this email address.</a>\n          </FieldDescription>\n        </Field>\n      </CardContent>\n      <CardFooter>\n        <Field>\n          <Button type="submit" className="w-full">\n            Verify\n          </Button>\n          <div className="text-sm text-muted-foreground">\n            Having trouble signing in?{" "}\n            <a\n              href="#"\n              className="underline underline-offset-4 transition-colors hover:text-primary"\n            >\n              Contact support\n            </a>\n          </div>\n        </Field>\n      </CardFooter>\n    </Card>\n  );\n}\n',
      },
    },
  },
  render: () => <InputOTPForm />,
};

export const Disabled: Story = {
  parameters: {
    docs: {
      description: { story: "Use the `disabled` prop to disable the input." },
      source: {
        code: 'import {\n  InputOTP,\n  InputOTPGroup,\n  InputOTPSeparator,\n  InputOTPSlot,\n} from "@erbium/ui/components/input-otp";\n\nexport function InputOTPDisabled() {\n  return (\n    <InputOTP id="disabled" maxLength={6} disabled value="123456">\n      <InputOTPGroup>\n        <InputOTPSlot index={0} />\n        <InputOTPSlot index={1} />\n        <InputOTPSlot index={2} />\n      </InputOTPGroup>\n      <InputOTPSeparator />\n      <InputOTPGroup>\n        <InputOTPSlot index={3} />\n        <InputOTPSlot index={4} />\n        <InputOTPSlot index={5} />\n      </InputOTPGroup>\n    </InputOTP>\n  );\n}\n',
      },
    },
  },
  render: () => <InputOTPDisabled />,
};
export const Invalid: Story = {
  parameters: {
    docs: {
      description: { story: "Use `aria-invalid` on the slots to show an error state." },
      source: {
        code: 'import * as React from "react";\n\nimport {\n  InputOTP,\n  InputOTPGroup,\n  InputOTPSeparator,\n  InputOTPSlot,\n} from "@erbium/ui/components/input-otp";\n\nexport function InputOTPInvalid() {\n  const [value, setValue] = React.useState("000000");\n\n  return (\n    <InputOTP maxLength={6} value={value} onChange={setValue}>\n      <InputOTPGroup>\n        <InputOTPSlot index={0} aria-invalid />\n        <InputOTPSlot index={1} aria-invalid />\n      </InputOTPGroup>\n      <InputOTPSeparator />\n      <InputOTPGroup>\n        <InputOTPSlot index={2} aria-invalid />\n        <InputOTPSlot index={3} aria-invalid />\n      </InputOTPGroup>\n      <InputOTPSeparator />\n      <InputOTPGroup>\n        <InputOTPSlot index={4} aria-invalid />\n        <InputOTPSlot index={5} aria-invalid />\n      </InputOTPGroup>\n    </InputOTP>\n  );\n}\n',
      },
    },
  },
  render: () => <InputOTPInvalid />,
};

export const Pattern: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Use the `pattern` prop to define a custom pattern for the OTP input.\n\n```tsx\nimport { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp"\n\n;<InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS_AND_CHARS}>\n  ...\n</InputOTP>\n```',
      },
      source: {
        code: 'import { REGEXP_ONLY_DIGITS } from "input-otp";\n\nimport { Field, FieldLabel } from "@erbium/ui/components/field";\nimport { InputOTP, InputOTPGroup, InputOTPSlot } from "@erbium/ui/components/input-otp";\n\nexport function InputOTPPattern() {\n  return (\n    <Field className="w-fit">\n      <FieldLabel htmlFor="digits-only">Digits Only</FieldLabel>\n      <InputOTP id="digits-only" maxLength={6} pattern={REGEXP_ONLY_DIGITS}>\n        <InputOTPGroup>\n          <InputOTPSlot index={0} />\n          <InputOTPSlot index={1} />\n          <InputOTPSlot index={2} />\n          <InputOTPSlot index={3} />\n          <InputOTPSlot index={4} />\n          <InputOTPSlot index={5} />\n        </InputOTPGroup>\n      </InputOTP>\n    </Field>\n  );\n}\n',
      },
    },
  },
  render: () => <InputOTPPattern />,
};

export const FourDigits: Story = {
  parameters: {
    docs: {
      description: {
        story: "A common pattern for PIN codes. This uses the `pattern={REGEXP_ONLY_DIGITS}` prop.",
      },
      source: {
        code: 'import { REGEXP_ONLY_DIGITS } from "input-otp";\n\nimport { InputOTP, InputOTPGroup, InputOTPSlot } from "@erbium/ui/components/input-otp";\n\nexport function InputOTPFourDigits() {\n  return (\n    <InputOTP maxLength={4} pattern={REGEXP_ONLY_DIGITS}>\n      <InputOTPGroup>\n        <InputOTPSlot index={0} />\n        <InputOTPSlot index={1} />\n        <InputOTPSlot index={2} />\n        <InputOTPSlot index={3} />\n      </InputOTPGroup>\n    </InputOTP>\n  );\n}\n',
      },
    },
  },
  render: () => <InputOTPFourDigits />,
};

export const Alphanumeric: Story = {
  parameters: {
    docs: {
      description: {
        story: "Use `REGEXP_ONLY_DIGITS_AND_CHARS` to accept both letters and numbers.",
      },
      source: {
        code: 'import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";\n\nimport {\n  InputOTP,\n  InputOTPGroup,\n  InputOTPSeparator,\n  InputOTPSlot,\n} from "@erbium/ui/components/input-otp";\n\nexport function InputOTPAlphanumeric() {\n  return (\n    <InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS_AND_CHARS}>\n      <InputOTPGroup>\n        <InputOTPSlot index={0} />\n        <InputOTPSlot index={1} />\n        <InputOTPSlot index={2} />\n      </InputOTPGroup>\n      <InputOTPSeparator />\n      <InputOTPGroup>\n        <InputOTPSlot index={3} />\n        <InputOTPSlot index={4} />\n        <InputOTPSlot index={5} />\n      </InputOTPGroup>\n    </InputOTP>\n  );\n}\n',
      },
    },
  },
  render: () => <InputOTPAlphanumeric />,
};
