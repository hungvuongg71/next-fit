import { Exercise } from '@/types'
import exercisesData from '@/lib/exercises.json'

export const MOCK_EXERCISES: Exercise[] = (exercisesData as { exercises: Exercise[] }).exercises

export const DEFAULT_EXERCISES = MOCK_EXERCISES.slice(0, 4)
