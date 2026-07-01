"use client"

import { useState, useEffect, useMemo, useCallback, type CSSProperties } from "react"
import { useRouter } from "next/navigation"
import { Plus, RefreshCw, Trash2, RotateCcw, GripVertical, ChevronUp, ChevronDown, Brain, CalendarDays, PencilLine } from "lucide-react"
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { useApp } from "@/state/context"
import type { Exercise, MuscleGroup } from "@/types"
import type { DayPlan } from "@/lib/weekly-plan/types"
import TopHeader from "@/components/layout/TopHeader"
import BottomNav from "@/components/layout/BottomNav"
import ExercisePicker from "@/components/ui/ExercisePicker"
import ExerciseModal from "@/components/ui/ExerciseModal"
import ExerciseThumbnail from "@/components/ui/ExerciseThumbnail"
import CookieConsent from "@/components/ui/CookieConsent"
import MuscleGroupSelector from "@/components/ui/MuscleGroupSelector"
import DailyExercise from "@/components/ui/DailyExercise"
import QuickStats from "@/components/ui/QuickStats"
import WorkoutBanner from "@/components/ui/WorkoutBanner"
import { MUSCLE_GROUPS } from "@/constants/muscles"
import { generateWeeklyPlan } from "@/lib/weekly-plan"
import { suggestExercises } from "@/lib/suggestions"
import { MOCK_EXERCISES } from "@/lib/data"
import { getDailyExercise, getMicroWorkout } from "@/lib/daily-recommendation"
import { getTotalWorkouts, getTotalVolume } from "@/lib/weekly-stats"

export default function HomePage() {
  const router = useRouter()
  const { state, setTodayExercises, startWorkout, setWeeklyPlan } = useApp()
  const [ready, setReady] = useState(false)
  const [selectedMuscles, setSelectedMuscles] = useState<MuscleGroup[]>([])
  const [suggestModeExercises, setSuggestModeExercises] = useState<Exercise[]>([])
  const [planExercises, setPlanExercises] = useState<Exercise[]>([])
  const [freeExercises, setFreeExercises] = useState<Exercise[]>([])
  const [suggestSaved, setSuggestSaved] = useState<Exercise[]>([])
  const [planSaved, setPlanSaved] = useState<Exercise[]>([])
  const [freeSaved, setFreeSaved] = useState<Exercise[]>([])
  const [showPicker, setShowPicker] = useState(false)
  const [viewingExercise, setViewingExercise] = useState<Exercise | null>(null)
  const [exerciseToRemove, setExerciseToRemove] = useState<Exercise | null>(null)
  const [dismissedWorkoutBanner, setDismissedWorkoutBanner] = useState(false)
  const [workoutMode, setWorkoutMode] = useState<"suggest" | "plan" | "free">("suggest")
  const [selectedPlanDayIndex, setSelectedPlanDayIndex] = useState<number | null>(null)

  const currentExercises = useMemo(() => {
    if (workoutMode === "suggest") return suggestModeExercises
    if (workoutMode === "plan") return planExercises
    return freeExercises
  }, [workoutMode, suggestModeExercises, planExercises, freeExercises])

  const currentSaved = useMemo(() => {
    if (workoutMode === "suggest") return suggestSaved
    if (workoutMode === "plan") return planSaved
    return freeSaved
  }, [workoutMode, suggestSaved, planSaved, freeSaved])

  function updateExercises(fn: (prev: Exercise[]) => Exercise[]) {
    if (workoutMode === "suggest") setSuggestModeExercises(fn)
    else if (workoutMode === "plan") setPlanExercises(fn)
    else setFreeExercises(fn)
  }

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
    if (selectedMuscles.length === 0) {
      setSuggestModeExercises([])
      setSuggestSaved([])
      return
    }
    const exercises = suggestExercises(selectedMuscles, state.criteria?.equipment, 10, 2)
    setSuggestModeExercises(exercises)
    setSuggestSaved(exercises)
  }, [selectedMuscles])

  const recentExerciseIds = useMemo(() => {
    const ids = new Set<string>()
    const weekAgo = Date.now() - 7 * 86400000
    for (const entry of state.workoutHistory) {
      if (new Date(entry.completedAt).getTime() < weekAgo) continue
      for (const ex of entry.exercises) {
        ids.add(ex.id)
      }
    }
    return ids
  }, [state.workoutHistory])

  const dailyExercise = useMemo(() => {
    if (!state.criteria) return null
    const dateSeed = new Date().toISOString().slice(0, 10)
    return getDailyExercise(MOCK_EXERCISES, state.criteria, recentExerciseIds, dateSeed)
  }, [state.criteria, recentExerciseIds])

  const microWorkout = useMemo(() => {
    if (!state.criteria) return []
    return getMicroWorkout(MOCK_EXERCISES, state.criteria, 3)
  }, [state.criteria])

  const handleStartWorkout = () => {
    if (currentExercises.length === 0) return
    setTodayExercises(currentExercises)
    startWorkout()
    router.push("/workout")
    setSuggestModeExercises([])
    setPlanExercises([])
    setFreeExercises([])
    setSuggestSaved([])
    setPlanSaved([])
    setFreeSaved([])
  }

  const handleAddExercises = (exercises: Exercise[]) => {
    updateExercises((prev) => {
      const existingIds = new Set(prev.map((e) => e.id))
      const newExercises = exercises.filter((e) => !existingIds.has(e.id))
      return [...prev, ...newExercises]
    })
  }

  const handleReplaceExercise = (index: number, newEx: Exercise) => {
    updateExercises((prev) => prev.map((ex, i) => (i === index ? newEx : ex)))
  }

  const handleRemoveExercise = (ex: Exercise) => {
    updateExercises((prev) => prev.filter((e) => e.id !== ex.id))
    setExerciseToRemove(null)
  }

  const handleMoveUp = useCallback((index: number) => {
    if (index === 0) return
    updateExercises((prev) => {
      const arr = [...prev]
      ;[arr[index - 1], arr[index]] = [arr[index], arr[index - 1]]
      return arr
    })
  }, [workoutMode])

  const handleMoveDown = useCallback((index: number) => {
    updateExercises((prev) => {
      if (index >= prev.length - 1) return prev
      const arr = [...prev]
      ;[arr[index], arr[index + 1]] = [arr[index + 1], arr[index]]
      return arr
    })
  }, [workoutMode])

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    updateExercises((prev) => {
      const oldIndex = prev.findIndex((e) => e.id === active.id)
      const newIndex = prev.findIndex((e) => e.id === over.id)
      if (oldIndex === -1 || newIndex === -1) return prev
      const arr = [...prev]
      const [moved] = arr.splice(oldIndex, 1)
      arr.splice(newIndex, 0, moved)
      return arr
    })
  }, [workoutMode])

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  const handleLoadPlanDay = useCallback((day: DayPlan, index: number) => {
    setPlanExercises([...day.exercises])
    setPlanSaved([...day.exercises])
    setSelectedPlanDayIndex(index)
  }, [])

  const handleUndo = () => {
    if (workoutMode === "suggest") setSuggestModeExercises([...suggestSaved])
    else if (workoutMode === "plan") setPlanExercises([...planSaved])
    else setFreeExercises([])
  }

  const hasChanges = useMemo(() => {
    if (currentExercises.length !== currentSaved.length) return true
    return currentExercises.some((ex, i) => ex.id !== currentSaved[i]?.id)
  }, [currentExercises, currentSaved])

  const [selectedReplaceIndex, setSelectedReplaceIndex] = useState<number | null>(null)
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  const handleResetMode = () => {
    if (workoutMode === "suggest") { setSuggestModeExercises([]); setSuggestSaved([]) }
    else if (workoutMode === "plan") { setPlanExercises([]); setPlanSaved([]); setSelectedPlanDayIndex(null) }
    else { setFreeExercises([]); setFreeSaved([]) }
    setShowResetConfirm(false)
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--color-bg)" }}>
      <TopHeader />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-4xl px-4 pt-5 pb-24">
          {/* Resume banner */}
          {state.workoutStarted && !dismissedWorkoutBanner && (
            <div className="mb-4">
              <WorkoutBanner onDismiss={() => setDismissedWorkoutBanner(true)} />
            </div>
          )}

          {/* Zone 1: Today's Pick */}
          {dailyExercise && (
            <section className="mb-6">
              <DailyExercise
                exercise={dailyExercise}
                microWorkout={microWorkout.length > 0 ? microWorkout : undefined}
                onStartMicro={(exercises) => {
                  setTodayExercises(exercises)
                  startWorkout()
                  router.push("/workout")
                }}
                onAdd={(ex) => {
                  updateExercises((prev) =>
                    prev.some((e) => e.id === ex.id) ? prev : [...prev, ex],
                  )
                  setSelectedMuscles((prev) =>
                    prev.includes(ex.target_muscle_group as MuscleGroup)
                      ? prev
                      : [...prev, ex.target_muscle_group as MuscleGroup],
                  )
                }}
                onView={(ex) => setViewingExercise(ex)}
              />
            </section>
          )}

          {/* Stats */}
          <div className="mb-6">
            <QuickStats history={state.workoutHistory} />
          </div>

          {/* Zone 2: Build Your Workout */}
          <section className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="font-display text-base font-extrabold" style={{ color: "var(--color-text)" }}>
                🏋️ Xây dựng bài tập
              </h2>
            </div>

            {/* Mode switcher */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {([
                { key: "suggest" as const, icon: Brain, label: "Gợi ý", desc: "Chọn nhóm cơ" },
                { key: "plan" as const, icon: CalendarDays, label: "Giáo án", desc: "Theo lịch tuần" },
                { key: "free" as const, icon: PencilLine, label: "Tự chọn", desc: "Thêm bài tập" },
              ]).map((mode) => {
                const isActive = workoutMode === mode.key
                return (
                  <button
                    key={mode.key}
                    onClick={() => setWorkoutMode(mode.key)}
                    className="flex flex-col items-center gap-1 rounded-2xl p-3 transition-all active:scale-[0.97]"
                    style={{
                      background: isActive ? "rgba(var(--color-primary-rgb), 0.1)" : "var(--color-surface)",
                      border: `1px solid ${isActive ? "var(--color-primary)" : "var(--color-border)"}`,
                    }}
                  >
                    <mode.icon size={16} style={{ color: isActive ? "var(--color-primary)" : "var(--color-text-secondary)" }} aria-hidden="true" />
                    <span className="font-heading text-[11px] font-semibold" style={{ color: isActive ? "var(--color-primary)" : "var(--color-text)" }}>
                      {mode.label}
                    </span>
                    <span className="font-body text-[9px]" style={{ color: "var(--color-text-secondary)" }}>
                      {mode.desc}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Mode: Gợi ý */}
            {workoutMode === "suggest" && (
              <div className="mb-4">
                <MuscleGroupSelector selected={selectedMuscles} onChange={setSelectedMuscles} gender={state.criteria?.gender} />
              </div>
            )}

            {/* Mode: Giáo án */}
            {workoutMode === "plan" && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-heading font-semibold text-xs" style={{ color: "var(--color-text-secondary)" }}>
                    📅 Giáo án tuần
                  </h3>
                  <button
                    onClick={() => router.push("/plan")}
                    className="font-body text-xs transition-all hover:opacity-70"
                    style={{ color: "var(--color-primary)" }}
                  >
                    Chi tiết
                  </button>
                </div>
                {state.weeklyPlan ? (
                  <div className="flex flex-wrap gap-2">
                    {state.weeklyPlan.days.map((day, i) => {
                      const dayOfWeek = new Date().getDay()
                      const todayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1
                      const isToday = i === todayIndex % state.weeklyPlan!.days.length
                      const isSelected = selectedPlanDayIndex === i
                      return (
                        <button
                          key={i}
                          onClick={() => handleLoadPlanDay(day, i)}
                          className="flex-1 min-w-[70px] rounded-2xl px-3 py-2.5 text-left transition-all active:scale-[0.98]"
                          style={{
                            background: isSelected ? "rgba(var(--color-primary-rgb), 0.15)" : isToday ? "rgba(var(--color-primary-rgb), 0.08)" : "var(--color-surface)",
                            border: `1px solid ${isSelected ? "var(--color-primary)" : isToday ? "var(--color-primary)" : "var(--color-border)"}`,
                          }}
                        >
                          <p className="font-heading font-semibold text-xs" style={{ color: "var(--color-text)" }}>
                            {day.dayName}
                          </p>
                          <p className="font-number text-[10px] mt-0.5" style={{ color: "var(--color-text-secondary)" }}>
                            {day.exercises.length} bài
                          </p>
                          {isToday && (
                            <span
                              className="inline-block mt-1 text-[8px] font-heading font-bold px-1.5 py-0.5 rounded"
                              style={{ background: "var(--color-primary)", color: "#fff" }}
                            >
                              HÔM NAY
                            </span>
                          )}
                        </button>
                      )
                    })}
                  </div>
                ) : (
                  <p className="font-body text-sm" style={{ color: "var(--color-text-secondary)" }}>
                    Chưa có giáo án. Hãy hoàn thành onboarding để nhận lịch tập cá nhân hóa.
                  </p>
                )}
              </div>
            )}

            {/* Mode: Tự chọn */}
            {workoutMode === "free" && (
              <div className="mb-4">
                <button
                  onClick={() => setShowPicker(true)}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl py-4 font-heading text-sm font-semibold transition-all active:scale-[0.97]"
                  style={{
                    background: "var(--color-surface)",
                    border: "1px dashed var(--color-border)",
                    color: "var(--color-text-secondary)",
                  }}
                >
                  <PencilLine size={16} aria-hidden="true" />
                  Mở danh sách bài tập
                </button>
              </div>
            )}

            {workoutMode === "suggest" && selectedMuscles.length === 0 && currentExercises.length === 0 && (
              <div className="mb-4 text-center py-8">
                <Brain size={24} className="mx-auto mb-3 opacity-40" style={{ color: "var(--color-text-secondary)" }} aria-hidden="true" />
                <p className="font-body text-sm" style={{ color: "var(--color-text-secondary)" }}>
                  Chọn nhóm cơ bên trên để nhận gợi ý bài tập
                </p>
              </div>
            )}

            {currentExercises.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-heading font-semibold text-xs" style={{ color: "var(--color-text-secondary)" }}>
                    {workoutMode === "suggest" ? "Bài tập gợi ý" : workoutMode === "plan" ? "Bài tập giáo án" : "Bài tập của tôi"} ({currentExercises.length})
                  </h3>
                  <div className="flex items-center gap-2">
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
                    {currentExercises.length > 0 && (
                      <button
                        onClick={() => setShowResetConfirm(true)}
                        className="flex items-center gap-1 rounded-xl px-3 py-1.5 font-heading text-[10px] font-semibold transition-all active:scale-95"
                        style={{ background: "rgba(214,69,69,0.12)", color: "#D64545" }}
                      >
                        <Trash2 size={10} aria-hidden="true" />
                        Xoá hết
                      </button>
                    )}
                  </div>
                </div>
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext items={currentExercises.map((e) => e.id)} strategy={verticalListSortingStrategy}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {currentExercises.map((ex, i) => (
                        <SortableExerciseCard
                          key={ex.id}
                          exercise={ex}
                          index={i}
                          total={currentExercises.length}
                          onView={() => setViewingExercise(ex)}
                          onReplace={() => setSelectedReplaceIndex(i)}
                          onRemove={() => setExerciseToRemove(ex)}
                          onMoveUp={() => handleMoveUp(i)}
                          onMoveDown={() => handleMoveDown(i)}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>

                <button
                  onClick={() => setShowPicker(true)}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 font-heading text-xs font-semibold transition-all active:scale-[0.98]"
                  style={{
                    background: "var(--color-surface-subtle)",
                    border: "1px dashed var(--color-border)",
                    color: "var(--color-text-secondary)",
                  }}
                >
                  <Plus size={14} aria-hidden="true" />
                  Thêm bài tập
                </button>

                <button
                  onClick={handleStartWorkout}
                  className="mt-4 w-full py-4 rounded-2xl font-heading font-bold text-base transition-all active:scale-[0.97]"
                  style={{
                    background: "var(--color-primary)",
                    color: "#fff",
                    boxShadow: "0 0 30px rgba(var(--color-primary-rgb), 0.35)",
                  }}
                >
                  Bắt Đầu Workout ({currentExercises.length} bài)
                </button>
              </div>
            )}
          </section>
        </div>
      </main>

      <BottomNav />
      {viewingExercise && <ExerciseModal exercise={viewingExercise} onClose={() => setViewingExercise(null)} />}
      <ExercisePicker
        isOpen={showPicker}
        onClose={() => setShowPicker(false)}
        onAdd={handleAddExercises}
        selectedIds={new Set(currentExercises.map((e) => e.id))}
      />
      {selectedReplaceIndex !== null && (
        <ExercisePicker
          isOpen
          onClose={() => setSelectedReplaceIndex(null)}
          onAdd={() => {}}
          replaceMode={{
            exerciseId: currentExercises[selectedReplaceIndex].id,
            muscleGroup: currentExercises[selectedReplaceIndex].target_muscle_group,
          }}
          onReplace={(_, newEx) => {
            handleReplaceExercise(selectedReplaceIndex, newEx)
            setSelectedReplaceIndex(null)
          }}
        />
      )}
      {exerciseToRemove && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 px-4 pb-5"
          role="dialog"
          aria-modal="true"
          aria-labelledby="remove-exercise-title"
        >
          <div
            className="w-full max-w-md rounded-[28px] p-5 animate-slideUp"
            style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl"
                style={{ background: "rgba(214,69,69,0.14)" }}
              >
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
      {showResetConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 px-4 pb-5"
          role="dialog"
          aria-modal="true"
          aria-labelledby="reset-mode-title"
        >
          <div
            className="w-full max-w-md rounded-[28px] p-5 animate-slideUp"
            style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl"
                style={{ background: "rgba(214,69,69,0.14)" }}
              >
                <Trash2 size={20} style={{ color: "#D64545" }} aria-hidden="true" />
              </div>
              <h2 id="reset-mode-title" className="font-display text-2xl font-extrabold">
                Xoá tất cả?
              </h2>
            </div>
            <p className="font-body text-sm leading-6" style={{ color: "var(--color-text-secondary)" }}>
              Bạn có chắc muốn xoá toàn bộ bài tập trong chế độ này?
            </p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="min-h-12 rounded-2xl font-heading font-semibold transition-all active:scale-95"
                style={{ background: "var(--color-surface-subtle)", color: "var(--color-text)" }}
              >
                Huỷ
              </button>
              <button
                type="button"
                onClick={handleResetMode}
                className="min-h-12 rounded-2xl font-heading font-semibold transition-all active:scale-95"
                style={{ background: "#D64545", color: "#fff" }}
              >
                Xoá hết
              </button>
            </div>
          </div>
        </div>
      )}
      <CookieConsent />
    </div>
  )
}

interface SortableExerciseCardProps {
  exercise: Exercise
  index: number
  total: number
  onView: () => void
  onReplace: () => void
  onRemove: () => void
  onMoveUp: () => void
  onMoveDown: () => void
}

function SortableExerciseCard({
  exercise,
  index,
  total,
  onView,
  onReplace,
  onRemove,
  onMoveUp,
  onMoveDown,
}: SortableExerciseCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: exercise.id })
  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    position: "relative",
    zIndex: isDragging ? 10 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 rounded-2xl p-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
      role="button"
      tabIndex={0}
      onClick={onView}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onView()
        }
      }}
    >
      <div className="flex flex-col items-center gap-0.5 self-stretch justify-center" onClick={(e) => e.stopPropagation()}>
        <button
          {...attributes}
          {...listeners}
          aria-label="Kéo để sắp xếp"
          className="hidden lg:flex items-center justify-center w-5 h-5 rounded touch-none cursor-grab active:cursor-grabbing hover:opacity-70 transition-opacity"
        >
          <GripVertical size={13} style={{ color: "var(--color-text-secondary)"}} aria-hidden="true" />
        </button>
        <button
          onClick={onMoveUp}
          disabled={index === 0}
          aria-label="Di chuyển lên"
          className="lg:hidden flex items-center justify-center w-5 h-4 rounded hover:opacity-70 transition-opacity disabled:opacity-20"
        >
          <ChevronUp size={10} style={{ color: "var(--color-text-secondary)"}} aria-hidden="true" />
        </button>
        <button
          onClick={onMoveDown}
          disabled={index === total - 1}
          aria-label="Di chuyển xuống"
          className="lg:hidden flex items-center justify-center w-5 h-4 rounded hover:opacity-70 transition-opacity disabled:opacity-20"
        >
          <ChevronDown size={10} style={{ color: "var(--color-text-secondary)"}} aria-hidden="true" />
        </button>
      </div>

      <div className="rounded-lg overflow-hidden shrink-0">
        <ExerciseThumbnail exercise={exercise} className="w-10 h-10 object-cover" />
      </div>

      <div className="min-w-0 flex-1 pointer-events-none">
        <p className="font-heading text-xs font-semibold truncate" style={{ color: "var(--color-text)" }}>
          {exercise.name}
        </p>
        <p className="font-body text-[10px]" style={{ color: "var(--color-text-secondary)" }}>
          {exercise.primary_equipment} · {exercise.target_muscle_group}
        </p>
      </div>

      <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          onClick={onReplace}
          aria-label="Thay thế bài tập"
          className="flex h-7 w-7 items-center justify-center rounded-lg transition-all active:scale-90"
          style={{ background: "rgba(var(--color-primary-rgb), 0.08)", color: "var(--color-primary)" }}
        >
          <RefreshCw size={11} aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={onRemove}
          aria-label="Xóa bài tập"
          className="flex h-7 w-7 items-center justify-center rounded-lg transition-all active:scale-90"
          style={{ background: "rgba(214,69,69,0.12)", color: "#ff6b6b" }}
        >
          <Trash2 size={11} aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
