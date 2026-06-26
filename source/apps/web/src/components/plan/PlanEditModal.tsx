"use client"

import type { DayPlan, PlannedExercise } from "@/lib/weekly-plan/types"
import { X, Dumbbell } from "lucide-react"
import { MOCK_EXERCISES } from "@/lib/data"
import ExerciseThumbnail from "@/components/ui/ExerciseThumbnail"

interface PlanEditModalProps {
  day: DayPlan
  onClose: () => void
  onApplyToToday: (exercises: DayPlan) => void
  onRegenerateDay: () => void
}

const ROLE_LABELS: Record<string, string> = {
  mainCompound: "Main Compound",
  secondaryCompound: "Secondary",
  isolation: "Cô lập",
}

const ROLE_COLORS: Record<string, { bg: string; text: string }> = {
  mainCompound: { bg: "rgba(var(--color-primary-rgb), 0.12)", text: "var(--color-primary)" },
  secondaryCompound: { bg: "rgba(255, 200, 0, 0.12)", text: "#ffc800" },
  isolation: { bg: "rgba(255,255,255,0.06)", text: "var(--color-text-secondary)" },
}

export default function PlanEditModal({ day, onClose, onApplyToToday, onRegenerateDay }: PlanEditModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.6)" }} />
      <div
        className="relative z-10 w-full max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[85dvh] overflow-y-auto px-5 pt-6 pb-8"
        style={{ background: "var(--color-surface)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-display text-xl font-extrabold" style={{ color: "var(--color-text)" }}>
              {day.dayName}
            </h2>
            <p className="font-body text-sm mt-0.5" style={{ color: "var(--color-text-secondary)" }}>
              {day.exercises.length} bài tập
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl transition-all active:scale-90"
            style={{ background: "rgba(255,255,255,0.06)" }}
          >
            <X size={16} style={{ color: "var(--color-text-secondary)" }} />
          </button>
        </div>

        <div className="flex flex-col gap-3 mb-6">
          {day.exercises.map((ex) => (
            <PlannedExerciseCard key={ex.id} exercise={ex} />
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => onApplyToToday(day)}
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl font-heading font-bold text-sm transition-all active:scale-[0.98]"
            style={{
              background: "var(--color-primary)",
              color: "#fff",
              boxShadow: "0 0 20px rgba(var(--color-primary-rgb), 0.3)",
            }}
          >
            <Dumbbell size={16} />
            Chọn buổi tập này. BẮT ĐẦU!
          </button>
          <button
            onClick={onRegenerateDay}
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl font-heading font-semibold text-sm transition-all active:scale-[0.98]"
            style={{
              background: "rgba(255,255,255,0.06)",
              color: "var(--color-text)",
              border: "1px solid var(--color-border)",
            }}
          >
            Tạo lại ngày này
          </button>
        </div>
      </div>
    </div>
  )
}

function PlannedExerciseCard({ exercise }: { exercise: PlannedExercise }) {
  const original = MOCK_EXERCISES.find((e) => e.id === exercise.id)
  const color = ROLE_COLORS[exercise.role] ?? ROLE_COLORS.isolation

  return (
    <div className="flex items-center gap-3 rounded-2xl p-3" style={{ background: "rgba(255,255,255,0.04)" }}>
      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl">
        <ExerciseThumbnail exercise={original ?? exercise} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-heading font-semibold text-sm truncate" style={{ color: "var(--color-text)" }}>
          {exercise.name_vi || exercise.name}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span
            className="inline-block rounded-lg px-2 py-0.5 text-[10px] font-heading font-semibold"
            style={{ background: color.bg, color: color.text }}
          >
            {ROLE_LABELS[exercise.role] ?? exercise.role}
          </span>
          <span className="font-number text-xs" style={{ color: "var(--color-text-secondary)" }}>
            {exercise.plannedSets}×{exercise.plannedReps}
          </span>
          {exercise.suggestedWeight !== undefined && (
            <span className="font-number text-xs" style={{ color: "var(--color-text-secondary)" }}>
              · {exercise.suggestedWeight} kg
            </span>
          )}
        </div>
        <p className="font-body text-xs mt-0.5" style={{ color: "var(--color-text-secondary)" }}>
          Nghỉ {exercise.plannedRestSeconds}s
        </p>
      </div>
    </div>
  )
}
