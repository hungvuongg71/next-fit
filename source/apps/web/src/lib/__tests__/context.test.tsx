import { describe, it, expect, beforeEach } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { AppProvider, useApp } from "@/state/context"
import type { Exercise, ReactNode } from "react"

function wrapper({ children }: { children: ReactNode }) {
  return <AppProvider>{children}</AppProvider>
}

function renderApp() {
  return renderHook(() => useApp(), { wrapper })
}

function makeExercise(id = "test-1"): Exercise {
  return {
    id,
    name: "Test Exercise",
    name_vi: "Bài tập kiểm tra",
    muscleGroup: "Chest",
    muscleGroup_vi: "Ngực",
    level: "Intermediate",
    equipment: "Dumbbell",
    sets: 3,
    reps: "8-12",
    restSeconds: 60,
    description: "A test exercise",
  }
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
    expect(result.current.state.todayExercises).toEqual([])
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
    const ex = makeExercise()
    act(() => { result.current.addExercise(ex) })
    act(() => {
      result.current.startWorkout()
    })
    expect(result.current.state.workoutStarted).toBe(true)
    expect(result.current.state.workoutCompleted).toBe(false)
    expect(result.current.state.exerciseProgress.length).toBe(1)
    expect(result.current.state.exerciseProgress[0].sets.length).toBeGreaterThan(0)
  })

  it("addExercise adds to todayExercises", () => {
    const { result } = renderApp()
    act(() => {
      result.current.addExercise(makeExercise())
    })
    expect(result.current.state.todayExercises.length).toBe(1)
  })

  it("removeExercise removes from todayExercises", () => {
    const { result } = renderApp()
    act(() => { result.current.addExercise(makeExercise("ex-1")) })
    act(() => { result.current.addExercise(makeExercise("ex-2")) })
    act(() => {
      result.current.removeExercise("ex-1")
    })
    expect(result.current.state.todayExercises.find((e) => e.id === "ex-1")).toBeUndefined()
    expect(result.current.state.todayExercises.length).toBe(1)
  })

  it("replaceExercise swaps an exercise", () => {
    const { result } = renderApp()
    act(() => { result.current.addExercise(makeExercise("old")) })
    act(() => { result.current.addExercise(makeExercise("new")) })
    act(() => {
      result.current.replaceExercise("old", makeExercise("replacement"))
    })
    expect(result.current.state.todayExercises[0].id).toBe("replacement")
  })

  it("resetWorkout clears workout state", () => {
    const { result } = renderApp()
    const ex = makeExercise()
    act(() => { result.current.addExercise(ex) })
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
    const ex = makeExercise()
    act(() => { result.current.addExercise(ex) })
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
