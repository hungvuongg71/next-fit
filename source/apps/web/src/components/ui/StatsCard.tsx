"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { Flame, Calendar } from "lucide-react"
import { WorkoutHistoryEntry } from "@/types"

interface StatsCardProps {
  streak: number
  totalWorkouts: number
  history: WorkoutHistoryEntry[]
}

const CHART_HEIGHT = 100
const BAR_WIDTH = 6
const GAP = 4

function AnimatedNumber({ value }: { value: number }) {
  const [count, setCount] = useState(0)
  const prev = useRef(0)

  useEffect(() => {
    const target = value
    const start = prev.current
    if (start === target) {
      setCount(target)
      return
    }
    const duration = 800
    const startTime = performance.now()

    const raf = requestAnimationFrame(function tick(now) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const current = Math.round(start + (target - start) * progress)
      setCount(current)
      if (progress < 1) requestAnimationFrame(tick)
    })

    prev.current = target
    return () => cancelAnimationFrame(raf)
  }, [value])

  return <>{count}</>
}

export default function StatsCard({ streak, totalWorkouts, history }: StatsCardProps) {
  const chartData = useMemo(() => {
    const threeMonthsAgo = Date.now() - 90 * 86400000
    return history
      .filter((e) => new Date(e.completedAt).getTime() > threeMonthsAgo)
      .sort((a, b) => new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime())
      .map((e) => ({
        date: new Date(e.completedAt).toLocaleDateString("vi-VN", { day: "numeric", month: "numeric" }),
        minutes: Math.round((e.durationSeconds || 0) / 60),
      }))
  }, [history])

  const maxMinutes = Math.max(...chartData.map((d) => d.minutes), 1)
  const svgWidth = Math.max(chartData.length * (BAR_WIDTH + GAP) - GAP, 0)

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div
          className="rounded-2xl p-4 text-center"
          style={{
            background: "linear-gradient(135deg, rgba(var(--color-primary-rgb), 0.1) 0%, rgba(var(--color-primary-rgb), 0.03) 100%)",
            border: "1px solid rgba(var(--color-primary-rgb), 0.15)",
          }}
        >
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <Flame size={16} style={{ color: "var(--color-primary)" }} aria-hidden="true" />
            <span className="font-heading text-xs font-semibold" style={{ color: "var(--color-text-secondary)" }}>
              Streak
            </span>
          </div>
          <span className="font-display text-4xl font-extrabold" style={{ color: "var(--color-primary)" }}>
            <AnimatedNumber value={streak} />
          </span>
        </div>

        <div
          className="rounded-2xl p-4 text-center"
          style={{
            background: "linear-gradient(135deg, rgba(var(--color-primary-rgb), 0.1) 0%, rgba(var(--color-primary-rgb), 0.03) 100%)",
            border: "1px solid rgba(var(--color-primary-rgb), 0.15)",
          }}
        >
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <Calendar size={16} style={{ color: "var(--color-text-secondary)" }} aria-hidden="true" />
            <span className="font-heading text-xs font-semibold" style={{ color: "var(--color-text-secondary)" }}>
              Tổng buổi tập
            </span>
          </div>
          <span className="font-display text-4xl font-extrabold" style={{ color: "var(--color-text)" }}>
            <AnimatedNumber value={totalWorkouts} />
          </span>
        </div>
      </div>

      {chartData.length > 0 && (
        <div
          className="rounded-2xl p-4"
          style={{
            background: "linear-gradient(135deg, rgba(var(--color-primary-rgb), 0.08) 0%, rgba(var(--color-primary-rgb), 0.02) 100%)",
            border: "1px solid rgba(var(--color-primary-rgb), 0.12)",
          }}
        >
          <p className="font-heading text-xs font-semibold mb-2" style={{ color: "var(--color-text-secondary)" }}>
            Thời gian tập (3 tháng gần nhất)
          </p>
          <div className="overflow-x-auto">
            <svg width="100%" height={CHART_HEIGHT + 20} style={{ minWidth: svgWidth || undefined }}>
              {chartData.map((d, i) => {
                const barHeight = (d.minutes / maxMinutes) * CHART_HEIGHT
                const x = i * (BAR_WIDTH + GAP)
                const y = CHART_HEIGHT - barHeight
                return (
                  <rect
                    key={i}
                    x={x}
                    y={y}
                    width={BAR_WIDTH}
                    height={barHeight}
                    rx={2}
                    fill="var(--color-primary)"
                    style={{ opacity: 0.8 }}
                  />
                )
              })}
            </svg>
          </div>
        </div>
      )}
    </div>
  )
}
