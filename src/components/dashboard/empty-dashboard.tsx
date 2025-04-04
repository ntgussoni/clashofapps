// import Link from "next/link";
import { PlusCircle } from "lucide-react";
// import { Button } from "@/components/ui/button";

export function EmptyDashboard() {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
        <PlusCircle className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="mt-6 text-xl font-semibold">No comparisons yet</h3>
      <p className="mt-2 max-w-md text-muted-foreground">
        Create your first app comparison to get started
      </p>
      {/* <div className="mt-6">
        <Link href="/new-analysis">
          <Button className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            New Comparison
          </Button>
        </Link>
      </div> */}
    </div>
  );
}
