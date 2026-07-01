"use client"

import { Flame, Calendar } from "lucide-react"
import { WorkoutHistoryEntry } from "@/types"
import { getSessionsThisWeek, getCurrentStreak } from "@/lib/weekly-stats"

interface QuickStatsProps {
  history: WorkoutHistoryEntry[]
}

export default function QuickStats({ history }: QuickStatsProps) {
  const sessionsThisWeek = getSessionsThisWeek(history)
  const streak = getCurrentStreak(history)

  if (history.length === 0) return null

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <span
          className="flex h-7 w-7 items-center justify-center rounded-lg shrink-0"
          style={{ background: "rgba(251,191,36,0.12)" }}
        >
          <Flame size={13} style={{ color: "#fbbf24" }} aria-hidden="true" />
        </span>
        <div>
          <span className="font-number text-sm font-bold" style={{ color: "var(--color-text)" }}>
            {streak}
          </span>
          <span className="font-heading text-[10px] font-semibold ml-1" style={{ color: "var(--color-text-secondary)" }}>
            streak
          </span>
        </div>
      </div>
      <span className="font-body text-xs" style={{ color: "var(--color-border)" }}>·</span>
      <div className="flex items-center gap-2">
        <span
          className="flex h-7 w-7 items-center justify-center rounded-lg shrink-0"
          style={{ background: "rgba(var(--color-primary-rgb), 0.12)" }}
        >
          <Calendar size={13} style={{ color: "var(--color-primary)" }} aria-hidden="true" />
        </span>
        <div>
          <span className="font-number text-sm font-bold" style={{ color: "var(--color-text)" }}>
            {sessionsThisWeek}
          </span>
          <span className="font-heading text-[10px] font-semibold ml-1" style={{ color: "var(--color-text-secondary)" }}>
            buổi / tuần
          </span>
        </div>
      </div>
    </div>
  )
}
