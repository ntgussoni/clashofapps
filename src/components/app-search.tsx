"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { AppType } from "@/lib/types"
import { mockApps } from "@/lib/mock-data"

interface AppSearchProps {
  onSelectApp: (app: AppType) => void
}

export function AppSearch({ onSelectApp }: AppSearchProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<AppType[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)

    // Simulate API call with mock data
    setTimeout(() => {
      const results = mockApps.filter(
        (app) =>
          app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.developer.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setSearchResults(results)
      setIsSearching(false)
    }, 500)
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search apps by name or developer..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>
        <Button onClick={handleSearch} disabled={isSearching}>
          {isSearching ? "Searching..." : "Search"}
        </Button>
      </div>

      {searchResults.length > 0 && (
        <div className="border rounded-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {searchResults.map((app) => (
              <div
                key={app.id}
                className="flex items-center gap-3 p-3 border rounded-lg hover:bg-accent cursor-pointer"
                onClick={() => onSelectApp(app)}
              >
                <img src={app.icon || "/placeholder.svg"} alt={app.name} className="w-12 h-12 rounded-lg" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">{app.name}</h3>
                  <p className="text-sm text-muted-foreground truncate">{app.developer}</p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation()
                    onSelectApp(app)
                  }}
                >
                  Add
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

