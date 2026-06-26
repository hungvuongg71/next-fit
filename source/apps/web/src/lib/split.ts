import { Exercise, MuscleGroup, Level, Goal, Gender } from "@/types"

export const MUSCLE_GROUP_MAP: Record<MuscleGroup, string[]> = {
  Chest: ["Chest"],
  Back: ["Back"],
  Legs: ["Quadriceps", "Hamstrings", "Glutes", "Calves", "Adductors", "Abductors", "Hip Flexors", "Shins"],
  Shoulders: ["Shoulders", "Trapezius"],
  Arms: ["Biceps", "Triceps", "Forearms"],
  Core: ["Abdominals"],
  Cardio: ["Cardio"],
}

const UPPER_BODY_GROUPS = new Set([
  "Chest", "Shoulders", "Back", "Biceps", "Triceps", "Forearms", "Trapezius",
])

const LOWER_BODY_GROUPS = new Set([
  "Quadriceps", "Hamstrings", "Glutes", "Calves", "Adductors", "Abductors",
])

const LEVEL_ORDER: Record<string, number> = {
  Novice: 0,
  Beginner: 1,
  Intermediate: 2,
  Advanced: 3,
  Expert: 4,
  Master: 5,
  "Grand Master": 6,
  Legendary: 7,
}

const LEVEL_RANGE: Record<Level, [number, number]> = {
  Beginner: [0, 1],
  Intermediate: [2, 2],
  Advanced: [3, 4],
  Expert: [4, 7],
  Novice: [0, 0],
  Master: [5, 5],
  "Grand Master": [6, 6],
  Legendary: [7, 7],
}

export function matchesLevel(exerciseLevel: string, criteriaLevel: Level): boolean {
  const exRank = LEVEL_ORDER[exerciseLevel]
  const range = LEVEL_RANGE[criteriaLevel]
  if (exRank === undefined || !range) return exerciseLevel === criteriaLevel
  return exRank >= range[0] && exRank <= range[1]
}

const CATEGORY_COMPOUND_SCORE: Record<string, number> = {
  "Full Body": 1.0,
  "Lower Body": 0.7,
  "Upper Body": 0.5,
  Core: 0.3,
}

export function parseAvgReps(reps: string): number | null {
  const match = reps.match(/(\d+)\s*-\s*(\d+)/)
  if (!match) return null
  return (Number(match[1]) + Number(match[2])) / 2
}

export function compoundScore(ex: Exercise, gender?: string): number {
  const cat = CATEGORY_COMPOUND_SCORE[ex.category ?? ""] ?? 0.4
  const secondaryBonus = ex.musclesSecondary?.length ? 0.1 : 0
  const equipmentBonus = ["Barbell", "Trap Bar"].includes(ex.equipment) ? 0.05 : 0

  let genderBonus = 0
  if (gender === "Nam" && cat >= 0.5 && UPPER_BODY_GROUPS.has(ex.muscleGroup)) {
    genderBonus = 0.1
  }
  if (gender === "Nữ" && cat >= 0.5 && LOWER_BODY_GROUPS.has(ex.muscleGroup)) {
    genderBonus = 0.1
  }

  return Math.min(cat + secondaryBonus + equipmentBonus + genderBonus, 1)
}

export function repScore(
  avgReps: number,
  goal: Goal,
  gender?: string,
  muscleGroup?: string,
): number {
  const adjusted = gender === "Nữ" && UPPER_BODY_GROUPS.has(muscleGroup ?? "")
    ? avgReps * 1.15
    : avgReps

  switch (goal) {
    case "Strength":
      if (adjusted <= 4) return 1.0
      if (adjusted <= 6) return 0.8
      if (adjusted <= 8) return 0.4
      return 0
    case "Hypertrophy":
      if (adjusted >= 8 && adjusted <= 12) return 1.0
      if (adjusted >= 6 && adjusted < 8) return 0.7
      if (adjusted > 12 && adjusted <= 15) return 0.6
      return 0.3
    case "Endurance":
      if (adjusted >= 15) return 1.0
      if (adjusted >= 12) return 0.8
      if (adjusted >= 10) return 0.5
      if (adjusted >= 8) return 0.2
      return 0
  }
}

export function goalScore(ex: Exercise, goal: Goal, gender?: string): number {
  const compound = compoundScore(ex, gender)
  const avgReps = parseAvgReps(ex.reps)
  const rep = avgReps !== null ? repScore(avgReps, goal, gender, ex.muscleGroup) : 0.5

  switch (goal) {
    case "Strength":
      return compound * 0.7 + rep * 0.3
    case "Hypertrophy":
      return (1 - Math.abs(compound - 0.5)) * 0.5 + rep * 0.5
    case "Endurance":
      return (1 - compound) * 0.4 + rep * 0.6
  }
}

export function fatiguePenalty(ex: Exercise, fatiguedMuscles: Set<string>): number {
  if (fatiguedMuscles.size === 0) return 0
  const allMuscles = [...(ex.muscles ?? []), ...(ex.musclesSecondary ?? [])]
  const overlap = allMuscles.filter((m) => fatiguedMuscles.has(m)).length
  return overlap * 0.15
}
