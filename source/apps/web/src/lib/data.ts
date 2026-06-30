import { Exercise } from '@/types'
import exercisesData from '@/data/exercises_v2.json'

type RawExercise = {
  exercise: string
  short_youtube_demonstration: string
  in_depth_youtube_explanation: string
  difficulty_level: string
  target_muscle_group: string
  prime_mover_muscle: string
  secondary_muscle: string
  tertiary_muscle: string
  primary_equipment: string
  primary_items: number
  secondary_equipment: string
  secondary_items: number
  posture: string
  single_or_double_arm: string
  continuous_or_alternating_arms: string
  grip: string
  load_position_ending: string
  continuous_or_alternating_legs: string
  foot_elevation: string
  combination_exercises: string
  movement_pattern_1: string
  movement_pattern_2: string
  movement_pattern_3: string
  plane_of_motion_1: string
  plane_of_motion_2: string
  plane_of_motion_3: string
  body_region: string
  force_type: string
  mechanics: string
  laterality: string
  primary_exercise_classification: string
}

const rawExercises = exercisesData as RawExercise[]

export const MOCK_EXERCISES: Exercise[] = rawExercises.map((ex, i) => ({
  id: `ex-${i}`,
  name: ex.exercise,
  difficulty_level: ex.difficulty_level,
  target_muscle_group: ex.target_muscle_group.trim(),
  prime_mover_muscle: ex.prime_mover_muscle,
  secondary_muscle: ex.secondary_muscle,
  tertiary_muscle: ex.tertiary_muscle,
  primary_equipment: ex.primary_equipment,
  primary_items: ex.primary_items,
  secondary_equipment: ex.secondary_equipment,
  secondary_items: ex.secondary_items,
  posture: ex.posture,
  single_or_double_arm: ex.single_or_double_arm,
  continuous_or_alternating_arms: ex.continuous_or_alternating_arms,
  grip: ex.grip,
  load_position_ending: ex.load_position_ending,
  continuous_or_alternating_legs: ex.continuous_or_alternating_legs,
  foot_elevation: ex.foot_elevation,
  combination_exercises: ex.combination_exercises,
  movement_pattern_1: ex.movement_pattern_1,
  movement_pattern_2: ex.movement_pattern_2,
  movement_pattern_3: ex.movement_pattern_3,
  plane_of_motion_1: ex.plane_of_motion_1,
  plane_of_motion_2: ex.plane_of_motion_2,
  plane_of_motion_3: ex.plane_of_motion_3,
  body_region: ex.body_region,
  force_type: ex.force_type,
  mechanics: ex.mechanics,
  laterality: ex.laterality,
  primary_exercise_classification: ex.primary_exercise_classification,
  short_youtube_demonstration: ex.short_youtube_demonstration,
  in_depth_youtube_explanation: ex.in_depth_youtube_explanation,
}))

export const DEFAULT_EXERCISES = MOCK_EXERCISES.slice(0, 4)

export const DEFAULT_SETS = 3
export const DEFAULT_REPS = "10-12"
export const DEFAULT_REST_SECONDS = 90

export function getYouTubeThumbnailUrl(url: string | undefined | null): string | null {
  if (!url) return null
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  )
  return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : null
}

export function getExerciseImageUrl(exercise: Exercise): string | null {
  return (
    getYouTubeThumbnailUrl(exercise.in_depth_youtube_explanation) ||
    getYouTubeThumbnailUrl(exercise.short_youtube_demonstration) ||
    null
  )
}

export function getExerciseGifUrl(exercise: Exercise): string | null {
  return exercise.short_youtube_demonstration || null
}
