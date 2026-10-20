import { Icon } from "@erbium/ui/components/icon";

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

export const AlertDialogWithMedia = () => (
  <AlertDialog>
    <AlertDialogTrigger render={<Button variant="outline">Share Project</Button>} />
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogMedia>
          <Icon name="circle-fading-plus" />
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
