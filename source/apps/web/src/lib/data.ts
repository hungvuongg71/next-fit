import { Exercise } from '@/types'
import exercisesData from '@/lib/exercises.json'

const rawExercises: Exercise[] = (exercisesData as { exercises: Exercise[] }).exercises

const seen = new Set<string>()
export const MOCK_EXERCISES: Exercise[] = rawExercises.filter((ex) => {
  if (seen.has(ex.id)) return false
  seen.add(ex.id)
  return true
})

export const DEFAULT_EXERCISES = MOCK_EXERCISES.slice(0, 4)

export function getExerciseImageUrl(exercise: Exercise): string | null {
  return exercise.image || exercise.exerciseDbGif || null
}

export function getExerciseGifUrl(exercise: Exercise): string | null {
  return exercise.exerciseDbGif || null
}
