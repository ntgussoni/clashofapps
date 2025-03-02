"use client"

import { useEffect, useRef } from "react"
import type { AppType } from "@/lib/types"

interface SentimentChartProps {
  app: AppType
}

export function SentimentChart({ app }: SentimentChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return

    // Calculate sentiment percentages from the app's review insights
    const sentiments = app.reviewInsights.reduce(
      (acc, insight) => {
        acc[insight.sentiment] = (acc[insight.sentiment] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const total = Object.values(sentiments).reduce((sum, count) => sum + count, 0)

    const positive = ((sentiments.positive || 0) / total) * 100
    const neutral = ((sentiments.neutral || 0) / total) * 100
    const negative = ((sentiments.negative || 0) / total) * 100

    // Draw the donut chart
    const centerX = canvasRef.current.width / 2
    const centerY = canvasRef.current.height / 2
    const radius = Math.min(centerX, centerY) - 10

    const drawSegment = (startAngle: number, endAngle: number, color: string) => {
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, startAngle, endAngle)
      ctx.arc(centerX, centerY, radius * 0.6, endAngle, startAngle, true)
      ctx.closePath()
      ctx.fillStyle = color
      ctx.fill()
    }

    const startAngle = -0.5 * Math.PI
    const positiveEndAngle = startAngle + (positive / 100) * (2 * Math.PI)
    const neutralEndAngle = positiveEndAngle + (neutral / 100) * (2 * Math.PI)

    drawSegment(startAngle, positiveEndAngle, "#22c55e") // Green for positive
    drawSegment(positiveEndAngle, neutralEndAngle, "#eab308") // Yellow for neutral
    drawSegment(neutralEndAngle, startAngle + 2 * Math.PI, "#ef4444") // Red for negative

    // Add text in the center
    ctx.fillStyle = "#000"
    ctx.font = "bold 16px sans-serif"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(`${Math.round(positive)}%`, centerX, centerY - 10)
    ctx.font = "12px sans-serif"
    ctx.fillText("Positive", centerX, centerY + 10)
  }, [app])

  return (
    <div className="flex justify-center">
      <canvas ref={canvasRef} width={200} height={200} className="max-w-full" />
    </div>
  )
}

