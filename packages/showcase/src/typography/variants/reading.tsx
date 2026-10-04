import { Card, CardHeader, CardTitle, CardContent } from "@erbium/ui/components/card";

export default function ReadingExample() {
  return (
    <div className="grid w-full gap-4 lg:grid-cols-2">
      {(["docs", "compact"] as const).map((preset) => (
        <Card key={preset}>
          <CardHeader>
            <CardTitle>Reading rhythm</CardTitle>
          </CardHeader>
          <CardContent>
            <article className={`typeset typeset-${preset}`}>
              <h3>Workspace access</h3>
              <p>
                Members can view shared projects. Administrators can also manage access and
                workspace settings.
              </p>
              <p>
                Changes apply to <strong>all workspace members</strong>. Invitations remain{" "}
                <em>pending</em> until accepted.
              </p>
              <ul>
                <li>Review member roles before granting access.</li>
                <li>Remove access when a member leaves the team.</li>
              </ul>
            </article>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
