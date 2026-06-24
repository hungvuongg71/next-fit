"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Plus, RotateCcw, History } from "lucide-react"
import { useApp } from "@/state/context"
import { Exercise } from "@/types"
import TopHeader from "@/components/layout/TopHeader"
import BottomNav from "@/components/layout/BottomNav"
import ExerciseCard from "@/components/ui/ExerciseCard"
import ExerciseModal from "@/components/ui/ExerciseModal"
import ExercisePicker from "@/components/ui/ExercisePicker"
import CookieConsent from "@/components/ui/CookieConsent"
import { MOCK_EXERCISES } from "@/lib/data"

function formatDate() {
  const now = new Date()
  const days = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"]
  const d = days[now.getDay()]
  const dd = String(now.getDate()).padStart(2, "0")
  const mm = String(now.getMonth() + 1).padStart(2, "0")
  return `${d} ${dd}/${mm}`
}

export default function HomePage() {
  const router = useRouter()
  const {
    state,
    setTodayExercises,
    removeExercise,
    resetTodayExercises,
    startWorkout,
  } = useApp()
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null)
  const [showPicker, setShowPicker] = useState(false)

  const lastWorkout = useMemo(() => {
    if (state.workoutHistory.length === 0) return null
    return state.workoutHistory.reduce((latest, entry) =>
      new Date(entry.completedAt) > new Date(latest.completedAt) ? entry : latest,
    )
  }, [state.workoutHistory])

  const handleAddExercises = (exercises: Exercise[]) => {
    setTodayExercises(exercises)
  }

  const handleLoadLastWorkout = () => {
    if (lastWorkout) {
      setTodayExercises(lastWorkout.exercises)
    }
  }

  const handleStartWorkout = () => {
    startWorkout()
    router.push("/workout")
  }

  const isEmpty = state.todayExercises.length === 0

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--color-bg)" }}>
      <TopHeader />
      <main
        className={`flex-1 px-4 pt-5 ${isEmpty ? "overflow-y-hidden pb-4" : "overflow-y-auto pb-36"}`}>
        <div className="mb-6">
          <h1
            className="font-display font-extrabold text-3xl leading-tight mb-1"
            style={{ color: "var(--color-text)" }}
          >
            Hôm nay bạn muốn tập gì?
          </h1>
          <p className="font-body text-sm" style={{ color: "var(--color-text-secondary)" }}>
            {isEmpty ? "Thêm bài tập để bắt đầu buổi tập" : `${state.todayExercises.length} bài tập · ${formatDate()}`}
          </p>
        </div>

        {/* Empty state */}
        {isEmpty && (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
              style={{ background: "rgba(var(--color-primary-rgb), 0.1)" }}
            >
              <Plus size={28} style={{ color: "var(--color-primary)" }} />
            </div>
            <p className="font-heading font-semibold text-lg mb-2 text-center" style={{ color: "var(--color-text)" }}>
              Chưa có bài tập nào
            </p>
            <p className="font-body text-sm mb-6 text-center max-w-xs" style={{ color: "var(--color-text-secondary)" }}>
              Thêm bài tập từ danh sách hoặc tải lại bài từ buổi tập gần nhất
            </p>
            <div className="flex flex-col gap-3 w-full max-w-sm">
              <button
                onClick={() => setShowPicker(true)}
                className="w-full py-3.5 rounded-2xl font-heading font-bold text-sm transition-all active:scale-[0.98]"
                style={{
                  background: "var(--color-primary)",
                  color: "#fff",
                  boxShadow: "0 0 20px rgba(var(--color-primary-rgb), 0.3)",
                }}
              >
                Thêm bài tập
              </button>
              {lastWorkout && (
                <button
                  onClick={handleLoadLastWorkout}
                  className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl font-heading font-semibold text-sm transition-all active:scale-[0.98]"
                  style={{
                    background: "var(--color-surface-subtle)",
                    color: "var(--color-text)",
                    border: "1px solid var(--color-border)",
                  }}
                >
                  <History size={16} />
                  Tải bài từ buổi trước
                </button>
              )}
            </div>
          </div>
        )}

        {/* Exercise list */}
        {!isEmpty && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-heading font-semibold text-base" style={{ color: "var(--color-text)" }}>
                    {state.todayExercises.length} Bài Tập Hôm Nay
                  </h2>
                </div>
              </div>
              <button
                onClick={resetTodayExercises}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-heading font-semibold transition-all duration-200 active:scale-95 hover:opacity-80"
                style={{ background: "var(--color-surface-subtle)", color: "var(--color-text-secondary)" }}
              >
                <RotateCcw size={12} />
                Xoá tất cả
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {state.todayExercises.map((ex, i) => (
                <ExerciseCard
                  key={ex.id}
                  exercise={ex}
                  index={i}
                  onView={setSelectedExercise}
                  onRemove={removeExercise}
                  showActions
                />
              ))}
            </div>
          </div>
        )}

        {/* Add exercise button (when not empty) */}
        {!isEmpty && (
          <button
            onClick={() => setShowPicker(true)}
            className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 font-heading font-semibold text-sm transition-all active:scale-[0.98]"
            style={{
              background: "var(--color-surface-subtle)",
              border: "1px dashed rgba(255,255,255,0.12)",
              color: "var(--color-text-secondary)",
            }}
          >
            <Plus size={16} />
            Thêm bài tập khác
          </button>
        )}
      </main>

      {/* Start Workout CTA */}
      {!isEmpty && (
        <div
          className="fixed bottom-[68px] left-0 right-0 px-4 pt-4 pb-3"
          style={{ background: "linear-gradient(to top, var(--color-bg) 50%, transparent)" }}
        >
          <button
            onClick={handleStartWorkout}
            className="w-full py-4 rounded-2xl font-heading font-bold text-base transition-all active:scale-[0.97]"
            style={{
              background: "var(--color-primary)",
              color: "#fff",
              boxShadow: "0 0 30px rgba(var(--color-primary-rgb), 0.35)",
            }}
          >
            Bắt Đầu Workout
          </button>
        </div>
      )}

      <BottomNav />
      {selectedExercise && (
        <ExerciseModal
          exercise={selectedExercise}
          onClose={() => setSelectedExercise(null)}
        />
      )}
      <ExercisePicker
        isOpen={showPicker}
        onClose={() => setShowPicker(false)}
        onAdd={handleAddExercises}
        selectedIds={new Set(state.todayExercises.map((e) => e.id))}
      />
      <CookieConsent />
    </div>
  )
}
