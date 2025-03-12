"use client";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MailIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { authClient } from "@/lib/auth-client";
import { AuthHeader } from "@/components/auth-header";
import { redirect, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const referrer = searchParams.get("referrer");
  const [showAlert, setShowAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = authClient.useSession();

  if (session) {
    redirect("/");
  }

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get("email") as string;
    setIsLoading(true);
    await authClient.signIn.magicLink({
      email,
      callbackURL: referrer ?? "/",
    });
    setShowAlert(true);
    setIsLoading(false);
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
            <div className="space-y-4">
              <form id="sign-in-form" onSubmit={submit}>
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

            <Button type="submit" className="w-full" form="sign-in-form">
              Send magic link
            </Button>
            <div className="space-y-2">
              <p className="text-sm text-secondary-foreground">
                Click the magic link we email you to sign in. If you don&apos;t
                see the email, check other places it might be, like your junk,
                spam, social, or other folders.
              </p>
            </div>
            {/* <div className="flex items-center gap-2">
              <hr className="flex-1 border-b border-foreground" />
              <p className="text-sm text-foreground">
                Or use one of the following
              </p>
              <hr className="flex-1 border-b border-foreground" />
            </div> */}
          </div>
          {/* <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="#" className="underline">
              Sign up
            </Link>
          </div> */}
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
