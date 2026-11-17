import { Button } from "@erbium/ui/components/button";
import { Input } from "@erbium/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@erbium/ui/components/select";
import { Toggle } from "@erbium/ui/components/toggle";
import { Tabs, TabsList, TabsTrigger } from "@erbium/ui/components/tabs";

export default function ControlsExample() {
  return (
    <div className="flex flex-col gap-section p-panel">
      <div className="flex flex-wrap items-center gap-related">
        <Button size="xs">Embedded</Button>
        <Button size="sm">Small</Button>
        <Button>Default</Button>
        <Button size="lg">Large</Button>
      </div>
      <div className="flex flex-wrap items-center gap-related">
        <Input aria-label="Search projects" placeholder="Search projects" className="w-48" />
        <Select defaultValue="updated">
          <SelectTrigger>
            <SelectValue>
              {(value) => (value === "updated" ? "Recently updated" : "Project name")}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="updated">Recently updated</SelectItem>
            <SelectItem value="name">Project name</SelectItem>
          </SelectContent>
        </Select>
        <Toggle aria-label="Pin projects">Pin</Toggle>
        <Button>New project</Button>
      </div>
      <Tabs defaultValue="table">
        <TabsList>
          <TabsTrigger value="table">Table</TabsTrigger>
          <TabsTrigger value="board">Board</TabsTrigger>
        </TabsList>
      </Tabs>
      <div lang="fa" dir="rtl" className="flex flex-wrap items-center gap-related">
        <Input aria-label="جستجو" placeholder="جستجوی پروژه‌ها" className="w-48" />
        <Button>پروژه جدید</Button>
      </div>
      <p className="text-caption text-muted-foreground">
        Resize the container and use touch emulation: layout wraps, editable text stays readable,
        and general targets expand.
      </p>
    </div>
  );
}
