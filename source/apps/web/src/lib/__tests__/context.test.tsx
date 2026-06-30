import { describe, it, expect, beforeEach } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { AppProvider, useApp } from "@/state/context"
import type { ReactNode } from "react"
import type { Exercise } from "@/types"

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
    difficulty_level: "Intermediate",
    target_muscle_group: "Chest",
    prime_mover_muscle: "",
    secondary_muscle: "",
    tertiary_muscle: "",
    primary_equipment: "Dumbbell",
    primary_items: 1,
    secondary_equipment: "",
    secondary_items: 0,
    posture: "",
    single_or_double_arm: "",
    continuous_or_alternating_arms: "",
    grip: "",
    load_position_ending: "",
    continuous_or_alternating_legs: "",
    foot_elevation: "",
    combination_exercises: "",
    movement_pattern_1: "",
    movement_pattern_2: "",
    movement_pattern_3: "",
    plane_of_motion_1: "",
    plane_of_motion_2: "",
    plane_of_motion_3: "",
    body_region: "",
    force_type: "",
    mechanics: "",
    laterality: "",
    primary_exercise_classification: "",
    short_youtube_demonstration: "",
    in_depth_youtube_explanation: "",
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
