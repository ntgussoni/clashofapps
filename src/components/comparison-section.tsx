"use client"
import { Card } from "@/components/ui/card"
import { ChatInterface } from "@/components/chat-interface"

interface ComparisonSectionProps {
  appLinks: string[]
}

export function ComparisonSection({ appLinks }: ComparisonSectionProps) {
  // Extract app IDs from links for the initial message
  const appIds = appLinks.map((link) => {
    const match = link.match(/id=([^&]+)/)
    return match ? match[1] : link
  })

  const initialMessage = `Compare these apps from Google Play Store:\n${appIds.join("\n")}`

  return (
    <div className="container px-4 md:px-6 py-8">
      <Card className="border-2">
        <ChatInterface initialMessage={initialMessage} />
      </Card>
    </div>
  )
}

