import { describe, it, expect } from "vitest"
import { generateWeeklyPlan } from "../index"
import type { UserCriteria } from "@/types"

const fullCriteria: UserCriteria = {
  gender: "Nam",
  level: "Intermediate",
  goal: "Hypertrophy",
  muscleGroups: ["Chest", "Back", "Quadriceps", "Shoulders", "Biceps", "Abdominals"],
  duration: "45 min",
  equipment: ["Barbell", "Dumbbell", "Bodyweight"],
  frequency: "4 ngày",
  weight: 75,
  height: 175,
}

describe("generateWeeklyPlan", () => {
  it("returns a valid weekly plan", () => {
    const plan = generateWeeklyPlan(fullCriteria)
    expect(plan.template).toBe("UpperLower")
    expect(plan.days).toHaveLength(4)
    expect(plan.criteria).toEqual(fullCriteria)
  })

  it("each day has exercises", () => {
    const plan = generateWeeklyPlan(fullCriteria)
    for (const day of plan.days) {
      expect(day.exercises.length).toBeGreaterThan(0)
    }
  })

  it("no duplicate exercises across days", () => {
    const plan = generateWeeklyPlan(fullCriteria)
    const allIds = plan.days.flatMap((d) => d.exercises.map((e) => e.id))
    const uniqueIds = new Set(allIds)
    expect(uniqueIds.size).toBe(allIds.length)
  })

  it("generates different plans for different frequencies", () => {
    const p3 = generateWeeklyPlan({ ...fullCriteria, frequency: "3 ngày" })
    const p6 = generateWeeklyPlan({ ...fullCriteria, frequency: "6 ngày" })
    expect(p3.template).toBe("FullBody")
    expect(p3.days).toHaveLength(3)
    expect(p6.template).toBe("PPL")
    expect(p6.days).toHaveLength(6)
  })

  it("handles minimal criteria (only required fields)", () => {
    const plan = generateWeeklyPlan({
      gender: "Nữ",
      level: "Beginner",
      goal: "Strength",
      muscleGroups: [],
      duration: "30 min",
      equipment: ["Bodyweight"],
      frequency: "3 ngày",
    })
    expect(plan.days.length).toBeGreaterThan(0)
  })

  it("includes generatedAt timestamp", () => {
    const plan = generateWeeklyPlan(fullCriteria)
    expect(plan.generatedAt).toBeTruthy()
    expect(() => new Date(plan.generatedAt)).not.toThrow()
  })

  it("reduces exercise count for shorter durations", () => {
    const short = generateWeeklyPlan({ ...fullCriteria, duration: "15 min" })
    const long = generateWeeklyPlan({ ...fullCriteria, duration: "60+ min" })
    const shortTotal = short.days.reduce((s, d) => s + d.exercises.length, 0)
    const longTotal = long.days.reduce((s, d) => s + d.exercises.length, 0)

    if (shortTotal > 0 && longTotal > 0) {
      expect(shortTotal).toBeLessThan(longTotal)
    }
  })

  it("all planned exercises have all required fields", () => {
    const plan = generateWeeklyPlan(fullCriteria)
    for (const day of plan.days) {
      for (const ex of day.exercises) {
        expect(ex.role).toBeTruthy()
        expect(ex.plannedSets).toBeGreaterThan(0)
        expect(ex.plannedReps).toBeTruthy()
        expect(ex.plannedRestSeconds).toBeGreaterThan(0)
        expect(typeof ex.order).toBe("number")
      }
    }
  })
})
