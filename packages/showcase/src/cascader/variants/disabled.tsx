import {
  Cascader,
  CascaderContent,
  CascaderList,
  CascaderTrigger,
  CascaderValue,
} from "@erbium/ui/components/cascader";
import type { CascaderNode } from "@erbium/ui/components/cascader";

const plans: CascaderNode[] = [
  {
    value: "starter",
    label: "Starter",
    children: [
      { value: "starter-monthly", label: "Monthly" },
      { value: "starter-yearly", label: "Yearly" },
    ],
  },
  {
    value: "team",
    label: "Team",
    children: [
      { value: "team-monthly", label: "Monthly" },
      {
        value: "team-yearly",
        label: "Yearly",
        description: "Not offered in your region",
        disabled: true,
      },
    ],
  },
  {
    value: "enterprise",
    label: "Enterprise",
    description: "Contact sales",
    disabled: true,
    children: [{ value: "enterprise-custom", label: "Custom" }],
  },
];

export default function CascaderDisabledExample() {
  return (
    <div className="flex flex-col gap-related">
      <Cascader items={plans}>
        <CascaderTrigger aria-label="Plan" className="w-56">
          <CascaderValue placeholder="Choose a plan" />
        </CascaderTrigger>
        <CascaderContent>
          <CascaderList />
        </CascaderContent>
      </Cascader>
      <Cascader items={plans} defaultValue="starter-yearly" disabled>
        <CascaderTrigger aria-label="Current plan" className="w-56">
          <CascaderValue />
        </CascaderTrigger>
        <CascaderContent>
          <CascaderList />
        </CascaderContent>
      </Cascader>
    </div>
  );
}
