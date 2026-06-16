"use client"

import { useState, useEffect, useRef } from "react"
import { X, Play, Image as ImageIcon } from "lucide-react"
import { Exercise } from "@/types"
import { MOCK_EXERCISES } from "@/lib/data"

interface ExerciseModalProps {
  exercise: Exercise | null
  onClose: () => void
}

export default function ExerciseModal({ exercise, onClose }: ExerciseModalProps) {
  const [tab, setTab] = useState<"gif" | "video">("gif")
  const [imgErr, setImgErr] = useState(false)
  const [vidErr, setVidErr] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!exercise) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    closeButtonRef.current?.focus()

    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [exercise, onClose])

  useEffect(() => {
    setTab("gif")
    setImgErr(false)
    setVidErr(false)
  }, [exercise?.id])

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
        style={{ background: "var(--color-surface)" }}
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
            <p className="text-xs font-heading mb-1" style={{ color: "var(--color-text-secondary)" }}>
              {exercise.muscleGroup} • {exercise.level}
            </p>
            <h2
              id="exercise-title"
              className="font-display font-bold text-xl leading-tight"
              style={{ color: "var(--color-text)" }}
            >
              {exercise.name}
            </h2>
          </div>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            aria-label="Close exercise details"
            className="w-8 h-8 rounded-full flex items-center justify-center mt-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)] focus-visible:ring-[var(--color-primary)]"
            style={{
              background: "var(--color-surface-subtle)",
            }}
          >
            <X size={16} style={{ color: "var(--color-text-secondary)" }} aria-hidden="true" />
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
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-heading font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)] focus-visible:ring-[var(--color-primary)]"
                style={{
                  background: tab === t ? "var(--color-primary)" : "transparent",
                  color: tab === t ? "#fff" : "var(--color-text-secondary)",
                }}
              >
                {t === "gif" ? <ImageIcon size={14} aria-hidden="true" /> : <Play size={14} aria-hidden="true" />}
                {t === "gif" ? "Hình ảnh" : "Video"}
              </button>
            ))}
          </div>
          <div id="gif-panel" role="tabpanel" hidden={tab !== "gif"} aria-hidden={tab !== "gif"}>
            {exercise.image && !imgErr ? (
              <img
                src={exercise.image}
                alt={exercise.name}
                className="w-full rounded-2xl object-cover"
                style={{ height: "220px" }}
                onError={() => setImgErr(true)}
              />
            ) : (
              <div
                className="w-full rounded-2xl flex items-center justify-center"
                style={{
                  height: "220px",
                  background: "linear-gradient(135deg, var(--color-surface-2) 0%, var(--color-surface) 100%)",
                  border: "1px solid var(--color-border)",
                }}
              >
                <span className="font-heading text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>
                  Không có hình ảnh
                </span>
              </div>
            )}
          </div>
          <div id="video-panel" role="tabpanel" hidden={tab !== "video"} aria-hidden={tab !== "video"}>
            {exercise.video && !vidErr ? (
              <video
                src={exercise.video}
                controls
                className="w-full rounded-2xl"
                style={{ height: "220px" }}
                onError={() => setVidErr(true)}
              />
            ) : (
              <div
                className="w-full rounded-2xl flex items-center justify-center"
                style={{
                  height: "220px",
                  background: "linear-gradient(135deg, var(--color-surface-2) 0%, var(--color-surface) 100%)",
                  border: "1px solid var(--color-border)",
                }}
              >
                <span className="font-heading text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>
                  Không có video
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Section 2: Description */}
        <div className="px-5 mb-5">
          <h3 className="font-heading font-semibold text-sm mb-2" style={{ color: "var(--color-text-secondary)" }}>
            MÔ TẢ ĐỘNG TÁC
          </h3>
          <p className="font-body text-sm leading-relaxed" style={{ color: "var(--color-text)" }}>
            {exercise.description}
          </p>
          {exercise.trainer && (
            <p className="font-body text-xs mt-2" style={{ color: "var(--color-primary)" }}>
              Huấn luyện viên: {exercise.trainer}
            </p>
          )}
        </div>

        {/* Section 3: Related exercises */}
        {related.length > 0 && (
          <div className="px-5 pb-8">
            <h3 className="font-heading font-semibold text-sm mb-3" style={{ color: "var(--color-text-secondary)" }}>
              BÀI TẬP LIÊN QUAN
            </h3>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {related.map((ex) => (
                <button
                  key={ex.id}
                  onClick={() => {}} // Would navigate to that exercise
                  className="flex-shrink-0 w-28 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)] focus-visible:ring-[var(--color-primary)]"
                  aria-label={`View ${ex.name}`}
                >
                  {ex.image ? (
                    <img
                      src={ex.image}
                      alt={ex.name}
                      className="w-28 rounded-xl mb-2 object-cover"
                      style={{ height: "80px" }}
                    />
                  ) : (
                    <div
                      className="w-28 rounded-xl mb-2 flex items-center justify-center"
                      style={{
                        height: "80px",
                        background: "linear-gradient(135deg, var(--color-surface-2) 0%, var(--color-surface) 100%)",
                        border: "1px solid var(--color-border)",
                      }}
                    >
                      <span className="font-heading text-xs" style={{ color: "rgba(255,255,255,0.15)" }}>
                        {ex.muscleGroup}
                      </span>
                    </div>
                  )}
                  <p
                    className="font-heading text-xs font-semibold leading-tight"
                    style={{ color: "var(--color-text)" }}
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
