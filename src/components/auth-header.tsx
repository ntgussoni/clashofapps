import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CircleArrowLeft } from "lucide-react";
import Logo from "@/../public/logo.webp";

export function AuthHeader() {
  return (
    <div className="group flex flex-col items-center justify-center gap-2 text-center">
      <Link href="/" className="mb-4 flex items-center">
        <Button
          size={"icon"}
          variant={"ghost"}
          className="-ml-6 opacity-50 group-hover:opacity-100"
        >
          <CircleArrowLeft size={18} />
        </Button>
        <Image src={Logo} alt="Logo" height={32} className="self-center" />
      </Link>
      <h1 className="text-3xl font-bold">Login</h1>
      <p className="text-balance text-foreground">
        Enter your email below to login to your account
      </p>
    </div>
  );
}
