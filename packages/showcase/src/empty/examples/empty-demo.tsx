import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@erbium/ui/components/empty";
import { Button } from "@erbium/ui/components/button";

const Demo = () => (
  <Empty>
    <EmptyHeader>
      <EmptyTitle>No projects yet</EmptyTitle>
      <EmptyDescription>Create a project to get started.</EmptyDescription>
    </EmptyHeader>
    <EmptyContent>
      <Button>Create project</Button>
    </EmptyContent>
  </Empty>
);

export default Demo;
