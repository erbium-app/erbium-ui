import {
  Cascader,
  CascaderContent,
  CascaderEmpty,
  CascaderList,
  CascaderSearch,
  CascaderTrigger,
  CascaderValue,
} from "@erbium/ui/components/cascader";
import type { CascaderNode } from "@erbium/ui/components/cascader";
import { Icon } from "@erbium/ui/components/icon";

const attributes: CascaderNode[] = [
  {
    value: "record-id",
    label: "Record ID",
    icon: <Icon name="tag-01" aria-hidden="true" />,
    description: "Unique identifier",
  },
  {
    value: "person",
    label: "Person",
    icon: <Icon name="user" aria-hidden="true" />,
    children: [
      { value: "person.name", label: "Name", icon: <Icon name="user" aria-hidden="true" /> },
      {
        value: "person.email",
        label: "Email addresses",
        icon: <Icon name="mail-01" aria-hidden="true" />,
        description: "Primary first",
      },
      {
        value: "person.created",
        label: "Created at",
        icon: <Icon name="calendar-01" aria-hidden="true" />,
      },
    ],
  },
  {
    value: "company",
    label: "Company",
    icon: <Icon name="building-02" aria-hidden="true" />,
    children: [
      {
        value: "company.name",
        label: "Name",
        icon: <Icon name="building-02" aria-hidden="true" />,
      },
      {
        value: "company.domain",
        label: "Domain",
        icon: <Icon name="globe" aria-hidden="true" />,
        keywords: ["website", "url"],
      },
      {
        value: "company.revenue",
        label: "Annual revenue",
        icon: <Icon name="coins-01" aria-hidden="true" />,
        description: "In USD",
      },
    ],
  },
];

export default function CascaderCustomExample() {
  return (
    <Cascader searchable items={attributes} defaultValue="company.domain">
      <CascaderTrigger aria-label="Attribute" className="w-64">
        <CascaderValue placeholder="Select an attribute">
          {([path = []]) => {
            const leaf = path.at(-1);

            return leaf === undefined ? (
              "Select an attribute"
            ) : (
              <span className="flex items-center gap-related">
                {leaf.icon}
                <span className="truncate">{path.map((node) => node.label).join(" › ")}</span>
              </span>
            );
          }}
        </CascaderValue>
      </CascaderTrigger>
      <CascaderContent className="w-64">
        <CascaderSearch placeholder="Search attributes…" />
        <CascaderEmpty>No attributes found.</CascaderEmpty>
        <CascaderList />
      </CascaderContent>
    </Cascader>
  );
}
