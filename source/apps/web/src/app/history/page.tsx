"use client"

import { Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useApp } from "@/state/context"
import { ArrowLeft, Clock, Flame, Dumbbell } from "lucide-react"

function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  if (m < 60) return `${m} phút`
  const h = Math.floor(m / 60)
  const rest = m % 60
  return rest > 0 ? `${h} giờ ${rest} phút` : `${h} giờ`
}

function HistoryContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { state } = useApp()
  const id = searchParams.get("id")
  const entry = state.workoutHistory.find((e) => e.id === id)

  if (!id || !entry) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center px-5 text-center" style={{ background: "var(--color-bg)", color: "var(--color-text)" }}>
        <div
          className="mb-5 flex h-20 w-20 items-center justify-center rounded-[28px]"
          style={{ background: "rgba(var(--color-primary-rgb), 0.14)", border: "1px solid rgba(var(--color-primary-rgb), 0.28)" }}
        >
          <Dumbbell size={34} style={{ color: "var(--color-primary)" }} aria-hidden="true" />
        </div>
        <h1 className="font-display text-3xl font-extrabold">Không tìm thấy</h1>
        <p className="mt-3 max-w-sm font-body text-sm leading-6" style={{ color: "var(--color-text-secondary)" }}>
          Buổi tập này không tồn tại hoặc đã bị xoá.
        </p>
        <button
          type="button"
          onClick={() => router.push("/")}
          className="mt-7 min-h-14 w-full max-w-sm rounded-2xl font-heading font-bold"
          style={{ background: "var(--color-primary)", color: "#fff", boxShadow: "var(--shadow-glow)" }}
        >
          Về trang chủ
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-dvh" style={{ background: "var(--color-bg)", color: "var(--color-text)" }}>
      <header
        className="sticky top-0 z-30 px-4 pb-3 pt-4"
        style={{ background: "rgba(0,0,0,0.92)", borderBottom: "1px solid var(--color-border)", backdropFilter: "blur(20px)" }}
      >
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Quay lại"
            className="flex h-11 w-11 items-center justify-center rounded-full transition-all active:scale-95"
            style={{ background: "rgba(255,255,255,0.06)" }}
          >
            <ArrowLeft size={21} style={{ color: "var(--color-text-secondary)" }} aria-hidden="true" />
          </button>
          <h1 className="font-display text-base font-bold">Chi tiết buổi tập</h1>
          <div className="w-11" />
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 pt-5 pb-24">
        <div className="mb-6">
          <h2 className="font-display text-xl font-extrabold mb-1">{formatDate(entry.completedAt)}</h2>
          <div className="flex items-center gap-4 text-sm" style={{ color: "var(--color-text-secondary)" }}>
            <span className="flex items-center gap-1">
              <Clock size={14} aria-hidden="true" />
              {formatDuration(entry.durationSeconds)}
            </span>
            <span className="flex items-center gap-1">
              <Flame size={14} aria-hidden="true" />
              {entry.completedSets}/{entry.totalSets} hiệp
            </span>
            {entry.totalVolume > 0 && (
              <span>{Math.round(entry.totalVolume).toLocaleString("vi-VN")} kg</span>
            )}
          </div>
        </div>

        <div className="grid gap-3">
          {entry.exercises.map((ex) => {
            const detail = entry.exerciseDetails?.find((d) => d.exercise.id === ex.id)
            const sets = detail?.sets ?? []
            const completed = sets.filter((s) => s.completed && !s.isWarmup)
            const isBodyweight = ex.primary_equipment === "Bodyweight"
            return (
              <div
                key={ex.id}
                className="rounded-2xl p-4"
                style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-heading text-sm font-semibold">{ex.name}</h3>
                    <p className="font-body text-xs" style={{ color: "var(--color-text-secondary)" }}>
                      {ex.primary_equipment} · {ex.target_muscle_group}
                    </p>
                  </div>
                  <span
                    className="rounded-xl px-2 py-1 font-number text-[10px]"
                    style={{
                      background: "rgba(var(--color-primary-rgb), 0.12)",
                      color: "var(--color-primary)",
                    }}
                  >
                    {completed.length}/{sets.filter((s) => !s.isWarmup).length} hiệp
                  </span>
                </div>
                {sets.filter((s) => !s.isWarmup).length > 0 && (
                  <div
                    className="grid gap-1.5 rounded-xl p-3"
                    style={{ background: "rgba(255,255,255,0.035)" }}
                  >
                    <div className={`grid items-center gap-2 px-1 font-heading text-[10px] uppercase tracking-[0.12em] ${isBodyweight ? "grid-cols-[24px_1fr_44px]" : "grid-cols-[24px_1fr_1fr_44px]"}`} style={{ color: "var(--color-text-secondary)" }}>
                      <span>#</span>
                      <span className="text-center">Reps</span>
                      {!isBodyweight && <span className="text-center">Kg</span>}
                      <span />
                    </div>
                    {sets.filter((s) => !s.isWarmup).map((set, i) => (
                      <div
                        key={i}
                        className={`grid items-center gap-2 rounded-xl p-2 ${isBodyweight ? "grid-cols-[24px_1fr_44px]" : "grid-cols-[24px_1fr_1fr_44px]"}`}
                        style={{
                          background: set.completed ? "rgba(var(--color-primary-rgb), 0.06)" : "rgba(255,255,255,0.025)",
                        }}
                      >
                        <span className="text-center font-number text-xs" style={{ color: set.completed ? "var(--color-primary)" : "var(--color-text-secondary)" }}>
                          {i + 1}
                        </span>
                        <span className="text-center font-number text-xs">{set.reps ?? "—"}</span>
                        {!isBodyweight && <span className="text-center font-number text-xs">{set.weight ?? "—"}</span>}
                        <span className="text-center font-number text-xs" style={{ color: set.completed ? "#22c55e" : "var(--color-text-secondary)" }}>
                          {set.completed ? "✓" : "—"}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <button
          type="button"
          onClick={() => router.push("/")}
          className="mt-6 w-full py-4 rounded-2xl font-heading font-bold text-base transition-all active:scale-[0.97]"
          style={{
            background: "var(--color-primary)",
            color: "#fff",
            boxShadow: "0 0 30px rgba(var(--color-primary-rgb), 0.35)",
          }}
        >
          Về trang chủ
        </button>
      </main>
    </div>
  )
}

export default function HistoryPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-dvh items-center justify-center" style={{ background: "var(--color-bg)" }}>
        <p className="font-body text-sm" style={{ color: "var(--color-text-secondary)" }}>Đang tải...</p>
      </div>
    }>
      <HistoryContent />
    </Suspense>
  )
}
