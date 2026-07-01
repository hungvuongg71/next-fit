import { WorkoutHistoryEntry } from "@/types"

export function getWeekId(date: Date): string {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  const monday = new Date(d.setDate(diff))
  return monday.toISOString().slice(0, 10)
}

export function getSessionsThisWeek(history: WorkoutHistoryEntry[]): number {
  const currentWeek = getWeekId(new Date())
  return history.filter((entry) => getWeekId(new Date(entry.completedAt)) === currentWeek).length
}

export function getCurrentStreak(history: WorkoutHistoryEntry[]): number {
  if (history.length === 0) return 0

  const dates = history.map((e) => new Date(e.completedAt).toISOString().slice(0, 10))
  const unique = [...new Set(dates)].sort().reverse()

  let streak = 0
  const today = new Date().toISOString().slice(0, 10)

  if (unique[0] !== today) {
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
    if (unique[0] !== yesterday) return 0
  }

  for (let i = 0; i < unique.length; i++) {
    const offset = unique[0] === today ? i : i + 1
    const expected = new Date(Date.now() - offset * 86400000).toISOString().slice(0, 10)
    if (unique[i] === expected) {
      streak++
    } else {
      break
    }
  }

  return streak
}

export function getTotalWorkouts(history: WorkoutHistoryEntry[]): number {
  return history.length
}

export function getTotalVolume(history: WorkoutHistoryEntry[]): number {
  return history.reduce((sum, entry) => sum + (entry.totalVolume || 0), 0)
}
