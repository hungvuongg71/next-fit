import { Exercise, MuscleGroup } from "@/types"
import { MOCK_EXERCISES } from "@/lib/data"
import { MUSCLE_GROUP_MAP } from "@/lib/split"

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function suggestExercises(muscleGroups: MuscleGroup[], count = 6): Exercise[] {
  if (muscleGroups.length === 0) return []

  const byGroup: Record<string, Exercise[]> = {}

  for (const group of muscleGroups) {
    const targets = MUSCLE_GROUP_MAP[group]
    if (!targets) continue

    byGroup[group] = MOCK_EXERCISES.filter((ex) => targets.includes(ex.muscleGroup))
  }

  const perGroup = Math.ceil(count / muscleGroups.length)
  const result: Exercise[] = []
  const usedIds = new Set<string>()

  for (const group of muscleGroups) {
    const pool = shuffle(byGroup[group] ?? [])
    let taken = 0
    for (const ex of pool) {
      if (taken >= perGroup) break
      if (usedIds.has(ex.id)) continue
      usedIds.add(ex.id)
      result.push(ex)
      taken++
    }
  }

  return shuffle(result).slice(0, count)
}
