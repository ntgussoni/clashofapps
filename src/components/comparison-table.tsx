import { X, Star, Download, Users, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { AppType } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { formatNumber } from "@/lib/utils"

interface ComparisonTableProps {
  apps: AppType[]
  onRemoveApp: (appId: string) => void
}

export function ComparisonTable({ apps, onRemoveApp }: ComparisonTableProps) {
  if (apps.length === 0) return null

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Comparison</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-muted">
              <th className="p-4 text-left font-medium">Feature</th>
              {apps.map((app) => (
                <th key={app.id} className="p-4 text-left font-medium min-w-[200px]">
                  <div className="flex items-center justify-between">
                    <span>{app.name}</span>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onRemoveApp(app.id)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="p-4 font-medium">App Icon</td>
              {apps.map((app) => (
                <td key={app.id} className="p-4">
                  <img src={app.icon || "/placeholder.svg"} alt={app.name} className="w-16 h-16 rounded-lg" />
                </td>
              ))}
            </tr>
            <tr className="border-b">
              <td className="p-4 font-medium">Developer</td>
              {apps.map((app) => (
                <td key={app.id} className="p-4">
                  {app.developer}
                </td>
              ))}
            </tr>
            <tr className="border-b">
              <td className="p-4 font-medium">Category</td>
              {apps.map((app) => (
                <td key={app.id} className="p-4">
                  <Badge variant="outline">{app.category}</Badge>
                </td>
              ))}
            </tr>
            <tr className="border-b">
              <td className="p-4 font-medium">Rating</td>
              {apps.map((app) => (
                <td key={app.id} className="p-4">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{app.rating.toFixed(1)}</span>
                    <span className="text-muted-foreground text-sm">({formatNumber(app.reviewCount)} reviews)</span>
                  </div>
                </td>
              ))}
            </tr>
            <tr className="border-b">
              <td className="p-4 font-medium">Downloads</td>
              {apps.map((app) => (
                <td key={app.id} className="p-4">
                  <div className="flex items-center gap-1">
                    <Download className="h-4 w-4 text-muted-foreground" />
                    <span>{formatNumber(app.downloads)}</span>
                  </div>
                </td>
              ))}
            </tr>
            <tr className="border-b">
              <td className="p-4 font-medium">Active Users</td>
              {apps.map((app) => (
                <td key={app.id} className="p-4">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{formatNumber(app.activeUsers)}</span>
                  </div>
                </td>
              ))}
            </tr>
            <tr className="border-b">
              <td className="p-4 font-medium">Last Updated</td>
              {apps.map((app) => (
                <td key={app.id} className="p-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{app.lastUpdated}</span>
                  </div>
                </td>
              ))}
            </tr>
            <tr className="border-b">
              <td className="p-4 font-medium">Key Features</td>
              {apps.map((app) => (
                <td key={app.id} className="p-4">
                  <ul className="list-disc list-inside space-y-1">
                    {app.keyFeatures.map((feature, index) => (
                      <li key={index} className="text-sm">
                        {feature}
                      </li>
                    ))}
                  </ul>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

