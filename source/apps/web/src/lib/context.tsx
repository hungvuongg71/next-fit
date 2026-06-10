'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { AppState, UserCriteria, Exercise, ExerciseProgress } from '@/types'
import { DEFAULT_EXERCISES } from '@/lib/data'

interface AppContextType {
  state: AppState
  setCookiesAccepted: (v: boolean) => void
  setCriteria: (c: UserCriteria) => void
  startWorkout: () => void
  completeWorkout: () => void
  resetWorkout: () => void
  setCurrentExercise: (i: number) => void
  updateExerciseProgress: (progress: ExerciseProgress[]) => void
  addExercise: (ex: Exercise) => void
  removeExercise: (id: string) => void
  replaceExercise: (id: string, newEx: Exercise) => void
  resetTodayExercises: () => void
  setFirstVisitDone: () => void
}

const defaultState: AppState = {
  isFirstVisit: true,
  cookiesAccepted: false,
  criteria: null,
  todayExercises: DEFAULT_EXERCISES,
  workoutStarted: false,
  workoutCompleted: false,
  currentExerciseIndex: 0,
  exerciseProgress: [],
}

const AppContext = createContext<AppContextType | undefined>(undefined)

function initProgress(exercises: Exercise[]): ExerciseProgress[] {
  return exercises.map(ex => ({
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

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(defaultState)

  useEffect(() => {
    const saved = localStorage.getItem('nextfit-state')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setState(prev => ({ ...prev, ...parsed }))
      } catch {}
    }
  }, [])

  useEffect(() => {
    const { isFirstVisit, cookiesAccepted, criteria } = state
    localStorage.setItem('nextfit-state', JSON.stringify({ isFirstVisit, cookiesAccepted, criteria }))
  }, [state.isFirstVisit, state.cookiesAccepted, state.criteria])

  const setCookiesAccepted = (v: boolean) =>
    setState(prev => ({ ...prev, cookiesAccepted: v }))

  const setCriteria = (c: UserCriteria) =>
    setState(prev => ({ ...prev, criteria: c }))

  const setFirstVisitDone = () =>
    setState(prev => ({ ...prev, isFirstVisit: false }))

  const startWorkout = () =>
    setState(prev => ({
      ...prev,
      workoutStarted: true,
      workoutCompleted: false,
      currentExerciseIndex: 0,
      exerciseProgress: initProgress(prev.todayExercises),
    }))

  const completeWorkout = () =>
    setState(prev => ({ ...prev, workoutCompleted: true, workoutStarted: false }))

  const resetWorkout = () =>
    setState(prev => ({
      ...prev,
      workoutStarted: false,
      workoutCompleted: false,
      currentExerciseIndex: 0,
      exerciseProgress: [],
    }))

  const setCurrentExercise = (i: number) =>
    setState(prev => ({ ...prev, currentExerciseIndex: i }))

  const updateExerciseProgress = (progress: ExerciseProgress[]) =>
    setState(prev => ({ ...prev, exerciseProgress: progress }))

  const addExercise = (ex: Exercise) =>
    setState(prev => ({ ...prev, todayExercises: [...prev.todayExercises, ex] }))

  const removeExercise = (id: string) =>
    setState(prev => ({
      ...prev,
      todayExercises: prev.todayExercises.filter(e => e.id !== id),
    }))

  const replaceExercise = (id: string, newEx: Exercise) =>
    setState(prev => ({
      ...prev,
      todayExercises: prev.todayExercises.map(e => (e.id === id ? newEx : e)),
    }))

  const resetTodayExercises = () =>
    setState(prev => ({ ...prev, todayExercises: DEFAULT_EXERCISES }))

  return (
    <AppContext.Provider
      value={{
        state,
        setCookiesAccepted,
        setCriteria,
        startWorkout,
        completeWorkout,
        resetWorkout,
        setCurrentExercise,
        updateExerciseProgress,
        addExercise,
        removeExercise,
        replaceExercise,
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
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}
