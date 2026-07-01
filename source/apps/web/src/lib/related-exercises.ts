import { Exercise, UserCriteria } from "@/types"
import { matchesLevel } from "@/lib/split"
import type { Equipment, Level } from "@/types"

export interface ScoredExercise {
  exercise: Exercise
  score: number
}

export function relatedScore(
  exercise: Exercise,
  userEquipment: Equipment[],
  userLevel: Level | undefined,
): number {
  let score = 1

  if (userEquipment.length > 0 && userEquipment.includes(exercise.primary_equipment as Equipment)) {
    score += 3
  }

  if (userLevel && matchesLevel(exercise.difficulty_level, userLevel)) {
    score += 2
  }

  return score
}

export function getRelatedExercises(
  currentExercise: Exercise,
  allExercises: Exercise[],
  criteria: UserCriteria | null,
  maxResults = 15,
): ScoredExercise[] {
  const userEquipment = criteria?.equipment ?? []
  const userLevel = criteria?.level

  const scored = allExercises
    .filter(
      (e) =>
        e.id !== currentExercise.id &&
        e.target_muscle_group === currentExercise.target_muscle_group,
    )
    .map((exercise) => ({
      exercise,
      score: relatedScore(exercise, userEquipment, userLevel),
    }))
    .sort((a, b) => b.score - a.score)

  return scored.slice(0, maxResults)
}
