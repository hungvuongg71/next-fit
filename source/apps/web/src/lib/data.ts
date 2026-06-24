import { Exercise } from '@/types'
import exercisesData from '@/data/exercises.json'

const rawExercises: Exercise[] = (exercisesData as { exercises: Exercise[] }).exercises

const seen = new Set<string>()
export const MOCK_EXERCISES: Exercise[] = rawExercises.filter((ex) => {
  if (seen.has(ex.id)) return false
  seen.add(ex.id)
  return true
})

export const DEFAULT_EXERCISES = MOCK_EXERCISES.slice(0, 4)

export function getYouTubeThumbnailUrl(url: string | undefined | null): string | null {
  if (!url) return null
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  )
  return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : null
}

export function getExerciseImageUrl(exercise: Exercise): string | null {
  return (
    exercise.image ||
    getYouTubeThumbnailUrl(exercise.video) ||
    getYouTubeThumbnailUrl(exercise.exerciseDbGif) ||
    null
  )
}

export function getExerciseGifUrl(exercise: Exercise): string | null {
  return exercise.exerciseDbGif || null
}
