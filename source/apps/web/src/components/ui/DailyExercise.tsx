"use client"

import { Sparkles, Plus, Zap, Play } from "lucide-react"
import { Exercise } from "@/types"
import ExerciseThumbnail from "./ExerciseThumbnail"

interface DailyExerciseProps {
  exercise: Exercise
  onAdd: (ex: Exercise) => void
  onView: (ex: Exercise) => void
  microWorkout?: Exercise[]
  onStartMicro?: (exercises: Exercise[]) => void
}

export default function DailyExercise({ exercise, onAdd, onView, microWorkout, onStartMicro }: DailyExerciseProps) {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
      }}
    >
      <div className="flex items-center gap-2 px-4 pt-4 pb-0">
        <Sparkles size={14} style={{ color: "var(--color-primary)" }} aria-hidden="true" />
        <h2 className="font-display text-base font-extrabold" style={{ color: "var(--color-text)" }}>
          Gợi ý hôm nay
        </h2>
      </div>

      <div className="p-4">
        <button
          onClick={() => onView(exercise)}
          className="flex w-full items-center gap-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] rounded-xl transition-all active:scale-[0.99]"
          aria-label={`Xem chi tiết ${exercise.name}`}
        >
          <div className="shrink-0 rounded-xl overflow-hidden">
            <ExerciseThumbnail exercise={exercise} className="w-16 h-16 object-cover" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-heading font-semibold text-sm truncate" style={{ color: "var(--color-text)" }}>
              {exercise.name}
            </h3>
            <p className="font-body text-xs mt-0.5" style={{ color: "var(--color-text-secondary)" }}>
              {exercise.target_muscle_group} · {exercise.difficulty_level} · {exercise.primary_equipment}
            </p>
          </div>
        </button>

        <button
          onClick={() => onAdd(exercise)}
          className="mt-3 w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-heading text-xs font-semibold transition-all active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
          style={{ background: "rgba(var(--color-primary-rgb), 0.08)", color: "var(--color-primary)" }}
        >
          <Plus size={13} aria-hidden="true" />
          Thêm vào danh sách
        </button>
      </div>

      {microWorkout && microWorkout.length > 0 && onStartMicro && (
        <div
          className="mx-4 mb-4 rounded-xl p-3"
          style={{
            background: "linear-gradient(135deg, rgba(var(--color-primary-rgb), 0.06) 0%, rgba(var(--color-primary-rgb), 0.02) 100%)",
            border: "1px solid rgba(var(--color-primary-rgb), 0.1)",
          }}
        >
          <div className="flex items-center gap-1.5 mb-2">
            <Zap size={12} style={{ color: "var(--color-primary)" }} aria-hidden="true" />
            <span className="font-heading text-[10px] font-semibold" style={{ color: "var(--color-primary)" }}>
              HOẶC TẬP NHANH {microWorkout.length} BÀI · ~15p
            </span>
          </div>
          <div className="flex flex-col gap-1.5 mb-2">
            {microWorkout.map((ex, i) => (
              <button
                key={ex.id}
                onClick={() => onView(ex)}
                className="flex items-center gap-2 rounded-lg p-1.5 text-left transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
              >
                <span
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[9px] font-heading font-bold"
                  style={{ background: "var(--color-primary)", color: "#fff" }}
                >
                  {i + 1}
                </span>
                <span className="font-heading text-[11px] font-semibold truncate" style={{ color: "var(--color-text)" }}>
                  {ex.name}
                </span>
                <span className="font-body text-[10px] ml-auto shrink-0" style={{ color: "var(--color-text-secondary)" }}>
                  {ex.target_muscle_group}
                </span>
              </button>
            ))}
          </div>
          <button
            onClick={() => onStartMicro(microWorkout)}
            className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg font-heading text-[11px] font-semibold transition-all active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
            style={{ background: "var(--color-primary)", color: "#fff" }}
          >
            <Play size={12} aria-hidden="true" />
            Bắt đầu ngay
          </button>
        </div>
      )}
    </div>
  )
}
