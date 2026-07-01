import { describe, it, expect } from "vitest"
import { getTemplate } from "../templates"

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


