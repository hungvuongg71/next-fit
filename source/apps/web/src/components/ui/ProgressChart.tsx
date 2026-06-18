"use client"

import { useMemo } from "react"
import { TrendingUp } from "lucide-react"
import { ExerciseLogEntry } from "@/types"
import { getLogsForExercise } from "@/lib/progressive"

interface ProgressChartProps {
  exerciseName: string
  exerciseId: string
  logs: Record<string, ExerciseLogEntry[]>
}

export default function ProgressChart({ exerciseName, exerciseId, logs }: ProgressChartProps) {
  const entries = useMemo(() => getLogsForExercise(logs, exerciseId), [logs, exerciseId])

  if (entries.length < 2) {
    if (entries.length === 1) {
      return (
        <div
          className="rounded-2xl p-4 mt-3"
          style={{ background: "rgba(var(--color-primary-rgb), 0.04)", border: "1px solid rgba(var(--color-primary-rgb), 0.1)" }}
        >
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={14} style={{ color: "var(--color-primary)" }} aria-hidden="true" />
            <p className="font-heading text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-primary)" }}>
              Lịch sử
            </p>
          </div>
          <p className="font-body text-xs" style={{ color: "var(--color-text-secondary)" }}>
            Lần trước: {entries[0].reps} reps × {entries[0].weight}kg ({entries[0].sets} sets)
          </p>
        </div>
      )
    }
    return null
  }

  const maxWeight = Math.max(...entries.map((e) => e.weight))
  const recentEntries = entries.slice(-10)

  return (
    <div
      className="rounded-2xl p-4 mt-3"
      style={{ background: "rgba(var(--color-primary-rgb), 0.04)", border: "1px solid rgba(var(--color-primary-rgb), 0.1)" }}
    >
      <div className="flex items-center gap-2 mb-3">
        <TrendingUp size={14} style={{ color: "var(--color-primary)" }} aria-hidden="true" />
        <p className="font-heading text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-primary)" }}>
          {exerciseName} — Tiến trình
        </p>
      </div>

      <div className="flex items-end gap-1.5 h-24">
        {recentEntries.map((entry, i) => {
          const heightPct = maxWeight > 0 ? (entry.weight / maxWeight) * 100 : 0
          return (
            <div
              key={entry.date}
              className="flex-1 flex flex-col items-center gap-1"
            >
              <span className="font-number text-[9px]" style={{ color: "var(--color-text-secondary)" }}>
                {entry.weight}
              </span>
              <div
                className="w-full rounded-t-lg transition-all"
                style={{
                  height: `${Math.max(heightPct, 5)}%`,
                  background: i === recentEntries.length - 1 ? "var(--color-primary)" : "rgba(var(--color-primary-rgb), 0.4)",
                  minHeight: "8px",
                }}
              />
              <span className="font-number text-[8px]" style={{ color: "var(--color-text-secondary)" }}>
                {new Date(entry.date).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" })}
              </span>
            </div>
          )
        })}
      </div>

      {entries.length > 1 && (
        <p className="mt-2 font-number text-[10px]" style={{ color: "var(--color-text-secondary)" }}>
          Max: {maxWeight}kg · Gần nhất: {entries[entries.length - 1].reps} reps × {entries[entries.length - 1].weight}kg
        </p>
      )}
    </div>
  )
}
