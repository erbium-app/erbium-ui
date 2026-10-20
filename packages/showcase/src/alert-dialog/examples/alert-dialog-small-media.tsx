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

export const AlertDialogSmallWithMedia = () => (
  <AlertDialog>
    <AlertDialogTrigger render={<Button variant="outline">Show Dialog</Button>} />

    <AlertDialogContent size="sm">
      <AlertDialogHeader>
        <AlertDialogMedia>
          <Icon name="bluetooth" />
        </AlertDialogMedia>
        <AlertDialogTitle>Allow accessory to connect?</AlertDialogTitle>
        <AlertDialogDescription>
          Do you want to allow the USB accessory to connect to this device?
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Don&apos;t allow</AlertDialogCancel>
        <AlertDialogAction>Allow</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);
