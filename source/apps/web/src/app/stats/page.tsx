"use client"

import { Suspense, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, BarChart2, CalendarDays, Clock3, Dumbbell, LineChart, ChevronRight, Check, X } from "lucide-react"
import BottomNav from "@/components/layout/BottomNav"
import TopHeader from "@/components/layout/TopHeader"
import { useApp } from "@/state/context"

export default function StatsPage() {
  return (
    <Suspense fallback={null}>
      <StatsContent />
    </Suspense>
  )
}

function formatDuration(seconds: number) {
  const minutes = Math.round(seconds / 60)
  if (minutes < 60) return `${minutes} phút`
  return `${Math.floor(minutes / 60)}h ${minutes % 60}m`
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }).format(
    new Date(value),
  )
}

function formatDateFull(value: string) {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  }).format(new Date(value))
}

function formatSetNumber(index: number, isWarmup: boolean | undefined, warmupCount: number) {
  if (isWarmup) return "W"
  return (index - warmupCount + 1).toString()
}

function StatsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { state } = useApp()
  const selectedId = searchParams.get("id")

  const entry = useMemo(
    () => (selectedId ? state.workoutHistory.find((h) => h.id === selectedId) ?? null : null),
    [state.workoutHistory, selectedId],
  )

  if (entry) {
    return (
      <div className="min-h-dvh" style={{ background: "var(--color-bg)", color: "var(--color-text)" }}>
        <TopHeader title="Chi tiết buổi tập" subtitle={formatDate(entry.completedAt)} />
        <main className="mx-auto w-full max-w-5xl px-4 pb-28 pt-5">
          <Link
            href="/stats"
            className="mb-4 inline-flex items-center gap-2 font-heading text-xs font-semibold transition-all active:scale-95"
            style={{ color: "var(--color-primary)" }}
          >
            <ArrowLeft size={14} aria-hidden="true" />
            Quay lại
          </Link>

          <section
            className="rounded-[28px] p-5"
            style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
          >
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-2xl p-3" style={{ background: "rgba(255,255,255,0.04)" }}>
                <Clock3 size={16} style={{ color: "var(--color-primary)" }} aria-hidden="true" />
                <p className="mt-2 font-number text-base" style={{ color: "var(--color-primary)" }}>
                  {formatDuration(entry.durationSeconds)}
                </p>
                <p className="mt-0.5 font-body text-[11px]" style={{ color: "var(--color-text-secondary)" }}>
                  Thời gian
                </p>
              </div>
              <div className="rounded-2xl p-3" style={{ background: "rgba(255,255,255,0.04)" }}>
                <BarChart2 size={16} style={{ color: "var(--color-primary)" }} aria-hidden="true" />
                <p className="mt-2 font-number text-base" style={{ color: "var(--color-primary)" }}>
                  {entry.completedSets}/{entry.totalSets}
                </p>
                <p className="mt-0.5 font-body text-[11px]" style={{ color: "var(--color-text-secondary)" }}>
                  Hiệp
                </p>
              </div>
              <div className="rounded-2xl p-3" style={{ background: "rgba(255,255,255,0.04)" }}>
                <Dumbbell size={16} style={{ color: "var(--color-primary)" }} aria-hidden="true" />
                <p className="mt-2 font-number text-base" style={{ color: "var(--color-primary)" }}>
                  {Math.round(entry.totalVolume).toLocaleString("vi-VN")}
                </p>
                <p className="mt-0.5 font-body text-[11px]" style={{ color: "var(--color-text-secondary)" }}>
                  KL (kg)
                </p>
              </div>
            </div>
            <p className="mt-3 font-body text-xs" style={{ color: "var(--color-text-secondary)" }}>
              {formatDateFull(entry.completedAt)}
            </p>
          </section>

          {entry.exerciseDetails && entry.exerciseDetails.length > 0 ? (
            <section className="mt-5 grid gap-4">
              {entry.exerciseDetails.map((detail, exerciseIndex) => {
                const warmupCount = detail.sets.filter((s) => s.isWarmup).length
                const isBodyweight = detail.exercise.equipment === "Bodyweight"
                return (
                  <div
                    key={`${detail.exercise.id}-${exerciseIndex}`}
                    className="overflow-hidden rounded-[28px] p-4"
                    style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h2 className="font-heading text-sm font-semibold">{detail.exercise.name}</h2>
                        <p className="mt-1 font-body text-xs" style={{ color: "var(--color-text-secondary)" }}>
                          {detail.exercise.equipment} · {detail.exercise.muscleGroup_vi ?? detail.exercise.muscleGroup}
                        </p>
                      </div>
                      <span
                        className="shrink-0 rounded-xl px-2 py-1 font-number text-[10px]"
                        style={{
                          background: "rgba(var(--color-primary-rgb), 0.16)",
                          color: "var(--color-primary)",
                        }}
                      >
                        {detail.sets.filter((s) => !s.isWarmup && s.completed).length}/{detail.sets.length - warmupCount}
                      </span>
                    </div>

                    <div className="mt-3 grid gap-1.5">
                      <div
                        className={`grid items-center gap-2 px-1 py-1 font-heading text-[10px] uppercase tracking-[0.18em] ${isBodyweight ? "grid-cols-[28px_1fr_28px]" : "grid-cols-[28px_1fr_1fr_28px]"}`}
                        style={{ color: "var(--color-text-secondary)" }}
                      >
                        <span>#</span>
                        <span className="text-center">Số reps</span>
                        {!isBodyweight && <span className="text-center">Kg</span>}
                        <span className="text-right" />
                      </div>
                      {detail.sets.map((set, setIndex) => (
                        <div
                          key={setIndex}
                          className={`grid items-center gap-2 rounded-2xl p-2 ${isBodyweight ? "grid-cols-[28px_1fr_28px]" : "grid-cols-[28px_1fr_1fr_28px]"}`}
                          style={{
                            background: set.completed ? "rgba(var(--color-primary-rgb), 0.08)" : "rgba(255,255,255,0.035)",
                          }}
                        >
                          <span
                            className="text-center font-number text-xs"
                            style={{
                              color: set.isWarmup ? "var(--color-primary)" : set.completed ? "var(--color-primary)" : "var(--color-text-secondary)",
                            }}
                          >
                            {formatSetNumber(setIndex, set.isWarmup, warmupCount)}
                          </span>
                          <span className="text-center font-number text-xs" style={{ color: "var(--color-text)" }}>
                            {set.reps ?? "—"}
                          </span>
                          {!isBodyweight && (
                            <span className="text-center font-number text-xs" style={{ color: "var(--color-text)" }}>
                              {set.weight != null ? `${set.weight}kg` : "—"}
                            </span>
                          )}
                          <span className="flex justify-end">
                            {set.isWarmup ? null : set.completed ? (
                              <Check size={14} style={{ color: "#22c55e" }} aria-hidden="true" />
                            ) : (
                              <X size={14} style={{ color: "#ff6b6b" }} aria-hidden="true" />
                            )}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </section>
          ) : (
            <section className="mt-5">
              <div
                className="rounded-[28px] p-5 text-center"
                style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
              >
                <p className="font-body text-sm" style={{ color: "var(--color-text-secondary)" }}>
                  Chi tiết từng set không khả dụng cho buổi tập cũ.
                </p>
                <p className="mt-1 font-body text-xs" style={{ color: "var(--color-text-secondary)" }}>
                  {entry.exercises.length} bài tập · {entry.completedSets} hiệp hoàn thành
                </p>
              </div>
            </section>
          )}
        </main>
        <BottomNav />
      </div>
    )
  }

  const summary = useMemo(() => {
    const history = state.workoutHistory
    const totalWorkouts = history.length
    const totalSets = history.reduce((sum, entry) => sum + entry.completedSets, 0)
    const totalVolume = history.reduce((sum, entry) => sum + entry.totalVolume, 0)
    const totalSeconds = history.reduce((sum, entry) => sum + entry.durationSeconds, 0)
    const maxSets = Math.max(1, ...history.slice(0, 7).map((entry) => entry.completedSets))
    return { totalWorkouts, totalSets, totalVolume, totalSeconds, maxSets }
  }, [state.workoutHistory])

  return (
    <div className="min-h-dvh" style={{ background: "var(--color-bg)", color: "var(--color-text)" }}>
      <TopHeader title="Thống kê" subtitle="Lịch sử tập luyện" />

      <main className="mx-auto w-full max-w-5xl px-4 pb-28 pt-5 md:px-6">
        {!state.workoutHistory.length ? (
          <section className="flex min-h-[65dvh] flex-col items-center justify-center text-center">
            <div
              className="mb-5 flex h-20 w-20 items-center justify-center rounded-[28px]"
              style={{ background: "rgba(var(--color-primary-rgb), 0.14)", border: "1px solid rgba(var(--color-primary-rgb), 0.28)" }}
            >
              <BarChart2 size={34} style={{ color: "var(--color-primary)" }} aria-hidden="true" />
            </div>
            <h1 className="font-display text-3xl font-extrabold">Chưa có thống kê</h1>
            <p className="mt-3 max-w-sm font-body text-sm leading-6" style={{ color: "var(--color-text-secondary)" }}>
              Hoàn thành một buổi tập để NextFit lưu thời lượng, số set và volume vào Local Storage.
            </p>
            <button
              type="button"
              onClick={() => router.push("/")}
              className="mt-7 min-h-14 w-full max-w-sm rounded-2xl font-heading font-bold"
              style={{ background: "var(--color-primary)", color: "#fff", boxShadow: "var(--shadow-glow)" }}
            >
              Bắt đầu buổi tập
            </button>
          </section>
        ) : (
          <div className="grid gap-5">
            <section
              className="rounded-[28px] p-5"
              style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
            >
              <p className="font-heading text-xs font-semibold uppercase tracking-[0.28em]" style={{ color: "var(--color-text-secondary)" }}>
                Tổng quan
              </p>
              <h1 className="mt-3 font-display text-4xl font-extrabold leading-none">Tiến trình đang lên nhịp.</h1>
              <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
                {[
                  { icon: Dumbbell, label: "Buổi tập", value: summary.totalWorkouts.toString() },
                  { icon: BarChart2, label: "Hiệp", value: summary.totalSets.toString() },
                  { icon: LineChart, label: "KL (kg)", value: Math.round(summary.totalVolume).toLocaleString("vi-VN") },
                  { icon: Clock3, label: "Thời gian", value: formatDuration(summary.totalSeconds) },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.04)" }}>
                    <Icon size={18} style={{ color: "var(--color-primary)" }} aria-hidden="true" />
                    <p className="mt-3 font-number text-xl" style={{ color: "var(--color-primary)" }}>
                      {value}
                    </p>
                    <p className="mt-1 font-body text-xs" style={{ color: "var(--color-text-secondary)" }}>
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section
              className="rounded-[28px] p-5"
              style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
            >
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="font-heading text-base font-semibold">7 buổi gần nhất</h2>
                    <p className="font-body text-xs" style={{ color: "var(--color-text-secondary)" }}>
                      Số hiệp hoàn tất mỗi buổi
                    </p>
                </div>
                <CalendarDays size={18} style={{ color: "var(--color-text-secondary)" }} aria-hidden="true" />
              </div>
              <div className="flex h-40 items-end gap-2">
                {state.workoutHistory.slice(0, 7).reverse().map((entry) => (
                  <div key={entry.id} className="flex flex-1 flex-col items-center gap-2">
                    <div className="flex h-32 w-full items-end rounded-2xl p-1" style={{ background: "rgba(255,255,255,0.04)" }}>
                      <div
                        className="w-full rounded-xl"
                        style={{
                          height: `${Math.max(14, (entry.completedSets / summary.maxSets) * 100)}%`,
                          background: "linear-gradient(180deg, var(--color-primary), rgba(var(--color-primary-rgb), 0.35))",
                        }}
                        aria-label={`${entry.completedSets} hiệp`}
                      />
                    </div>
                    <span className="font-number text-[10px]" style={{ color: "var(--color-text-secondary)" }}>
                      {entry.completedSets}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="mb-3 font-heading text-base font-semibold">Lịch sử gần đây</h2>
              <div className="grid gap-3">
                {state.workoutHistory.slice(0, 8).map((entry) => (
                  <Link
                    key={entry.id}
                    href={`/stats?id=${entry.id}`}
                    className="block rounded-[24px] p-4 transition-all active:scale-[0.98]"
                    style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-heading text-sm font-semibold">{entry.criteria?.goal ?? "Tập luyện"}</p>
                        <p className="mt-1 font-body text-xs" style={{ color: "var(--color-text-secondary)" }}>
                          {formatDate(entry.completedAt)} · {entry.exercises.length} bài
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <p className="font-number text-xs" style={{ color: "var(--color-primary)" }}>
                          {formatDuration(entry.durationSeconds)}
                        </p>
                        <ChevronRight size={14} style={{ color: "var(--color-text-secondary)" }} aria-hidden="true" />
                      </div>
                    </div>
                    <div className="mt-3 grid grid-cols-3 gap-2">
                      <div className="rounded-2xl p-3" style={{ background: "rgba(255,255,255,0.04)" }}>
                        <p className="font-number text-sm">{entry.completedSets}</p>
                        <p className="mt-1 font-body text-[11px]" style={{ color: "var(--color-text-secondary)" }}>
                          Hiệp
                        </p>
                      </div>
                      <div className="rounded-2xl p-3" style={{ background: "rgba(255,255,255,0.04)" }}>
                        <p className="font-number text-sm">{Math.round(entry.totalVolume).toLocaleString("vi-VN")}</p>
                        <p className="mt-1 font-body text-[11px]" style={{ color: "var(--color-text-secondary)" }}>
                          KL (kg)
                        </p>
                      </div>
                      <div className="rounded-2xl p-3" style={{ background: "rgba(255,255,255,0.04)" }}>
                        <p className="font-number text-sm">{entry.totalSets}</p>
                        <p className="mt-1 font-body text-[11px]" style={{ color: "var(--color-text-secondary)" }}>
                          Dự kiến
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  )
}
