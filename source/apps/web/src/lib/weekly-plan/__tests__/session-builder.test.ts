import { describe, it, expect } from "vitest"
import { buildDaySession } from "../session-builder"
import type { SessionBuilderInput } from "../types"

const baseInput: SessionBuilderInput = {
  targetMuscleGroups: ["Chest"],
  equipment: ["Barbell", "Dumbbell", "Bodyweight"],
  level: "Intermediate",
  goal: "Hypertrophy",
  gender: "Nam",
  exerciseCount: 5,
  usedExerciseIds: new Set<string>(),
  lastPerformances: {},
  bodyWeight: 75,
}

describe("buildDaySession", () => {
  it("returns planned exercises for chest day", () => {
    const result = buildDaySession(baseInput)
    expect(result.length).toBeGreaterThan(0)
    expect(result.length).toBeLessThanOrEqual(5)
  })

  it("assigns roles to all exercises", () => {
    const result = buildDaySession(baseInput)
    for (const ex of result) {
      expect(["mainCompound", "secondaryCompound", "isolation"]).toContain(ex.role)
    }
  })

  it("assigns plannedSets, plannedReps, plannedRestSeconds", () => {
    const result = buildDaySession(baseInput)
    for (const ex of result) {
      expect(ex.plannedSets).toBeGreaterThan(0)
      expect(ex.plannedReps).toMatch(/\d+-\d+/)
      expect(ex.plannedRestSeconds).toBeGreaterThan(0)
    }
  })

  it("assigns sequential order numbers", () => {
    const result = buildDaySession(baseInput)
    for (let i = 0; i < result.length; i++) {
      expect(result[i].order).toBe(i)
    }
  })

  it("returns empty array when no exercises match", () => {
    const result = buildDaySession({
      ...baseInput,
      equipment: ["Ab Wheel"],
      targetMuscleGroups: ["Cardio"],
    })
    expect(result).toEqual([])
  })

  it("does not reuse exercises already in usedExerciseIds", () => {
    const firstRun = buildDaySession(baseInput)
    const usedIds = new Set(firstRun.map((e) => e.id))

    const secondRun = buildDaySession({
      ...baseInput,
      usedExerciseIds: usedIds,
      targetMuscleGroups: ["Chest"],
    })

    for (const ex of secondRun) {
      expect(usedIds.has(ex.id)).toBe(false)
    }
  })

  it("returns at least 1 exercise when enough candidates exist", () => {
    const result = buildDaySession(baseInput)
    expect(result.length).toBeGreaterThanOrEqual(1)
  })

  it("includes suggestedWeight for main compound exercises with barbell/dumbbell", () => {
    const result = buildDaySession(baseInput)
    const compounds = result.filter(
      (ex) => ex.role === "mainCompound" && ["Barbell", "Dumbbell", "Trap Bar"].includes(ex.primary_equipment),
    )
    for (const ex of compounds) {
      expect(ex.suggestedWeight).toBeDefined()
    }
  })

  it("handles leg day correctly", () => {
    const result = buildDaySession({
      ...baseInput,
      targetMuscleGroups: ["Quadriceps", "Hamstrings", "Glutes"],
    })
    expect(result.length).toBeGreaterThan(0)
  })

  it("handles back day correctly", () => {
    const result = buildDaySession({
      ...baseInput,
      targetMuscleGroups: ["Back"],
    })
    expect(result.length).toBeGreaterThan(0)
  })
})
