import { AccountSettings } from "../helpers";
import type { AccountSettingsProps } from "../helpers";

const Example = ({ latency, failSessions }: AccountSettingsProps) => (
  <div className="w-full min-w-72 max-w-2xl p-4">
    {/* Remounted when the args change, so each change replays the page load. */}
    <AccountSettings
      key={`${String(latency)}-${String(failSessions)}`}
      latency={latency}
      failSessions={failSessions}
    />
  </div>
);

export default Example;
