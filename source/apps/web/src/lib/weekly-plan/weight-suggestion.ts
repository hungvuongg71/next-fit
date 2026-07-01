import type { Exercise, Level, Gender } from "@/types"

const UPPER_COMPOUND_FACTOR: Record<Level, [number, number]> = {
  Novice: [0.3, 0.4],
  Beginner: [0.4, 0.5],
  Intermediate: [0.6, 0.8],
  Advanced: [0.8, 1.0],
  Expert: [0.9, 1.1],
  Master: [1.0, 1.2],
  "Grand Master": [1.1, 1.3],
  Legendary: [1.2, 1.5],
}

const LOWER_COMPOUND_FACTOR: Record<Level, [number, number]> = {
  Novice: [0.5, 0.7],
  Beginner: [0.6, 0.8],
  Intermediate: [0.8, 1.2],
  Advanced: [1.2, 1.5],
  Expert: [1.3, 1.6],
  Master: [1.5, 1.8],
  "Grand Master": [1.6, 2.0],
  Legendary: [1.8, 2.2],
}

const ACCESSORY_FACTOR: Record<Level, [number, number]> = {
  Novice: [0.2, 0.3],
  Beginner: [0.3, 0.4],
  Intermediate: [0.4, 0.6],
  Advanced: [0.6, 0.8],
  Expert: [0.7, 0.9],
  Master: [0.8, 1.0],
  "Grand Master": [0.9, 1.1],
  Legendary: [1.0, 1.2],
}

const FEMALE_UPPER_MULTIPLIER = 0.7

const COMPOUND_UPPER_MUSCLES = new Set([
  "Back",
  "Chest",
  "Shoulders",
  "Triceps",
  "Trapezius",
])

const COMPOUND_LOWER_MUSCLES = new Set([
  "Quadriceps",
  "Hamstrings",
  "Glutes",
  "Adductors",
  "Abductors",
  "Calves",
])

const BARBELL_DUMBBELL = new Set(["Barbell", "Dumbbell", "Trap Bar"])

function classifyExercise(exercise: Exercise): "upperCompound" | "lowerCompound" | "accessory" {
  const isPrimaryCompound = BARBELL_DUMBBELL.has(exercise.primary_equipment) &&
    ["Full Body", "Upper Body", "Lower Body"].includes(exercise.body_region ?? "")

  if (!isPrimaryCompound) return "accessory"

  if (COMPOUND_UPPER_MUSCLES.has(exercise.target_muscle_group)) return "upperCompound"
  if (COMPOUND_LOWER_MUSCLES.has(exercise.target_muscle_group)) return "lowerCompound"

  if (exercise.body_region === "Full Body") return "lowerCompound"

  return "accessory"
}

function roundToNearest(value: number, increment: number): number {
  return Math.round(value / increment) * increment
}

export function suggestWeight(
  exercise: Exercise,
  bodyWeight: number,
  level: Level,
  gender?: Gender,
  lastPerformance?: { reps: number; weight: number },
): number | undefined {
  if (lastPerformance) return lastPerformance.weight

  const classification = classifyExercise(exercise)
  if (classification === "accessory") return undefined

  const factorMap = classification === "upperCompound"
    ? UPPER_COMPOUND_FACTOR
    : LOWER_COMPOUND_FACTOR

  const [minFactor, maxFactor] = factorMap[level] ?? [0.4, 0.6]
  const avgFactor = (minFactor + maxFactor) / 2

  let adjustedFactor = avgFactor
  if (gender === "Nữ" && classification === "upperCompound") {
    adjustedFactor *= FEMALE_UPPER_MULTIPLIER
  }

  const rawWeight = bodyWeight * adjustedFactor
  return roundToNearest(rawWeight, 2.5)
}

function formatWeight(weight: number | undefined): string {
  if (weight === undefined) return "Bodyweight"
  return `${weight} kg`
}
