// Compare layout - this uses the same layout as the main app pages
// but could be customized in the future if needed

import { AppHeader } from "@/components/app-header";
import { Footer } from "@/components/footer";
import { auth } from "@/server/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function CompareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/");
  }

  return (
    <>
      <div className="container mx-auto px-4 py-6">
        <AppHeader initialSession={session} />
      </div>
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
