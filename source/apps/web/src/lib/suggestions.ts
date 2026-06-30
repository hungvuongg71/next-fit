import { Exercise, MuscleGroup } from "@/types"
import { MOCK_EXERCISES } from "@/lib/data"

const DEFAULT_EQUIPMENT = ["Barbell", "Dumbbell", "Cable", "Bodyweight"]
const PRIORITY_EQUIPMENT = new Set(["Barbell", "Dumbbell"])

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function suggestExercises(
  muscleGroups: MuscleGroup[],
  equipment: string[] = DEFAULT_EQUIPMENT,
  count = 6,
): Exercise[] {
  if (muscleGroups.length === 0) return []

  const targets = new Set(muscleGroups)
  const equipSet = new Set(equipment.length > 0 ? equipment : DEFAULT_EQUIPMENT)

  const pool = MOCK_EXERCISES.filter((ex) => {
    if (!targets.has(ex.target_muscle_group as MuscleGroup)) return false
    if (!equipSet.has(ex.primary_equipment)) return false
    return true
  })

  const priorityExercises = pool.filter((ex) => PRIORITY_EQUIPMENT.has(ex.primary_equipment))
  const otherExercises = pool.filter((ex) => !PRIORITY_EQUIPMENT.has(ex.primary_equipment))

  const result: Exercise[] = []
  for (const ex of shuffle(priorityExercises)) {
    if (result.length >= count) break
    result.push(ex)
  }
  for (const ex of shuffle(otherExercises)) {
    if (result.length >= count) break
    result.push(ex)
  }
  return result
}
