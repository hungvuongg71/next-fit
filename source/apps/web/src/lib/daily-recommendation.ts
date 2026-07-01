import { Exercise, UserCriteria } from "@/types"
import { matchesLevel } from "@/lib/split"

const BODY_REGIONS: Record<string, string> = {
  Chest: "Upper Body",
  Shoulders: "Upper Body",
  Back: "Upper Body",
  Biceps: "Upper Body",
  Triceps: "Upper Body",
  Forearms: "Upper Body",
  Trapezius: "Upper Body",
  Quadriceps: "Lower Body",
  Hamstrings: "Lower Body",
  Glutes: "Lower Body",
  Calves: "Lower Body",
  Abductors: "Lower Body",
  Adductors: "Lower Body",
  "Hip Flexors": "Lower Body",
  Shins: "Lower Body",
  Abdominals: "Core",
}

function getRegion(group: string): string {
  return BODY_REGIONS[group] ?? "Full Body"
}

function simpleHash(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0
  }
  return Math.abs(hash)
}

export function getDailyExercise(
  allExercises: Exercise[],
  criteria: UserCriteria | null,
  recentExerciseIds: Set<string>,
  dateSeed: string,
): Exercise | null {
  const userEquipment = criteria?.equipment ?? []
  const userLevel = criteria?.level
  const equipSet = new Set(userEquipment)

  const pool = allExercises.filter((ex) => {
    if (equipSet.size > 0 && !equipSet.has(ex.primary_equipment as any)) return false
    if (userLevel && !matchesLevel(ex.difficulty_level, userLevel)) return false
    return true
  })

  if (pool.length === 0) return null

  const fresh = pool.filter((ex) => !recentExerciseIds.has(ex.id))
  const chosen = fresh.length > 0 ? fresh : pool

  const index = simpleHash(dateSeed + JSON.stringify(criteria?.level ?? "")) % chosen.length
  return chosen[index]
}

export function getMicroWorkout(
  allExercises: Exercise[],
  criteria: UserCriteria | null,
  count = 3,
): Exercise[] {
  const userEquipment = criteria?.equipment ?? []
  const userLevel = criteria?.level
  const equipSet = new Set(userEquipment)

  const pool = allExercises.filter((ex) => {
    if (equipSet.size > 0 && !equipSet.has(ex.primary_equipment as any)) return false
    if (userLevel && !matchesLevel(ex.difficulty_level, userLevel)) return false
    if (ex.mechanics !== "Compound") return false
    return true
  })

  const byRegion: Record<string, Exercise[]> = {}
  for (const ex of pool) {
    const region = getRegion(ex.target_muscle_group)
    if (!byRegion[region]) byRegion[region] = []
    byRegion[region].push(ex)
  }

  const regions = Object.keys(byRegion)
  const index = simpleHash(String(Date.now())) % regions.length
  const firstRegion = regions[index]
  const remaining = regions.filter((r) => r !== firstRegion)

  const result: Exercise[] = []
  const used = new Set<string>()

  function pickOne(region: string) {
    const candidates = (byRegion[region] ?? []).filter((ex) => !used.has(ex.id))
    if (candidates.length === 0) return null
    const idx = simpleHash(region + candidates.length.toString()) % candidates.length
    used.add(candidates[idx].id)
    return candidates[idx]
  }

  const first = pickOne(firstRegion)
  if (first) result.push(first)

  for (const region of remaining) {
    if (result.length >= count) break
    const ex = pickOne(region)
    if (ex) result.push(ex)
  }

  if (result.length < count) {
    const fallback = allExercises.filter(
      (ex) => !used.has(ex.id) && equipSet.size > 0 && equipSet.has(ex.primary_equipment as any),
    )
    for (const ex of fallback) {
      if (result.length >= count) break
      result.push(ex)
    }
  }

  return result
}
