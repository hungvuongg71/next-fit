"use client"

import { useMemo } from "react"
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
    <div
      className="rounded-2xl p-4"
      style={{
        background: "linear-gradient(135deg, rgba(var(--color-primary-rgb), 0.08) 0%, rgba(var(--color-primary-rgb), 0.02) 100%)",
        border: "1px solid rgba(var(--color-primary-rgb), 0.12)",
      }}
    >
      <div className="flex items-center gap-4 mb-3">
        <div className="flex items-center gap-2">
          <Flame size={18} style={{ color: "var(--color-primary)" }} aria-hidden="true" />
          <span className="font-heading font-semibold text-sm" style={{ color: "var(--color-text)" }}>
            <span style={{ color: "var(--color-primary)" }}>{streak}</span> streak
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar size={18} style={{ color: "var(--color-text-secondary)" }} aria-hidden="true" />
          <span className="font-heading text-sm" style={{ color: "var(--color-text-secondary)" }}>
            {totalWorkouts} tổng buổi tập
          </span>
        </div>
      </div>

      {chartData.length > 0 && (
        <div>
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
