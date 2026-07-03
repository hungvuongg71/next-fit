"use client"

import { useRouter } from "next/navigation"
import { WorkoutHistoryEntry } from "@/types"

interface RecentSessionsProps {
  history: WorkoutHistoryEntry[]
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" })
}

export default function RecentSessions({ history }: RecentSessionsProps) {
  const router = useRouter()

  if (history.length === 0) {
    return (
      <section>
        <h2 className="font-display text-base font-extrabold mb-4" style={{ color: "var(--color-text)" }}>
          📋 Các buổi tập gần nhất
        </h2>
        <div
          className="rounded-2xl p-6 text-center"
          style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
        >
          <p className="font-body text-sm mb-4" style={{ color: "var(--color-text-secondary)" }}>
            Chưa có buổi tập nào. Bắt đầu buổi tập đầu tiên của bạn!
          </p>
          <button
            type="button"
            onClick={() => router.push("/workout")}
            className="animate-running-light min-h-10 rounded-xl font-heading text-xs font-bold transition-all active:scale-[0.98] px-6"
            style={{ background: "var(--color-primary)", color: "#fff" }}
          >
            Bắt đầu tập luyện
          </button>
        </div>
      </section>
    )
  }

  const sorted = [...history].sort(
    (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime(),
  )

  return (
    <section>
      <h2 className="font-display text-base font-extrabold mb-4" style={{ color: "var(--color-text)" }}>
        📋 Các buổi tập gần nhất
      </h2>
      <div className="grid gap-3">
        {sorted.slice(0, 10).map((entry) => (
          <button
            key={entry.id}
            onClick={() => router.push(`/history?id=${entry.id}`)}
            className="w-full text-left rounded-2xl p-4 transition-all active:scale-[0.98] hover:opacity-80"
            style={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
            }}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-heading text-sm font-semibold" style={{ color: "var(--color-text)" }}>
                {formatDate(entry.completedAt)}
              </span>
              <span className="font-number text-xs" style={{ color: "var(--color-text-secondary)" }}>
                {formatDuration(entry.durationSeconds)}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs" style={{ color: "var(--color-text-secondary)" }}>
              <span>{entry.exercises.length} bài tập</span>
              <span>{entry.completedSets}/{entry.totalSets} hiệp</span>
              {entry.totalVolume > 0 && (
                <span>{Math.round(entry.totalVolume).toLocaleString("vi-VN")} kg</span>
              )}
            </div>
          </button>
        ))}
      </div>
    </section>
  )
}
