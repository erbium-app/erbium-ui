import { HugeiconsIcon } from "@hugeicons/react";
import Delete02Icon from "@hugeicons/core-free-icons/Delete02Icon";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@erbium/ui/components/alert-dialog";
import { Button } from "@erbium/ui/components/button";

export function AlertDialogError() {
  return (
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant="error">Delete Chat</Button>} />
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-error/10 text-error dark:bg-error/20 dark:text-error">
            <HugeiconsIcon icon={Delete02Icon} />
          </AlertDialogMedia>
          <AlertDialogTitle>Delete chat?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete this chat conversation. View <a href="#">Settings</a>{" "}
            delete any memories saved during this chat.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
          <AlertDialogAction variant="error">Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
