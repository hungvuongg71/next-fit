"use client"

import { useState, useEffect, useRef } from "react"
import { X, Play, Image as ImageIcon } from "lucide-react"
import { Exercise } from "@/types"
import PlaceholderImage from "./PlaceholderImage"
import { MOCK_EXERCISES } from "@/lib/data"
import { THEME } from "@/lib/theme"

interface ExerciseModalProps {
  exercise: Exercise | null
  onClose: () => void
}

export default function ExerciseModal({ exercise, onClose }: ExerciseModalProps) {
  const [tab, setTab] = useState<"gif" | "video">("gif")
  const modalRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!exercise) return

    // Handle Escape key
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    // Focus close button
    closeButtonRef.current?.focus()

    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [exercise, onClose])

  if (!exercise) return null

  const related = MOCK_EXERCISES.filter((e) => e.id !== exercise.id && e.muscleGroup === exercise.muscleGroup).slice(
    0,
    3,
  )

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ background: "rgba(0,0,0,0.85)" }}
      onClick={onClose}
      role="presentation"
    >
      <div
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-t-3xl animate-slideUp"
        style={{ background: THEME.colors.bg.primary }}
        onClick={(e) => e.stopPropagation()}
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="exercise-title"
      >
        {/* Handle */}
        <div className="flex justify-center pt-4 pb-2" aria-hidden="true">
          <div className="w-10 h-1 rounded-full" style={{ background: "rgba(255,255,255,0.15)" }} />
        </div>

        {/* Header */}
        <div className="flex items-start justify-between px-5 pb-4">
          <div>
            <p className="text-xs font-heading mb-1" style={{ color: THEME.colors.text.secondary }}>
              {exercise.muscleGroup} • {exercise.level}
            </p>
            <h2
              id="exercise-title"
              className="font-display font-bold text-xl leading-tight"
              style={{ color: THEME.colors.text.primary }}
            >
              {exercise.name}
            </h2>
          </div>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            aria-label="Close exercise details"
            className="w-8 h-8 rounded-full flex items-center justify-center mt-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 focus-visible:ring-blue-400"
            style={{
              background: THEME.colors.bg.subtle,
            }}
          >
            <X size={16} style={{ color: THEME.colors.text.secondary }} aria-hidden="true" />
          </button>
        </div>

        {/* Section 1: Tabs */}
        <div className="px-5 mb-5">
          <div className="flex rounded-xl p-1 mb-3" style={{ background: "rgba(255,255,255,0.04)" }} role="tablist">
            {(["gif", "video"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                role="tab"
                aria-selected={tab === t}
                aria-controls={`${t}-panel`}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-heading font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 focus-visible:ring-blue-400"
                style={{
                  background: tab === t ? THEME.colors.primary : "transparent",
                  color: tab === t ? "#fff" : THEME.colors.text.secondary,
                }}
              >
                {t === "gif" ? <ImageIcon size={14} aria-hidden="true" /> : <Play size={14} aria-hidden="true" />}
                {t === "gif" ? "Hình ảnh GIF" : "Video"}
              </button>
            ))}
          </div>
          <div id="gif-panel" role="tabpanel" hidden={tab !== "gif"} aria-hidden={tab !== "gif"}>
            <PlaceholderImage
              aspectRatio=""
              className="w-full rounded-2xl"
              label="GIF động tác"
              style={{ height: "220px" } as React.CSSProperties}
            />
          </div>
          <div id="video-panel" role="tabpanel" hidden={tab !== "video"} aria-hidden={tab !== "video"}>
            <PlaceholderImage
              aspectRatio=""
              className="w-full rounded-2xl"
              label="Video hướng dẫn"
              style={{ height: "220px" } as React.CSSProperties}
            />
          </div>
        </div>

        {/* Section 2: Description */}
        <div className="px-5 mb-5">
          <h3 className="font-heading font-semibold text-sm mb-2" style={{ color: THEME.colors.text.secondary }}>
            MÔ TẢ ĐỘNG TÁC
          </h3>
          <p className="font-body text-sm leading-relaxed" style={{ color: THEME.colors.text.primary }}>
            {exercise.description}
          </p>
          {exercise.trainer && (
            <p className="font-body text-xs mt-2" style={{ color: THEME.colors.primary }}>
              Huấn luyện viên: {exercise.trainer}
            </p>
          )}
        </div>

        {/* Section 3: Related exercises */}
        {related.length > 0 && (
          <div className="px-5 pb-8">
            <h3 className="font-heading font-semibold text-sm mb-3" style={{ color: THEME.colors.text.secondary }}>
              BÀI TẬP LIÊN QUAN
            </h3>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {related.map((ex) => (
                <button
                  key={ex.id}
                  onClick={() => {}} // Would navigate to that exercise
                  className="flex-shrink-0 w-28 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 focus-visible:ring-blue-400"
                  aria-label={`View ${ex.name}`}
                >
                  <PlaceholderImage
                    aspectRatio=""
                    className="w-28 rounded-xl mb-2"
                    label={ex.muscleGroup}
                    style={{ height: "80px" } as React.CSSProperties}
                  />
                  <p
                    className="font-heading text-xs font-semibold leading-tight"
                    style={{ color: THEME.colors.text.primary }}
                  >
                    {ex.name}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
