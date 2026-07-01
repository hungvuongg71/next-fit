import { describe, it, expect } from "vitest"
import { getDailyExercise, getMicroWorkout } from "@/lib/daily-recommendation"
import type { Exercise, UserCriteria } from "@/types"

function makeExercise(overrides: Partial<Exercise> = {}): Exercise {
  return {
    id: "test-1",
    name: "Test Exercise",
    target_muscle_group: "Chest",
    difficulty_level: "Intermediate",
    primary_equipment: "Dumbbell",
    body_region: "Upper Body",
    prime_mover_muscle: "Pectoralis Major",
    secondary_muscle: "Triceps",
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
    mechanics: "Compound",
    laterality: "",
    primary_exercise_classification: "",
    short_youtube_demonstration: "",
    in_depth_youtube_explanation: "",
    ...overrides,
  }
}

const baseCriteria: UserCriteria = {
  equipment: ["Dumbbell", "Barbell"],
  level: "Intermediate",
  muscleGroups: ["Chest"],
}

const noopCriteria: UserCriteria = {
  equipment: [],
  level: undefined,
  muscleGroups: [],
}

describe("getDailyExercise", () => {
  it("returns null when pool is empty", () => {
    const result = getDailyExercise([], baseCriteria, new Set(), "2026-07-01")
    expect(result).toBeNull()
  })

  it("returns null when no equipment matches", () => {
    const ex = makeExercise({ primary_equipment: "Kettlebell" })
    const result = getDailyExercise([ex], baseCriteria, new Set(), "2026-07-01")
    expect(result).toBeNull()
  })

  it("returns an exercise matching equipment and level", () => {
    const ex = makeExercise({ primary_equipment: "Dumbbell" })
    const result = getDailyExercise([ex], baseCriteria, new Set(), "2026-07-01")
    expect(result).not.toBeNull()
    expect(result!.id).toBe("test-1")
  })

  it("prefers exercises not recently done", () => {
    const recent = makeExercise({ id: "ex-1", primary_equipment: "Dumbbell" })
    const fresh = makeExercise({ id: "ex-2", primary_equipment: "Dumbbell" })
    const result = getDailyExercise(
      [recent, fresh],
      baseCriteria,
      new Set(["ex-1"]),
      "2026-07-01",
    )
    expect(result!.id).toBe("ex-2")
  })

  it("returns deterministic result for same date seed", () => {
    const ex1 = makeExercise({ id: "ex-1", primary_equipment: "Dumbbell" })
    const ex2 = makeExercise({ id: "ex-2", primary_equipment: "Dumbbell" })
    const result1 = getDailyExercise([ex1, ex2], baseCriteria, new Set(), "2026-07-01")
    const result2 = getDailyExercise([ex1, ex2], baseCriteria, new Set(), "2026-07-01")
    expect(result1!.id).toBe(result2!.id)
  })

  it("handles null criteria", () => {
    const ex = makeExercise({ primary_equipment: "Dumbbell" })
    const result = getDailyExercise([ex], null, new Set(), "2026-07-01")
    expect(result).not.toBeNull()
  })

  it("handles empty equipment in criteria", () => {
    const ex = makeExercise({ primary_equipment: "Dumbbell" })
    const result = getDailyExercise([ex], noopCriteria, new Set(), "2026-07-01")
    expect(result).not.toBeNull()
  })
})

describe("getMicroWorkout", () => {
  it("returns compound exercises from different regions", () => {
    const chest = makeExercise({ id: "ex-1", target_muscle_group: "Chest", primary_equipment: "Dumbbell", mechanics: "Compound" })
    const quads = makeExercise({ id: "ex-2", target_muscle_group: "Quadriceps", primary_equipment: "Barbell", mechanics: "Compound" })
    const abs = makeExercise({ id: "ex-3", target_muscle_group: "Abdominals", primary_equipment: "Dumbbell", mechanics: "Compound" })
    const result = getMicroWorkout([chest, quads, abs], baseCriteria, 3)
    expect(result.length).toBe(3)
  })

  it("returns fewer exercises if pool is small", () => {
    const chest = makeExercise({ id: "ex-1", target_muscle_group: "Chest", primary_equipment: "Dumbbell", mechanics: "Compound" })
    const result = getMicroWorkout([chest], baseCriteria, 3)
    expect(result.length).toBe(1)
  })

  it("returns empty when no exercises match equipment", () => {
    const chest = makeExercise({ id: "ex-1", primary_equipment: "Kettlebell", mechanics: "Compound" })
    const result = getMicroWorkout([chest], baseCriteria, 3)
    expect(result.length).toBe(0)
  })

  it("handles null criteria", () => {
    const chest = makeExercise({ id: "ex-1", target_muscle_group: "Chest", primary_equipment: "Dumbbell", mechanics: "Compound" })
    const result = getMicroWorkout([chest], null, 3)
    expect(result.length).toBe(1)
  })
})
