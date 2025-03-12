import { redirect } from "next/navigation";
import { auth } from "@/server/auth";
import { headers } from "next/headers";
import { api } from "@/trpc/server";

export default async function AnalysisCreatePage({
  params,
}: {
  params: Promise<{ appIds: string[] }>;
}) {
  const { appIds: appStoreIds } = await params;
  // Get the user session using better-auth
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Check if the user is authenticated
  if (!session?.user) {
    // Redirect to login with a referrer back to this page
    const currentPath = `/analysis/create/${appStoreIds.join("/")}`;
    redirect(`/login?referrer=${encodeURIComponent(currentPath)}`);
  }

  if (appStoreIds.length === 0) {
    redirect("/"); // Or to an error page
  }

  let redirectUrl = "/";
  try {
    const result = await api.analysis.create({
      appStoreIds,
    });

    // Redirect to the analysis detail page
    redirectUrl = `/analysis/${result.slug}`;
  } catch (error) {
    console.error("Error creating analysis:", error);
    redirectUrl = "/error?message=Failed+to+create+analysis";
  } finally {
    redirect(redirectUrl);
  }
}
