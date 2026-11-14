import { useId, useState } from "react";
import { Button } from "@erbium/ui/components/button";
import {
  Dialog,
  DialogClose,
  DialogPanel,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@erbium/ui/components/dialog";
import { Form, useAppForm } from "@erbium/ui/components/form";

const DialogDemo = () => {
  const [open, setOpen] = useState(false);
  const [savedName, setSavedName] = useState<string | null>(null);

  const formId = useId();

  const form = useAppForm({
    defaultValues: { name: "Pedro Duarte", username: "@peduarte" },
    onSubmit: ({ value, formApi }) => {
      setSavedName(value.name.trim());
      formApi.reset(value);
      setOpen(false);
    },
  });

  return (
    <div className="flex flex-col items-center gap-3">
      <Dialog
        open={open}
        onOpenChange={(nextOpen) => {
          if (nextOpen) {
            form.reset();
          }

          setOpen(nextOpen);
        }}
      >
        <DialogTrigger render={<Button variant="outline">Open Dialog</Button>} />
        <DialogPanel className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          <DialogContent className="grid content-start gap-group">
            <Form form={form} id={formId} className="grid gap-group">
              <form.AppField
                name="name"
                validators={{
                  onDynamic: ({ value }) => (value.trim() ? undefined : "Enter your name."),
                }}
              >
                {(field) => <field.TextField label="Name" autoComplete="name" required />}
              </form.AppField>
              <form.AppField
                name="username"
                validators={{
                  onDynamic: ({ value }) => (value.trim() ? undefined : "Enter your username."),
                }}
              >
                {(field) => <field.TextField label="Username" autoComplete="username" required />}
              </form.AppField>
            </Form>
          </DialogContent>
          <DialogFooter>
            <DialogClose render={<Button variant="outline">Cancel</Button>} />
            <form.AppForm>
              <form.SubmitButton form={formId}>Save changes</form.SubmitButton>
            </form.AppForm>
          </DialogFooter>
        </DialogPanel>
      </Dialog>
      {savedName !== null && (
        <output className="text-caption text-muted-foreground">
          Saved profile for {savedName}.
        </output>
      )}
    </div>
  );
};

export default DialogDemo;
