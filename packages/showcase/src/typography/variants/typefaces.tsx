import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@erbium/ui/components/card";

export default function TypefacesExample() {
  return (
    <div className="grid w-full gap-group">
      <Card>
        <CardHeader>
          <CardTitle>Cal Sans</CardTitle>
          <CardDescription>
            Latin headings, reading, and controls · Mark Davis for Cal.com
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-group">
          <p className="text-display">A place for your ideas</p>
          <p className="text-title">Projects take shape here</p>
          <p className="text-body">
            Collect your notes, share a first draft, and keep the next step in view.
          </p>
          <div className="flex flex-wrap items-baseline gap-group">
            <span className="text-control">Create project</span>
            <span className="text-control-sm">Overview</span>
            <span className="text-metadata">Edited today</span>
          </div>
          <p className="text-caption text-muted-foreground">
            Aa Bb Cc · 0123456789 · Regular, medium, semibold, bold
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Paper Mono</CardTitle>
          <CardDescription>Code, commands, and identifiers · Paper</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-group">
          <pre className="text-code-block overflow-x-auto" dir="ltr">
            <code>
              {
                'const project = { name: "Erbium", members: 12 };\nawait workspace.projects.create(project);'
              }
            </code>
          </pre>
          <p className="text-body">
            Open <code className="text-inline-code">src/project.tsx</code> to edit the project.
          </p>
          <p className="text-code-block break-all">Aa Bb Cc · 0123456789 · {"{} [] () => != /"}</p>
        </CardContent>
      </Card>
    </div>
  );
}
