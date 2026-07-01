import { describe, it, expect } from "vitest"
import {
  computeSets,
  computeReps,
  computeRest,
  getExerciseCount,
} from "../volume-manager"

describe("computeSets", () => {
  it("returns correct sets for Strength main compound at Intermediate", () => {
    expect(computeSets("mainCompound", "Strength", "Intermediate")).toBe(5)
  })

  it("returns correct sets for Hypertrophy isolation at Beginner", () => {
    expect(computeSets("isolation", "Hypertrophy", "Beginner")).toBe(2)
  })

  it("returns correct sets for Strength main compound at Advanced", () => {
    expect(computeSets("mainCompound", "Strength", "Advanced")).toBe(6)
  })

  it("never returns less than 1", () => {
    expect(computeSets("isolation", "Endurance", "Novice")).toBeGreaterThanOrEqual(1)
  })

  it("returns different values for different roles", () => {
    const main = computeSets("mainCompound", "Hypertrophy", "Intermediate")
    const iso = computeSets("isolation", "Hypertrophy", "Intermediate")
    expect(main).toBeGreaterThanOrEqual(iso)
  })
})

describe("computeReps", () => {
  it("returns low reps for Strength main compound", () => {
    const reps = computeReps("mainCompound", "Strength")
    expect(reps).toBe("3-5")
  })

  it("returns medium reps for Hypertrophy secondary", () => {
    const reps = computeReps("secondaryCompound", "Hypertrophy")
    expect(reps).toBe("8-12")
  })

  it("returns high reps for Endurance isolation", () => {
    const reps = computeReps("isolation", "Endurance")
    expect(reps).toBe("20-25")
  })
})

describe("computeRest", () => {
  it("returns longest rest for Strength main compound", () => {
    expect(computeRest("mainCompound", "Strength")).toBe(150)
  })

  it("returns shortest rest for Endurance isolation", () => {
    expect(computeRest("isolation", "Endurance")).toBe(30)
  })
})

describe("getExerciseCount", () => {
  it("returns 3 for 15 min", () => expect(getExerciseCount("15 min")).toBe(3))
  it("returns 5 for 30 min", () => expect(getExerciseCount("30 min")).toBe(5))
  it("returns 7 for 45 min", () => expect(getExerciseCount("45 min")).toBe(7))
  it("returns 9 for 60+ min", () => expect(getExerciseCount("60+ min")).toBe(9))
  it("defaults to 5 for unknown", () => expect(getExerciseCount("unknown")).toBe(5))
})


