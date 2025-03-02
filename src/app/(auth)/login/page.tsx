"use client";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import LoginImage from "@/../public/login.webp";
import Logo from "@/../public/logo.webp";
import { CircleArrowLeft, MailIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { authClient } from "@/lib/auth-client";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const hasVerify = params.get("verify") !== undefined;
  const { data: session } = authClient.useSession();

  if (session) {
    router.push("/sites");
  }

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get("email") as string;
    await authClient.signIn.magicLink({
      email,
    });
  };

  return (
    <div className="flex h-dvh w-full items-center justify-center lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex h-dvh items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="group flex flex-col items-center justify-center gap-2 text-center">
            <Link href="/" className="mb-4 flex items-center">
              <Button
                size={"icon"}
                variant={"ghost"}
                className="-ml-6 opacity-50 group-hover:opacity-100"
              >
                <CircleArrowLeft size={18} />
              </Button>
              <Image
                src={Logo}
                alt="Logo"
                height={32}
                className="self-center"
              />
            </Link>
            <h1 className="text-3xl font-bold">Login</h1>
            <p className="text-balance text-foreground">
              Enter your email below to login to your account
            </p>
          </div>
          <div className="grid gap-4">
            {hasVerify && (
              <Alert
                className="animate-animate-slidein300 mb-6 opacity-0"
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
            <div className="flex items-center gap-2">
              <hr className="flex-1 border-b border-foreground" />
              <p className="text-sm text-foreground">
                Or use one of the following
              </p>
              <hr className="flex-1 border-b border-foreground" />
            </div>
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
          <Image
            src={LoginImage}
            alt="Image"
            className="z-10 h-full w-full object-cover"
            sizes="(max-width: 768px) 0, 50vw"
            quality={80}
          />
        </div>
      </div>
    </div>
  );
}
