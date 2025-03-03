// Admin layout - we want to show a specialized header for admin pages
// but still use the footer from the root layout

import { AppHeader } from "@/components/app-header";

export default function AdminLayout({
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
    </>
  );
}
