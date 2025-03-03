import { AppHeader } from "@/components/app-header";
import { Footer } from "@/components/footer";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="container mx-auto px-4 py-6">
        <AppHeader />
      </div>
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
