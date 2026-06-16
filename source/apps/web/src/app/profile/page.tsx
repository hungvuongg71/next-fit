"use client"

import { useRouter } from "next/navigation"
import { Activity, Clock3, Dumbbell, Settings2, User } from "lucide-react"
import BottomNav from "@/components/layout/BottomNav"
import TopHeader from "@/components/layout/TopHeader"
import ThemeSwitcher from "@/components/ui/ThemeSwitcher"
import { useApp } from "@/lib/context"

export default function ProfilePage() {
  const router = useRouter()
  const { state } = useApp()
  const criteria = state.criteria
  const latestWorkout = state.workoutHistory[0]

  const rows = [
    { label: "Giới tính", value: criteria?.gender ?? "Chưa chọn" },
    { label: "Trình độ", value: criteria?.level ?? "Chưa chọn" },
    { label: "Mục tiêu", value: criteria?.goal ?? "Chưa chọn" },
    { label: "Thời lượng", value: criteria?.duration ?? "Chưa chọn" },
    { label: "Tần suất", value: criteria?.frequency ?? "Chưa chọn" },
    { label: "Dụng cụ", value: criteria?.equipment.length ? criteria.equipment.join(", ") : "Chưa chọn" },
  ]

  return (
    <div className="min-h-dvh" style={{ background: "var(--color-bg)", color: "var(--color-text)" }}>
      <TopHeader title="Hồ sơ" subtitle="Tiêu chí & tùy chỉnh" />

      <main className="mx-auto grid w-full max-w-4xl gap-5 px-4 pb-28 pt-5 md:px-6">
        <section
          className="relative overflow-hidden rounded-[30px] p-5"
          style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
        >
          <div
            className="pointer-events-none absolute -right-14 -top-16 h-44 w-44 rounded-full blur-3xl"
            style={{ background: "rgba(var(--color-primary-rgb), 0.2)" }}
            aria-hidden="true"
          />
          <div className="relative flex items-center gap-4">
            <div
              className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[28px]"
              style={{ background: "rgba(var(--color-primary-rgb), 0.14)", border: "1px solid rgba(var(--color-primary-rgb), 0.28)" }}
            >
              <User size={34} style={{ color: "var(--color-primary)" }} aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <h1 className="font-display text-3xl font-extrabold leading-tight">Gymer NextFit</h1>
              <p className="mt-1 font-body text-sm" style={{ color: "var(--color-text-secondary)" }}>
                {criteria?.level ?? "Beginner"} · {criteria?.goal ?? "Strength"}
              </p>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-3 gap-3">
          {[
            { icon: Dumbbell, label: "Buổi tập", value: state.workoutHistory.length.toString() },
            { icon: Activity, label: "Hiệp", value: state.workoutHistory.reduce((sum, entry) => sum + entry.completedSets, 0).toString() },
            { icon: Clock3, label: "Gần nhất", value: latestWorkout ? `${Math.round(latestWorkout.durationSeconds / 60)}m` : "--" },
          ].map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="rounded-[24px] p-4"
              style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
            >
              <Icon size={18} style={{ color: "var(--color-primary)" }} aria-hidden="true" />
              <p className="mt-3 font-number text-lg" style={{ color: "var(--color-primary)" }}>
                {value}
              </p>
              <p className="mt-1 font-body text-[11px]" style={{ color: "var(--color-text-secondary)" }}>
                {label}
              </p>
            </div>
          ))}
        </section>

        <section
          className="rounded-[28px] p-5"
          style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
        >
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="font-heading text-base font-semibold">Thông tin tập luyện</h2>
              <p className="mt-1 font-body text-xs" style={{ color: "var(--color-text-secondary)" }}>
                Dữ liệu được lưu trong Local Storage.
              </p>
            </div>
            <button
              type="button"
              onClick={() => router.push("/")}
              className="flex min-h-11 items-center gap-2 rounded-2xl px-3 font-heading text-xs font-semibold transition-all active:scale-95"
              style={{ background: "rgba(var(--color-primary-rgb), 0.14)", color: "var(--color-primary)" }}
            >
              <Settings2 size={15} aria-hidden="true" />
              Chỉnh
            </button>
          </div>

          <div className="grid gap-1">
            {rows.map((row) => (
              <div
                key={row.label}
                className="flex items-start justify-between gap-4 py-3"
                style={{ borderBottom: "1px solid var(--color-border)" }}
              >
                <span className="font-body text-sm" style={{ color: "var(--color-text-secondary)" }}>
                  {row.label}
                </span>
                <span className="max-w-[58%] text-right font-heading text-sm font-semibold">{row.value}</span>
              </div>
            ))}
          </div>
        </section>

        <section
          className="rounded-[28px] p-5"
          style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
        >
          <ThemeSwitcher />
        </section>
      </main>

      <BottomNav />
    </div>
  )
}
