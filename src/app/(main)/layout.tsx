import { AppHeader } from "@/components/app-header";
import { auth } from "@/server/auth";
import { headers } from "next/headers";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="dark relative flex min-h-screen flex-col">
      <AppHeader initialSession={session} />
      <main className="flex-1">{children}</main>
    </div>
  );
}
