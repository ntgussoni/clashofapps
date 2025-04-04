"use client";
import { useState, Suspense } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MailIcon, KeyIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { authClient } from "@/lib/auth-client";
import { AuthHeader } from "@/components/auth-header";
import { redirect, useSearchParams } from "next/navigation";

// Create a client component that uses useSearchParams
function LoginContent() {
  const searchParams = useSearchParams();
  const referrer = searchParams.get("referrer");
  const [showAlert, setShowAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = authClient.useSession();

  if (session) {
    redirect("/");
  }

  const submitMagicLink = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get("email") as string;
    setIsLoading(true);
    setError(null);
    try {
      await authClient.signIn.magicLink({
        email,
        callbackURL: referrer ?? "/",
      });
      setShowAlert(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to send magic link",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const submitPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get("email-pwd") as string;
    const password = formData.get("password") as string;
    setIsLoading(true);
    setError(null);
    try {
      await authClient.signIn.email({
        email,
        password,
        callbackURL: referrer ?? "/",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sign in");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-dvh w-full items-center justify-center lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex h-dvh items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <AuthHeader />
          <div className="grid gap-4">
            {showAlert && !isLoading && (
              <Alert
                className="mb-6 animate-animate-slidein300 opacity-0"
                variant="default"
              >
                <MailIcon className="mr-5 h-5 w-5" />
                <AlertTitle className="mb-4 pt-1 font-bold">
                  Magic Link Sent
                </AlertTitle>
                <AlertDescription>
                  We&apos;ve sent a magic link to your email.{" "}
                  <b>Check your inbox to sign in</b>.
                </AlertDescription>
              </Alert>
            )}
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-4">
              <form id="magic-link-form" onSubmit={submitMagicLink}>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </form>
            </div>

            <Button
              type="submit"
              className="w-full"
              form="magic-link-form"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send magic link"}
            </Button>

            {process.env.NODE_ENV === "development" && (
              <>
                <div className="flex items-center gap-2 pt-4">
                  <hr className="flex-1 border-b border-foreground" />
                  <p className="text-sm text-foreground">
                    Or use email/password (dev only)
                  </p>
                  <hr className="flex-1 border-b border-foreground" />
                </div>

                <form
                  id="password-form"
                  onSubmit={submitPassword}
                  className="space-y-4"
                >
                  <div>
                    <Label htmlFor="email-pwd">Email</Label>
                    <Input
                      id="email-pwd"
                      name="email-pwd"
                      type="email"
                      placeholder="m@example.com"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                    variant="outline"
                  >
                    <KeyIcon className="mr-2 h-4 w-4" />
                    {isLoading ? "Signing in..." : "Sign in with password"}
                  </Button>
                </form>
              </>
            )}

            <div className="space-y-2">
              <p className="text-sm text-secondary-foreground">
                Click the magic link we email you to sign in. If you don&apos;t
                see the email, check other places it might be, like your junk,
                spam, social, or other folders.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="relative hidden h-dvh w-full lg:flex">
        <div className="h-full w-full mix-blend-darken">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-300 to-yellow-500" />
        </div>
      </div>
    </div>
  );
}

// Main page component with Suspense boundary
export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-4">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
