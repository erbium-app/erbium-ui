import type { CascaderNode } from "@erbium/ui/components/cascader";
import { Icon } from "@erbium/ui/components/icon";

const scope = (area: string, actions: [string, string][]): CascaderNode[] =>
  actions.map(([action, label]) => ({ value: `${area}.${action}`, label }));

/** Permission scopes grouped by area. Leaves are `area.action` values. */
export const permissions: CascaderNode[] = [
  {
    value: "billing",
    label: "Billing",
    icon: <Icon name="credit-card" aria-hidden="true" />,
    children: scope("billing", [
      ["view", "View invoices"],
      ["pay", "Pay invoices"],
      ["plan", "Change plan"],
      ["payment-method", "Update payment method"],
    ]),
  },
  {
    value: "members",
    label: "Members",
    icon: <Icon name="user" aria-hidden="true" />,
    children: [
      {
        value: "members.view",
        label: "View members",
        icon: <Icon name="eye" aria-hidden="true" />,
      },
      {
        value: "members.invite",
        label: "Invite members",
        icon: <Icon name="plus-sign" aria-hidden="true" />,
      },
      {
        value: "members.remove",
        label: "Remove members",
        icon: <Icon name="minus-sign" aria-hidden="true" />,
      },
      {
        value: "members.roles",
        label: "Assign roles",
        icon: <Icon name="shield-01" aria-hidden="true" />,
      },
    ],
  },
  {
    value: "projects",
    label: "Projects",
    icon: <Icon name="folder-01" aria-hidden="true" />,
    children: scope("projects", [
      ["view", "View projects"],
      ["create", "Create projects"],
      ["edit", "Edit settings"],
      ["delete", "Delete projects"],
    ]),
  },
  {
    value: "domains",
    label: "Domains",
    icon: <Icon name="globe" aria-hidden="true" />,
    children: scope("domains", [
      ["view", "View domains"],
      ["add", "Add domains"],
      ["remove", "Remove domains"],
    ]),
  },
  {
    value: "secrets",
    label: "Secrets",
    icon: <Icon name="lock" aria-hidden="true" />,
    children: scope("secrets", [
      ["read", "Read secrets"],
      ["write", "Write secrets"],
    ]),
  },
  {
    value: "support",
    label: "Support",
    icon: <Icon name="lifebuoy" aria-hidden="true" />,
    children: scope("support", [
      ["open", "Open tickets"],
      ["escalate", "Escalate tickets"],
    ]),
  },
];
