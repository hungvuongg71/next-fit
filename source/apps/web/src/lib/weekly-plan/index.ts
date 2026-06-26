import type { UserCriteria } from "@/types"
import type { WeeklyPlan, DayPlan, SplitTemplate } from "./types"
import { getTemplate, TEMPLATES } from "./templates"
import { getExerciseCount } from "./volume-manager"
import { buildDaySession } from "./session-builder"

export function generateWeeklyPlan(criteria: UserCriteria, templateOverride?: SplitTemplate): WeeklyPlan {
  const frequency = criteria.frequency ?? "3 ngày"
  const duration = criteria.duration ?? "30 min"
  const level = criteria.level ?? "Intermediate"
  const goal = criteria.goal ?? "Hypertrophy"
  const gender = criteria.gender
  const equipment = criteria.equipment.length > 0 ? criteria.equipment : ["Bodyweight"]
  const bodyWeight = criteria.weight ?? 70

  const template = templateOverride ? TEMPLATES[templateOverride] : getTemplate(frequency)
  const exerciseCount = getExerciseCount(duration)
  const usedExerciseIds = new Set<string>()
  const lastPerformances: Record<string, { reps: number; weight: number }> = {}

  const days: DayPlan[] = template.days.map((dayDef, dayIndex) => {
    const exercises = buildDaySession({
      targetMuscleGroups: dayDef.targetMuscleGroups,
      equipment,
      level,
      goal,
      gender,
      exerciseCount,
      usedExerciseIds,
      lastPerformances,
      bodyWeight,
    })

    for (const ex of exercises) {
      usedExerciseIds.add(ex.id)
    }

    return {
      dayName: dayDef.name,
      dayIndex,
      targetMuscleGroups: dayDef.targetMuscleGroups,
      exercises,
    }
  })

  return {
    template: template.id,
    generatedAt: new Date().toISOString(),
    criteria,
    days,
  }
}
