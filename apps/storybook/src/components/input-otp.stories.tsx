import ExampleInputOtpSeparator from "./examples/input-otp-separator";
import ExampleInputOtpControlled from "./examples/input-otp-controlled";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { InputOTP } from "@erbium/ui/components/input-otp";
import Demo from "./examples/input-otp-demo";

const meta = {
  title: "UI/Input OTP",
  component: InputOTP,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'Accessible one-time password component with copy-paste functionality.\n\n**Import:** `@erbium/ui/components/input-otp`  \n\n**shadcn/ui page:** [Input OTP](https://ui.shadcn.com/docs/components/base/input-otp)\n\n### About\n\nInput OTP is built on top of [input-otp](https://github.com/guilhermerodz/input-otp) by [@guilherme_rodz](https://twitter.com/guilherme_rodz).\n\n### Usage\n\n```tsx\nimport {\n  InputOTP,\n  InputOTPGroup,\n  InputOTPSeparator,\n  InputOTPSlot,\n} from "@erbium/ui/components/input-otp"\n```\n\n```tsx\n<InputOTP maxLength={6}>\n  <InputOTPGroup>\n    <InputOTPSlot index={0} />\n    <InputOTPSlot index={1} />\n    <InputOTPSlot index={2} />\n  </InputOTPGroup>\n  <InputOTPSeparator />\n  <InputOTPGroup>\n    <InputOTPSlot index={3} />\n    <InputOTPSlot index={4} />\n    <InputOTPSlot index={5} />\n  </InputOTPGroup>\n</InputOTP>\n```\n\n### Composition\n\nUse the following composition to build an `InputOTP`:\n\n```text\nInputOTP\n├── InputOTPGroup\n│   ├── InputOTPSlot\n│   ├── InputOTPSlot\n│   └── InputOTPSlot\n├── InputOTPSeparator\n├── InputOTPGroup\n│   ├── InputOTPSlot\n│   ├── InputOTPSlot\n│   └── InputOTPSlot\n├── InputOTPSeparator\n└── InputOTPGroup\n    ├── InputOTPSlot\n    └── InputOTPSlot\n```\n\n### Pattern\n\nUse the `pattern` prop to define a custom pattern for the OTP input.\n\n```tsx\nimport { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp"\n\n;<InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS_AND_CHARS}>\n  ...\n</InputOTP>\n```\n\n### Separator\n\nUse the `<InputOTPSeparator />` component to add a separator between input groups.\n\n### Disabled\n\nUse the `disabled` prop to disable the input.\n\n### Controlled\n\nUse the `value` and `onChange` props to control the input value.\n\n### Invalid\n\nUse `aria-invalid` on the slots to show an error state.\n\n### Four Digits\n\nA common pattern for PIN codes. This uses the `pattern={REGEXP_ONLY_DIGITS}` prop.\n\n### Alphanumeric\n\nUse `REGEXP_ONLY_DIGITS_AND_CHARS` to accept both letters and numbers.\n\n### Form\n\nstyleName="base-nova"\n\nname="input-otp-form"\n\npreviewClassName="h-[30rem]"\n\n/>',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

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
