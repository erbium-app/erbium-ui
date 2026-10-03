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

const Example = (args: { size: "default" | "sm"; defaultOpen: boolean }) => (
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

export default Example;
