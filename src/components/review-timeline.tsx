"use client"

import { useEffect, useRef } from "react"
import type { AppType } from "@/lib/types"

interface ReviewTimelineProps {
  app: AppType
}

export function ReviewTimeline({ app }: ReviewTimelineProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return

    const width = canvasRef.current.width
    const height = canvasRef.current.height

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Draw timeline chart
    const timeline = app.ratingTimeline
    const padding = 40
    const chartWidth = width - padding * 2
    const chartHeight = height - padding * 2

    // Draw axes
    ctx.beginPath()
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, height - padding)
    ctx.lineTo(width - padding, height - padding)
    ctx.strokeStyle = "#94a3b8"
    ctx.lineWidth = 1
    ctx.stroke()

    // Draw y-axis labels (ratings 1-5)
    ctx.textAlign = "right"
    ctx.textBaseline = "middle"
    ctx.fillStyle = "#64748b"
    ctx.font = "12px sans-serif"

    for (let i = 1; i <= 5; i++) {
      const y = height - padding - ((i - 1) * chartHeight) / 4
      ctx.fillText(i.toString(), padding - 10, y)

      // Draw horizontal grid line
      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(width - padding, y)
      ctx.strokeStyle = "#e2e8f0"
      ctx.stroke()
    }

    // Draw x-axis labels (months)
    ctx.textAlign = "center"
    ctx.textBaseline = "top"

    const months = timeline.map((item) => item.month)
    months.forEach((month, i) => {
      const x = padding + (i * chartWidth) / (months.length - 1)
      ctx.fillText(month, x, height - padding + 10)
    })

    // Draw line chart
    ctx.beginPath()
    timeline.forEach((item, i) => {
      const x = padding + (i * chartWidth) / (timeline.length - 1)
      const y = height - padding - ((item.rating - 1) * chartHeight) / 4

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    ctx.strokeStyle = "#3b82f6"
    ctx.lineWidth = 2
    ctx.stroke()

    // Draw data points
    timeline.forEach((item, i) => {
      const x = padding + (i * chartWidth) / (timeline.length - 1)
      const y = height - padding - ((item.rating - 1) * chartHeight) / 4

      ctx.beginPath()
      ctx.arc(x, y, 4, 0, 2 * Math.PI)
      ctx.fillStyle = "#3b82f6"
      ctx.fill()
      ctx.strokeStyle = "#ffffff"
      ctx.lineWidth = 1
      ctx.stroke()
    })
  }, [app])

  return <canvas ref={canvasRef} width={800} height={400} className="w-full h-full" />
}

