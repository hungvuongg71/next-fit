import { Exercise, MuscleGroup, Duration, Frequency, UserCriteria, WorkoutHistoryEntry } from "@/types"
import { MOCK_EXERCISES } from "@/lib/data"

const DURATION_TO_COUNT: Record<Duration, number> = {
  "15 min": 3,
  "30 min": 5,
  "45 min": 7,
  "60+ min": 9,
}

const DAY_MS = 86_400_000
const RECENT_DAYS = 5

const SPLITS: Record<Frequency, MuscleGroup[][]> = {
  "3 ngày": [
    ["Chest", "Shoulders", "Arms"],
    ["Back", "Core"],
    ["Legs"],
  ],
  "4 ngày": [
    ["Chest", "Back", "Shoulders", "Arms"],
    ["Legs", "Core"],
    ["Chest", "Back", "Shoulders", "Arms"],
    ["Legs", "Core"],
  ],
  "5 ngày": [
    ["Chest"],
    ["Back"],
    ["Legs"],
    ["Shoulders"],
    ["Arms", "Core"],
  ],
  "6 ngày": [
    ["Chest", "Shoulders", "Arms"],
    ["Back", "Core"],
    ["Legs"],
    ["Chest", "Shoulders", "Arms"],
    ["Back", "Core"],
    ["Legs"],
  ],
}

function hashCode(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash |= 0
  }
  return hash
}

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

function shuffleWithSeed<T>(arr: T[], seed: number): T[] {
  const result = [...arr]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(seededRandom(seed + i) * (i + 1))
    const tmp = result[i]
    result[i] = result[j]
    result[j] = tmp
  }
  return result
}

function getSeed(criteria: UserCriteria): number {
  const today = new Date()
  const dateStr = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`
  const key = `${dateStr}|${JSON.stringify({
    muscleGroups: criteria.muscleGroups,
    equipment: criteria.equipment,
    level: criteria.level,
    goal: criteria.goal,
  })}`
  return hashCode(key)
}

function getRecentExerciseIds(
  history: WorkoutHistoryEntry[],
  days: number,
): Set<string> {
  const cutoff = Date.now() - days * DAY_MS
  const ids = new Set<string>()
  for (const entry of history) {
    if (new Date(entry.completedAt).getTime() > cutoff) {
      for (const ex of entry.exercises) {
        ids.add(ex.id)
      }
    }
  }
  return ids
}

export function getTodaySuggestion(frequency: Frequency): MuscleGroup[] {
  const split = SPLITS[frequency]
  if (!split || split.length === 0) return []
  const daysSinceEpoch = Math.floor(Date.now() / DAY_MS)
  const dayIndex = daysSinceEpoch % split.length
  return split[dayIndex]
}

export function getExerciseCount(duration?: Duration): number {
  return DURATION_TO_COUNT[duration ?? "30 min"] ?? 5
}

export function generateProgressiveExercises(
  criteria: UserCriteria | null,
  history: WorkoutHistoryEntry[],
): Exercise[] {
  if (!criteria) return MOCK_EXERCISES.slice(0, 4)

  const filtered = MOCK_EXERCISES.filter(
    (ex) =>
      (criteria.muscleGroups.length === 0 || criteria.muscleGroups.includes(ex.muscleGroup)) &&
      (criteria.equipment.length === 0 || criteria.equipment.includes(ex.equipment)) &&
      (!criteria.level || ex.level === criteria.level),
  )

  if (filtered.length === 0) return MOCK_EXERCISES.slice(0, 4)

  const count = getExerciseCount(criteria.duration)
  const recentIds = getRecentExerciseIds(history, RECENT_DAYS)

  const preferred = filtered.filter((e) => !recentIds.has(e.id))
  const fallback = filtered.filter((e) => recentIds.has(e.id))

  const seed = getSeed(criteria)
  const shuffledPreferred = shuffleWithSeed(preferred, seed)
  const shuffledFallback = shuffleWithSeed(fallback, seed + 1)

  const result: Exercise[] = []
  result.push(...shuffledPreferred.slice(0, count))
  if (result.length < count) {
    result.push(...shuffledFallback.slice(0, count - result.length))
  }

  return result.slice(0, count)
}
