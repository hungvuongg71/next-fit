import type { Goal, Level } from "@/types"
import type { ExerciseRole, VolumeConfig } from "./types"

const BASELINE_VOLUME: Record<Goal, VolumeConfig> = {
  Strength: {
    mainCompound: { sets: [4, 5], reps: [3, 5], rest: 150 },
    secondaryCompound: { sets: [3, 4], reps: [6, 8], rest: 120 },
    isolation: { sets: [2, 3], reps: [8, 10], rest: 90 },
  },
  Hypertrophy: {
    mainCompound: { sets: [3, 4], reps: [6, 8], rest: 90 },
    secondaryCompound: { sets: [3, 4], reps: [8, 12], rest: 75 },
    isolation: { sets: [3, 3], reps: [12, 15], rest: 60 },
  },
  Endurance: {
    mainCompound: { sets: [2, 3], reps: [12, 15], rest: 45 },
    secondaryCompound: { sets: [2, 3], reps: [15, 20], rest: 30 },
    isolation: { sets: [2, 2], reps: [20, 25], rest: 30 },
  },
}

const LEVEL_SET_ADJUSTMENT: Record<Level, number> = {
  Beginner: -1,
  Novice: -1,
  Intermediate: 0,
  Advanced: 1,
  Expert: 1,
  Master: 2,
  "Grand Master": 2,
  Legendary: 2,
}

function getVolumeConfig(goal: Goal): VolumeConfig {
  return BASELINE_VOLUME[goal]
}

function getSetAdjustment(level: Level): number {
  return LEVEL_SET_ADJUSTMENT[level] ?? 0
}

export function computeSets(role: ExerciseRole, goal: Goal, level: Level): number {
  const config = BASELINE_VOLUME[goal][role]
  const base = Math.round((config.sets[0] + config.sets[1]) / 2)
  const adjustment = LEVEL_SET_ADJUSTMENT[level] ?? 0
  return Math.max(1, base + adjustment)
}

export function computeReps(role: ExerciseRole, goal: Goal): string {
  const config = BASELINE_VOLUME[goal][role]
  return `${config.reps[0]}-${config.reps[1]}`
}

export function computeRest(role: ExerciseRole, goal: Goal): number {
  return BASELINE_VOLUME[goal][role].rest
}

function computeWeeklyVolume(level: Level): [number, number] {
  switch (level) {
    case "Novice":
    case "Beginner":
      return [8, 12]
    case "Intermediate":
      return [12, 16]
    case "Advanced":
    case "Expert":
    case "Master":
    case "Grand Master":
    case "Legendary":
      return [16, 20]
  }
}

export function getExerciseCount(duration: string): number {
  switch (duration) {
    case "15 min":
      return 3
    case "30 min":
      return 5
    case "45 min":
      return 7
    case "60+ min":
      return 9
  }
  return 5
}

function estimateDuration(exerciseCount: number, goal: Goal): number {
  const restMap: Record<Goal, number> = { Strength: 120, Hypertrophy: 75, Endurance: 35 }
  const avgRest = restMap[goal]
  const avgSetDuration = 30
  const avgSetsPerExercise = 3
  const totalSets = exerciseCount * avgSetsPerExercise
  return totalSets * (avgSetDuration + avgRest)
}
