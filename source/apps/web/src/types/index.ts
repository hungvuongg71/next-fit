export type Gender = 'Nam' | 'Nữ' | 'Khác'
export type Level = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
export type Goal = 'Strength' | 'Hypertrophy' | 'Endurance'
export type MuscleGroup = 'Chest' | 'Back' | 'Legs' | 'Shoulders' | 'Arms' | 'Core'
export type Duration = '15 min' | '30 min' | '45 min' | '60+ min'
export type Equipment = 'Barbell' | 'Dumbbell' | 'Bodyweight' | 'Cable'

export interface UserCriteria {
  gender?: Gender
  level?: Level
  goal?: Goal
  muscleGroups: MuscleGroup[]
  duration?: Duration
  equipment: Equipment[]
}

export interface SetData {
  reps: number | null
  weight: number | null
  completed: boolean
}

export interface Exercise {
  id: string
  name: string
  muscleGroup: MuscleGroup
  level: Level
  equipment: Equipment
  sets: number
  reps: string
  restSeconds: number
  description: string
  trainer?: string
  image?: string
}

export interface WorkoutSet extends SetData {
  restTaken?: number
}

export interface ExerciseProgress {
  exercise: Exercise
  sets: WorkoutSet[]
  currentSet: number
  completed: boolean
}

export interface AppState {
  isFirstVisit: boolean
  cookiesAccepted: boolean
  criteria: UserCriteria | null
  todayExercises: Exercise[]
  workoutStarted: boolean
  workoutCompleted: boolean
  currentExerciseIndex: number
  exerciseProgress: ExerciseProgress[]
}
