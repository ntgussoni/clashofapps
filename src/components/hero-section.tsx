"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, X, ArrowRight, Loader2 } from "lucide-react"

interface HeroSectionProps {
  onStartComparison: (links: string[]) => void
  isComparing: boolean
}

export function HeroSection({ onStartComparison, isComparing }: HeroSectionProps) {
  const [links, setLinks] = useState<string[]>([""])
  const [isValidating, setIsValidating] = useState(false)

  const handleAddLink = () => {
    setLinks([...links, ""])
  }

  const handleRemoveLink = (index: number) => {
    const newLinks = links.filter((_, i) => i !== index)
    setLinks(newLinks.length ? newLinks : [""])
  }

  const handleLinkChange = (index: number, value: string) => {
    const newLinks = [...links]
    newLinks[index] = value
    setLinks(newLinks)
  }

  const handleCompare = async () => {
    setIsValidating(true)
    // Simulate link validation
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsValidating(false)
    onStartComparison(links)
  }

  const isValidGooglePlayLink = (link: string) => {
    return link.trim().startsWith("https://play.google.com/store/apps/")
  }

  const allLinksValid = links.every((link) => isValidGooglePlayLink(link))
  const atLeastTwoLinks = links.filter((link) => link.trim()).length >= 2

  return (
    <section className={`relative transition-all duration-500 ${isComparing ? "py-8" : "py-20 md:py-28"}`}>
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
      <div className="container px-4 md:px-6 relative">
        <div className="flex flex-col items-center text-center space-y-4 mb-8">
          <div className="space-y-2">
            <h1
              className={`transition-all duration-500 ${
                isComparing
                  ? "text-2xl md:text-3xl font-bold"
                  : "text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl"
              }`}
            >
              Compare Any Apps with AI
            </h1>
            {!isComparing && (
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Paste Google Play Store links below and let our AI analyze and compare the apps for you.
              </p>
            )}
          </div>
        </div>

        {!isComparing && (
          <div className="max-w-3xl mx-auto space-y-4">
            {links.map((link, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder="Paste Google Play Store link here..."
                  value={link}
                  onChange={(e) => handleLinkChange(index, e.target.value)}
                  className={`flex-1 ${link && !isValidGooglePlayLink(link) ? "border-red-500" : ""}`}
                />
                {links.length > 1 && (
                  <Button variant="outline" size="icon" onClick={() => handleRemoveLink(index)}>
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}

            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Button
                variant="outline"
                onClick={handleAddLink}
                disabled={links.length >= 5}
                className="w-full sm:w-auto"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Another App
              </Button>
              <Button
                onClick={handleCompare}
                disabled={!allLinksValid || !atLeastTwoLinks || isValidating}
                className="w-full sm:w-auto"
              >
                {isValidating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Validating Links...
                  </>
                ) : (
                  <>
                    Compare Apps
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </div>

            <div className="text-sm text-muted-foreground text-center">
              {links.some((link) => link && !isValidGooglePlayLink(link)) && (
                <p className="text-red-500">Please enter valid Google Play Store links</p>
              )}
              {!atLeastTwoLinks && links.some((link) => link.trim()) && <p>Add at least two apps to compare</p>}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

