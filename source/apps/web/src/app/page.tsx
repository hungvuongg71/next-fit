"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Calendar, Plus, RefreshCw, Trash2, RotateCcw } from "lucide-react"
import { useApp } from "@/state/context"
import type { Exercise, MuscleGroup } from "@/types"
import type { DayPlan } from "@/lib/weekly-plan/types"
import TopHeader from "@/components/layout/TopHeader"
import BottomNav from "@/components/layout/BottomNav"
import PlanEditModal from "@/components/plan/PlanEditModal"
import ExercisePicker from "@/components/ui/ExercisePicker"
import ExerciseModal from "@/components/ui/ExerciseModal"
import ExerciseThumbnail from "@/components/ui/ExerciseThumbnail"
import CookieConsent from "@/components/ui/CookieConsent"
import MuscleGroupSelector from "@/components/ui/MuscleGroupSelector"
import { generateWeeklyPlan } from "@/lib/weekly-plan"
import { suggestExercises } from "@/lib/suggestions"

export default function HomePage() {
  const router = useRouter()
  const { state, setTodayExercises, startWorkout, setWeeklyPlan } = useApp()
  const [selectedPlanDay, setSelectedPlanDay] = useState<DayPlan | null>(null)
  const [ready, setReady] = useState(false)
  const [selectedMuscles, setSelectedMuscles] = useState<MuscleGroup[]>([])
  const [suggestedExercises, setSuggestedExercises] = useState<Exercise[]>([])
  const [savedSuggestions, setSavedSuggestions] = useState<Exercise[]>([])
  const [showPicker, setShowPicker] = useState(false)
  const [viewingExercise, setViewingExercise] = useState<Exercise | null>(null)
  const [exerciseToRemove, setExerciseToRemove] = useState<Exercise | null>(null)

  useEffect(() => {
    if (state.criteria && !state.weeklyPlan) {
      const plan = generateWeeklyPlan(state.criteria)
      setWeeklyPlan(plan)
    }
  }, [state.criteria, state.weeklyPlan, setWeeklyPlan])

  useEffect(() => {
    setReady(true)
  }, [])

  useEffect(() => {
    if (ready && state.isFirstVisit && !state.criteria) {
      router.replace("/onboarding")
    }
  }, [ready, state.isFirstVisit, state.criteria, router])

  useEffect(() => {
    if (selectedMuscles.length > 0) {
      const exercises = suggestExercises(selectedMuscles, 6)
      setSuggestedExercises(exercises)
      setSavedSuggestions(exercises)
    } else {
      setSuggestedExercises([])
      setSavedSuggestions([])
    }
  }, [selectedMuscles])

  const handleConfirmPlanDay = (day: DayPlan) => {
    setTodayExercises(day.exercises.map((e) => ({
      ...e,
      sets: e.plannedSets,
      reps: e.plannedReps,
      restSeconds: e.plannedRestSeconds,
    })))
    setSelectedPlanDay(null)
    startWorkout()
    router.push("/workout")
  }

  const handleStartWorkout = () => {
    if (suggestedExercises.length === 0) return
    setTodayExercises(suggestedExercises)
    startWorkout()
    router.push("/workout")
  }

  const handleAddExercises = (exercises: Exercise[]) => {
    setSuggestedExercises((prev) => [...prev, ...exercises])
  }

  const handleReplaceExercise = (index: number, newEx: Exercise) => {
    setSuggestedExercises((prev) => prev.map((ex, i) => (i === index ? newEx : ex)))
  }

  const handleRemoveExercise = (ex: Exercise) => {
    setSuggestedExercises((prev) => prev.filter((e) => e.id !== ex.id))
    setExerciseToRemove(null)
  }

  const handleUndo = () => {
    setSuggestedExercises([...savedSuggestions])
  }

  const hasChanges = useMemo(() => {
    if (suggestedExercises.length !== savedSuggestions.length) return true
    return suggestedExercises.some((ex, i) => ex.id !== savedSuggestions[i]?.id)
  }, [suggestedExercises, savedSuggestions])

  const [selectedReplaceIndex, setSelectedReplaceIndex] = useState<number | null>(null)

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--color-bg)" }}>
      <TopHeader />
      <main className="flex-1 overflow-y-auto px-4 pt-5 pb-36">
        <div className="mb-6">
          <h1
            className="font-display font-extrabold text-3xl leading-tight mb-1"
            style={{ color: "var(--color-text)" }}
          >
            Bạn muốn tập nhóm cơ nào?
          </h1>
          <p className="font-body text-sm" style={{ color: "var(--color-text-secondary)" }}>
            Chọn nhóm cơ để nhận bài tập gợi ý
          </p>
        </div>

        <section className="mb-6">
          <MuscleGroupSelector
            selected={selectedMuscles}
            onChange={setSelectedMuscles}
          />
        </section>

        {suggestedExercises.length > 0 && (
          <section className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-heading font-semibold text-sm" style={{ color: "var(--color-text-secondary)" }}>
                Bài tập gợi ý ({suggestedExercises.length})
              </h2>
              {hasChanges && (
                <button
                  onClick={handleUndo}
                  className="flex items-center gap-1 rounded-xl px-3 py-1.5 font-heading text-[10px] font-semibold transition-all active:scale-95"
                  style={{ background: "rgba(var(--color-primary-rgb), 0.08)", color: "var(--color-primary)" }}
                >
                  <RotateCcw size={10} aria-hidden="true" />
                  Hoàn tác
                </button>
              )}
            </div>
            <div className="flex flex-col gap-3">
              {suggestedExercises.map((ex, i) => (
                <div
                  key={`${ex.id}-${i}`}
                  onClick={() => setViewingExercise(ex)}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setViewingExercise(ex) } }}
                  role="button"
                  tabIndex={0}
                  className="flex cursor-pointer items-center gap-3 rounded-2xl p-3 transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
                  style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
                >
                  <div className="shrink-0 rounded-xl overflow-hidden">
                    <ExerciseThumbnail exercise={ex} className="w-12 h-12 object-cover" />
                  </div>
                  <div className="min-w-0 flex-1 pointer-events-none">
                    <p className="font-heading text-sm font-semibold truncate" style={{ color: "var(--color-text)" }}>
                      {ex.name}
                    </p>
                    <p className="font-body text-[11px] mt-0.5" style={{ color: "var(--color-text-secondary)" }}>
                      {ex.equipment} · {ex.muscleGroup_vi ?? ex.muscleGroup}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => {
                        const group = ex.muscleGroup as MuscleGroup
                        setSelectedReplaceIndex(i)
                      }}
                      aria-label="Thay thế bài tập"
                      className="flex h-7 w-7 items-center justify-center rounded-lg transition-all active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
                      style={{ background: "rgba(var(--color-primary-rgb), 0.08)", color: "var(--color-primary)" }}
                    >
                      <RefreshCw size={12} aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setExerciseToRemove(ex)}
                      aria-label="Xóa bài tập"
                      className="flex h-7 w-7 items-center justify-center rounded-lg transition-all active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
                      style={{ background: "rgba(214,69,69,0.12)", color: "#ff6b6b" }}
                    >
                      <Trash2 size={12} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowPicker(true)}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 font-heading text-xs font-semibold transition-all active:scale-[0.98]"
              style={{ background: "var(--color-surface-subtle)", border: "1px dashed var(--color-border)", color: "var(--color-text-secondary)" }}
            >
              <Plus size={14} aria-hidden="true" />
              Thêm bài tập
            </button>
          </section>
        )}

        {/* Weekly plan */}
        {state.weeklyPlan && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-heading font-semibold text-sm" style={{ color: "var(--color-text-secondary)" }}>
                Giáo án tuần
              </h2>
              <button
                onClick={() => router.push("/plan")}
                className="font-body text-xs transition-all hover:opacity-70"
                style={{ color: "var(--color-primary)" }}
              >
                Chi tiết
              </button>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {state.weeklyPlan.days.map((day, i) => {
                const dayOfWeek = new Date().getDay()
                const todayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1
                const isToday = i === (todayIndex % state.weeklyPlan!.days.length)
                return (
                  <button
                    key={i}
                    onClick={() => setSelectedPlanDay(day)}
                    className="shrink-0 rounded-2xl px-4 py-3 text-left transition-all active:scale-[0.98]"
                    style={{
                      background: isToday ? "rgba(var(--color-primary-rgb), 0.1)" : "var(--color-surface)",
                      border: `1px solid ${isToday ? "var(--color-primary)" : "var(--color-border)"}`,
                      minWidth: 130,
                    }}
                  >
                    <p className="font-heading font-semibold text-xs mb-0.5" style={{ color: "var(--color-text)" }}>
                      {day.dayName}
                    </p>
                    <p className="font-number text-xs" style={{ color: "var(--color-text-secondary)" }}>
                      {day.exercises.length} bài
                    </p>
                    {isToday && (
                      <span
                        className="inline-block mt-1 text-[9px] font-heading font-bold px-1.5 py-0.5 rounded"
                        style={{ background: "var(--color-primary)", color: "#fff" }}
                      >
                        HÔM NAY
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </section>
        )}
      </main>

      {/* Bottom CTA */}
      {suggestedExercises.length > 0 && (
        <div
          className="fixed bottom-[68px] left-0 right-0 z-30 px-4 pb-4 pt-3"
          style={{ background: "linear-gradient(to top, var(--color-bg) 70%, transparent)" }}
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
            Bắt Đầu Workout ({suggestedExercises.length} bài)
          </button>
        </div>
      )}

      <BottomNav />
      {viewingExercise && (
        <ExerciseModal exercise={viewingExercise} onClose={() => setViewingExercise(null)} />
      )}
      <ExercisePicker
        isOpen={showPicker}
        onClose={() => setShowPicker(false)}
        onAdd={handleAddExercises}
        selectedIds={new Set(suggestedExercises.map((e) => e.id))}
      />
      {selectedReplaceIndex !== null && (
        <ExercisePicker
          isOpen
          onClose={() => setSelectedReplaceIndex(null)}
          onAdd={() => {}}
          replaceMode={{
            exerciseId: suggestedExercises[selectedReplaceIndex].id,
            muscleGroup: suggestedExercises[selectedReplaceIndex].muscleGroup,
          }}
          onReplace={(_, newEx) => {
            handleReplaceExercise(selectedReplaceIndex, newEx)
            setSelectedReplaceIndex(null)
          }}
        />
      )}
      {exerciseToRemove && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 px-4 pb-5" role="dialog" aria-modal="true" aria-labelledby="remove-exercise-title">
          <div className="w-full max-w-md rounded-[28px] p-5 animate-slideUp" style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl" style={{ background: "rgba(214,69,69,0.14)" }}>
                <Trash2 size={20} style={{ color: "#D64545" }} aria-hidden="true" />
              </div>
              <h2 id="remove-exercise-title" className="font-display text-2xl font-extrabold">
                Xóa bài tập?
              </h2>
            </div>
            <p className="font-body text-sm leading-6" style={{ color: "var(--color-text-secondary)" }}>
              Bạn có chắc muốn xóa &quot;{exerciseToRemove.name}&quot; khỏi danh sách?
            </p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setExerciseToRemove(null)}
                className="min-h-12 rounded-2xl font-heading font-semibold transition-all active:scale-95"
                style={{ background: "var(--color-surface-subtle)", color: "var(--color-text)" }}
              >
                Giữ lại
              </button>
              <button
                type="button"
                onClick={() => handleRemoveExercise(exerciseToRemove)}
                className="min-h-12 rounded-2xl font-heading font-semibold transition-all active:scale-95"
                style={{ background: "#D64545", color: "#fff" }}
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
      {selectedPlanDay && (
        <PlanEditModal
          day={selectedPlanDay}
          onClose={() => setSelectedPlanDay(null)}
          onApplyToToday={(day) => handleConfirmPlanDay(day)}
          onRegenerateDay={() => {
            if (state.criteria) {
              const newPlan = generateWeeklyPlan(state.criteria)
              setWeeklyPlan(newPlan)
              setSelectedPlanDay(null)
            }
          }}
        />
      )}
      <CookieConsent />
    </div>
  )
}
