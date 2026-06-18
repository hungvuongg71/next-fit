import { describe, it, expect, beforeEach } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { AppProvider, useApp } from "@/lib/context"
import type { ReactNode } from "react"

function wrapper({ children }: { children: ReactNode }) {
  return <AppProvider>{children}</AppProvider>
}

function renderApp() {
  return renderHook(() => useApp(), { wrapper })
}

beforeEach(() => {
  localStorage.clear()
})

describe("AppProvider", () => {
  it("starts with default state", () => {
    const { result } = renderApp()
    expect(result.current.state.isFirstVisit).toBe(true)
    expect(result.current.state.workoutStarted).toBe(false)
    expect(result.current.state.workoutCompleted).toBe(false)
    expect(result.current.state.todayExercises.length).toBeGreaterThan(0)
  })

  it("setCriteria updates criteria", () => {
    const { result } = renderApp()
    act(() => {
      result.current.setCriteria({
        gender: "Nam",
        level: "Intermediate",
        goal: "Hypertrophy",
        muscleGroups: ["Chest", "Back"],
        equipment: ["Dumbbell", "Barbell"],
        duration: "45 min",
        frequency: "4 ngày",
      })
    })
    expect(result.current.state.criteria?.gender).toBe("Nam")
    expect(result.current.state.criteria?.goal).toBe("Hypertrophy")
    expect(result.current.state.criteria?.duration).toBe("45 min")
  })

  it("setCookiesAccepted updates cookies and storage preference", () => {
    const { result } = renderApp()
    act(() => {
      result.current.setCookiesAccepted(true)
    })
    expect(result.current.state.cookiesAccepted).toBe(true)
    expect(result.current.state.storagePreferenceAnswered).toBe(true)
  })

  it("startWorkout initializes progress", () => {
    const { result } = renderApp()
    act(() => {
      result.current.startWorkout()
    })
    expect(result.current.state.workoutStarted).toBe(true)
    expect(result.current.state.workoutCompleted).toBe(false)
    expect(result.current.state.exerciseProgress.length).toBeGreaterThan(0)
    expect(result.current.state.exerciseProgress[0].sets.length).toBeGreaterThan(0)
  })

  it("addExercise adds to todayExercises", () => {
    const { result } = renderApp()
    const ex = result.current.state.todayExercises[0]
    act(() => {
      result.current.addExercise(ex)
    })
    expect(result.current.state.todayExercises.length).toBe(5)
  })

  it("removeExercise removes from todayExercises", () => {
    const { result } = renderApp()
    const id = result.current.state.todayExercises[0].id
    act(() => {
      result.current.removeExercise(id)
    })
    expect(result.current.state.todayExercises.find((e) => e.id === id)).toBeUndefined()
  })

  it("replaceExercise swaps an exercise", () => {
    const { result } = renderApp()
    const old = result.current.state.todayExercises[0]
    const replacement = result.current.state.todayExercises[1]
    act(() => {
      result.current.replaceExercise(old.id, replacement)
    })
    expect(result.current.state.todayExercises[0].id).toBe(replacement.id)
  })

  it("resetWorkout clears workout state", () => {
    const { result } = renderApp()
    act(() => {
      result.current.startWorkout()
    })
    expect(result.current.state.workoutStarted).toBe(true)
    act(() => {
      result.current.resetWorkout()
    })
    expect(result.current.state.workoutStarted).toBe(false)
    expect(result.current.state.exerciseProgress.length).toBe(0)
  })

  it("setFirstVisitDone updates isFirstVisit", () => {
    const { result } = renderApp()
    act(() => {
      result.current.setFirstVisitDone()
    })
    expect(result.current.state.isFirstVisit).toBe(false)
  })

  it("completeWorkout creates history entry", () => {
    const { result } = renderApp()
    act(() => {
      result.current.startWorkout()
    })
    act(() => {
      result.current.completeWorkout(3600)
    })
    expect(result.current.state.workoutCompleted).toBe(true)
    expect(result.current.state.workoutHistory.length).toBe(1)
    expect(result.current.state.workoutHistory[0].durationSeconds).toBe(3600)
  })
})
