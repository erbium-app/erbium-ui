import { useState } from "react";
import { Button } from "@erbium/ui/components/button";
import { Input } from "@erbium/ui/components/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@erbium/ui/components/card";
import { Form, useAppForm } from "@erbium/ui/components/form";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuList,
} from "@erbium/ui/components/dropdown-menu";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@erbium/ui/components/table";

const WorkflowExample = () => {
  const [projects, setProjects] = useState(["Design system", "Documentation"]);
  const [query, setQuery] = useState("");

  const form = useAppForm({
    defaultValues: { name: "" },
    onSubmit: ({ value, formApi }) => {
      setProjects((current) => [...current, value.name.trim()]);
      formApi.reset();
    },
  });

  return (
    <div className="p-panel">
      <Card>
        <CardHeader>
          <CardTitle>Workspace projects</CardTitle>
          <CardDescription>
            Related controls wrap together; validation and longer content grow in place.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-section">
          <div className="flex flex-wrap items-center gap-related">
            <Input
              aria-label="Filter projects"
              placeholder="Filter projects"
              value={query}
              onChange={(event) => {
                setQuery(event.currentTarget.value);
              }}
              className="w-full sm:w-48"
            />
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="outline" />}>
                Workspace actions
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuList>
                  <DropdownMenuItem
                    onClick={() => {
                      setQuery("");
                    }}
                  >
                    Show all projects
                  </DropdownMenuItem>
                  <DropdownMenuItem disabled>Archive workspace</DropdownMenuItem>
                </DropdownMenuList>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Form form={form} className="grid gap-related">
            <form.AppField
              name="name"
              validators={{
                onDynamic: ({ value }) =>
                  value.trim() ? undefined : "Enter a project name before creating it.",
              }}
            >
              {(field) => (
                <field.TextField label="Project name" placeholder="Name your project" required />
              )}
            </form.AppField>
            <form.SubmitButton className="justify-self-start">Create project</form.SubmitButton>
          </Form>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects
                .filter((project) => project.toLowerCase().includes(query.toLowerCase()))
                .map((project, index) => (
                  <TableRow key={`${project}-${index}`}>
                    <TableCell className="whitespace-normal">{project}</TableCell>
                    <TableCell className="text-end">
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={<Button variant="ghost" aria-label={`Actions for ${project}`} />}
                        >
                          Actions
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuList>
                            <DropdownMenuItem
                              onClick={() => {
                                setQuery(project);
                              }}
                            >
                              Show this project
                            </DropdownMenuItem>
                            <DropdownMenuItem disabled>Archive project</DropdownMenuItem>
                          </DropdownMenuList>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkflowExample;
