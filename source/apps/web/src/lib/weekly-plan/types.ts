import type { Exercise, Goal, Level, UserCriteria } from "@/types"

export type SplitTemplate = "PPL" | "UpperLower" | "FullBody" | "BroSplit" | "PushPull"

export type ExerciseRole = "mainCompound" | "secondaryCompound" | "isolation"

export interface PlannedExercise extends Exercise {
  role: ExerciseRole
  plannedSets: number
  plannedReps: string
  plannedRestSeconds: number
  suggestedWeight?: number
  order: number
}

export interface DayPlan {
  dayName: string
  dayIndex: number
  targetMuscleGroups: string[]
  exercises: PlannedExercise[]
}

export interface WeeklyPlan {
  template: SplitTemplate
  generatedAt: string
  criteria: UserCriteria
  days: DayPlan[]
}

export interface ExerciseSlot {
  role: ExerciseRole
  count: number
}

export interface TemplateDayDef {
  name: string
  targetMuscleGroups: string[]
  slots: ExerciseSlot[]
}

export interface SplitTemplateConfig {
  id: SplitTemplate
  name: string
  name_vi: string
  days: TemplateDayDef[]
}

export interface VolumeConfig {
  mainCompound: { sets: [number, number]; reps: [number, number]; rest: number }
  secondaryCompound: { sets: [number, number]; reps: [number, number]; rest: number }
  isolation: { sets: [number, number]; reps: [number, number]; rest: number }
}

export interface SessionBuilderInput {
  targetMuscleGroups: string[]
  equipment: string[]
  level: Level
  goal: Goal
  gender?: string
  exerciseCount: number
  usedExerciseIds: Set<string>
  lastPerformances: Record<string, { reps: number; weight: number }>
  bodyWeight: number
}
