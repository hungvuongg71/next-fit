import { Exercise, MuscleGroup, Level, Goal, Gender, Duration, Frequency, UserCriteria, WorkoutHistoryEntry } from "@/types"
import { MOCK_EXERCISES } from "@/lib/data"
import { rotateExercise } from "@/lib/progressive"

export const MUSCLE_GROUP_MAP: Record<MuscleGroup, string[]> = {
  Chest: ["Chest"],
  Back: ["Back"],
  Legs: ["Quadriceps", "Hamstrings", "Glutes", "Calves", "Adductors", "Abductors", "Hip Flexors", "Shins"],
  Shoulders: ["Shoulders", "Trapezius"],
  Arms: ["Biceps", "Triceps", "Forearms"],
  Core: ["Abdominals"],
  Abs: ["Abdominals"],
  Cardio: ["Cardio"],
}

const UPPER_BODY_GROUPS = new Set([
  "Chest", "Shoulders", "Back", "Biceps", "Triceps", "Forearms", "Trapezius",
])

const LOWER_BODY_GROUPS = new Set([
  "Quadriceps", "Hamstrings", "Glutes", "Calves", "Adductors", "Abductors",
])

const UPPER_UI_GROUPS: MuscleGroup[] = ["Chest", "Shoulders", "Arms", "Back"]

const GENDER_VOLUME_BIAS: Record<Gender, { upper: number; lower: number }> = {
  Nam: { upper: 1.3, lower: 0.7 },
  Nữ: { upper: 0.7, lower: 1.3 },
  Khác: { upper: 1.0, lower: 1.0 },
}

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

function getSeed(criteria: UserCriteria): number {
  const today = new Date()
  const dateStr = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`
  const key = `${dateStr}|${JSON.stringify({
    muscleGroups: criteria.muscleGroups,
    equipment: criteria.equipment,
    level: criteria.level,
    goal: criteria.goal,
    gender: criteria.gender,
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

export function computeExerciseCount(
  duration?: Duration,
  goal?: Goal,
  level?: Level,
  groupsCount?: number,
): number {
  const base: Record<Duration, number> = {
    "15 min": 5,
    "30 min": 5,
    "45 min": 6,
    "60+ min": 6,
  }

  const goalAdj: Record<Goal, number> = {
    Strength: -1,
    Hypertrophy: 0,
    Endurance: +1,
  }

  const levelAdj = !level || level === "Novice" || level === "Beginner"
    ? -1
    : level === "Advanced" || level === "Expert"
      ? +1
      : 0

  const groupAdj = !groupsCount || groupsCount >= 4
    ? +1
    : groupsCount <= 1
      ? -1
      : 0

  const raw = (base[duration ?? "30 min"] ?? 5) + (goalAdj[goal ?? "Hypertrophy"]) + levelAdj + groupAdj
  return Math.max(5, Math.min(6, raw))
}

function distributeSlotCounts(
  groups: MuscleGroup[],
  totalCount: number,
  gender?: Gender,
): number[] {
  if (!gender || gender === "Khác") {
    const perSlot = Math.max(1, Math.floor(totalCount / groups.length))
    return groups.map(() => perSlot)
  }

  const bias = GENDER_VOLUME_BIAS[gender] ?? { upper: 1.0, lower: 1.0 }
  const raw = groups.map((g) =>
    UPPER_UI_GROUPS.includes(g) ? bias.upper : bias.lower,
  )
  const sum = raw.reduce((a, b) => a + b, 0)
  return raw.map((r) => Math.max(1, Math.round((r / sum) * totalCount)))
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

function getSlotSeed(criteria: UserCriteria, slotIndex: number): number {
  const base = getSeed(criteria)
  return hashCode(`${base}|slot:${slotIndex}`)
}

export function fatiguePenalty(ex: Exercise, fatiguedMuscles: Set<string>): number {
  if (fatiguedMuscles.size === 0) return 0
  const allMuscles = [...(ex.muscles ?? []), ...(ex.musclesSecondary ?? [])]
  const overlap = allMuscles.filter((m) => fatiguedMuscles.has(m)).length
  return overlap * 0.15
}

function selectForSlot(
  candidates: Exercise[],
  count: number,
  goal: Goal,
  slotSeed: number,
  fatiguedMuscles: Set<string>,
  recentIds: Set<string>,
  gender?: string,
  extraExcludeIds?: Set<string>,
): Exercise[] {
  const preferred = candidates.filter((e) => !recentIds.has(e.id))
  const fallback = candidates.filter((e) => recentIds.has(e.id))

  const ranked = [...preferred, ...fallback]
    .map((ex) => {
      const base = goalScore(ex, goal, gender)
      const fatigue = fatiguePenalty(ex, fatiguedMuscles)
      const excludePenalty = extraExcludeIds?.has(ex.id) ? 0.5 : 0
      return { ex, score: base - fatigue - excludePenalty, tiebreaker: seededRandom(slotSeed + hashCode(ex.id)) }
    })
    .sort((a, b) => b.score - a.score || a.tiebreaker - b.tiebreaker)
    .map(({ ex }) => ex)

  const selected = ranked.slice(0, count)
  for (const ex of selected) {
    for (const m of ex.musclesSecondary ?? []) {
      fatiguedMuscles.add(m)
    }
  }
  return selected
}

const SECONDARY_MUSCLE_MAP: Record<string, string[]> = {
  Chest: ["Shoulders", "Arms"],
  Back: ["Shoulders", "Arms"],
  Shoulders: ["Arms"],
}

export function crossSlotFatiguePenalty(
  ex: Exercise,
  remainingGroups: MuscleGroup[],
): number {
  const allMuscles = [...(ex.muscles ?? []), ...(ex.musclesSecondary ?? [])]
  let penalty = 0
  for (const group of remainingGroups) {
    const overlaps = SECONDARY_MUSCLE_MAP[group] ?? []
    for (const m of overlaps) {
      if (allMuscles.some((em) => em.toLowerCase().includes(m.toLowerCase()))) {
        penalty += 0.08
      }
    }
  }
  return penalty
}

export function generateProgressiveExercises(
  criteria: UserCriteria | null,
  history: WorkoutHistoryEntry[],
  extraExcludeIds?: Set<string>,
  hardExcludeIds?: Set<string>,
): Exercise[] {
  if (!criteria) return MOCK_EXERCISES.slice(0, 4)

  const plainFiltered = MOCK_EXERCISES.filter(
    (ex) =>
      (criteria.equipment.length === 0 || criteria.equipment.includes(ex.equipment)) &&
      (!criteria.level || matchesLevel(ex.level, criteria.level)),
  )

  const pool = hardExcludeIds?.size
    ? plainFiltered.filter((ex) => !hardExcludeIds.has(ex.id))
    : plainFiltered
  const candidateSource = pool.length > 0 ? pool : plainFiltered

  const groupsCount = criteria.muscleGroups.length > 0
    ? criteria.muscleGroups.length
    : criteria.frequency
      ? getTodaySuggestion(criteria.frequency).length
      : 0
  const count = computeExerciseCount(criteria.duration, criteria.goal, criteria.level, groupsCount)
  const baseRecentIds = getRecentExerciseIds(history, RECENT_DAYS)
  const recentIds = extraExcludeIds?.size
    ? new Set([...baseRecentIds, ...extraExcludeIds])
    : baseRecentIds
  const goal = criteria.goal ?? "Hypertrophy"
  const gender = criteria.gender
  const fatiguedMuscles = new Set<string>()

  const activeGroups: MuscleGroup[] =
    criteria.muscleGroups.length > 0
      ? criteria.muscleGroups
      : criteria.frequency
        ? getTodaySuggestion(criteria.frequency)
        : []

  if (activeGroups.length === 0) {
    const selected = selectForSlot(candidateSource, count, goal, getSeed(criteria), fatiguedMuscles, recentIds, gender, extraExcludeIds)
    return selected.length > 0 ? selected : MOCK_EXERCISES.slice(0, 4)
  }

  const result: Exercise[] = []
  const slotCounts = distributeSlotCounts(activeGroups, count, gender)

  for (let i = 0; i < activeGroups.length; i++) {
    const group = activeGroups[i]
    if (result.length >= count) break

    const dataGroups = MUSCLE_GROUP_MAP[group]
    if (!dataGroups) continue

    const slotCandidates = candidateSource.filter((ex) => dataGroups.includes(ex.muscleGroup))
    if (slotCandidates.length === 0) continue

    const remaining = activeGroups.slice(i + 1)
    const scored = slotCandidates.map((ex) => ({
      ex,
      fatigue: crossSlotFatiguePenalty(ex, remaining),
    }))

    const slotSeed = getSlotSeed(criteria, i)
    const preferred = scored.filter((s) => !recentIds.has(s.ex.id) && !result.some((r) => r.id === s.ex.id))
    const fallback = scored.filter((s) => !preferred.includes(s))

    const ranked = [...preferred, ...fallback]
      .filter((s) => !result.some((r) => r.id === s.ex.id))
      .map((s) => ({
        ex: s.ex,
        score:
          goalScore(s.ex, goal, gender) -
          s.fatigue -
          fatiguePenalty(s.ex, fatiguedMuscles) -
          (extraExcludeIds?.has(s.ex.id) ? 0.5 : 0),
        tiebreaker: seededRandom(slotSeed + hashCode(s.ex.id)),
      }))
      .sort((a, b) => b.score - a.score || a.tiebreaker - b.tiebreaker)
      .map(({ ex }) => ex)

    const selected = ranked.slice(0, slotCounts[i])
    for (const ex of selected) {
      for (const m of ex.musclesSecondary ?? []) {
        fatiguedMuscles.add(m)
      }
    }
    result.push(...selected)
  }

  if (result.length === 0) return MOCK_EXERCISES.slice(0, 4)

  const rotated = result.map((ex) => rotateExercise(ex, candidateSource, recentIds))
  const deduped = rotated.filter(
    (ex, i, arr) => arr.findIndex((e) => e.id === ex.id) === i,
  )
  return deduped.slice(0, count)
}
