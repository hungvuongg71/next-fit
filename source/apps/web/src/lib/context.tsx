"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { AppState, UserCriteria, Exercise, ExerciseProgress, WorkoutHistoryEntry } from "@/types"
import { DEFAULT_EXERCISES } from "@/lib/data"

interface AppContextType {
  state: AppState
  setCookiesAccepted: (v: boolean) => void
  setStoragePreferenceAnswered: (v: boolean) => void
  setCriteria: (c: UserCriteria) => void
  startWorkout: () => void
  completeWorkout: (durationSeconds?: number, progress?: ExerciseProgress[]) => void
  resetWorkout: () => void
  setCurrentExercise: (i: number) => void
  updateExerciseProgress: (progress: ExerciseProgress[]) => void
  addExercise: (ex: Exercise) => void
  removeExercise: (id: string) => void
  replaceExercise: (id: string, newEx: Exercise) => void
  setTodayExercises: (exercises: Exercise[]) => void
  resetTodayExercises: () => void
  setFirstVisitDone: () => void
}

const defaultState: AppState = {
  isFirstVisit: true,
  cookiesAccepted: false,
  storagePreferenceAnswered: false,
  criteria: null,
  todayExercises: DEFAULT_EXERCISES,
  workoutStarted: false,
  workoutCompleted: false,
  currentExerciseIndex: 0,
  exerciseProgress: [],
  workoutHistory: [],
  lastPerformances: {},
}

function loadSavedState(): Partial<AppState> | null {
  if (typeof window === "undefined") return null
  const saved = localStorage.getItem("nextfit-state")
  if (!saved) return null
  try {
    return JSON.parse(saved) as Partial<AppState>
  } catch {
    return null
  }
}

const AppContext = createContext<AppContextType | undefined>(undefined)

function initProgress(exercises: Exercise[]): ExerciseProgress[] {
  return exercises.map((ex) => ({
    exercise: ex,
    sets: Array.from({ length: ex.sets }, () => ({
      reps: null,
      weight: null,
      completed: false,
    })),
    currentSet: 0,
    completed: false,
  }))
}

function dedupeExercises(arr: Exercise[]): Exercise[] {
  const seen = new Set<string>()
  return arr.filter((ex) => {
    if (seen.has(ex.id)) return false
    seen.add(ex.id)
    return true
  })
}

function mergeSaved(parsed: Partial<AppState>): AppState {
  return {
    ...defaultState,
    ...parsed,
    todayExercises: parsed.todayExercises?.length ? dedupeExercises(parsed.todayExercises) : defaultState.todayExercises,
    exerciseProgress: parsed.exerciseProgress ?? defaultState.exerciseProgress,
    workoutHistory: parsed.workoutHistory ?? defaultState.workoutHistory,
    lastPerformances: parsed.lastPerformances ?? defaultState.lastPerformances,
    storagePreferenceAnswered: parsed.storagePreferenceAnswered ?? parsed.cookiesAccepted !== undefined,
    isFirstVisit: parsed.isFirstVisit ?? (parsed.criteria ? false : true), // If criteria exists, it's not first visit
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(defaultState)

  useEffect(() => {
    const saved = loadSavedState()
    if (saved) {
      setState(mergeSaved(saved))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("nextfit-state", JSON.stringify(state))
  }, [state])

  const setCookiesAccepted = (v: boolean) =>
    setState((prev) => ({ ...prev, cookiesAccepted: v, storagePreferenceAnswered: true }))

  const setStoragePreferenceAnswered = (v: boolean) =>
    setState((prev) => ({ ...prev, storagePreferenceAnswered: v }))

  const setCriteria = (c: UserCriteria) => setState((prev) => ({ ...prev, criteria: c }))

  const setFirstVisitDone = () => setState((prev) => ({ ...prev, isFirstVisit: false }))

  const startWorkout = () =>
    setState((prev) => ({
      ...prev,
      workoutStarted: true,
      workoutCompleted: false,
      currentExerciseIndex: 0,
      exerciseProgress: initProgress(prev.todayExercises),
    }))

  const completeWorkout = (durationSeconds = 0, progress?: ExerciseProgress[]) =>
    setState((prev) => {
      const finalProgress = progress ?? prev.exerciseProgress
      const completedSets = finalProgress.reduce((sum, item) => sum + item.sets.filter((set) => set.completed).length, 0)
      const totalSets = finalProgress.reduce((sum, item) => sum + item.sets.length, 0)
      const totalVolume = finalProgress.reduce(
        (sum, item) =>
          sum +
          item.sets.reduce((setSum, set) => {
            if (!set.completed) return setSum
            return setSum + (set.reps ?? 0) * (set.weight ?? 0)
          }, 0),
        0,
      )
      const entry: WorkoutHistoryEntry = {
        id: `workout-${Date.now()}`,
        completedAt: new Date().toISOString(),
        durationSeconds,
        exercises: prev.todayExercises,
        totalSets,
        completedSets,
        totalVolume,
        criteria: prev.criteria,
      }

      const newPerformances = { ...prev.lastPerformances }
      for (const item of finalProgress) {
        const completed = item.sets.filter(
          (s) => s.completed && s.reps !== null && s.weight !== null,
        )
        if (completed.length > 0) {
          const best = completed.reduce((max, s) =>
            (s.weight ?? 0) > (max.weight ?? 0) ? s : max,
          )
          newPerformances[item.exercise.id] = {
            reps: best.reps!,
            weight: best.weight!,
          }
        }
      }

      return {
        ...prev,
        workoutCompleted: true,
        workoutStarted: false,
        exerciseProgress: finalProgress,
        workoutHistory: [entry, ...prev.workoutHistory].slice(0, 30),
        lastPerformances: newPerformances,
      }
    })

  const resetWorkout = () =>
    setState((prev) => ({
      ...prev,
      workoutStarted: false,
      workoutCompleted: false,
      currentExerciseIndex: 0,
      exerciseProgress: [],
    }))

  const setCurrentExercise = (i: number) => setState((prev) => ({ ...prev, currentExerciseIndex: i }))

  const updateExerciseProgress = (progress: ExerciseProgress[]) =>
    setState((prev) => ({ ...prev, exerciseProgress: progress }))

  const addExercise = (ex: Exercise) => setState((prev) => ({ ...prev, todayExercises: [...prev.todayExercises, ex] }))

  const removeExercise = (id: string) =>
    setState((prev) => ({
      ...prev,
      todayExercises: prev.todayExercises.filter((e) => e.id !== id),
    }))

  const replaceExercise = (id: string, newEx: Exercise) =>
    setState((prev) => ({
      ...prev,
      todayExercises: prev.todayExercises.map((e) => (e.id === id ? newEx : e)),
    }))

  const setTodayExercises = (exercises: Exercise[]) => setState((prev) => ({ ...prev, todayExercises: exercises }))

  const resetTodayExercises = () => setState((prev) => ({ ...prev, todayExercises: DEFAULT_EXERCISES }))

  return (
    <AppContext.Provider
      value={{
        state,
        setCookiesAccepted,
        setStoragePreferenceAnswered,
        setCriteria,
        startWorkout,
        completeWorkout,
        resetWorkout,
        setCurrentExercise,
        updateExerciseProgress,
        addExercise,
        removeExercise,
        replaceExercise,
        setTodayExercises,
        resetTodayExercises,
        setFirstVisitDone,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error("useApp must be used inside AppProvider")
  return ctx
}
