import type { Exercise, Level, Goal, Gender, MuscleGroup } from "@/types"
import type { SessionBuilderInput, PlannedExercise, ExerciseRole } from "./types"
import { MOCK_EXERCISES } from "@/lib/data"
import { matchesLevel, compoundScore, parseAvgReps, MUSCLE_GROUP_MAP } from "@/lib/split"
import { computeSets, computeReps, computeRest } from "./volume-manager"
import { suggestWeight } from "./weight-suggestion"

function resolveDetailed(broadGroups: string[]): Set<string> {
  const result = new Set<string>()
  for (const bg of broadGroups) {
    const mapped = MUSCLE_GROUP_MAP[bg as MuscleGroup]
    if (mapped) mapped.forEach((m: string) => result.add(m))
  }
  return result
}

function equipmentMatches(ex: Exercise, userEquipment: string[]): boolean {
  if (userEquipment.length === 0) return true
  if (userEquipment.includes(ex.equipment)) return true
  if (ex.equipmentList?.some((eq) => userEquipment.includes(eq))) return true
  return false
}

const MAIN_LIFT_EQUIPMENT = new Set(["Barbell", "Dumbbell", "Trap Bar"])

function mainLiftScore(ex: Exercise): number {
  const base = compoundScore(ex)
  const secondaryBonus = ex.musclesSecondary?.length ? 0.15 : 0
  const equipBonus = MAIN_LIFT_EQUIPMENT.has(ex.equipment) ? 0.1 : 0
  const setsBonus = (ex.sets ?? 3) >= 4 ? 0.1 : 0
  const avgReps = parseAvgReps(ex.reps)
  const repBonus = avgReps !== null && avgReps <= 8 ? 0.05 : 0
  return base + secondaryBonus + equipBonus + setsBonus + repBonus
}

function scoreByRole(ex: Exercise, role: ExerciseRole): number {
  const base = mainLiftScore(ex)

  switch (role) {
    case "mainCompound":
      return base
    case "secondaryCompound":
      return 1 - Math.abs(base - 0.6) * 0.8
    case "isolation":
      return 1 - base
  }
}

function pickExercises(
  candidates: Exercise[],
  count: number,
  role: ExerciseRole,
  usedIds: Set<string>,
): Exercise[] {
  const available = candidates.filter((ex) => !usedIds.has(ex.id))
  const scored = available
    .map((ex) => ({ ex, score: scoreByRole(ex, role) }))
    .sort((a, b) => b.score - a.score)

  return scored.slice(0, count).map((s) => s.ex)
}

export function buildDaySession(input: SessionBuilderInput): PlannedExercise[] {
  const {
    targetMuscleGroups,
    equipment,
    level,
    goal,
    gender,
    exerciseCount,
    usedExerciseIds,
    lastPerformances,
    bodyWeight,
  } = input

  const detailedGroups = resolveDetailed(targetMuscleGroups)

  const candidates = MOCK_EXERCISES.filter((ex) => {
    if (!detailedGroups.has(ex.muscleGroup)) return false
    if (!equipmentMatches(ex, equipment)) return false
    if (!matchesLevel(ex.level, level)) return false
    return true
  })

  if (candidates.length === 0) return []

  const totalSlots = exerciseCount
  const mainCount = Math.max(1, Math.round(totalSlots * 0.3))
  const secondaryCount = Math.max(1, Math.round(totalSlots * 0.35))
  const isoCount = Math.max(0, totalSlots - mainCount - secondaryCount)

  const mainExercises = pickExercises(candidates, mainCount, "mainCompound", usedExerciseIds)
  const mainIds = new Set(mainExercises.map((e) => e.id))

  const secondaryExercises = pickExercises(
    candidates,
    secondaryCount,
    "secondaryCompound",
    new Set([...usedExerciseIds, ...mainIds]),
  )
  const secondaryIds = new Set(secondaryExercises.map((e) => e.id))

  const isoExercises = pickExercises(
    candidates,
    isoCount,
    "isolation",
    new Set([...usedExerciseIds, ...mainIds, ...secondaryIds]),
  )

  const genderTyped = gender as Gender | undefined

  const allExercises = [
    ...mainExercises.map((ex): PlannedExercise => ({
      ...ex,
      role: "mainCompound" as ExerciseRole,
      plannedSets: computeSets("mainCompound", goal, level),
      plannedReps: computeReps("mainCompound", goal),
      plannedRestSeconds: computeRest("mainCompound", goal),
      suggestedWeight: suggestWeight(ex, bodyWeight, level, genderTyped, lastPerformances[ex.id]),
      order: 0,
    })),
    ...secondaryExercises.map((ex): PlannedExercise => ({
      ...ex,
      role: "secondaryCompound" as ExerciseRole,
      plannedSets: computeSets("secondaryCompound", goal, level),
      plannedReps: computeReps("secondaryCompound", goal),
      plannedRestSeconds: computeRest("secondaryCompound", goal),
      suggestedWeight: suggestWeight(ex, bodyWeight, level, genderTyped, lastPerformances[ex.id]),
      order: 0,
    })),
    ...isoExercises.map((ex): PlannedExercise => ({
      ...ex,
      role: "isolation" as ExerciseRole,
      plannedSets: computeSets("isolation", goal, level),
      plannedReps: computeReps("isolation", goal),
      plannedRestSeconds: computeRest("isolation", goal),
      suggestedWeight: suggestWeight(ex, bodyWeight, level, genderTyped, lastPerformances[ex.id]),
      order: 0,
    })),
  ]

  return allExercises.map((ex, i) => ({ ...ex, order: i }))
}
