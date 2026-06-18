export type Gender = "Nam" | "Nữ" | "Khác"
export type Level = "Novice" | "Beginner" | "Intermediate" | "Advanced" | "Expert" | "Master" | "Grand Master" | "Legendary"
export type Goal = "Strength" | "Hypertrophy" | "Endurance"
export type MuscleGroup = "Chest" | "Back" | "Legs" | "Shoulders" | "Arms" | "Core" | "Abs" | "Cardio"
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
}

export interface SetData {
  reps: number | null
  weight: number | null
  completed: boolean
}

export interface Exercise {
  id: string
  name: string
  name_vi?: string
  muscleGroup: string
  muscleGroup_vi?: string
  muscles?: string[]
  muscles_vi?: string[]
  musclesSecondary?: string[]
  musclesSecondary_vi?: string[]
  level: Level
  level_vi?: string
  equipment: Equipment
  equipmentList?: string[]
  equipmentList_vi?: string[]
  category?: string
  category_vi?: string
  sets: number
  reps: string
  restSeconds: number
  description: string
  trainer?: string
  image?: string
  video?: string
  exerciseDbId?: string
  exerciseDbGif?: string
  exerciseDbInstructions?: string[]
  exerciseDbInstructions_vi?: string[]
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

export interface WorkoutHistoryEntry {
  id: string
  completedAt: string
  durationSeconds: number
  exercises: Exercise[]
  totalSets: number
  completedSets: number
  totalVolume: number
  criteria: UserCriteria | null
}

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
}
