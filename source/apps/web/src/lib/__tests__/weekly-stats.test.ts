import { describe, it, expect } from "vitest"
import { getSessionsThisWeek, getCurrentStreak, getWeekId, getTotalWorkouts, getTotalVolume } from "@/lib/weekly-stats"
import type { WorkoutHistoryEntry } from "@/types"

function makeEntry(completedAt: string, overrides: Partial<WorkoutHistoryEntry> = {}): WorkoutHistoryEntry {
  return {
    id: "w-1",
    completedAt,
    durationSeconds: 1800,
    exercises: [],
    totalSets: 3,
    completedSets: 3,
    totalVolume: 1000,
    criteria: null,
    ...overrides,
  }
}

describe("getWeekId", () => {
  it("returns Monday of the week for a Wednesday", () => {
    // 2026-07-01 is a Wednesday
    const id = getWeekId(new Date("2026-07-01"))
    expect(id).toBe("2026-06-29") // Monday
  })

  it("returns Monday for a Sunday (week starts Monday)", () => {
    // 2026-07-05 is a Sunday
    const id = getWeekId(new Date("2026-07-05"))
    expect(id).toBe("2026-06-29") // Monday
  })
})

describe("getSessionsThisWeek", () => {
  it("counts sessions in the current week", () => {
    const monday = new Date()
    monday.setDate(monday.getDate() - monday.getDay() + 1)
    const entry = makeEntry(monday.toISOString())
    expect(getSessionsThisWeek([entry])).toBe(1)
  })

  it("ignores sessions from previous weeks", () => {
    const old = makeEntry("2026-01-01T00:00:00Z")
    expect(getSessionsThisWeek([old])).toBe(0)
  })

  it("returns 0 for empty history", () => {
    expect(getSessionsThisWeek([])).toBe(0)
  })
})

describe("getCurrentStreak", () => {
  it("returns 0 for empty history", () => {
    expect(getCurrentStreak([])).toBe(0)
  })

  it("returns 0 if no workout today or yesterday", () => {
    const old = makeEntry("2026-01-01T00:00:00Z")
    expect(getCurrentStreak([old])).toBe(0)
  })

  it("counts consecutive days from today", () => {
    const today = new Date().toISOString()
    const yesterday = new Date(Date.now() - 86400000).toISOString()
    const entries = [makeEntry(today), makeEntry(yesterday)]
    expect(getCurrentStreak(entries)).toBe(2)
  })

  it("counts consecutive days from yesterday if no workout today", () => {
    const yesterday = new Date(Date.now() - 86400000).toISOString()
    const twoDaysAgo = new Date(Date.now() - 2 * 86400000).toISOString()
    const entries = [makeEntry(yesterday), makeEntry(twoDaysAgo)]
    expect(getCurrentStreak(entries)).toBe(2)
  })

  it("breaks streak on gaps", () => {
    const today = new Date().toISOString()
    const threeDaysAgo = new Date(Date.now() - 3 * 86400000).toISOString()
    const entries = [makeEntry(today), makeEntry(threeDaysAgo)]
    expect(getCurrentStreak(entries)).toBe(1)
  })
})

describe("getTotalWorkouts", () => {
  it("returns history length", () => {
    const entries = [makeEntry(new Date().toISOString()), makeEntry(new Date().toISOString())]
    expect(getTotalWorkouts(entries)).toBe(2)
  })

  it("returns 0 for empty history", () => {
    expect(getTotalWorkouts([])).toBe(0)
  })
})

describe("getTotalVolume", () => {
  it("sums totalVolume across all entries", () => {
    const a = makeEntry(new Date().toISOString(), { totalVolume: 500 })
    const b = makeEntry(new Date().toISOString(), { totalVolume: 1500 })
    expect(getTotalVolume([a, b])).toBe(2000)
  })

  it("returns 0 for empty history", () => {
    expect(getTotalVolume([])).toBe(0)
  })

  it("handles entries with no totalVolume", () => {
    const a = makeEntry(new Date().toISOString(), { totalVolume: 0 })
    expect(getTotalVolume([a])).toBe(0)
  })
})
