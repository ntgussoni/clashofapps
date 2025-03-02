"use client"

import { useEffect, useRef } from "react"
import type { AppType } from "@/lib/types"

interface KeywordCloudProps {
  app: AppType
}

export function KeywordCloud({ app }: KeywordCloudProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return

    const width = canvasRef.current.width
    const height = canvasRef.current.height

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Draw keyword cloud
    const keywords = app.keywords
    const centerX = width / 2
    const centerY = height / 2

    ctx.textAlign = "center"
    ctx.textBaseline = "middle"

    // Place keywords in a spiral pattern
    let angle = 0
    let radius = 0
    const radiusIncrement = 5
    const angleIncrement = 0.5

    keywords.forEach((keyword, index) => {
      // Calculate size based on weight
      const fontSize = 12 + keyword.weight * 20
      ctx.font = `${fontSize}px sans-serif`

      // Calculate position in spiral
      const x = centerX + radius * Math.cos(angle)
      const y = centerY + radius * Math.sin(angle)

      // Assign color based on sentiment
      if (keyword.sentiment === "positive") {
        ctx.fillStyle = "#22c55e" // Green
      } else if (keyword.sentiment === "negative") {
        ctx.fillStyle = "#ef4444" // Red
      } else {
        ctx.fillStyle = "#64748b" // Slate
      }

      // Draw text
      ctx.fillText(keyword.text, x, y)

      // Increment spiral parameters
      angle += angleIncrement
      radius += radiusIncrement

      // Reset spiral if it gets too large
      if (radius > Math.min(width, height) / 2 - 50) {
        radius = 20
        angle += Math.PI
      }
    })
  }, [app])

  return <canvas ref={canvasRef} width={800} height={400} className="w-full h-full" />
}

