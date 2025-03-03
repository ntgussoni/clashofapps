import { BarChart3, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/config";
import { BrandIcon } from "@/components/ui/brand-icon";

export function AppHeader() {
  return (
    <header className="flex flex-col items-center justify-between gap-4 md:flex-row">
      <div>
        <h1 className="flex items-center gap-2 text-3xl font-bold">
          {siteConfig.name} <BrandIcon className="h-6 w-6" />
        </h1>
        <p className="mt-1 text-muted-foreground">{siteConfig.description}</p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm">
          <Search className="mr-2 h-4 w-4" />
          Advanced Search
        </Button>
        <Button size="sm">
          <BarChart3 className="mr-2 h-4 w-4" />
          Generate Report
        </Button>
      </div>
    </header>
  );
}
