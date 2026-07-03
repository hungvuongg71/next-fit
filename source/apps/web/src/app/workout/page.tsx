"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Check, ChevronLeft, ChevronUp, ChevronDown, Minus, Pause, Play, Plus, Trophy, AlertTriangle, RefreshCw, Trash2 } from "lucide-react"
import ExerciseModal from "@/components/ui/ExerciseModal"
import NumberPickerWheel from "@/components/ui/NumberPickerWheel"
import RestTimer from "@/components/ui/RestTimer"
import { useApp } from "@/state/context"
import ExerciseThumbnail from "@/components/ui/ExerciseThumbnail"
import { Exercise, ExerciseLogEntry, ExerciseProgress, MuscleGroup, WorkoutSet } from "@/types"
import { STORAGE_KEYS } from "@/constants/storage"
import { DEFAULT_SETS, DEFAULT_REST_SECONDS } from "@/lib/data"
import { suggestNextWeight, getLogsForExercise } from "@/lib/progressive"
import WarmupSection from "@/components/ui/WarmupSection"
import ProgressChart from "@/components/ui/ProgressChart"
import ExercisePicker from "@/components/ui/ExercisePicker"
import WorkoutBuilder from "@/components/ui/WorkoutBuilder"
import BottomNav from "@/components/layout/BottomNav"
import { getElapsedSeconds } from "@/state/context"

function formatElapsed(seconds: number) {
  const minutes = Math.floor(seconds / 60)
  const rest = seconds % 60
  return `${String(minutes).padStart(2, "0")}:${String(rest).padStart(2, "0")}`
}

function buildWarmupWeight(exercise: Exercise, logs: Record<string, ExerciseLogEntry[]>): number | null {
  if (exercise.primary_equipment === "Bodyweight") return null
  const exLogs = getLogsForExercise(logs, exercise.id)
  if (exLogs.length > 0) {
    return Math.max(5, +(suggestNextWeight(exLogs).weight * 0.5).toFixed(1))
  }
  return 5
}

function buildProgress(exercises: Exercise[], logs: Record<string, ExerciseLogEntry[]>): ExerciseProgress[] {
  return exercises.map((exercise) => {
    const warmupWeight = buildWarmupWeight(exercise, logs)
    const warmup: WorkoutSet[] = warmupWeight !== null
      ? [{ reps: 12, weight: warmupWeight, completed: false, isWarmup: true }]
      : []
    return {
      exercise,
      currentSet: warmup.length,
      completed: false,
      sets: [
        ...warmup,
        ...Array.from({ length: DEFAULT_SETS }, (): WorkoutSet => ({ reps: null, weight: null, completed: false })),
      ],
    }
  })
}

export default function WorkoutPage() {
  const router = useRouter()
  const { state, updateExerciseProgress, completeWorkout, resetWorkout, startWorkout, replaceExercise, addExerciseToWorkout, removeExerciseFromWorkout, moveExercise, pauseWorkout, resumeWorkout, setTrackingMinimized } = useApp()
  const lastPerf = state.lastPerformances
  const elapsedSeconds = getElapsedSeconds(state.workoutTimer)
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null)
  const [showAddPicker, setShowAddPicker] = useState(false)
  const [replaceTarget, setReplaceTarget] = useState<Exercise | null>(null)
  const [exerciseToRemove, setExerciseToRemove] = useState<Exercise | null>(null)
  const replaceModeProp = useMemo(
    () => (replaceTarget ? { exerciseId: replaceTarget.id, muscleGroup: replaceTarget.target_muscle_group } : undefined),
    [replaceTarget],
  )
  const [showCompleted, setShowCompleted] = useState(false)
  const [finalElapsed, setFinalElapsed] = useState(0)
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
    startedAt?: number
  }>({ active: false, exerciseName: "", setNumber: 0, restSeconds: 60 })

  const progress = useMemo(() => {
    if (state.exerciseProgress.length) {
      return state.exerciseProgress.map((item) => {
        if (item.exercise.primary_equipment === "Bodyweight") return item
        if (item.sets[0]?.isWarmup) return item
        const warmupWeight = buildWarmupWeight(item.exercise, exerciseLogs)
        return {
          ...item,
          currentSet: item.currentSet + 1,
          sets: [
            { reps: 12, weight: warmupWeight, completed: false, isWarmup: true },
            ...item.sets,
          ],
        }
      })
    }
    return buildProgress(state.todayExercises, exerciseLogs)
  }, [state.exerciseProgress, state.todayExercises, exerciseLogs])

  useEffect(() => {
    if (!state.workoutStarted && !state.exerciseProgress.length) return
    if (!state.exerciseProgress.length && state.todayExercises.length) {
      updateExerciseProgress(buildProgress(state.todayExercises, exerciseLogs))
    }
  }, [state.exerciseProgress.length, state.todayExercises, state.workoutStarted, updateExerciseProgress, exerciseLogs])



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
    if (state.workoutStarted && !state.todayExercises.length && !showCompleted) {
      router.replace("/")
    }
  }, [state.workoutStarted, state.todayExercises.length, showCompleted, router])

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

  function workingSetsOf(sets: WorkoutSet[]) {
    return sets.filter((s) => !s.isWarmup)
  }

  const totals = useMemo(() => {
    const totalSets = progress.reduce((sum, item) => sum + workingSetsOf(item.sets).length, 0)
    const completedSets = progress.reduce((sum, item) => sum + workingSetsOf(item.sets).filter((set) => set.completed).length, 0)
    const totalVolume = progress.reduce(
      (sum, item) =>
        sum +
        workingSetsOf(item.sets).reduce((setSum, set) => {
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
        const ws = workingSetsOf(sets)
        const firstIncomplete = sets.findIndex((s) => !s.isWarmup && !s.completed)
        return {
          ...item,
          sets,
          currentSet: firstIncomplete === -1 ? sets.length - 1 : firstIncomplete,
          completed: ws.length > 0 && ws.every((s) => s.completed),
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
    const set = progress[exerciseIndex]?.sets[setIndex]
    if (set?.isWarmup) return
    replaceProgress(
      progress.map((item, itemIndex) => {
        if (itemIndex !== exerciseIndex) return item
        const sets = item.sets.filter((_, i) => i !== setIndex)
        const ws = workingSetsOf(sets)
        const firstIncomplete = sets.findIndex((s) => !s.isWarmup && !s.completed)
        return {
          ...item,
          sets,
          currentSet: firstIncomplete === -1 ? sets.length - 1 : firstIncomplete,
          completed: ws.length > 0 && ws.every((s) => s.completed),
        }
      }),
    )
  }

  const handleCheckSet = (exerciseIndex: number, setIndex: number) => {
    const set = progress[exerciseIndex]?.sets[setIndex]
    if (set?.isWarmup) return
    updateSet(exerciseIndex, setIndex, "completed", true)
    const exercise = progress[exerciseIndex].exercise
    setRestState({
      active: true,
      exerciseName: exercise.name,
      setNumber: setIndex + 1,
      restSeconds: DEFAULT_REST_SECONDS,
      startedAt: Date.now(),
    })
  }

  const saveExerciseLogs = () => {
    const newLogs = { ...exerciseLogs }
    for (const item of progress) {
      const isBw = item.exercise.primary_equipment === "Bodyweight"
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
    setFinalElapsed(elapsedSeconds)
    completeWorkout(elapsedSeconds, progress)
    saveExerciseLogs()
    localStorage.removeItem(STORAGE_KEYS.WORKOUT_SESSION)
    setShowCompleted(true)
  }

  const handleCancel = () => {
    resetWorkout()
    localStorage.removeItem(STORAGE_KEYS.WORKOUT_SESSION)
    router.push("/")
  }

  const saveSession = useCallback(() => {
    const session = {
      restState: restState.active
        ? {
            active: true,
            exerciseName: restState.exerciseName,
            setNumber: restState.setNumber,
            restSeconds: restState.restSeconds,
            restEndTimestamp: (restState.startedAt ?? Date.now()) + restState.restSeconds * 1000,
          }
        : { active: false },
      savedAt: Date.now(),
    }
    localStorage.setItem(STORAGE_KEYS.WORKOUT_SESSION, JSON.stringify(session))
  }, [restState])

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEYS.WORKOUT_SESSION)
    if (!raw) return
    try {
      const session = JSON.parse(raw)
      if (session.restState?.active) {
        const remainingMs = session.restState.restEndTimestamp - Date.now()
        if (remainingMs > 0) {
          setRestState({
            active: true,
            exerciseName: session.restState.exerciseName,
            setNumber: session.restState.setNumber,
            restSeconds: Math.ceil(remainingMs / 1000),
            startedAt: Date.now(),
          })
        }
      }
    } catch { /* ignore */ }
  }, [])

  const saveSessionRef = useRef(saveSession)
  saveSessionRef.current = saveSession

  useEffect(() => {
    if (!state.workoutStarted || showCompleted) return
    const handler = () => saveSessionRef.current()
    window.addEventListener("beforeunload", handler)
    const interval = window.setInterval(() => saveSessionRef.current(), 10000)
    return () => {
      window.removeEventListener("beforeunload", handler)
      window.clearInterval(interval)
    }
  }, [state.workoutStarted, showCompleted])



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
          {formatElapsed(finalElapsed)}
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

  const isTracking = state.workoutStarted && !(state.workoutTimer?.trackingMinimized ?? false)

  return (
    <div className="min-h-dvh" style={{ background: "var(--color-bg)", color: "var(--color-text)" }}>
      {/* Builder section (shown when no workout or tracking minimized) */}
      {(!state.workoutStarted || (state.workoutTimer?.trackingMinimized ?? false)) && (
        <>
          <main className="mx-auto max-w-4xl px-4 pt-5 pb-24">
            {(state.workoutTimer?.trackingMinimized ?? false) && (
              <div
                className="mb-4 p-3 rounded-2xl cursor-pointer flex items-center justify-between transition-all active:scale-[0.98]"
                style={{ background: "rgba(var(--color-primary-rgb), 0.1)", border: "1px solid rgba(var(--color-primary-rgb), 0.2)" }}
                onClick={() => setTrackingMinimized(false)}
              >
                <div>
                  <p className="font-heading text-xs font-semibold" style={{ color: "var(--color-text)" }}>
                    Buổi tập hôm nay
                  </p>
                  <p className="font-number text-xs mt-0.5" style={{ color: "var(--color-text-secondary)" }}>
                    {totals.completedSets}/{totals.totalSets} sets · {formatElapsed(elapsedSeconds)} · {totals.progressPct}%
                  </p>
                </div>
                <span className="font-heading text-[10px] font-semibold" style={{ color: "var(--color-primary)" }}>
                  Mở rộng →
                </span>
              </div>
            )}
            <WorkoutBuilder onStartWorkout={() => setTrackingMinimized(false)} />
          </main>
          <BottomNav />
        </>
      )}

      {/* Tracking section (shown when workout started and not minimized) */}
      {isTracking && (
        <>
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
                onClick={() => (state.workoutTimer?.isPaused ? resumeWorkout() : pauseWorkout())}
                aria-label={state.workoutTimer?.isPaused ? "Tiếp tục timer" : "Tạm dừng timer"}
                aria-pressed={state.workoutTimer?.isPaused}
                className="flex h-11 w-11 items-center justify-center rounded-full transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
                style={{ background: "rgba(255,255,255,0.06)" }}
              >
                {state.workoutTimer?.isPaused ? <Play size={17} style={{ color: "var(--color-primary)" }} aria-hidden="true" /> : <Pause size={17} style={{ color: "var(--color-text-secondary)" }} aria-hidden="true" />}
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
          targetMuscles={state.todayExercises.map((ex) => ex.target_muscle_group as MuscleGroup)}
        />
        {progress.map((item, exerciseIndex) => {
          const exerciseCompleted = workingSetsOf(item.sets).every((set) => set.completed)
          const isBodyweight = item.exercise.primary_equipment === "Bodyweight"
          const warmupCount = item.sets.filter((s) => s.isWarmup).length
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
                        {item.exercise.primary_equipment} · {item.exercise.target_muscle_group} · {DEFAULT_REST_SECONDS}s nghỉ
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
                      {!exerciseCompleted && (
                        <div className="mt-1.5 flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setReplaceTarget(item.exercise)}
                            aria-label="Thay thế bài tập"
                            className="flex h-7 w-7 items-center justify-center rounded-lg transition-all active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
                            style={{ background: "rgba(var(--color-primary-rgb), 0.08)", color: "var(--color-primary)" }}
                          >
                            <RefreshCw size={12} aria-hidden="true" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setExerciseToRemove(item.exercise)}
                            aria-label="Xóa bài tập"
                            className="flex h-7 w-7 items-center justify-center rounded-lg transition-all active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
                            style={{ background: "rgba(214,69,69,0.12)", color: "#ff6b6b" }}
                          >
                            <Trash2 size={12} aria-hidden="true" />
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="flex shrink-0 items-start gap-1.5">
                      <span
                        className="rounded-xl px-2 py-1 font-number text-[10px]"
                        style={{
                          background: exerciseCompleted ? "rgba(var(--color-primary-rgb), 0.16)" : "var(--color-surface-subtle)",
                          color: exerciseCompleted ? "var(--color-primary)" : "var(--color-text-secondary)",
                        }}
                      >
                        {workingSetsOf(item.sets).filter((set) => set.completed).length}/{item.sets.length - warmupCount}
                      </span>
                      {progress.length > 1 && !exerciseCompleted && (
                        <div className="flex flex-col gap-0.5">
                          <button
                            type="button"
                            onClick={() => moveExercise(item.exercise.id, "up")}
                            disabled={exerciseIndex === 0}
                            aria-label="Di chuyển lên"
                            className="flex h-5 w-5 items-center justify-center rounded-md transition-all active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] disabled:opacity-0"
                            style={{ color: "var(--color-text-secondary)" }}
                          >
                            <ChevronUp size={12} aria-hidden="true" />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveExercise(item.exercise.id, "down")}
                            disabled={exerciseIndex === progress.length - 1}
                            aria-label="Di chuyển xuống"
                            className="flex h-5 w-5 items-center justify-center rounded-md transition-all active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] disabled:opacity-0"
                            style={{ color: "var(--color-text-secondary)" }}
                          >
                            <ChevronDown size={12} aria-hidden="true" />
                          </button>
                        </div>
                      )}
                    </div>
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
                    const canCheck = !set.isWarmup && !set.completed && set.reps !== null && set.reps > 0
                    return (
                    <div
                      key={`${item.exercise.id}-${setIndex}`}
                      className={`grid items-center gap-2 rounded-2xl p-2 ${isBodyweight ? "grid-cols-[32px_1fr_44px_44px]" : "grid-cols-[32px_1fr_1fr_44px_36px_44px]"}`}
                      style={{
                        background: set.completed ? "rgba(var(--color-primary-rgb), 0.08)" : "rgba(255,255,255,0.035)",
                        border: `1px solid ${set.completed ? "rgba(var(--color-primary-rgb), 0.2)" : "rgba(255,255,255,0.045)"}`,
                      }}
                    >
                      <span className="text-center font-number text-xs" style={{ color: set.isWarmup ? "var(--color-primary)" : set.completed ? "var(--color-primary)" : "var(--color-text-secondary)" }}>
                        {set.isWarmup ? "W" : setIndex - warmupCount + 1}
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
                        {DEFAULT_REST_SECONDS}s
                      </span>
                      {!isBodyweight && !set.isWarmup && item.sets.length > 1 && (
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
                      {!set.isWarmup && (
                      <button
                        type="button"
                        onClick={() => canCheck && handleCheckSet(exerciseIndex, setIndex)}
                        disabled={!canCheck}
                        aria-label={`Hoàn tất ${item.exercise.name} hiệp ${setIndex + 1}`}
                        className="flex h-11 w-11 items-center justify-center rounded-2xl transition-all active:scale-90 disabled:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
                        style={{
                          background: set.completed ? "rgba(34, 197, 94, 0.25)" : canCheck ? "var(--color-primary)" : "rgba(255,255,255,0.08)",
                          color: set.completed ? "#22c55e" : "#fff",
                          opacity: !canCheck && !set.completed ? 0.5 : 1,
                        }}
                      >
                        <Check size={16} aria-hidden="true" />
                      </button>
                      )}
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
        <button
          type="button"
          onClick={() => setShowAddPicker(true)}
          className="flex min-h-14 w-full items-center justify-center gap-2 rounded-[28px] font-heading text-sm font-semibold transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
          style={{ background: "var(--color-surface)", border: "1px dashed var(--color-border)", color: "var(--color-text-secondary)" }}
        >
          <Plus size={16} aria-hidden="true" />
          Thêm bài tập
        </button>
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
            background: totals.allCompleted ? "#22c55e" : "rgba(34, 197, 94, 0.12)",
            color: totals.allCompleted ? "#fff" : "rgba(34, 197, 94, 0.5)",
            boxShadow: totals.allCompleted ? "0 0 20px rgba(34, 197, 94, 0.35)" : "none",
          }}
        >
          Hoàn thành
        </button>
        <button
          type="button"
          onClick={() => setTrackingMinimized(true)}
          className="min-h-14 flex-1 rounded-2xl font-heading text-sm font-semibold transition-all active:scale-[0.98]"
          style={{ background: "var(--color-surface-subtle)", color: "var(--color-text-secondary)" }}
        >
          Thu gọn
        </button>
      </div>
      </>)}

    {/* Tracking modals */}
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

    {exerciseToRemove && (
      <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 px-4 pb-5" role="dialog" aria-modal="true" aria-labelledby="remove-exercise-title">
        <div className="w-full max-w-md rounded-[28px] p-5 animate-slideUp" style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl" style={{ background: "rgba(214,69,69,0.14)" }}>
              <AlertTriangle size={20} style={{ color: "#D64545" }} aria-hidden="true" />
            </div>
            <h2 id="remove-exercise-title" className="font-display text-2xl font-extrabold">
              Xóa bài tập?
            </h2>
          </div>
          <p className="font-body text-sm leading-6" style={{ color: "var(--color-text-secondary)" }}>
            Bạn có chắc muốn xóa &quot;{exerciseToRemove.name}&quot; khỏi buổi tập?
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
              onClick={() => {
                removeExerciseFromWorkout(exerciseToRemove.id)
                setExerciseToRemove(null)
              }}
              className="min-h-12 rounded-2xl font-heading font-semibold transition-all active:scale-95"
              style={{ background: "#D64545", color: "#fff" }}
            >
              Xóa
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

    {showAddPicker && (
      <ExercisePicker
        isOpen
        onClose={() => setShowAddPicker(false)}
        onAdd={(exercises) => {
          for (const ex of exercises) {
            addExerciseToWorkout(ex)
          }
          setShowAddPicker(false)
        }}
      />
    )}
    {replaceTarget && (
      <ExercisePicker
        isOpen
        onClose={() => setReplaceTarget(null)}
        onAdd={() => {}}
        replaceMode={replaceModeProp}
        onReplace={(exerciseId, newExercise) => {
          replaceExercise(exerciseId, newExercise)
          setReplaceTarget(null)
        }}
      />
    )}
  </div>
)
}
