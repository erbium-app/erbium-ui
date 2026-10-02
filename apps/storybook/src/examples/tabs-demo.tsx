import { Button } from "@erbium/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@erbium/ui/components/card";
import { Input } from "@erbium/ui/components/input";
import { Field, FieldLabel } from "@erbium/ui/components/field";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@erbium/ui/components/tabs";

export default function TabsDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <Tabs defaultValue="account">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
              <CardDescription>
                Make changes to your account here. Click save when you&apos;re done.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <Field>
                <FieldLabel htmlFor="tabs-demo-name">Name</FieldLabel>
                <Input id="tabs-demo-name" defaultValue="Pedro Duarte" />
              </Field>
              <Field>
                <FieldLabel htmlFor="tabs-demo-username">Username</FieldLabel>
                <Input id="tabs-demo-username" defaultValue="@peduarte" />
              </Field>
            </CardContent>
            <CardFooter>
              <Button>Save changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>
                Change your password here. After saving, you&apos;ll be logged out.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <Field>
                <FieldLabel htmlFor="tabs-demo-current">Current password</FieldLabel>
                <Input id="tabs-demo-current" type="password" />
              </Field>
              <Field>
                <FieldLabel htmlFor="tabs-demo-new">New password</FieldLabel>
                <Input id="tabs-demo-new" type="password" />
              </Field>
            </CardContent>
            <CardFooter>
              <Button>Save password</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
