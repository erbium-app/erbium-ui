import { Toaster } from "@erbium/ui/components/toast";
import { ShowcaseProviders } from "@erbium/showcase/preview";
export default function ShowcaseToaster() {
  return (
    <ShowcaseProviders>
      <Toaster />
    </ShowcaseProviders>
  );
}
