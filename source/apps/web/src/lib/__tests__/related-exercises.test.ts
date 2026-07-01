import { describe, it, expect } from "vitest"
import { relatedScore, getRelatedExercises } from "@/lib/related-exercises"
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
    mechanics: "",
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

describe("relatedScore", () => {
  it("returns baseline score when no equipment or level match", () => {
    const ex = makeExercise({ primary_equipment: "Kettlebell", difficulty_level: "Advanced" })
    expect(relatedScore(ex, [], undefined)).toBe(1)
  })

  it("adds 3 points when equipment matches", () => {
    const ex = makeExercise({ primary_equipment: "Barbell", difficulty_level: "Advanced" })
    expect(relatedScore(ex, ["Barbell"], undefined)).toBe(4)
  })

  it("adds 2 points when level matches", () => {
    const ex = makeExercise({ primary_equipment: "Kettlebell", difficulty_level: "Intermediate" })
    expect(relatedScore(ex, [], "Intermediate")).toBe(3)
  })

  it("adds 5 points when both equipment and level match", () => {
    const ex = makeExercise({ primary_equipment: "Dumbbell", difficulty_level: "Intermediate" })
    expect(relatedScore(ex, ["Dumbbell"], "Intermediate")).toBe(6)
  })

  it("handles empty equipment array", () => {
    const ex = makeExercise({ primary_equipment: "Dumbbell", difficulty_level: "Intermediate" })
    expect(relatedScore(ex, [], "Intermediate")).toBe(3)
  })

  it("handles undefined level", () => {
    const ex = makeExercise({ primary_equipment: "Dumbbell", difficulty_level: "Intermediate" })
    expect(relatedScore(ex, ["Dumbbell"], undefined)).toBe(4)
  })
})

describe("getRelatedExercises", () => {
  it("returns only exercises in same muscle group", () => {
    const current = makeExercise({ id: "ex-0", name: "Chest Press" })
    const same = makeExercise({ id: "ex-1", name: "Chest Fly", target_muscle_group: "Chest" })
    const different = makeExercise({ id: "ex-2", name: "Squat", target_muscle_group: "Quadriceps" })
    const result = getRelatedExercises(current, [current, same, different], baseCriteria)
    expect(result).toHaveLength(1)
    expect(result[0].exercise.id).toBe("ex-1")
  })

  it("excludes the current exercise", () => {
    const current = makeExercise({ id: "ex-0", name: "Chest Press" })
    const result = getRelatedExercises(current, [current], baseCriteria)
    expect(result).toHaveLength(0)
  })

  it("returns max results capped by maxResults parameter", () => {
    const current = makeExercise({ id: "ex-0", name: "Chest Press" })
    const others = Array.from({ length: 20 }, (_, i) =>
      makeExercise({ id: `ex-${i + 1}`, target_muscle_group: "Chest" }),
    )
    const result = getRelatedExercises(current, [current, ...others], baseCriteria, 10)
    expect(result).toHaveLength(10)
  })

  it("sorts by score descending", () => {
    const current = makeExercise({ id: "ex-0", name: "Chest Press", target_muscle_group: "Chest" })
    const high = makeExercise({
      id: "ex-1",
      name: "High Score",
      target_muscle_group: "Chest",
      primary_equipment: "Dumbbell",
      difficulty_level: "Intermediate",
    })
    const low = makeExercise({
      id: "ex-2",
      name: "Low Score",
      target_muscle_group: "Chest",
      primary_equipment: "Kettlebell",
      difficulty_level: "Expert",
    })
    const result = getRelatedExercises(current, [current, low, high], baseCriteria)
    expect(result[0].exercise.name).toBe("High Score")
    expect(result[1].exercise.name).toBe("Low Score")
    expect(result[0].score).toBeGreaterThan(result[1].score)
  })

  it("returns empty array when no related exercises found", () => {
    const current = makeExercise({ id: "ex-0", name: "Squat", target_muscle_group: "Quadriceps" })
    const result = getRelatedExercises(current, [current], baseCriteria)
    expect(result).toHaveLength(0)
  })

  it("handles null criteria", () => {
    const current = makeExercise({ id: "ex-0", name: "Chest Press" })
    const related = makeExercise({ id: "ex-1", name: "Chest Fly", target_muscle_group: "Chest" })
    const result = getRelatedExercises(current, [current, related], null)
    expect(result).toHaveLength(1)
    expect(result[0].score).toBe(1)
  })
})
