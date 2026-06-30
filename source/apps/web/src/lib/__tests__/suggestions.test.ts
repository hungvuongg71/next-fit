import { describe, it, expect } from "vitest"
import { suggestExercises } from "@/lib/suggestions"

describe("suggestExercises", () => {
  it("prioritizes Barbell and Dumbbell exercises first", () => {
    const result = suggestExercises(["Back"], ["Barbell", "Kettlebell"], 30)
    const barbellCount = result.filter((ex) => ex.primary_equipment === "Barbell").length
    const kettlebellCount = result.filter((ex) => ex.primary_equipment === "Kettlebell").length

    expect(barbellCount).toBeGreaterThan(0)
    expect(kettlebellCount).toBeGreaterThan(0)
    const firstKettlebellIndex = result.findIndex((ex) => ex.primary_equipment === "Kettlebell")
    const lastBarbellIndex = result.map((ex, i) => ex.primary_equipment === "Barbell" ? i : -1).filter((i) => i >= 0).pop()!
    expect(lastBarbellIndex).toBeLessThan(firstKettlebellIndex)
  })

  it("supplements from other equipment when not enough Barbell/Dumbbell", () => {
    const result = suggestExercises(["Back"], ["Barbell", "Kettlebell"], 25)
    expect(result.length).toBe(25)

    const barbellCount = result.filter((ex) => ex.primary_equipment === "Barbell").length
    const kettlebellCount = result.filter((ex) => ex.primary_equipment === "Kettlebell").length
    expect(barbellCount + kettlebellCount).toBe(25)
    expect(kettlebellCount).toBeGreaterThan(0)
  })

  it("returns only Barbell/Dumbbell when enough exist", () => {
    const result = suggestExercises(["Back"], ["Barbell", "Dumbbell"], 6)
    expect(result.length).toBeLessThanOrEqual(6)
    for (const ex of result) {
      expect(["Barbell", "Dumbbell"]).toContain(ex.primary_equipment)
    }
  })

  it("uses default equipment with priority when none provided", () => {
    const result = suggestExercises(["Chest"], [], 30)
    expect(result.length).toBeGreaterThan(0)
    const priority = ["Barbell", "Dumbbell"]
    const priorityCount = result.filter((ex) => priority.includes(ex.primary_equipment)).length
    const nonPriorityCount = result.length - priorityCount

    expect(priorityCount).toBeGreaterThan(0)
    if (nonPriorityCount > 0) {
      const firstNonPriority = result.findIndex((ex) => !priority.includes(ex.primary_equipment))
      const lastPriority = result.map((ex, i) => priority.includes(ex.primary_equipment) ? i : -1).filter((i) => i >= 0).pop()!
      expect(lastPriority).toBeLessThan(firstNonPriority)
    }
  })

  it("returns exercises from other equipment when no Barbell/Dumbbell in list", () => {
    const result = suggestExercises(["Back"], ["Kettlebell", "Resistance Band"], 10)
    expect(result.length).toBeGreaterThan(0)
    expect(result.length).toBeLessThanOrEqual(10)
    for (const ex of result) {
      expect(["Kettlebell", "Resistance Band"]).toContain(ex.primary_equipment)
    }
  })

  it("returns empty array when no muscle groups selected", () => {
    const result = suggestExercises([], ["Dumbbell"], 6)
    expect(result).toEqual([])
  })

  it("returns empty array when no exercise matches muscle+equipment", () => {
    const result = suggestExercises(["Shins"], ["Barbell"], 6)
    expect(result).toEqual([])
  })

  it("returns correct count", () => {
    const result = suggestExercises(["Chest"], ["Dumbbell"], 3)
    expect(result.length).toBeLessThanOrEqual(3)
  })

  it("returns shuffled results within priority group on consecutive calls", () => {
    const results1 = suggestExercises(["Chest"], ["Dumbbell"], 27)
    const results2 = suggestExercises(["Chest"], ["Dumbbell"], 27)
    const sameOrder = results1.every((ex, i) => ex.id === results2[i]?.id)
    expect(sameOrder).toBe(false)
  })
})
