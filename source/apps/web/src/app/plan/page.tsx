"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { RefreshCw, Check, ChevronDown, ChevronUp, Dumbbell, ArrowLeft } from "lucide-react"
import { useApp } from "@/state/context"
import TopHeader from "@/components/layout/TopHeader"
import BottomNav from "@/components/layout/BottomNav"
import { generateWeeklyPlan } from "@/lib/weekly-plan"
import { TEMPLATES } from "@/lib/weekly-plan/templates"
import type { SplitTemplate } from "@/lib/weekly-plan/types"
import templateData from "@/data/templates.json"

interface TemplateMeta {
  id: string
  name_vi: string
  daysPerWeek: number
  description: string
  preview: string
}

const POPULAR_TEMPLATES: SplitTemplate[] = ["FullBody", "UpperLower", "PPL"]

export default function PlanPage() {
  const router = useRouter()
  const { state, setWeeklyPlan, setTodayExercises } = useApp()
  const [selectedTemplate, setSelectedTemplate] = useState<SplitTemplate | null>(null)
  const [applying, setApplying] = useState(false)

  const plan = state.weeklyPlan
  const meta = templateData as TemplateMeta[]

  function getMeta(id: string): TemplateMeta | undefined {
    return meta.find((m) => m.id === id)
  }

  async function handleApply(templateId: SplitTemplate) {
    if (!state.criteria) return
    setApplying(true)
    const newPlan = generateWeeklyPlan(state.criteria, templateId)
    setWeeklyPlan(newPlan)
    setApplying(false)
    router.push("/")
  }

  const TEMPLATE_NAMES_VI: Record<string, string> = {
    FullBody: "Toàn thân",
    UpperLower: "Trên / Dưới",
    PPL: "Đẩy / Kéo / Chân",
    BroSplit: "Chia nhóm cơ",
    PushPull: "Đẩy / Kéo",
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--color-bg)" }}>
      <TopHeader title="Giáo án tuần" />
      <main className="flex-1 overflow-y-auto px-4 pt-5 pb-36">
        {/* Current plan info */}
        {plan && (
          <section
            className="mb-6 rounded-2xl p-4"
            style={{ background: "rgba(var(--color-primary-rgb), 0.08)", border: "1px solid var(--color-primary)" }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-body text-xs" style={{ color: "var(--color-text-secondary)" }}>
                  Giáo án hiện tại
                </p>
                <p className="font-heading font-semibold text-base mt-0.5" style={{ color: "var(--color-text)" }}>
                  {TEMPLATE_NAMES_VI[plan.template] ?? plan.template}
                </p>
                <p className="font-body text-xs mt-0.5" style={{ color: "var(--color-text-secondary)" }}>
                  {plan.days.length} buổi/tuần · Tạo {new Date(plan.generatedAt).toLocaleDateString("vi-VN")}
                </p>
              </div>
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl"
                style={{ background: "var(--color-primary)" }}
              >
                <Check size={18} color="white" aria-hidden="true" />
              </div>
            </div>
          </section>
        )}

        {/* Template browser */}
        <section className="mb-6">
          <h2 className="font-display text-xl font-extrabold mb-1" style={{ color: "var(--color-text)" }}>
            {plan ? "Chọn giáo án khác" : "Chọn giáo án"}
          </h2>
          <p className="font-body text-sm mb-4" style={{ color: "var(--color-text-secondary)" }}>
            {plan ? "Đổi sang giáo án khác phù hợp với mục tiêu của bạn." : "Chọn một giáo án để bắt đầu tuần tập của bạn."}
          </p>

          <div className="flex flex-col gap-3">
            {POPULAR_TEMPLATES.map((id) => {
              const m = getMeta(id)
              const config = TEMPLATES[id]
              const isSelected = selectedTemplate === id

              return (
                <div key={id}>
                  <button
                    type="button"
                    onClick={() => setSelectedTemplate(isSelected ? null : id)}
                    className="w-full text-left rounded-2xl p-4 transition-all active:scale-[0.99]"
                    style={{
                      background: isSelected ? "rgba(var(--color-primary-rgb), 0.1)" : "var(--color-surface)",
                      border: `1px solid ${isSelected ? "var(--color-primary)" : "var(--color-border)"}`,
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-heading font-semibold text-base" style={{ color: "var(--color-text)" }}>
                          {m?.name_vi ?? id}
                        </p>
                        <p className="font-body text-xs mt-1" style={{ color: "var(--color-text-secondary)" }}>
                          {m?.preview ?? config.days.length + " buổi/tuần"}
                        </p>
                      </div>
                      {isSelected ? (
                        <ChevronUp size={18} style={{ color: "var(--color-primary)" }} />
                      ) : (
                        <ChevronDown size={18} style={{ color: "var(--color-text-secondary)" }} />
                      )}
                    </div>
                  </button>

                  {/* Template detail (expanded) */}
                  {isSelected && m && (
                    <div
                      className="rounded-2xl p-4 mt-1"
                      style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
                    >
                      <p className="font-body text-sm leading-6 mb-4" style={{ color: "var(--color-text-secondary)" }}>
                        {m.description}
                      </p>

                      <p className="font-heading text-xs font-semibold mb-3 uppercase tracking-wider" style={{ color: "var(--color-text-secondary)" }}>
                        Các buổi trong tuần
                      </p>

                      <div className="flex flex-col gap-2 mb-5">
                        {config.days.map((day, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between rounded-xl px-3.5 py-2.5"
                            style={{ background: "rgba(255,255,255,0.04)" }}
                          >
                            <div className="flex items-center gap-3">
                              <span
                                className="flex h-6 w-6 items-center justify-center rounded-lg font-number text-xs font-bold"
                                style={{ background: "rgba(var(--color-primary-rgb), 0.12)", color: "var(--color-primary)" }}
                              >
                                {i + 1}
                              </span>
                              <span className="font-heading text-sm font-semibold" style={{ color: "var(--color-text)" }}>
                                {day.name}
                              </span>
                            </div>
                            <span className="font-body text-xs" style={{ color: "var(--color-text-secondary)" }}>
                              {day.targetMuscleGroups.join(", ")}
                            </span>
                          </div>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleApply(id)}
                        disabled={applying}
                        className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl font-heading font-bold text-sm transition-all active:scale-[0.98] disabled:opacity-50"
                        style={{
                          background: "var(--color-primary)",
                          color: "#fff",
                          boxShadow: "0 0 20px rgba(var(--color-primary-rgb), 0.3)",
                        }}
                      >
                        <Dumbbell size={16} />
                        {applying ? "Đang áp dụng..." : "Áp dụng giáo án"}
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </section>

        {/* Quick link: current plan days (if plan exists) */}
        {plan && !selectedTemplate && (
          <section>
            <div className="flex flex-col gap-2">
              {plan.days.map((day, i) => {
                const dayOfWeek = new Date().getDay()
                const todayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1
                const isToday = i === (todayIndex % plan.days.length)
                return (
                  <button
                    key={i}
                    onClick={() => {
                      setTodayExercises(day.exercises.map((e) => ({
                        ...e,
                        sets: e.plannedSets,
                        reps: e.plannedReps,
                        restSeconds: e.plannedRestSeconds,
                      })))
                      router.push("/workout")
                    }}
                    className="w-full text-left rounded-2xl p-4 transition-all active:scale-[0.99]"
                    style={{
                      background: isToday ? "rgba(var(--color-primary-rgb), 0.08)" : "var(--color-surface)",
                      border: `1px solid ${isToday ? "var(--color-primary)" : "var(--color-border)"}`,
                    }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-heading font-semibold text-sm" style={{ color: "var(--color-text)" }}>
                        {day.dayName}
                      </p>
                      {isToday && (
                        <span
                          className="text-[10px] font-heading font-bold px-2 py-0.5 rounded-lg"
                          style={{ background: "var(--color-primary)", color: "#fff" }}
                        >
                          HÔM NAY
                        </span>
                      )}
                    </div>
                    <p className="font-body text-xs" style={{ color: "var(--color-text-secondary)" }}>
                      {day.exercises.length} bài · {day.targetMuscleGroups.join(", ")}
                    </p>
                  </button>
                )
              })}
            </div>
          </section>
        )}
      </main>

      <BottomNav />
    </div>
  )
}
