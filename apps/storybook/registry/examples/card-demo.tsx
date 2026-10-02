// @ts-nocheck
import { Button } from "../components/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/card";
import { Input } from "../components/input";
import { Field, FieldLabel } from "../components/field";
import { StatefulButton } from "../components/stateful-button";

export default function CardDemo() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>Enter your email below to login to your account</CardDescription>
        <CardAction>
          <Button variant="link">Sign Up</Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <form id="card-login-form" onSubmit={(event) => event.preventDefault()}>
          <div className="flex flex-col gap-6">
            <Field>
              <FieldLabel>Email</FieldLabel>
              <Input type="email" placeholder="m@example.com" required />
            </Field>
            <Field>
              <div className="flex items-center">
                <FieldLabel>Password</FieldLabel>
                <a
                  href="#"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </a>
              </div>
              <Input type="password" required />
            </Field>
          </div>
        </form>
      </CardContent>
      <CardFooter className="gap-2">
        <StatefulButton type="submit" form="card-login-form" className="min-w-0 flex-1">
          Login
        </StatefulButton>
        <Button variant="outline" className="shrink-0">
          Login with Google
        </Button>
      </CardFooter>
    </Card>
  );
}
