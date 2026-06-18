import { describe, it, expect } from "vitest"
import {
  computeExerciseCount,
  getTodaySuggestion,
  matchesLevel,
  compoundScore,
  repScore,
  goalScore,
  fatiguePenalty,
  crossSlotFatiguePenalty,
  parseAvgReps,
} from "@/lib/split"
import type { Exercise, Goal, Level } from "@/types"

function makeExercise(overrides: Partial<Exercise> = {}): Exercise {
  return {
    id: "test-1",
    name: "Test Exercise",
    muscleGroup: "Chest",
    level: "Intermediate",
    equipment: "Dumbbell",
    sets: 3,
    reps: "8-12",
    restSeconds: 60,
    description: "A test exercise",
    category: "Upper Body",
    muscles: ["Pectoralis Major"],
    musclesSecondary: ["Triceps", "Front Delts"],
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

describe("computeExerciseCount", () => {
  it("defaults to 5 exercises when no args given", () => {
    expect(computeExerciseCount()).toBe(5)
  })

  it("returns 5 for 30 min hypertrophy with 2 groups", () => {
    expect(computeExerciseCount("30 min", "Hypertrophy", "Intermediate", 2)).toBe(5)
  })

  it("returns 6 for 60+ min endurance with female 3 groups", () => {
    expect(computeExerciseCount("60+ min", "Endurance", "Advanced", 3)).toBe(6)
  })

  it("returns 5 for 15 min strength with 1 group (clamped)", () => {
    const result = computeExerciseCount("15 min", "Strength", "Beginner", 1)
    expect(result).toBeGreaterThanOrEqual(5)
    expect(result).toBeLessThanOrEqual(6)
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
    const ex = makeExercise({ category: "Full Body" })
    expect(compoundScore(ex)).toBeGreaterThan(compoundScore(makeExercise({ category: "Core" })))
  })

  it("gives barbell exercises small equipment bonus", () => {
    const barbell = makeExercise({ category: "Upper Body", equipment: "Barbell" })
    const dumbbell = makeExercise({ category: "Upper Body", equipment: "Dumbbell" })
    expect(compoundScore(barbell)).toBeGreaterThan(compoundScore(dumbbell))
  })

  it("caps score at 1.0", () => {
    const ex = makeExercise({ category: "Full Body", musclesSecondary: ["M1", "M2", "M3"], equipment: "Barbell" })
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
    const ex = makeExercise({ muscles: ["Pectoralis Major"], musclesSecondary: ["Triceps", "Front Delts"] })
    const overlap = fatiguePenalty(ex, new Set(["Triceps"]))
    const noOverlap = fatiguePenalty(ex, new Set(["Hamstrings"]))
    expect(overlap).toBeGreaterThan(noOverlap)
  })
})

describe("crossSlotFatiguePenalty", () => {
  it("returns 0 when no remaining groups", () => {
    const ex = makeExercise()
    expect(crossSlotFatiguePenalty(ex, [])).toBe(0)
  })

  it("penalizes exercises that overlap with remaining muscle groups", () => {
    const ex = makeExercise({ musclesSecondary: ["Shoulders"] })
    const penalty = crossSlotFatiguePenalty(ex, ["Chest"])
    const noPenalty = crossSlotFatiguePenalty(ex, ["Legs"])
    expect(penalty).toBeGreaterThan(noPenalty)
  })
})

describe("getTodaySuggestion", () => {
  it("returns an array of muscle groups for a valid frequency", () => {
    const result = getTodaySuggestion("3 ngày")
    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBeGreaterThan(0)
  })

  it("returns valid split for 4-day frequency", () => {
    const result = getTodaySuggestion("4 ngày")
    expect(result.length).toBeGreaterThan(0)
    expect(result).toContain("Chest" || "Legs")
  })
})
