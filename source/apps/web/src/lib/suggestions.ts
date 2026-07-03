import { Exercise, MuscleGroup } from "@/types"
import { MOCK_EXERCISES_WITH_VIDEO } from "@/lib/data"

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
  perGroup = 0,
): Exercise[] {
  if (muscleGroups.length === 0) return []

  const equipSet = new Set(equipment.length > 0 ? equipment : DEFAULT_EQUIPMENT)

  const equipFilter = (ex: Exercise) => equipSet.has(ex.primary_equipment)

  if (perGroup > 0) {
    const result: Exercise[] = []
    const seenIds = new Set<string>()
    for (const group of muscleGroups) {
      if (result.length >= count) break
      const pool = MOCK_EXERCISES_WITH_VIDEO.filter((ex) => {
        if (ex.target_muscle_group !== group) return false
        if (!equipFilter(ex)) return false
        if (seenIds.has(ex.id)) return false
        return true
      })
      for (const ex of shuffle(pool)) {
        if (result.length >= count || result.filter((r) => r.target_muscle_group === group).length >= perGroup) break
        result.push(ex)
        seenIds.add(ex.id)
      }
    }
    return result
  }

  const targets = new Set(muscleGroups)

  const pool = MOCK_EXERCISES_WITH_VIDEO.filter((ex) => {
    if (!targets.has(ex.target_muscle_group as MuscleGroup)) return false
    if (!equipFilter(ex)) return false
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
