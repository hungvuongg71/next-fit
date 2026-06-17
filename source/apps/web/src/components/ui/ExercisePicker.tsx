"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import { Search, X } from "lucide-react"
import { Exercise, MuscleGroup, Equipment } from "@/types"
import { MOCK_EXERCISES } from "@/lib/data"
import ExerciseThumbnail from "./ExerciseThumbnail"

const MUSCLE_GROUPS: MuscleGroup[] = ["Chest", "Back", "Legs", "Shoulders", "Arms", "Core", "Cardio"]
const EQUIPMENTS: Equipment[] = ["Barbell", "Dumbbell", "Bodyweight", "Cable", "Kettlebell", "Pull-up bar", "Machine", "EZ Curl Bar"]

interface ExercisePickerProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (exercise: Exercise) => void
  excludeIds?: Set<string>
}

export default function ExercisePicker({ isOpen, onClose, onSelect, excludeIds }: ExercisePickerProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<MuscleGroup | null>(null)
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      setSearchQuery("")
      setSelectedMuscleGroup(null)
      setSelectedEquipment(null)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  const filtered = useMemo(() => {
    return MOCK_EXERCISES.filter((ex) => {
      if (excludeIds?.has(ex.id)) return false
      if (selectedMuscleGroup && ex.muscleGroup !== selectedMuscleGroup) return false
      if (selectedEquipment && ex.equipment !== selectedEquipment) return false
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        const name = ex.name.toLowerCase()
        const nameVi = ex.name_vi?.toLowerCase() ?? ""
        return name.includes(q) || nameVi.includes(q)
      }
      return true
    })
  }, [searchQuery, selectedMuscleGroup, selectedEquipment, excludeIds])

  const handleSelect = (ex: Exercise) => {
    onSelect(ex)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ background: "rgba(0,0,0,0.85)" }}
      onClick={onClose}
      role="presentation"
    >
      <div
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-t-3xl animate-slideUp"
        style={{ background: "var(--color-surface)" }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Chọn bài tập"
      >
        {/* Handle */}
        <div className="flex justify-center pt-4 pb-3" aria-hidden="true">
          <div className="w-10 h-1 rounded-full" style={{ background: "rgba(255,255,255,0.15)" }} />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pb-3">
          <h2 className="font-display font-bold text-lg" style={{ color: "var(--color-text)" }}>
            Thêm bài tập
          </h2>
          <button
            onClick={onClose}
            aria-label="Đóng"
            className="w-8 h-8 rounded-full flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)] focus-visible:ring-[var(--color-primary)]"
            style={{ background: "var(--color-surface-subtle)" }}
          >
            <X size={16} style={{ color: "var(--color-text-secondary)" }} aria-hidden="true" />
          </button>
        </div>

        {/* Search */}
        <div className="px-5 pb-3">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: "var(--color-text-secondary)" }}
              aria-hidden="true"
            />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm bài tập..."
              className="w-full h-10 pl-9 pr-3 rounded-xl font-body text-sm outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
              style={{ background: "var(--color-surface-subtle)", color: "var(--color-text)" }}
            />
          </div>
        </div>

        {/* Muscle group filter */}
        <div className="px-5 pb-3">
          <p className="font-heading font-semibold text-xs mb-2" style={{ color: "var(--color-text-secondary)" }}>
            NHÓM CƠ
          </p>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setSelectedMuscleGroup(null)}
              className="px-3 py-1.5 rounded-xl font-heading font-semibold text-xs whitespace-nowrap transition-all active:scale-95 flex-shrink-0"
              style={{
                background: selectedMuscleGroup === null ? "var(--color-primary)" : "var(--color-surface-subtle)",
                color: selectedMuscleGroup === null ? "#fff" : "var(--color-text)",
              }}
            >
              Tất cả
            </button>
            {MUSCLE_GROUPS.map((mg) => (
              <button
                key={mg}
                onClick={() => setSelectedMuscleGroup(mg === selectedMuscleGroup ? null : mg)}
                className="px-3 py-1.5 rounded-xl font-heading font-semibold text-xs whitespace-nowrap transition-all active:scale-95 flex-shrink-0"
                style={{
                  background: mg === selectedMuscleGroup ? "var(--color-primary)" : "var(--color-surface-subtle)",
                  color: mg === selectedMuscleGroup ? "#fff" : "var(--color-text)",
                }}
              >
                {mg}
              </button>
            ))}
          </div>
        </div>

        {/* Equipment filter */}
        <div className="px-5 pb-4">
          <p className="font-heading font-semibold text-xs mb-2" style={{ color: "var(--color-text-secondary)" }}>
            THIẾT BỊ
          </p>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setSelectedEquipment(null)}
              className="px-3 py-1.5 rounded-xl font-heading font-semibold text-xs whitespace-nowrap transition-all active:scale-95 flex-shrink-0"
              style={{
                background: selectedEquipment === null ? "var(--color-primary)" : "var(--color-surface-subtle)",
                color: selectedEquipment === null ? "#fff" : "var(--color-text)",
              }}
            >
              Tất cả
            </button>
            {EQUIPMENTS.map((eq) => (
              <button
                key={eq}
                onClick={() => setSelectedEquipment(eq === selectedEquipment ? null : eq)}
                className="px-3 py-1.5 rounded-xl font-heading font-semibold text-xs whitespace-nowrap transition-all active:scale-95 flex-shrink-0"
                style={{
                  background: eq === selectedEquipment ? "var(--color-primary)" : "var(--color-surface-subtle)",
                  color: eq === selectedEquipment ? "#fff" : "var(--color-text)",
                }}
              >
                {eq}
              </button>
            ))}
          </div>
        </div>

        {/* Exercise list */}
        <div className="px-5 pb-8 space-y-2">
          {filtered.length === 0 ? (
            <p className="font-body text-sm text-center py-8" style={{ color: "var(--color-text-secondary)" }}>
              Không tìm thấy bài tập nào
            </p>
          ) : (
            filtered.map((ex) => (
              <button
                key={ex.id}
                onClick={() => handleSelect(ex)}
                className="flex items-center gap-3 p-2.5 rounded-2xl w-full text-left transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
                style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
              >
                <ExerciseThumbnail
                  exercise={ex}
                  className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="font-heading font-semibold text-sm truncate" style={{ color: "var(--color-text)" }}>
                    {ex.name}
                  </p>
                  <p className="font-body text-xs mt-0.5" style={{ color: "var(--color-text-secondary)" }}>
                    {ex.muscleGroup_vi ?? ex.muscleGroup} · {ex.level_vi ?? ex.level}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
