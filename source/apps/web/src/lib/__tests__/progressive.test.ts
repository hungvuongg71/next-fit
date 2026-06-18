import { describe, it, expect } from "vitest"
import { suggestNextWeight, suggestWarmup, suggestWarmupSets, rotateExercise, getLogsForExercise } from "@/lib/progressive"
import type { Exercise, ExerciseLogEntry } from "@/types"

describe("suggestNextWeight", () => {
  it("returns defaults when no history", () => {
    const result = suggestNextWeight([])
    expect(result).toEqual({ weight: 10, reps: 10 })
  })

  it("suggests weight increase when target reps met", () => {
    const logs: ExerciseLogEntry[] = [
      { date: "2024-01-01", weight: 20, reps: 10, sets: 3 },
    ]
    const result = suggestNextWeight(logs)
    expect(result.weight).toBe(22.5)
    expect(result.reps).toBe(8)
  })

  it("suggests rep increase when target not met", () => {
    const logs: ExerciseLogEntry[] = [
      { date: "2024-01-01", weight: 20, reps: 8, sets: 3 },
    ]
    const result = suggestNextWeight(logs)
    expect(result.weight).toBe(20)
    expect(result.reps).toBe(9)
  })

  it("uses last log entry only", () => {
    const logs: ExerciseLogEntry[] = [
      { date: "2024-01-01", weight: 10, reps: 10, sets: 3 },
      { date: "2024-01-08", weight: 12.5, reps: 9, sets: 3 },
    ]
    const result = suggestNextWeight(logs)
    expect(result.weight).toBe(12.5)
    expect(result.reps).toBe(10)
  })

  it("handles decimal weight correctly", () => {
    const logs: ExerciseLogEntry[] = [
      { date: "2024-01-01", weight: 27.5, reps: 10, sets: 3 },
    ]
    const result = suggestNextWeight(logs)
    expect(result.weight).toBe(30)
    expect(result.reps).toBe(8)
  })
})

describe("suggestWarmup", () => {
  it("returns empty for empty target muscles", () => {
    expect(suggestWarmup([])).toEqual([])
  })

  it("returns stretches matching target muscles", () => {
    const result = suggestWarmup(["Legs"])
    expect(result.length).toBeGreaterThan(0)
  })

  it("returns at most 4 stretches", () => {
    const result = suggestWarmup(["Chest", "Back", "Legs", "Shoulders", "Arms"])
    expect(result.length).toBeLessThanOrEqual(4)
  })

  it("deduplicates matching stretches", () => {
    const result = suggestWarmup(["Core", "Back"])
    const unique = new Set(result.map((w) => w.name_vi))
    expect(unique.size).toBe(result.length)
  })
})

describe("suggestWarmupSets", () => {
  const benchPress: Exercise = {
    id: "bench-1",
    name: "Barbell Bench Press",
    muscleGroup: "Chest",
    level: "Intermediate",
    equipment: "Barbell",
    sets: 3,
    reps: "8-12",
    restSeconds: 60,
    description: "",
  }

  const pushUp: Exercise = {
    id: "pushup-1",
    name: "Push Up",
    muscleGroup: "Chest",
    level: "Beginner",
    equipment: "Bodyweight",
    sets: 3,
    reps: "10-15",
    restSeconds: 60,
    description: "",
  }

  it("skips bodyweight exercises", () => {
    const result = suggestWarmupSets([pushUp], {})
    expect(result).toHaveLength(0)
  })

  it("generates warmup set for weighted exercise", () => {
    const result = suggestWarmupSets([benchPress], {})
    expect(result).toHaveLength(1)
    expect(result[0].reps).toBe(12)
    expect(result[0].weight).toBeGreaterThan(0)
  })

  it("uses 50% of working weight from logs", () => {
    const logs: Record<string, ExerciseLogEntry[]> = {
      "bench-1": [{ date: "2024-01-01", weight: 40, reps: 10, sets: 3 }],
    }
    const result = suggestWarmupSets([benchPress], logs)
    expect(result[0].weight).toBe(21.3)
  })
})

describe("rotateExercise", () => {
  const benchPress: Exercise = {
    id: "bench-1",
    name: "Barbell Bench Press",
    muscleGroup: "Chest",
    level: "Intermediate",
    equipment: "Barbell",
    sets: 3,
    reps: "8-12",
    restSeconds: 60,
    description: "",
  }

  const inclinePress: Exercise = {
    id: "incline-1",
    name: "Incline Barbell Press",
    muscleGroup: "Chest",
    level: "Intermediate",
    equipment: "Barbell",
    sets: 3,
    reps: "8-12",
    restSeconds: 60,
    description: "",
  }

  const pushUp: Exercise = {
    id: "pushup-1",
    name: "Push Up",
    muscleGroup: "Chest",
    level: "Beginner",
    equipment: "Bodyweight",
    sets: 3,
    reps: "10-15",
    restSeconds: 60,
    description: "",
  }

  const allExercises = [benchPress, inclinePress, pushUp]

  it("returns same exercise if not in recentIds", () => {
    const result = rotateExercise(benchPress, allExercises, new Set(["pushup-1"]))
    expect(result.id).toBe("bench-1")
  })

  it("returns variant with same equipment if available", () => {
    const recentIds = new Set(["bench-1"])
    const result = rotateExercise(benchPress, allExercises, recentIds)
    expect(result.equipment).toBe("Barbell")
    expect(result.muscleGroup).toBe("Chest")
  })

  it("falls back to same muscle group variant", () => {
    const recentIds = new Set(["bench-1", "incline-1"])
    const result = rotateExercise(benchPress, allExercises, recentIds)
    expect(result.muscleGroup).toBe("Chest")
  })

  it("returns original if no variants available", () => {
    const onlyOne = [benchPress]
    const recentIds = new Set(["bench-1"])
    const result = rotateExercise(benchPress, onlyOne, recentIds)
    expect(result.id).toBe("bench-1")
  })
})

describe("getLogsForExercise", () => {
  it("returns empty array for unknown exercise", () => {
    expect(getLogsForExercise({}, "nonexistent")).toEqual([])
  })

  it("returns logs for known exercise", () => {
    const logs: Record<string, ExerciseLogEntry[]> = {
      "ex-1": [{ date: "2024-01-01", weight: 20, reps: 10, sets: 3 }],
    }
    expect(getLogsForExercise(logs, "ex-1")).toHaveLength(1)
  })
})
