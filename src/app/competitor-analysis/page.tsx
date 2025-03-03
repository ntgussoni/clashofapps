"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CompetitorAnalysisRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the new compare route
    router.push("/compare");
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Redirecting...</h1>
        <p className="mt-2 text-gray-600">
          Please wait while we redirect you to the new comparison page.
        </p>
      </div>
    </div>
  );
}
