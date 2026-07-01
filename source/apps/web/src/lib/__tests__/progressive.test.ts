import { describe, it, expect } from "vitest"
import { suggestNextWeight, suggestWarmup, getLogsForExercise } from "@/lib/progressive"
import type { Exercise, ExerciseLogEntry } from "@/types"

describe("suggestNextWeight", () => {
  it("returns defaults when no history", () => {
    const result = suggestNextWeight([])
    expect(result).toEqual({ weight: 10, reps: 10 })
  })

  it("suggests weight increase when target reps met", () => {
    const logs: ExerciseLogEntry[] = [
      { date: "2024-01-01", weight: 20, reps: 10, sets: 3 },
    ]
    const result = suggestNextWeight(logs)
    expect(result.weight).toBe(22.5)
    expect(result.reps).toBe(8)
  })

  it("suggests rep increase when target not met", () => {
    const logs: ExerciseLogEntry[] = [
      { date: "2024-01-01", weight: 20, reps: 8, sets: 3 },
    ]
    const result = suggestNextWeight(logs)
    expect(result.weight).toBe(20)
    expect(result.reps).toBe(9)
  })

  it("uses last log entry only", () => {
    const logs: ExerciseLogEntry[] = [
      { date: "2024-01-01", weight: 10, reps: 10, sets: 3 },
      { date: "2024-01-08", weight: 12.5, reps: 9, sets: 3 },
    ]
    const result = suggestNextWeight(logs)
    expect(result.weight).toBe(12.5)
    expect(result.reps).toBe(10)
  })

  it("handles decimal weight correctly", () => {
    const logs: ExerciseLogEntry[] = [
      { date: "2024-01-01", weight: 27.5, reps: 10, sets: 3 },
    ]
    const result = suggestNextWeight(logs)
    expect(result.weight).toBe(30)
    expect(result.reps).toBe(8)
  })
})

describe("suggestWarmup", () => {
  it("returns empty for empty target muscles", () => {
    expect(suggestWarmup([])).toEqual([])
  })

  it("returns stretches matching target muscles", () => {
    const result = suggestWarmup(["Quadriceps"])
    expect(result.length).toBeGreaterThan(0)
  })

  it("returns at most 4 stretches", () => {
    const result = suggestWarmup(["Chest", "Back", "Quadriceps", "Shoulders", "Biceps"])
    expect(result.length).toBeLessThanOrEqual(4)
  })

  it("deduplicates matching stretches", () => {
    const result = suggestWarmup(["Abdominals", "Back"])
    const unique = new Set(result.map((w) => w.name_vi))
    expect(unique.size).toBe(result.length)
  })
})

const BASE_EXERCISE = {
  prime_mover_muscle: "",
  secondary_muscle: "",
  tertiary_muscle: "",
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



describe("getLogsForExercise", () => {
  it("returns empty array for unknown exercise", () => {
    expect(getLogsForExercise({}, "nonexistent")).toEqual([])
  })

  it("returns logs for known exercise", () => {
    const logs: Record<string, ExerciseLogEntry[]> = {
      "ex-1": [{ date: "2024-01-01", weight: 20, reps: 10, sets: 3 }],
    }
    expect(getLogsForExercise(logs, "ex-1")).toHaveLength(1)
  })
})
