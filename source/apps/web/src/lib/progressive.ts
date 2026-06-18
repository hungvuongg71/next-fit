import { Exercise, ExerciseLogEntry, MuscleGroup } from "@/types"
import { DYNAMIC_STRETCHES } from "@/lib/constants"

const ROTATION_WEEKS = 3

export function suggestNextWeight(logs: ExerciseLogEntry[]): { weight: number; reps: number } {
  const last = logs[logs.length - 1]
  if (!last) return { weight: 10, reps: 10 }

  if (last.reps >= 10) {
    return { weight: +(last.weight + 2.5).toFixed(1), reps: 8 }
  }

  return { weight: last.weight, reps: last.reps + 1 }
}

export interface WarmupSetSuggestion {
  exerciseName: string
  reps: number
  weight: number
}

export function suggestWarmup(
  targetMuscles: MuscleGroup[],
): { name_vi: string; duration: string }[] {
  if (targetMuscles.length === 0) return []

  const seen = new Set<string>()
  const result: { name_vi: string; duration: string }[] = []

  for (const muscle of targetMuscles) {
    const stretches = DYNAMIC_STRETCHES[muscle] ?? []
    for (const s of stretches) {
      if (!seen.has(s.name_vi) && result.length < 4) {
        seen.add(s.name_vi)
        result.push(s)
      }
    }
    if (result.length >= 4) break
  }

  return result
}

export function suggestWarmupSets(
  exercises: Exercise[],
  logs: Record<string, ExerciseLogEntry[]>,
): WarmupSetSuggestion[] {
  return exercises
    .filter((ex) => ex.equipment !== "Bodyweight")
    .map((ex) => {
      const exLogs = getLogsForExercise(logs, ex.id)
      let workingWeight = 10

      if (exLogs.length > 0) {
        workingWeight = suggestNextWeight(exLogs).weight
      } else if (ex.equipment !== "Bodyweight") {
        workingWeight = 10
      }

      const warmupWeight = Math.max(5, +(workingWeight * 0.5).toFixed(1))
      return {
        exerciseName: ex.name,
        reps: 12,
        weight: warmupWeight,
      }
    })
}

export function rotateExercise(
  exercise: Exercise,
  allExercises: Exercise[],
  recentIds: Set<string>,
): Exercise {
  if (!recentIds.has(exercise.id)) return exercise

  const variants = allExercises.filter(
    (e) =>
      e.id !== exercise.id &&
      e.muscleGroup === exercise.muscleGroup &&
      e.equipment === exercise.equipment &&
      !recentIds.has(e.id),
  )

  if (variants.length > 0) {
    return variants[Math.floor(Math.random() * variants.length)]
  }

  const sameMuscle = allExercises.filter(
    (e) =>
      e.id !== exercise.id &&
      e.muscleGroup === exercise.muscleGroup &&
      !recentIds.has(e.id),
  )

  if (sameMuscle.length > 0) {
    return sameMuscle[Math.floor(Math.random() * sameMuscle.length)]
  }

  return exercise
}

export function getLogsForExercise(
  logs: Record<string, ExerciseLogEntry[]>,
  exerciseId: string,
): ExerciseLogEntry[] {
  return logs[exerciseId] ?? []
}
