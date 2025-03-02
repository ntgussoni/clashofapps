import { BarChart3, Search, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AppHeader() {
  return (
    <header className="flex flex-col md:flex-row justify-between items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          Clash of Apps <Zap className="h-6 w-6 text-yellow-500" />
        </h1>
        <p className="text-muted-foreground mt-1">
          Compare apps and discover insights from reviews to gain a competitive edge
        </p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm">
          <Search className="h-4 w-4 mr-2" />
          Advanced Search
        </Button>
        <Button size="sm">
          <BarChart3 className="h-4 w-4 mr-2" />
          Generate Report
        </Button>
      </div>
    </header>
  )
}

