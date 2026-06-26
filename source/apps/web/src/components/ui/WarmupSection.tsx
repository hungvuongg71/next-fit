"use client"

import { useMemo } from "react"
import { Play } from "lucide-react"
import { MuscleGroup } from "@/types"
import { suggestWarmup } from "@/lib/progressive"

interface WarmupSectionProps {
  targetMuscles: MuscleGroup[]
}

export default function WarmupSection({ targetMuscles }: WarmupSectionProps) {
  const stretches = useMemo(() => suggestWarmup(targetMuscles), [targetMuscles])

  if (stretches.length === 0) return null

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
    </div>
  )
}
