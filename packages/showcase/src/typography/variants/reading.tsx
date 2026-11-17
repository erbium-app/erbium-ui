import { Card, CardHeader, CardTitle, CardContent } from "@erbium/ui/components/card";

export default function ReadingExample() {
  return (
    <div className="w-full">
      <Card>
        <CardHeader>
          <CardTitle>Reading</CardTitle>
        </CardHeader>
        <CardContent>
          <article className="typeset max-w-[65ch]">
            <h2>Workspace access</h2>
            <p>
              Members can view shared projects. Administrators can also manage access and workspace
              settings.
            </p>
            <p>
              Changes apply to <strong>all workspace members</strong>. Invitations remain{" "}
              <em>pending</em> until accepted.
            </p>
            <ul>
              <li>Review member roles before granting access.</li>
              <li>Remove access when a member leaves the team.</li>
              <li>
                Keep access deliberate.
                <ul>
                  <li>Invite collaborators to the projects they need.</li>
                </ul>
              </li>
            </ul>
            <blockquote>
              <p>A clear next step helps everyone keep work moving.</p>
            </blockquote>
            <p>
              Use <code>workspace.members</code> to inspect the current members.
            </p>
            <section className="typeset-scroll" aria-label="Workspace role comparison">
              <table>
                <caption>Access by workspace role</caption>
                <thead>
                  <tr>
                    <th>Role</th>
                    <th>Projects</th>
                    <th>Members</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th>Member</th>
                    <td>View</td>
                    <td>24</td>
                  </tr>
                  <tr>
                    <th>Administrator</th>
                    <td>Manage</td>
                    <td>3</td>
                  </tr>
                </tbody>
              </table>
            </section>
          </article>
        </CardContent>
      </Card>
    </div>
  );
}
