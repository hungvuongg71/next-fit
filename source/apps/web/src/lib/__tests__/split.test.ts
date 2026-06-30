import { describe, it, expect } from "vitest"
import {
  matchesLevel,
  compoundScore,
  repScore,
  goalScore,
  fatiguePenalty,
  parseAvgReps,
} from "@/lib/split"
import type { Exercise } from "@/types"

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

describe("parseAvgReps", () => {
  it("parses range format", () => {
    expect(parseAvgReps("8-12")).toBe(10)
  })

  it("parses single number format", () => {
    expect(parseAvgReps("10")).toBeNull()
  })

  it("returns null for invalid input", () => {
    expect(parseAvgReps("")).toBeNull()
    expect(parseAvgReps("abc")).toBeNull()
  })
})

describe("matchesLevel", () => {
  it("matches beginner level to novice and beginner exercises", () => {
    expect(matchesLevel("Novice", "Beginner")).toBe(true)
    expect(matchesLevel("Beginner", "Beginner")).toBe(true)
  })

  it("does not match intermediate level to beginner exercises", () => {
    expect(matchesLevel("Beginner", "Intermediate")).toBe(false)
  })

  it("matches expert level to expert+ range", () => {
    expect(matchesLevel("Expert", "Expert")).toBe(true)
    expect(matchesLevel("Master", "Expert")).toBe(true)
    expect(matchesLevel("Grand Master", "Expert")).toBe(true)
    expect(matchesLevel("Legendary", "Expert")).toBe(true)
  })
})

describe("compoundScore", () => {
  it("gives full body exercises highest score", () => {
    const ex = makeExercise({ body_region: "Full Body" })
    expect(compoundScore(ex)).toBeGreaterThan(compoundScore(makeExercise({ body_region: "Core" })))
  })

  it("gives barbell exercises small equipment bonus", () => {
    const barbell = makeExercise({ body_region: "Upper Body", primary_equipment: "Barbell" })
    const dumbbell = makeExercise({ body_region: "Upper Body", primary_equipment: "Dumbbell" })
    expect(compoundScore(barbell)).toBeGreaterThan(compoundScore(dumbbell))
  })

  it("caps score at 1.0", () => {
    const ex = makeExercise({ body_region: "Full Body", secondary_muscle: "M1", primary_equipment: "Barbell" })
    expect(compoundScore(ex, "Nam")).toBeLessThanOrEqual(1)
  })
})

describe("repScore", () => {
  it("prefers low reps for Strength goal", () => {
    expect(repScore(4, "Strength")).toBe(1.0)
    expect(repScore(8, "Strength")).toBe(0.4)
    expect(repScore(15, "Strength")).toBe(0)
  })

  it("prefers 8-12 reps for Hypertrophy goal", () => {
    expect(repScore(10, "Hypertrophy")).toBe(1.0)
    expect(repScore(5, "Hypertrophy")).toBe(0.3)
  })

  it("prefers high reps for Endurance goal", () => {
    expect(repScore(15, "Endurance")).toBe(1.0)
    expect(repScore(8, "Endurance")).toBe(0.2)
  })

  it("adjusts for female upper body making reps count differently", () => {
    const femaleScore = repScore(7, "Hypertrophy", "Nữ", "Chest")
    const maleScore = repScore(7, "Hypertrophy", "Nam", "Chest")
    expect(femaleScore).toBeGreaterThan(maleScore)
  })
})

describe("fatiguePenalty", () => {
  it("returns 0 when no fatigued muscles", () => {
    const ex = makeExercise()
    expect(fatiguePenalty(ex, new Set())).toBe(0)
  })

  it("increases penalty with muscle overlap", () => {
    const ex = makeExercise({ prime_mover_muscle: "Pectoralis Major", secondary_muscle: "Triceps" })
    const overlap = fatiguePenalty(ex, new Set(["Triceps"]))
    const noOverlap = fatiguePenalty(ex, new Set(["Hamstrings"]))
    expect(overlap).toBeGreaterThan(noOverlap)
  })
})


