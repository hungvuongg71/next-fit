export type Gender = "Nam" | "Nữ" | "Khác"
export type Level = "Novice" | "Beginner" | "Intermediate" | "Advanced" | "Expert" | "Master" | "Grand Master" | "Legendary"
export type Goal = "Strength" | "Hypertrophy" | "Endurance"
export type MuscleGroup =
  | "Abdominals" | "Abductors" | "Adductors"
  | "Back" | "Biceps"
  | "Calves" | "Chest"
  | "Forearms"
  | "Glutes"
  | "Hamstrings" | "Hip Flexors"
  | "Quadriceps"
  | "Shins" | "Shoulders"
  | "Trapezius" | "Triceps"
export type Duration = "15 min" | "30 min" | "45 min" | "60+ min"
export type Equipment =
  | "Ab Wheel"
  | "Barbell"
  | "Battle Ropes"
  | "Bodyweight"
  | "Bulgarian Bag"
  | "Cable"
  | "Climbing Rope"
  | "Clubbell"
  | "Dumbbell"
  | "EZ Bar"
  | "Gymnastic Rings"
  | "Heavy Sandbag"
  | "Indian Club"
  | "Kettlebell"
  | "Landmine"
  | "Macebell"
  | "Medicine Ball"
  | "Miniband"
  | "Parallette Bars"
  | "Pull Up Bar"
  | "Resistance Band"
  | "Sandbag"
  | "Slam Ball"
  | "Sled"
  | "Sliders"
  | "Stability Ball"
  | "Superband"
  | "Suspension Trainer"
  | "Tire"
  | "Trap Bar"
  | "Wall Ball"
  | "Weight Plate"
export type Frequency = "3 ngày" | "4 ngày" | "5 ngày" | "6 ngày"

export interface UserCriteria {
  gender?: Gender
  level?: Level
  goal?: Goal
  muscleGroups: MuscleGroup[]
  duration?: Duration
  equipment: Equipment[]
  frequency?: Frequency
  weight?: number
  height?: number
}

export interface SetData {
  reps: number | null
  weight: number | null
  completed: boolean
}

export interface Exercise {
  id: string
  name: string
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
  short_youtube_demonstration: string
  in_depth_youtube_explanation: string
}

export interface WorkoutSet extends SetData {
  restTaken?: number
  isWarmup?: boolean
}

export interface ExerciseProgress {
  exercise: Exercise
  sets: WorkoutSet[]
  currentSet: number
  completed: boolean
}

export interface ExerciseCompletion {
  exercise: Exercise
  sets: WorkoutSet[]
}

export interface WorkoutHistoryEntry {
  id: string
  completedAt: string
  durationSeconds: number
  exercises: Exercise[]
  totalSets: number
  completedSets: number
  totalVolume: number
  criteria: UserCriteria | null
  exerciseDetails?: ExerciseCompletion[]
}

export interface ExerciseLogEntry {
  date: string
  weight: number
  reps: number
  sets: number
}

export interface WorkoutSessionLog {
  id: string
  date: string
  exerciseLogs: Record<string, ExerciseLogEntry[]>
}

export interface WarmupExercise {
  name: string
  name_vi: string
  duration: string
  muscleGroups: MuscleGroup[]
}

import type { WeeklyPlan } from "@/lib/weekly-plan/types"

export interface AppState {
  isFirstVisit: boolean
  cookiesAccepted: boolean
  storagePreferenceAnswered: boolean
  criteria: UserCriteria | null
  todayExercises: Exercise[]
  workoutStarted: boolean
  workoutCompleted: boolean
  currentExerciseIndex: number
  exerciseProgress: ExerciseProgress[]
  workoutHistory: WorkoutHistoryEntry[]
  lastPerformances: Record<string, { reps: number; weight: number }>
  weeklyPlan: WeeklyPlan | null
}
