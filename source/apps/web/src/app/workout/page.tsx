"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Check, ChevronLeft, Dumbbell, Minus, Pause, Play, Plus, Trophy, AlertTriangle } from "lucide-react"
import ExerciseModal from "@/components/ui/ExerciseModal"
import NumberPickerWheel from "@/components/ui/NumberPickerWheel"
import RestTimer from "@/components/ui/RestTimer"
import { useApp } from "@/lib/context"
import ExerciseThumbnail from "@/components/ui/ExerciseThumbnail"
import { Exercise, ExerciseLogEntry, ExerciseProgress, MuscleGroup } from "@/types"
import { STORAGE_KEYS } from "@/lib/constants"
import { suggestNextWeight, getLogsForExercise } from "@/lib/progressive"
import WarmupSection from "@/components/ui/WarmupSection"
import ProgressChart from "@/components/ui/ProgressChart"

function formatElapsed(seconds: number) {
  const minutes = Math.floor(seconds / 60)
  const rest = seconds % 60
  return `${String(minutes).padStart(2, "0")}:${String(rest).padStart(2, "0")}`
}

function buildProgress(exercises: Exercise[]): ExerciseProgress[] {
  return exercises.map((exercise) => ({
    exercise,
    currentSet: 0,
    completed: false,
    sets: Array.from({ length: exercise.sets }, () => ({ reps: null, weight: null, completed: false })),
  }))
}

export default function WorkoutPage() {
  const router = useRouter()
  const { state, updateExerciseProgress, completeWorkout, resetWorkout, startWorkout } = useApp()
  const lastPerf = state.lastPerformances
  const [isPaused, setIsPaused] = useState(false)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null)
  const [showCompleted, setShowCompleted] = useState(false)
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)
  const cancelDialogRef = useRef<HTMLDivElement>(null)
  const continueBtnRef = useRef<HTMLButtonElement>(null)
  const [exerciseLogs, setExerciseLogs] = useState<Record<string, ExerciseLogEntry[]>>(() => {
    if (typeof window === "undefined") return {}
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.EXERCISE_LOGS)
      return raw ? JSON.parse(raw) : {}
    } catch {
      return {}
    }
  })
  const [restState, setRestState] = useState<{
    active: boolean
    exerciseName: string
    setNumber: number
    restSeconds: number
  }>({ active: false, exerciseName: "", setNumber: 0, restSeconds: 60 })

  const progress = useMemo(() => {
    if (state.exerciseProgress.length) return state.exerciseProgress
    return buildProgress(state.todayExercises)
  }, [state.exerciseProgress, state.todayExercises])

  useEffect(() => {
    if (!state.workoutStarted && !state.exerciseProgress.length) return
    if (!state.exerciseProgress.length && state.todayExercises.length) {
      updateExerciseProgress(buildProgress(state.todayExercises))
    }
  }, [state.exerciseProgress.length, state.todayExercises, state.workoutStarted, updateExerciseProgress])

  useEffect(() => {
    if (isPaused || showCompleted || !state.workoutStarted) return
    const timer = window.setInterval(() => setElapsedSeconds((seconds) => seconds + 1), 1000)
    return () => window.clearInterval(timer)
  }, [isPaused, showCompleted, state.workoutStarted])

  useEffect(() => {
    if (state.workoutStarted && !showCompleted) {
      const handler = (e: BeforeUnloadEvent) => {
        e.preventDefault()
        e.returnValue = ""
      }
      window.addEventListener("beforeunload", handler)
      return () => window.removeEventListener("beforeunload", handler)
    }
  }, [state.workoutStarted, showCompleted])

  useEffect(() => {
    if (!state.todayExercises.length && !showCompleted) {
      router.replace("/")
    }
  }, [state.todayExercises.length, showCompleted, router])

  useEffect(() => {
    if (showCancelConfirm) {
      continueBtnRef.current?.focus()
      const handleKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") setShowCancelConfirm(false)
      }
      document.addEventListener("keydown", handleKey)
      return () => document.removeEventListener("keydown", handleKey)
    }
  }, [showCancelConfirm])

  const totals = useMemo(() => {
    const totalSets = progress.reduce((sum, item) => sum + item.sets.length, 0)
    const completedSets = progress.reduce((sum, item) => sum + item.sets.filter((set) => set.completed).length, 0)
    const totalVolume = progress.reduce(
      (sum, item) =>
        sum +
        item.sets.reduce((setSum, set) => {
          if (!set.completed) return setSum
          return setSum + (set.reps ?? 0) * (set.weight ?? 0)
        }, 0),
      0,
    )
    return {
      totalSets,
      completedSets,
      totalVolume,
      progressPct: totalSets ? Math.round((completedSets / totalSets) * 100) : 0,
      allCompleted: totalSets > 0 && completedSets === totalSets,
    }
  }, [progress])

  const replaceProgress = (next: ExerciseProgress[]) => updateExerciseProgress(next)

  const updateSet = (
    exerciseIndex: number,
    setIndex: number,
    field: "reps" | "weight" | "completed",
    value: number | boolean | null,
  ) => {
    replaceProgress(
      progress.map((item, itemIndex) => {
        if (itemIndex !== exerciseIndex) return item
        const sets = item.sets.map((set, currentSetIndex) => {
          if (currentSetIndex !== setIndex) return set
          if (field !== "completed" && set.completed) {
            return { ...set, [field]: value, completed: false }
          }
          return { ...set, [field]: value }
        })
        return {
          ...item,
          sets,
          currentSet: sets.findIndex((set) => !set.completed) === -1 ? sets.length - 1 : sets.findIndex((set) => !set.completed),
          completed: sets.every((set) => set.completed),
        }
      }),
    )
  }

  const addSet = (exerciseIndex: number) => {
    replaceProgress(
      progress.map((item, itemIndex) =>
        itemIndex === exerciseIndex
          ? { ...item, sets: [...item.sets, { reps: null, weight: null, completed: false }] }
          : item,
      ),
    )
  }

  const removeSet = (exerciseIndex: number, setIndex: number) => {
    replaceProgress(
      progress.map((item, itemIndex) => {
        if (itemIndex !== exerciseIndex) return item
        const sets = item.sets.filter((_, i) => i !== setIndex)
        return {
          ...item,
          sets,
          currentSet: sets.findIndex((s) => !s.completed) === -1 ? sets.length - 1 : sets.findIndex((s) => !s.completed),
          completed: sets.every((s) => s.completed),
        }
      }),
    )
  }

  const handleCheckSet = (exerciseIndex: number, setIndex: number) => {
    updateSet(exerciseIndex, setIndex, "completed", true)
    const exercise = progress[exerciseIndex].exercise
    setRestState({
      active: true,
      exerciseName: exercise.name,
      setNumber: setIndex + 1,
      restSeconds: exercise.restSeconds,
    })
  }

  const saveExerciseLogs = () => {
    const newLogs = { ...exerciseLogs }
    for (const item of progress) {
      const isBw = item.exercise.equipment === "Bodyweight"
      const completedSets = item.sets.filter((s) => s.completed && s.reps !== null && (isBw || s.weight !== null))
      if (completedSets.length === 0) continue
      const best = completedSets.reduce((max, s) =>
        (s.weight ?? 0) > (max.weight ?? 0) ? s : max,
      )
      const entry: ExerciseLogEntry = {
        date: new Date().toISOString().split("T")[0],
        weight: best.weight ?? 0,
        reps: best.reps!,
        sets: completedSets.length,
      }
      const existing = newLogs[item.exercise.id] ?? []
      existing.push(entry)
      newLogs[item.exercise.id] = existing
    }
    localStorage.setItem(STORAGE_KEYS.EXERCISE_LOGS, JSON.stringify(newLogs))
    setExerciseLogs(newLogs)
  }

  const handleComplete = () => {
    completeWorkout(elapsedSeconds, progress)
    saveExerciseLogs()
    setShowCompleted(true)
  }

  const handleCancel = () => {
    resetWorkout()
    router.push("/")
  }

  if (!state.workoutStarted && !state.exerciseProgress.length && !showCompleted) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center px-5 text-center" style={{ background: "var(--color-bg)", color: "var(--color-text)" }}>
        <div
          className="mb-5 flex h-20 w-20 items-center justify-center rounded-[28px]"
          style={{ background: "rgba(var(--color-primary-rgb), 0.14)", border: "1px solid rgba(var(--color-primary-rgb), 0.28)" }}
        >
          <Dumbbell size={34} style={{ color: "var(--color-primary)" }} aria-hidden="true" />
        </div>
        <h1 className="font-display text-3xl font-extrabold">Chưa có buổi tập</h1>
        <p className="mt-3 max-w-sm font-body text-sm leading-6" style={{ color: "var(--color-text-secondary)" }}>
          Về trang chủ để chọn bài tập rồi bắt đầu buổi tập.
        </p>
        <div className="mt-7 grid w-full max-w-sm gap-3">
          <button
            type="button"
            onClick={() => {
              startWorkout()
              setElapsedSeconds(0)
            }}
            className="min-h-14 rounded-2xl font-heading font-bold"
            style={{ background: "var(--color-primary)", color: "#fff", boxShadow: "var(--shadow-glow)" }}
          >
            Bắt đầu với danh sách hiện tại
          </button>
          <button
            type="button"
            onClick={() => router.push("/")}
            className="min-h-12 rounded-2xl font-heading font-semibold"
            style={{ background: "var(--color-surface-subtle)", color: "var(--color-text-secondary)" }}
          >
            Về trang chủ
          </button>
        </div>
      </div>
    )
  }

  if (showCompleted) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center px-5 text-center" style={{ background: "var(--color-bg)", color: "var(--color-text)" }}>
        <div className="relative mb-7">
          <div
            className="flex h-28 w-28 items-center justify-center rounded-full"
            style={{ background: "rgba(var(--color-primary-rgb), 0.16)", border: "2px solid var(--color-primary)" }}
          >
            <Trophy size={44} style={{ color: "var(--color-primary)" }} aria-hidden="true" />
          </div>
          <div className="absolute -inset-5 rounded-full blur-3xl opacity-25" style={{ background: "var(--color-primary)" }} aria-hidden="true" />
        </div>
        <h1 className="font-display text-4xl font-extrabold">Buổi tập đã lưu</h1>
        <p className="mt-3 font-body text-sm" style={{ color: "var(--color-text-secondary)" }}>
          {totals.completedSets}/{totals.totalSets} hiệp · {Math.round(totals.totalVolume).toLocaleString("vi-VN")} kg
        </p>
        <p className="mt-4 font-number text-3xl" style={{ color: "var(--color-primary)" }}>
          {formatElapsed(elapsedSeconds)}
        </p>
        <button
          type="button"
          onClick={() => router.push("/")}
          className="mt-9 min-h-14 w-full max-w-sm rounded-2xl font-heading font-bold"
          style={{ background: "var(--color-primary)", color: "#fff", boxShadow: "var(--shadow-glow)" }}
        >
          Về trang chủ
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-dvh" style={{ background: "var(--color-bg)", color: "var(--color-text)" }}>
      <header
        className="sticky top-0 z-30 px-4 pb-3 pt-4"
        style={{ background: "rgba(0,0,0,0.92)", borderBottom: "1px solid var(--color-border)", backdropFilter: "blur(20px)" }}
      >
        <div className="mb-3 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setShowCancelConfirm(true)}
            aria-label="Hủy buổi tập"
            className="flex h-11 w-11 items-center justify-center rounded-full transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
            style={{ background: "rgba(255,255,255,0.06)" }}
          >
            <ChevronLeft size={21} style={{ color: "var(--color-text-secondary)" }} aria-hidden="true" />
          </button>
          <div className="text-center">
            <p className="font-display text-base font-bold">Buổi tập hôm nay</p>
            <p className="font-body text-xs" style={{ color: "var(--color-text-secondary)" }}>
              {totals.completedSets}/{totals.totalSets} sets · {formatElapsed(elapsedSeconds)}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsPaused((value) => !value)}
            aria-label={isPaused ? "Tiếp tục timer" : "Tạm dừng timer"}
            aria-pressed={isPaused}
            className="flex h-11 w-11 items-center justify-center rounded-full transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
            style={{ background: "rgba(255,255,255,0.06)" }}
          >
            {isPaused ? <Play size={17} style={{ color: "var(--color-primary)" }} aria-hidden="true" /> : <Pause size={17} style={{ color: "var(--color-text-secondary)" }} aria-hidden="true" />}
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${totals.progressPct}%`, background: "var(--color-primary)" }}
            />
          </div>
          <span className="font-number text-xs" style={{ color: "var(--color-primary)" }}>
            {totals.progressPct}%
          </span>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-4xl gap-4 px-4 pb-36 pt-4">
        <WarmupSection
          targetMuscles={state.todayExercises.map((ex) => ex.muscleGroup as MuscleGroup)}
          exercises={state.todayExercises}
          logs={exerciseLogs}
        />
        {progress.map((item, exerciseIndex) => {
          const exerciseCompleted = item.sets.every((set) => set.completed)
          const isBodyweight = item.exercise.equipment === "Bodyweight"
          return (
            <section
              key={item.exercise.id}
              className="overflow-hidden rounded-[28px]"
              style={{
                background: "var(--color-surface)",
                border: `1px solid ${exerciseCompleted ? "rgba(var(--color-primary-rgb), 0.36)" : "var(--color-border)"}`,
              }}
            >
              <div className="flex items-start gap-3 p-4">
                <button
                  type="button"
                  onClick={() => setSelectedExercise(item.exercise)}
                  className="shrink-0 rounded-2xl overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
                  aria-label={`Xem chi tiết ${item.exercise.name}`}
                >
                  <ExerciseThumbnail
                    exercise={item.exercise}
                    className="w-16 h-16 object-cover"
                  />
                </button>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="font-heading text-sm font-semibold leading-tight">{item.exercise.name}</h2>
                      <p className="mt-1 font-body text-xs" style={{ color: "var(--color-text-secondary)" }}>
                        {item.exercise.equipment} · {item.exercise.muscleGroup_vi ?? item.exercise.muscleGroup} · {item.exercise.restSeconds}s nghỉ
                      </p>
                      {lastPerf[item.exercise.id] && (
                        <p className="mt-1.5 font-number text-[11px]" style={{ color: "var(--color-primary)" }}>
                          Lần trước: {lastPerf[item.exercise.id].reps} reps × {lastPerf[item.exercise.id].weight}kg
                        </p>
                      )}
                      {(() => {
                        const exLogs = getLogsForExercise(exerciseLogs, item.exercise.id)
                        if (exLogs.length > 0) {
                          const suggestion = suggestNextWeight(exLogs)
                          return (
                            <p className="font-number text-[11px] mt-0.5" style={{ color: "var(--color-text-secondary)" }}>
                              Gợi ý: <span style={{ color: "var(--color-primary)" }}>{suggestion.reps} reps × {suggestion.weight}kg</span>
                            </p>
                          )
                        }
                        return null
                      })()}
                    </div>
                    <span
                      className="shrink-0 rounded-xl px-2 py-1 font-number text-[10px]"
                      style={{
                        background: exerciseCompleted ? "rgba(var(--color-primary-rgb), 0.16)" : "var(--color-surface-subtle)",
                        color: exerciseCompleted ? "var(--color-primary)" : "var(--color-text-secondary)",
                      }}
                    >
                      {item.sets.filter((set) => set.completed).length}/{item.sets.length}
                    </span>
                  </div>
                </div>
              </div>

              <div className="px-4 pb-4">
                <div className={`mb-2 grid items-center gap-2 px-1 font-heading text-[10px] uppercase tracking-[0.18em] ${isBodyweight ? "grid-cols-[32px_1fr_44px_44px]" : "grid-cols-[32px_1fr_1fr_44px_36px_44px]"}`} style={{ color: "var(--color-text-secondary)" }}>
                  <span>#</span>
                  <span className="text-center">Số reps</span>
                  {!isBodyweight && <span className="text-center">Kg</span>}
                  <span className="text-center">Nghỉ</span>
                  {!isBodyweight && <span />}
                  <span />
                </div>

                <div className="grid gap-2">
                  {item.sets.map((set, setIndex) => {
                    const canCheck = isBodyweight
                      ? !set.completed && set.reps !== null
                      : !set.completed && set.reps !== null && set.weight !== null
                    return (
                    <div
                      key={`${item.exercise.id}-${setIndex}`}
                      className={`grid items-center gap-2 rounded-2xl p-2 ${isBodyweight ? "grid-cols-[32px_1fr_44px_44px]" : "grid-cols-[32px_1fr_1fr_44px_36px_44px]"}`}
                      style={{
                        background: set.completed ? "rgba(var(--color-primary-rgb), 0.08)" : "rgba(255,255,255,0.035)",
                        border: `1px solid ${set.completed ? "rgba(var(--color-primary-rgb), 0.2)" : "rgba(255,255,255,0.045)"}`,
                      }}
                    >
                      <span className="text-center font-number text-xs" style={{ color: set.completed ? "var(--color-primary)" : "var(--color-text-secondary)" }}>
                        {setIndex + 1}
                      </span>
                      <NumberPickerWheel
                        value={set.reps}
                        onChange={(v) => updateSet(exerciseIndex, setIndex, "reps", v)}
                        min={0}
                        max={100}
                        step={1}
                        ariaLabel={`${item.exercise.name} hiệp ${setIndex + 1} số reps`}
                        disabled={set.completed}
                      />
                      {!isBodyweight && (
                        <NumberPickerWheel
                          value={set.weight}
                          onChange={(v) => updateSet(exerciseIndex, setIndex, "weight", v)}
                          min={0}
                          max={200}
                          step={2.5}
                          ariaLabel={`${item.exercise.name} hiệp ${setIndex + 1} kg`}
                          disabled={set.completed}
                        />
                      )}
                      <span className="text-center font-body text-xs" style={{ color: "var(--color-text-secondary)" }}>
                        {item.exercise.restSeconds}s
                      </span>
                      {!isBodyweight && item.sets.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSet(exerciseIndex, setIndex)}
                          aria-label={`Xóa hiệp ${setIndex + 1}`}
                          className="flex h-9 w-9 items-center justify-center rounded-xl transition-all active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
                          style={{ background: "rgba(214,69,69,0.12)" }}
                        >
                          <Minus size={14} style={{ color: "#ff6b6b" }} aria-hidden="true" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => canCheck && handleCheckSet(exerciseIndex, setIndex)}
                        disabled={!canCheck}
                        aria-label={`Hoàn tất ${item.exercise.name} hiệp ${setIndex + 1}`}
                        className="flex h-11 w-11 items-center justify-center rounded-2xl transition-all active:scale-90 disabled:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
                        style={{
                          background: set.completed ? "rgba(var(--color-primary-rgb), 0.2)" : "rgba(var(--color-primary-rgb), 0.4)",
                          color: "#fff",
                          opacity: !canCheck && !set.completed ? 0.5 : 1,
                        }}
                      >
                        <Check size={16} aria-hidden="true" />
                      </button>
                    </div>
                    )
                  })}
                </div>

                <button
                  type="button"
                  onClick={() => addSet(exerciseIndex)}
                  className="mt-3 flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl font-heading text-xs font-semibold transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
                  style={{ background: "rgba(255,255,255,0.045)", color: "var(--color-text-secondary)" }}
                >
                  <Plus size={14} aria-hidden="true" />
                  Thêm hiệp
                </button>
                <ProgressChart
                  exerciseName={item.exercise.name}
                  exerciseId={item.exercise.id}
                  logs={exerciseLogs}
                />
              </div>
            </section>
          )
        })}
      </main>

      <div
        className="fixed inset-x-0 bottom-0 z-30 flex gap-3 px-4 pb-8 pt-5"
        style={{ background: "linear-gradient(to top, var(--color-bg) 70%, transparent)" }}
      >
        <button
          type="button"
          onClick={() => setShowCancelConfirm(true)}
          className="min-h-14 flex-1 rounded-2xl font-heading text-sm font-semibold transition-all active:scale-[0.98]"
          style={{ background: "var(--color-surface-subtle)", color: "var(--color-text-secondary)" }}
        >
          Hủy
        </button>
        <button
          type="button"
          onClick={handleComplete}
          disabled={!totals.allCompleted}
          className="min-h-14 flex-[2] rounded-2xl font-heading text-base font-bold transition-all active:scale-[0.98] disabled:active:scale-100"
          style={{
            background: totals.allCompleted ? "var(--color-primary)" : "var(--color-surface-subtle)",
            color: totals.allCompleted ? "#fff" : "var(--color-text-secondary)",
            boxShadow: totals.allCompleted ? "var(--shadow-glow)" : "none",
          }}
        >
          Hoàn thành
        </button>
      </div>

      {showCancelConfirm && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 px-4 pb-5" role="dialog" aria-modal="true" aria-labelledby="cancel-title" ref={cancelDialogRef}>
          <div className="w-full max-w-md rounded-[28px] p-5 animate-slideUp" style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl" style={{ background: "rgba(214,69,69,0.14)" }}>
                <AlertTriangle size={20} style={{ color: "#D64545" }} aria-hidden="true" />
              </div>
              <h2 id="cancel-title" className="font-display text-2xl font-extrabold">
                Hủy buổi tập?
              </h2>
            </div>
            <p className="font-body text-sm leading-6" style={{ color: "var(--color-text-secondary)" }}>
              Tiến trình hiện tại sẽ bị xóa. Chỉ nhấn &quot;Hoàn thành&quot; nếu bạn muốn lưu kết quả.
            </p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                ref={continueBtnRef}
                type="button"
                onClick={() => setShowCancelConfirm(false)}
                className="min-h-12 rounded-2xl font-heading font-semibold transition-all active:scale-95"
                style={{ background: "var(--color-surface-subtle)", color: "var(--color-text)" }}
              >
                Tiếp tục tập
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="min-h-12 rounded-2xl font-heading font-semibold transition-all active:scale-95"
                style={{ background: "#D64545", color: "#fff" }}
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {restState.active && (
        <RestTimer
          exerciseName={restState.exerciseName}
          setNumber={restState.setNumber}
          defaultSeconds={restState.restSeconds}
          onComplete={() => setRestState((prev) => ({ ...prev, active: false }))}
          onSkip={() => setRestState((prev) => ({ ...prev, active: false }))}
        />
      )}

      {selectedExercise && <ExerciseModal exercise={selectedExercise} onClose={() => setSelectedExercise(null)} />}
    </div>
  )
}
