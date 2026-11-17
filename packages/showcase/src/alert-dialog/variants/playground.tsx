import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@erbium/ui/components/alert-dialog";
import { Button } from "@erbium/ui/components/button";

export const defaultProps = {
  defaultOpen: false,
  size: "default",
} satisfies { size: "default" | "sm"; defaultOpen: boolean };

export default function AlertDialogPlaygroundExample(
  args: { size: "default" | "sm"; defaultOpen: boolean } = defaultProps,
) {
  return (
    <AlertDialog key={String(args.defaultOpen)} defaultOpen={args.defaultOpen}>
      <AlertDialogTrigger render={<Button variant="outline">Open alert dialog</Button>} />
      <AlertDialogContent size={args.size}>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm action</AlertDialogTitle>
          <AlertDialogDescription>This action needs confirmation.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
