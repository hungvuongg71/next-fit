"use client"

import { useRef, useState, useCallback, useEffect, type CSSProperties } from "react"
import { ChevronRight } from "lucide-react"
import { MuscleGroup, Gender } from "@/types"
import { MUSCLE_GROUPS, MUSCLE_GROUPS_VI } from "@/constants/muscles"
import { BASE_PATH } from "@/constants/storage"

interface MuscleGroupSelectorProps {
  selected: MuscleGroup[]
  onChange: (groups: MuscleGroup[]) => void
  gender?: Gender
}

const GRADIENT_MAP: Record<string, string> = {
  Abdominals: "linear-gradient(135deg, #84cc16 0%, #65a30d 100%)",
  Abductors: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
  Adductors: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
  Back: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
  Biceps: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
  Calves: "linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)",
  Chest: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
  Forearms: "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)",
  Glutes: "linear-gradient(135deg, #eab308 0%, #ca8a04 100%)",
  Hamstrings: "linear-gradient(135deg, #d97706 0%, #b45309 100%)",
  "Hip Flexors": "linear-gradient(135deg, #a855f7 0%, #9333ea 100%)",
  Quadriceps: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
  Shins: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
  Shoulders: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
  Trapezius: "linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)",
  Triceps: "linear-gradient(135deg, #ec4899 0%, #db2777 100%)",
}

const IMAGE_MAP: Record<string, string> = {
  Abdominals: "abdominals.png",
  Abductors: "abductors.png",
  Adductors: "adductors.png",
  Back: "back.png",
  Biceps: "biceps.png",
  Calves: "calves.png",
  Chest: "chest.png",
  Forearms: "forearms.png",
  Glutes: "glutes.png",
  Hamstrings: "hamstrings.png",
  "Hip Flexors": "hip_flexors.png",
  Quadriceps: "quadriceps.png",
  Shins: "shins.png",
  Shoulders: "shoulders.png",
  Trapezius: "trapezius.png",
  Triceps: "triceps.png",
}

function folderForGender(gender?: Gender): string {
  if (gender === "Nữ") return "female"
  return "male"
}

function cardStyle(group: string, isSelected: boolean, gender?: Gender): CSSProperties {
  const folder = folderForGender(gender)
  const filename = IMAGE_MAP[group]
  const img = filename ? `${BASE_PATH}/muscles/${folder}/${filename}` : null
  const base: CSSProperties = {
    border: `2px solid ${isSelected ? "var(--color-primary)" : "transparent"}`,
    boxShadow: isSelected ? "0 0 20px rgba(var(--color-primary-rgb), 0.3)" : "none",
    opacity: isSelected ? 1 : 0.7,
  }
  if (img) {
    base.backgroundImage = `linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.75) 100%), url(${img})`
    base.backgroundSize = "cover"
    base.backgroundPosition = "center"
  } else {
    base.backgroundImage = GRADIENT_MAP[group] ?? "var(--color-surface)"
  }
  return base
}

export default function MuscleGroupSelector({ selected, onChange, gender }: MuscleGroupSelectorProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const [showHint, setShowHint] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  const dismissHint = useCallback(() => {
    setShowHint(false)
    sessionStorage.setItem("scrollHintSeen", "1")
  }, [])

  const checkScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 4)
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
  }, [])

  useEffect(() => { checkScroll() }, [checkScroll])

  useEffect(() => {
    if (canScrollRight && !sessionStorage.getItem("scrollHintSeen")) {
      setShowHint(true)
      timerRef.current = setTimeout(dismissHint, 3000)
      return () => clearTimeout(timerRef.current)
    }
  }, [canScrollRight, dismissHint])

  const toggle = (group: MuscleGroup) => {
    if (selected.includes(group)) {
      onChange(selected.filter((g) => g !== group))
    } else {
      onChange([...selected, group])
    }
  }

  return (
    <div className="relative">
      {canScrollLeft && (
        <div
          className="absolute left-0 top-0 bottom-1 w-6 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to right, var(--color-bg), transparent)" }}
        />
      )}
      {canScrollRight && (
        <div
          className="absolute right-0 top-0 bottom-1 w-6 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to left, var(--color-bg), transparent)" }}
        />
      )}
        {canScrollRight && showHint && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2 z-20 pointer-events-none animate-fadeIn">
            <div
              className="flex items-center gap-1 px-2 py-1 rounded-lg text-[9px] font-heading font-semibold whitespace-nowrap"
              style={{
                background: "var(--color-primary)",
                color: "#fff",
                boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
              }}
            >
              Vuốt để xem thêm
              <ChevronRight size={10} aria-hidden="true" />
            </div>
          </div>
        )}
        <div
          ref={scrollRef}
          onScroll={(e) => {
            if (showHint) dismissHint()
            checkScroll()
          }}
          className="flex gap-2 overflow-x-auto pb-1 scrollbar-none snap-x snap-mandatory"
        >
        {MUSCLE_GROUPS.map((group) => {
          const isSelected = selected.includes(group)
          return (
            <button
              key={group}
              onClick={() => toggle(group)}
              className="flex shrink-0 flex-col items-center gap-1 rounded-2xl p-3 w-20 aspect-square transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
              style={cardStyle(group, isSelected, gender)}
            >
              <span className="mt-auto font-heading text-[10px] font-bold text-white drop-shadow-sm leading-tight text-center">
                {MUSCLE_GROUPS_VI[group]}
              </span>
              {isSelected && (
                <span
                  className="flex h-4 w-4 items-center justify-center rounded-full text-[8px] font-bold"
                  style={{ background: "var(--color-primary)", color: "#fff" }}
                >
                  ✓
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
