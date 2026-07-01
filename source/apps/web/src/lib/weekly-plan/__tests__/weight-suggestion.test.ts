import { describe, it, expect } from "vitest"
import { suggestWeight } from "../weight-suggestion"
import type { Exercise } from "@/types"

const DEFAULT_FIELDS = {
  difficulty_level: "Intermediate",
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
  force_type: "",
  mechanics: "",
  laterality: "",
  primary_exercise_classification: "",
  short_youtube_demonstration: "",
  in_depth_youtube_explanation: "",
}

function makeEx(overrides: Partial<Exercise> = {}): Exercise {
  return {
    ...DEFAULT_FIELDS,
    id: "ex1",
    name: "Test Exercise",
    target_muscle_group: "Chest",
    primary_equipment: "Barbell",
    body_region: "Upper Body",
    ...overrides,
  }
}

describe("suggestWeight", () => {
  it("returns lastPerformance if available", () => {
    const result = suggestWeight(makeEx(), 80, "Intermediate", "Nam", { reps: 10, weight: 60 })
    expect(result).toBe(60)
  })

  it("returns weight for upper compound male intermediate", () => {
    const result = suggestWeight(makeEx(), 80, "Intermediate", "Nam")
    expect(result).toBeGreaterThan(0)
    expect(result! % 2.5).toBe(0)
  })

  it("returns lower weight for female upper compound", () => {
    const male = suggestWeight(makeEx(), 70, "Intermediate", "Nam")!
    const female = suggestWeight(makeEx(), 70, "Intermediate", "Nữ")!
    expect(female).toBeLessThan(male)
  })

  it("returns undefined for accessory exercises", () => {
    const result = suggestWeight(makeEx({ primary_equipment: "Cable", body_region: "Upper Body" }), 80, "Intermediate")
    expect(result).toBeUndefined()
  })

  it("returns higher weight for advanced vs beginner", () => {
    const beginner = suggestWeight(makeEx(), 80, "Beginner", "Nam")!
    const advanced = suggestWeight(makeEx(), 80, "Advanced", "Nam")!
    expect(advanced).toBeGreaterThan(beginner)
  })

  it("rounds to nearest 2.5kg", () => {
    const result = suggestWeight(makeEx(), 80, "Intermediate", "Nam")!
    expect(result % 2.5).toBe(0)
  })
})


