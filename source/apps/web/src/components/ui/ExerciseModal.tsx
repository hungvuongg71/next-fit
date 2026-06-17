"use client"

import { useState, useEffect, useRef } from "react"
import { X, Play, ChevronLeft } from "lucide-react"
import { Exercise } from "@/types"
import { MOCK_EXERCISES } from "@/lib/data"
import ExerciseThumbnail from "./ExerciseThumbnail"

interface ExerciseModalProps {
  exercise: Exercise | null
  onClose: () => void
  onReplace?: (newExercise: Exercise) => void
}

function getYouTubeEmbedUrl(url: string | undefined | null): string | null {
  if (!url) return null
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  )
  return match ? `https://www.youtube.com/embed/${match[1]}` : null
}

export default function ExerciseModal({ exercise, onClose, onReplace }: ExerciseModalProps) {
  const [showDetailVideo, setShowDetailVideo] = useState(false)
  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(exercise)
  const [history, setHistory] = useState<Exercise[]>([])
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
    setShowDetailVideo(false)
    if (exercise) {
      setCurrentExercise(exercise)
      setHistory([])
    }
  }, [exercise?.id])

  if (!exercise || !currentExercise) return null

  const handleBack = () => {
    if (history.length === 0) return
    const prev = history[history.length - 1]
    setHistory((h) => h.slice(0, -1))
    setCurrentExercise(prev)
  }

  const related = MOCK_EXERCISES.filter(
    (e) => e.id !== currentExercise.id && e.muscleGroup === currentExercise.muscleGroup,
  ).slice(0, 3)

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
          {history.length > 0 && (
            <button
              onClick={handleBack}
              aria-label="Quay lại"
              className="w-8 h-8 rounded-full flex items-center justify-center mt-1 mr-2 flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)] focus-visible:ring-[var(--color-primary)]"
              style={{ background: "var(--color-surface-subtle)" }}
            >
              <ChevronLeft size={16} style={{ color: "var(--color-text-secondary)" }} aria-hidden="true" />
            </button>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-heading mb-1" style={{ color: "var(--color-text-secondary)" }}>
              {currentExercise.muscleGroup_vi ?? currentExercise.muscleGroup} •{" "}
              {currentExercise.level_vi ?? currentExercise.level}
            </p>
            <h2
              id="exercise-title"
              className="font-display font-bold text-xl leading-tight truncate"
              style={{ color: "var(--color-text)" }}
            >
              {currentExercise.name}
            </h2>
          </div>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            aria-label="Close exercise details"
            className="w-8 h-8 rounded-full flex items-center justify-center mt-1 ml-2 flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)] focus-visible:ring-[var(--color-primary)]"
            style={{
              background: "var(--color-surface-subtle)",
            }}
          >
            <X size={16} style={{ color: "var(--color-text-secondary)" }} aria-hidden="true" />
          </button>
        </div>

        {/* Section 1: Video */}
        <div className="px-5 mb-5">
          {(() => {
            const gifEmbed = getYouTubeEmbedUrl(currentExercise.exerciseDbGif)
            const videoEmbed = getYouTubeEmbedUrl(currentExercise.video)
            const activeEmbed = showDetailVideo ? videoEmbed : gifEmbed
            const hasGif = !!gifEmbed
            const hasVideo = !!videoEmbed

            if (activeEmbed) {
              return (
                <div className="flex flex-col gap-3">
                  <iframe
                    src={activeEmbed}
                    title={currentExercise.name}
                    className="w-full rounded-2xl"
                    style={{ height: "220px" }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    key={showDetailVideo ? "detail" : "gif"}
                  />
                  {hasGif && hasVideo && (
                    <button
                      onClick={() => setShowDetailVideo((v) => !v)}
                      className="self-start px-3 py-1.5 rounded-xl font-heading font-semibold text-xs transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
                      style={{
                        background: "var(--color-surface-subtle)",
                        color: "var(--color-text-secondary)",
                      }}
                    >
                      {showDetailVideo ? "Xem video động tác ngắn" : "Xem video chi tiết"}
                    </button>
                  )}
                </div>
              )
            }

            return (
              <div
                className="w-full rounded-2xl flex flex-col items-center justify-center gap-3"
                style={{
                  height: "220px",
                  background: "linear-gradient(135deg, var(--color-surface-2) 0%, var(--color-surface) 100%)",
                  border: "1px solid var(--color-border)",
                }}
              >
                <Play size={36} style={{ color: "rgba(255,255,255,0.15)" }} aria-hidden="true" />
                <span className="font-heading text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>
                  Không có video
                </span>
              </div>
            )
          })()}
        </div>

        {/* Section 2: Description */}
        <div className="px-5 mb-5">
          <h3 className="font-heading font-semibold text-sm mb-2" style={{ color: "var(--color-text-secondary)" }}>
            MÔ TẢ ĐỘNG TÁC
          </h3>
          <p className="font-body text-sm leading-relaxed" style={{ color: "var(--color-text)" }}>
            {currentExercise.description}
          </p>
          {currentExercise.trainer && (
            <p className="font-body text-xs mt-2" style={{ color: "var(--color-primary)" }}>
              Huấn luyện viên: {currentExercise.trainer}
            </p>
          )}
        </div>

        {/* Section 3: Instructions (from ExerciseDB) */}
        {currentExercise.exerciseDbInstructions && currentExercise.exerciseDbInstructions.length > 0 && (
          <div className="px-5 mb-5">
            <h3 className="font-heading font-semibold text-sm mb-2" style={{ color: "var(--color-text-secondary)" }}>
              HƯỚNG DẪN THỰC HIỆN
            </h3>
            <ol className="space-y-2">
              {(currentExercise.exerciseDbInstructions_vi ?? currentExercise.exerciseDbInstructions).map((step, i) => (
                <li key={i} className="flex gap-2 font-body text-sm leading-relaxed" style={{ color: "var(--color-text)" }}>
                  <span
                    className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center font-number text-[10px] mt-0.5"
                    style={{ background: "rgba(var(--color-primary-rgb), 0.15)", color: "var(--color-primary)" }}
                  >
                    {i + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Section 4: Related exercises */}
        {related.length > 0 && (
          <div className="px-5 pb-6">
            <h3 className="font-heading font-semibold text-sm mb-3" style={{ color: "var(--color-text-secondary)" }}>
              BÀI TẬP LIÊN QUAN
            </h3>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {related.map((ex) => (
                <button
                  key={ex.id}
                  onClick={() => {
                    setHistory((prev) => [...prev, currentExercise])
                    setCurrentExercise(ex)
                  }}
                  className="flex-shrink-0 w-28 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)] focus-visible:ring-[var(--color-primary)]"
                  aria-label={`Xem ${ex.name}`}
                >
                  <ExerciseThumbnail
                    exercise={ex}
                    className="w-28 rounded-xl mb-2 object-cover"
                    style={{ height: "80px" }}
                  />
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

        {/* Replace button */}
        {onReplace && history.length > 0 && (
          <div className="px-5 pb-8">
            <button
              onClick={() => {
                onReplace(currentExercise)
                onClose()
              }}
              className="w-full py-3.5 rounded-2xl font-heading font-semibold text-sm transition-all active:scale-[0.98]"
              style={{ background: "var(--color-primary)", color: "#fff" }}
            >
              Thay &ldquo;{exercise.name}&rdquo; bằng &ldquo;{currentExercise.name}&rdquo;
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
