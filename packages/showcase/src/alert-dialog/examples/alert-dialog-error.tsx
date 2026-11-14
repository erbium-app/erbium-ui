import { useId, useState } from "react";
import { CopyButton } from "@erbium/ui/blocks/copy-button";
import { Field, FieldLabel } from "@erbium/ui/components/field";
import { Input } from "@erbium/ui/components/input";
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

const confirmation = "delete chat";

export const AlertDialogError = () => {
  const inputId = useId();
  const [value, setValue] = useState("");

  return (
    <AlertDialog
      onOpenChange={(open) => {
        if (open) {
          setValue("");
        }
      }}
    >
      <AlertDialogTrigger render={<Button variant="error">Delete Chat</Button>} />
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-error/10 text-error dark:bg-error/20 dark:text-error">
            <Icon name="delete-02" />
          </AlertDialogMedia>
          <AlertDialogTitle>Delete chat?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete this chat conversation.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Field>
          <FieldLabel htmlFor={inputId}>Enter the confirmation text</FieldLabel>
          <div className="flex items-center gap-related">
            <code>{confirmation}</code>
            <CopyButton
              aria-label="Copy confirmation text"
              size="icon-xs"
              value={confirmation}
              variant="embedded"
            />
          </div>
          <Input
            id={inputId}
            value={value}
            onChange={(event) => {
              setValue(event.target.value);
            }}
          />
        </Field>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
          <AlertDialogAction disabled={value !== confirmation} variant="error">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
