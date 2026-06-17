"use client"

import { useState } from "react"
import { RefreshCw, X, ChevronRight } from "lucide-react"
import { Exercise } from "@/types"
import ExerciseThumbnail from "./ExerciseThumbnail"

interface ExerciseCardProps {
  exercise: Exercise
  index: number
  onView: (ex: Exercise) => void
  onRemove?: (id: string) => void
  onReplace?: (id: string) => void
  showActions?: boolean
}

export default function ExerciseCard({
  exercise,
  index,
  onView,
  onRemove,
  onReplace,
  showActions = true,
}: ExerciseCardProps) {
  const [imgErr, setImgErr] = useState(false)

  return (
    <div
      className="flex items-center gap-3 p-3 rounded-2xl animate-fadeIn transition-all duration-200"
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        animationDelay: `${index * 80}ms`,
        animationFillMode: "both",
      }}
    >
      {/* Image */}
      <button
        onClick={() => onView(exercise)}
        className="relative flex-shrink-0 w-16 h-16 overflow-hidden rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)] focus-visible:ring-[var(--color-primary)]"
        aria-label={`View ${exercise.name} details`}
      >
        {!imgErr ? (
          <ExerciseThumbnail
            exercise={exercise}
            className="h-full w-full object-cover"
            onError={() => setImgErr(true)}
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center" style={{ background: "var(--color-surface)" }}>
            <span className="text-[10px] font-heading" style={{ color: "rgba(255,255,255,0.15)" }}>No img</span>
          </div>
        )}
      </button>

      {/* Info */}
      <div
        className="flex-1 min-w-0 cursor-pointer rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 px-1"
        onClick={() => onView(exercise)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            onView(exercise)
          }
        }}
      >
        <p
          className="font-heading font-semibold text-sm leading-tight mb-0.5 truncate"
          style={{ color: "var(--color-text)" }}
        >
          {exercise.name}
        </p>
        <p className="font-body text-xs mb-1.5" style={{ color: "var(--color-text-secondary)" }}>
          {exercise.muscleGroup_vi ?? exercise.muscleGroup} · {exercise.level_vi ?? exercise.level}
        </p>
        <p className="font-body text-xs" style={{ color: "var(--color-text-secondary)" }}>
          {exercise.sets} Sets · {exercise.reps} Reps · {exercise.restSeconds}s Rest
        </p>
      </div>

      {/* Actions */}
      {showActions ? (
        <div className="flex flex-col gap-2 flex-shrink-0">
          {onReplace && (
            <button
              onClick={() => onReplace(exercise.id)}
              aria-label="Replace exercise"
              className="w-8 h-8 rounded-xl flex items-center justify-center transition-all active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)] focus-visible:ring-[var(--color-primary)]"
              style={{
                background: "var(--color-surface-subtle)",
              }}
            >
              <RefreshCw size={14} style={{ color: "var(--color-text-secondary)" }} aria-hidden="true" />
            </button>
          )}
          {onRemove && (
            <button
              onClick={() => onRemove(exercise.id)}
              aria-label="Remove exercise"
              className="w-8 h-8 rounded-xl flex items-center justify-center transition-all active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)] focus-visible:ring-[var(--color-primary)]"
              style={{
                background: "rgba(214,69,69,0.12)",
              }}
            >
              <X size={14} style={{ color: "#ff6b6b" }} aria-hidden="true" />
            </button>
          )}
        </div>
      ) : (
        <button
          onClick={() => onView(exercise)}
          aria-label={`View ${exercise.name} details`}
          className="rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)] focus-visible:ring-[var(--color-primary)]"
        >
          <ChevronRight size={18} style={{ color: "var(--color-text-secondary)" }} aria-hidden="true" />
        </button>
      )}
    </div>
  )
}
