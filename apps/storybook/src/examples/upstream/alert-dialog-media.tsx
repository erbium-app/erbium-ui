import { HugeiconsIcon } from "@hugeicons/react";
import CircleFadingPlusIcon from "@hugeicons/core-free-icons/CircleFadingPlusIcon";

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

export function AlertDialogWithMedia() {
  return (
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant="outline">Share Project</Button>} />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia>
            <HugeiconsIcon icon={CircleFadingPlusIcon} />
          </AlertDialogMedia>
          <AlertDialogTitle>Share this project?</AlertDialogTitle>
          <AlertDialogDescription>
            Anyone with the link will be able to view and edit this project.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Share</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
