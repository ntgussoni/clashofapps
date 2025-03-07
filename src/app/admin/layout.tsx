// Admin layout - we want to show a specialized header for admin pages
// but still use the footer from the root layout

import { AppHeader } from "@/components/app-header";
import { auth } from "@/server/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== "admin") {
    redirect("/");
  }

  return (
    <>
      <div className="container mx-auto px-4 py-6">
        <AppHeader initialSession={session} />
      </div>
      <main className="flex-1">{children}</main>
    </>
  );
}
