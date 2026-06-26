import { describe, it, expect } from "vitest"
import { suggestWeight, classifyExercise, formatWeight } from "../weight-suggestion"
import type { Exercise } from "@/types"

function makeEx(overrides: Partial<Exercise> = {}): Exercise {
  return {
    id: "ex1",
    name: "Test Exercise",
    muscleGroup: "Chest",
    equipment: "Barbell",
    category: "Upper Body",
    level: "Intermediate",
    sets: 4,
    reps: "6-8",
    restSeconds: 90,
    description: "Test",
    ...overrides,
  }
}

describe("classifyExercise", () => {
  it("classifies barbell chest as upperCompound", () => {
    expect(classifyExercise(makeEx({ muscleGroup: "Chest", equipment: "Barbell", category: "Upper Body" }))).toBe("upperCompound")
  })

  it("classifies barbell quad as lowerCompound", () => {
    expect(classifyExercise(makeEx({ muscleGroup: "Quadriceps", equipment: "Barbell", category: "Lower Body" }))).toBe("lowerCompound")
  })

  it("classifies bodyweight exercise as accessory", () => {
    expect(classifyExercise(makeEx({ equipment: "Bodyweight", category: "Upper Body" }))).toBe("accessory")
  })

  it("classifies cable exercise as accessory", () => {
    expect(classifyExercise(makeEx({ equipment: "Cable", category: "Upper Body" }))).toBe("accessory")
  })

  it("classifies dumbbell chest as upperCompound", () => {
    expect(classifyExercise(makeEx({ equipment: "Dumbbell", category: "Upper Body" }))).toBe("upperCompound")
  })
})

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
    const result = suggestWeight(makeEx({ equipment: "Cable", category: "Upper Body" }), 80, "Intermediate")
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

describe("formatWeight", () => {
  it('returns "Bodyweight" for undefined', () => {
    expect(formatWeight(undefined)).toBe("Bodyweight")
  })

  it("returns formatted kg", () => {
    expect(formatWeight(60)).toBe("60 kg")
  })
})
