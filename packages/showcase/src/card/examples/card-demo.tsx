import { Schema } from "effect";
import { createContext, use, useMemo } from "react";
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
} from "@tanstack/react-router";
import { Card, CardContent, CardDescription, CardHeader } from "@erbium/ui/components/card";
import { FieldGroup } from "@erbium/ui/components/field";
import { Form, useAppForm } from "@erbium/ui/components/form";
import { Link } from "@erbium/ui/components/link";
import { Separator } from "@erbium/ui/components/separator";

interface AuthResult {
  error?: { message?: string } | null;
}

interface CardDemoProps {
  authClient?: {
    signIn: {
      email: (input: { email: string; password: string }) => Promise<AuthResult>;
      social: (input: { provider: "google" }) => Promise<AuthResult>;
    };
    signUp: {
      email: (input: { email: string; name: string; password: string }) => Promise<AuthResult>;
    };
  };
}

const Email = Schema.String.check(
  Schema.isPattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/u, { message: "Enter a valid email address." }),
);

const Name = Schema.Trim.check(Schema.isNonEmpty({ message: "Enter your name." }));
const Password = Schema.String.check(Schema.isNonEmpty({ message: "Enter your password." }));

const NewPassword = Schema.String.check(
  Schema.isMinLength(8, { message: "Use at least 8 characters." }),
);

const authError = async (request: () => Promise<AuthResult>) => {
  try {
    const { error } = await request();

    return error ? (error.message ?? "Authentication failed.") : undefined;
  } catch {
    return "Unable to reach the authentication server.";
  }
};

const AuthCard = ({ authClient, registering }: CardDemoProps & { registering: boolean }) => {
  const form = useAppForm({
    defaultValues: { email: "", name: "", password: "" },
    validators: {
      onSubmitAsync: async ({ value: { email, name, password } }): Promise<string | undefined> =>
        authClient
          ? await authError(async () =>
              registering
                ? await authClient.signUp.email({ email, name: name.trim(), password })
                : await authClient.signIn.email({ email, password }),
            )
          : undefined,
    },
  });

  const google = useAppForm({
    defaultValues: {},
    validators: {
      onSubmitAsync: async () =>
        authClient
          ? await authError(async () => await authClient.signIn.social({ provider: "google" }))
          : "Google sign-in is unavailable in this preview.",
    },
  });

  const action = registering ? "Create account" : "Sign in";

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <h2 className="text-subtitle">{registering ? "Create an account" : "Sign in"}</h2>
        <CardDescription>
          {registering
            ? "Use Google or register with your email."
            : "Use Google or sign in with your email."}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-section">
        <Form form={google} className="flex flex-col gap-related">
          <google.SubmitButton variant="outline" className="w-full">
            <svg aria-hidden data-icon="inline-start" fill="currentColor" viewBox="0 0 1024 1024">
              <path d="M512 469.333h364.075a445 445 0 0 1 2.858 50.518c0 116.65-41.813 214.869-114.261 281.6-63.36 58.496-150.101 92.8-253.525 92.8A382.976 382.976 0 0 1 128 511.147 382.976 382.976 0 0 1 511.147 128c103.253 0 189.994 37.973 256.341 99.797l-62.379 62.336c-49.408-47.744-116.181-76.8-193.109-76.8a298.667 298.667 0 1 0 0 597.334c150.443 0 262.144-111.275 280.619-256H512z" />
            </svg>
            Continue with Google
          </google.SubmitButton>
          <google.Subscribe selector={(state) => state.errorMap.onSubmit}>
            {(error) =>
              Boolean(error) && (
                <p role="alert" className="text-caption text-error">
                  {error}
                </p>
              )
            }
          </google.Subscribe>
        </Form>
        <Separator>Or continue with email</Separator>
        <Form form={form}>
          <FieldGroup>
            {registering && (
              <form.AppField
                name="name"
                validators={{ onDynamic: Schema.toStandardSchemaV1(Name) }}
              >
                {(field) => <field.TextField label="Name" autoComplete="name" required />}
              </form.AppField>
            )}
            <form.AppField
              name="email"
              validators={{ onDynamic: Schema.toStandardSchemaV1(Email) }}
            >
              {(field) => (
                <field.TextField label="Email" type="email" autoComplete="username" required />
              )}
            </form.AppField>
            <form.AppField
              name="password"
              validators={{
                onDynamic: Schema.toStandardSchemaV1(registering ? NewPassword : Password),
              }}
            >
              {(field) => (
                <field.PasswordField
                  label="Password"
                  autoComplete={registering ? "new-password" : "current-password"}
                  required
                />
              )}
            </form.AppField>
            <form.SubmitButton successLabel={registering ? "Account created" : "Signed in"}>
              {action}
            </form.SubmitButton>
            <form.Subscribe selector={(state) => state.errorMap.onSubmit}>
              {(error) =>
                Boolean(error) && (
                  <p role="alert" className="text-caption text-error">
                    {error}
                  </p>
                )
              }
            </form.Subscribe>
            <form.Subscribe selector={(state) => state.isSubmitSuccessful}>
              {(submitted) =>
                submitted &&
                !authClient && (
                  <output className="text-center text-muted-foreground">
                    Submission simulated in this preview.
                  </output>
                )
              }
            </form.Subscribe>
          </FieldGroup>
        </Form>
        <p className="text-center text-caption text-muted-foreground">
          {registering ? "Already have an account?" : "Don’t have an account?"}{" "}
          <Link to={registering ? "/" : "/sign-up"} className="text-link hover:underline">
            {registering ? "Sign in" : "Create an account"}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
};

const AuthClientContext = createContext<CardDemoProps["authClient"]>(undefined);
const SignInPage = () => <AuthCard authClient={use(AuthClientContext)} registering={false} />;
const SignUpPage = () => <AuthCard authClient={use(AuthClientContext)} registering />;
const rootRoute = createRootRoute({ component: Outlet });

const signInRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: SignInPage,
});

const signUpRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/sign-up",
  component: SignUpPage,
});

const routeTree = rootRoute.addChildren([signInRoute, signUpRoute]);

export const defaultProps = {} satisfies CardDemoProps;

export default function CardExample({ authClient }: CardDemoProps = defaultProps) {
  const router = useMemo(
    () =>
      createRouter({
        routeTree,
        history: createMemoryHistory({ initialEntries: ["/"] }),
      }),
    [],
  );

  return (
    <AuthClientContext value={authClient}>
      <RouterProvider router={router} />
    </AuthClientContext>
  );
}
