"use client"

import { useMemo } from "react"
import { Play, Dumbbell } from "lucide-react"
import { Exercise, ExerciseLogEntry, MuscleGroup } from "@/types"
import { suggestWarmup, suggestWarmupSets } from "@/lib/progressive"

interface WarmupSectionProps {
  targetMuscles: MuscleGroup[]
  exercises: Exercise[]
  logs: Record<string, ExerciseLogEntry[]>
}

export default function WarmupSection({ targetMuscles, exercises, logs }: WarmupSectionProps) {
  const stretches = useMemo(() => suggestWarmup(targetMuscles), [targetMuscles])
  const warmupSets = useMemo(() => suggestWarmupSets(exercises, logs), [exercises, logs])

  if (stretches.length === 0 && warmupSets.length === 0) return null

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: "rgba(var(--color-primary-rgb), 0.04)",
        border: "1px solid rgba(var(--color-primary-rgb), 0.1)",
      }}
    >
      <div className="flex items-center gap-2 px-4 pt-4 pb-2">
        <Play size={14} style={{ color: "var(--color-primary)" }} aria-hidden="true" />
        <p className="font-heading font-semibold text-xs uppercase tracking-wider" style={{ color: "var(--color-primary)" }}>
          Khởi động
        </p>
      </div>

      {stretches.length > 0 && (
        <div className="px-4 pb-3">
          <p className="font-heading text-[10px] uppercase tracking-wider mb-2" style={{ color: "var(--color-text-secondary)" }}>
            Dynamic Stretches
          </p>
          <div className="grid gap-1.5">
            {stretches.map((s, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-xl px-3 py-2"
                style={{ background: "rgba(var(--color-primary-rgb), 0.06)" }}
              >
                <span className="font-heading text-xs font-semibold" style={{ color: "var(--color-text)" }}>
                  {s.name_vi}
                </span>
                <span className="font-number text-[10px]" style={{ color: "var(--color-text-secondary)" }}>
                  {s.duration}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {warmupSets.length > 0 && (
        <div className="px-4 pb-4">
          <div className="flex items-center gap-1.5 mb-2">
            <Dumbbell size={12} style={{ color: "var(--color-text-secondary)" }} aria-hidden="true" />
            <p className="font-heading text-[10px] uppercase tracking-wider" style={{ color: "var(--color-text-secondary)" }}>
              Warmup Sets
            </p>
          </div>
          <div className="grid gap-1.5">
            {warmupSets.map((ws, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-xl px-3 py-2"
                style={{ background: "rgba(var(--color-primary-rgb), 0.04)" }}
              >
                <span className="font-heading text-xs" style={{ color: "var(--color-text)" }}>
                  {ws.exerciseName}
                </span>
                <span className="font-number text-[10px]" style={{ color: "var(--color-text-secondary)" }}>
                  {ws.reps} reps × {ws.weight}kg
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
