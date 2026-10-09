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
import { Field, FieldLabel, FieldError } from "@erbium/ui/components/field";
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

export default function WorkflowExample() {
  const [name, setName] = useState("");
  const [error, setError] = useState(false);
  const [projects, setProjects] = useState(["Design system", "Documentation"]);
  const [query, setQuery] = useState("");
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
              onChange={(event) => setQuery(event.currentTarget.value)}
              className="w-full sm:w-48"
            />
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="outline" />}>
                Workspace actions
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuList>
                  <DropdownMenuItem onClick={() => setQuery("")}>
                    Show all projects
                  </DropdownMenuItem>
                  <DropdownMenuItem disabled>Archive workspace</DropdownMenuItem>
                </DropdownMenuList>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <form
            className="grid gap-related"
            noValidate
            onSubmit={(event) => {
              event.preventDefault();
              if (!name.trim()) {
                setError(true);
                return;
              }
              setProjects((current) => [...current, name.trim()]);
              setName("");
              setError(false);
            }}
          >
            <Field invalid={error}>
              <FieldLabel>Project name</FieldLabel>
              <Input
                value={name}
                onChange={(event) => setName(event.currentTarget.value)}
                placeholder="Name your project"
              />
              <FieldError match={error}>
                {error
                  ? "Enter a project name before creating it. Labels and errors should stay readable without squeezing the field."
                  : null}
              </FieldError>
            </Field>
            <Button type="submit" className="justify-self-start">
              Create project
            </Button>
          </form>
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
                            <DropdownMenuItem onClick={() => setQuery(project)}>
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
}
