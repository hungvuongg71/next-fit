import { describe, it, expect } from "vitest"
import { getTemplate, getAllTemplates, resolveDetailedMuscleGroups } from "../templates"

describe("getTemplate", () => {
  it("returns FullBody for 3 ngày", () => {
    const t = getTemplate("3 ngày")
    expect(t.id).toBe("FullBody")
    expect(t.days).toHaveLength(3)
  })

  it("returns UpperLower for 4 ngày", () => {
    const t = getTemplate("4 ngày")
    expect(t.id).toBe("UpperLower")
    expect(t.days).toHaveLength(4)
  })

  it("returns BroSplit for 5 ngày", () => {
    const t = getTemplate("5 ngày")
    expect(t.id).toBe("BroSplit")
    expect(t.days).toHaveLength(5)
  })

  it("returns PPL for 6 ngày", () => {
    const t = getTemplate("6 ngày")
    expect(t.id).toBe("PPL")
    expect(t.days).toHaveLength(6)
  })

  it("every day has at least one muscle group", () => {
    const t = getTemplate("4 ngày")
    for (const day of t.days) {
      expect(day.targetMuscleGroups.length).toBeGreaterThan(0)
    }
  })

  it("every day has slots", () => {
    const t = getTemplate("6 ngày")
    for (const day of t.days) {
      expect(day.slots.length).toBeGreaterThan(0)
    }
  })
})

describe("getAllTemplates", () => {
  it("returns all 5 templates", () => {
    const all = getAllTemplates()
    expect(all).toHaveLength(5)
  })
})

describe("resolveDetailedMuscleGroups", () => {
  it("expands Chest to Chest", () => {
    expect(resolveDetailedMuscleGroups(["Chest"])).toEqual(["Chest"])
  })

  it("expands Legs to multiple detailed groups", () => {
    const result = resolveDetailedMuscleGroups(["Legs"])
    expect(result).toContain("Quadriceps")
    expect(result).toContain("Hamstrings")
    expect(result).toContain("Glutes")
    expect(result).toContain("Calves")
  })

  it("expands multiple broad groups", () => {
    const result = resolveDetailedMuscleGroups(["Chest", "Back"])
    expect(result).toContain("Chest")
    expect(result).toContain("Back")
  })

  it("deduplicates when groups overlap", () => {
    const result = resolveDetailedMuscleGroups(["Arms", "Arms"])
    expect(result.filter((m) => m === "Biceps")).toHaveLength(1)
  })
})
