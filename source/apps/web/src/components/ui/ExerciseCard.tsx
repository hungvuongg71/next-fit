"use client"

import { RefreshCw, X, ChevronRight } from "lucide-react"
import { Exercise } from "@/types"
import PlaceholderImage from "./PlaceholderImage"
import { THEME } from "@/lib/theme"

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
  return (
    <div
      className="flex items-center gap-3 p-3 rounded-2xl animate-fadeIn transition-all duration-200"
      style={{
        background: THEME.colors.bg.primary,
        border: `1px solid ${THEME.colors.border.subtle}`,
        animationDelay: `${index * 80}ms`,
        animationFillMode: "both",
      }}
    >
      {/* Placeholder image */}
      <button
        onClick={() => onView(exercise)}
        className="flex-shrink-0 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 focus-visible:ring-blue-400"
        aria-label={`View ${exercise.name} details`}
      >
        <PlaceholderImage className="w-16 rounded-xl" label="" style={{ height: "64px" } as React.CSSProperties} />
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
          style={{ color: THEME.colors.text.primary }}
        >
          {exercise.name}
        </p>
        <p className="font-body text-xs mb-1.5" style={{ color: THEME.colors.text.secondary }}>
          {exercise.muscleGroup} · {exercise.level}
        </p>
        <p className="font-body text-xs" style={{ color: THEME.colors.text.secondary }}>
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
              className="w-8 h-8 rounded-xl flex items-center justify-center transition-all active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 focus-visible:ring-blue-400"
              style={{
                background: THEME.colors.bg.subtle,
              }}
            >
              <RefreshCw size={14} style={{ color: THEME.colors.text.secondary }} aria-hidden="true" />
            </button>
          )}
          {onRemove && (
            <button
              onClick={() => onRemove(exercise.id)}
              aria-label="Remove exercise"
              className="w-8 h-8 rounded-xl flex items-center justify-center transition-all active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 focus-visible:ring-blue-400"
              style={{
                background: THEME.colors.bg.error,
              }}
            >
              <X size={14} style={{ color: "#FF007F" }} aria-hidden="true" />
            </button>
          )}
        </div>
      ) : (
        <button
          onClick={() => onView(exercise)}
          aria-label={`View ${exercise.name} details`}
          className="rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 focus-visible:ring-blue-400"
        >
          <ChevronRight size={18} style={{ color: THEME.colors.text.secondary }} aria-hidden="true" />
        </button>
      )}
    </div>
  )
}
