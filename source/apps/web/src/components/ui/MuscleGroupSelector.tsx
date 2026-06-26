"use client"

import { MuscleGroup } from "@/types"
import { MUSCLE_GROUPS, MUSCLE_GROUPS_VI } from "@/constants/muscles"

interface MuscleGroupSelectorProps {
  selected: MuscleGroup[]
  onChange: (groups: MuscleGroup[]) => void
}

const GRADIENT_MAP: Record<string, string> = {
  Chest: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
  Back: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
  Legs: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
  Shoulders: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
  Arms: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
  Core: "linear-gradient(135deg, #84cc16 0%, #65a30d 100%)",
  Cardio: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
}

export default function MuscleGroupSelector({ selected, onChange }: MuscleGroupSelectorProps) {
  const toggle = (group: MuscleGroup) => {
    if (selected.includes(group)) {
      onChange(selected.filter((g) => g !== group))
    } else {
      onChange([...selected, group])
    }
  }

  return (
    <div className="grid grid-cols-3 gap-3">
      {MUSCLE_GROUPS.map((group) => {
        const isSelected = selected.includes(group)
        return (
          <button
            key={group}
            onClick={() => toggle(group)}
            className="flex flex-col items-center gap-2 rounded-2xl p-4 transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
            style={{
              background: GRADIENT_MAP[group] ?? "var(--color-surface)",
              border: `2px solid ${isSelected ? "var(--color-primary)" : "transparent"}`,
              boxShadow: isSelected ? "0 0 20px rgba(var(--color-primary-rgb), 0.3)" : "none",
              opacity: isSelected ? 1 : 0.7,
            }}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
              <span className="text-xl font-bold text-white">
                {MUSCLE_GROUPS_VI[group]?.charAt(0) ?? "?"}
              </span>
            </div>
            <span className="font-heading text-xs font-bold text-white drop-shadow-sm">
              {MUSCLE_GROUPS_VI[group]}
            </span>
            {isSelected && (
              <span
                className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold"
                style={{ background: "var(--color-primary)", color: "#fff" }}
              >
                ✓
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
