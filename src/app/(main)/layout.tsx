import { AppHeader } from "@/components/app-header";
import { Footer } from "@/components/footer";
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
    <>
      <div className="container mx-auto px-4 py-6">
        <AppHeader initialSession={session} />
      </div>
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
