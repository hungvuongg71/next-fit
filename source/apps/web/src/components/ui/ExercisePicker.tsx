"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import { Search, X, Check } from "lucide-react"
import { Exercise, MuscleGroup, Equipment } from "@/types"
import { MOCK_EXERCISES } from "@/lib/data"
import { MUSCLE_GROUPS, MUSCLE_GROUPS_VI } from "@/constants/muscles"
import { EQUIPMENT, EQUIPMENT_VI, POPULAR_EQUIPMENT } from "@/constants/equipment"
import { MUSCLE_GROUP_MAP } from "@/lib/split"
import ExerciseThumbnail from "./ExerciseThumbnail"
import ExerciseModal from "./ExerciseModal"

const SORTED_EQUIPMENT = [...EQUIPMENT].sort((a, b) => {
  const aPop = POPULAR_EQUIPMENT.has(a) ? 0 : 1
  const bPop = POPULAR_EQUIPMENT.has(b) ? 0 : 1
  return aPop - bPop
})

interface ExercisePickerProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (exercises: Exercise[]) => void
  selectedIds?: Set<string>
}

export default function ExercisePicker({ isOpen, onClose, onAdd, selectedIds: externalSelected }: ExercisePickerProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<MuscleGroup>(MUSCLE_GROUPS[0])
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment>(SORTED_EQUIPMENT[0])
  const [showAllEquipment, setShowAllEquipment] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [previewExercise, setPreviewExercise] = useState<Exercise | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const filtered = useMemo(() => {
    return MOCK_EXERCISES.filter((ex) => {
      const mapped = MUSCLE_GROUP_MAP[selectedMuscleGroup]
      if (!mapped?.includes(ex.muscleGroup)) return false
      if (ex.equipment !== selectedEquipment) return false
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        const name = ex.name.toLowerCase()
        const nameVi = ex.name_vi?.toLowerCase() ?? ""
        return name.includes(q) || nameVi.includes(q)
      }
      return true
    })
  }, [searchQuery, selectedMuscleGroup, selectedEquipment])

  const allFilteredSelected = useMemo(
    () => filtered.length > 0 && filtered.every((e) => selectedIds.has(e.id)),
    [filtered, selectedIds],
  )

  useEffect(() => {
    if (isOpen) {
      setSearchQuery("")
      setSelectedMuscleGroup(MUSCLE_GROUPS[0])
      setSelectedEquipment(SORTED_EQUIPMENT[0])
      setSelectedIds(new Set(externalSelected ?? []))
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen, externalSelected])

  const toggleExercise = (ex: Exercise) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(ex.id)) next.delete(ex.id)
      else next.add(ex.id)
      return next
    })
  }

  const toggleSelectAll = () => {
    if (allFilteredSelected) {
      setSelectedIds((prev) => {
        const next = new Set(prev)
        for (const ex of filtered) next.delete(ex.id)
        return next
      })
    } else {
      setSelectedIds((prev) => {
        const next = new Set(prev)
        for (const ex of filtered) next.add(ex.id)
        return next
      })
    }
  }

  const handleSubmit = () => {
    const selected = MOCK_EXERCISES.filter((e) => selectedIds.has(e.id))
    onAdd(selected)
    onClose()
  }

  const selectedExercises = useMemo(
    () => MOCK_EXERCISES.filter((e) => selectedIds.has(e.id)),
    [selectedIds],
  )

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ background: "rgba(0,0,0,0.85)" }}
      onClick={onClose}
      role="presentation"
    >
      <div
        className="w-full max-w-lg max-h-[90vh] flex flex-col rounded-t-3xl animate-slideUp"
        style={{ background: "var(--color-surface)" }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Chọn bài tập"
      >
        {/* Handle */}
        <div className="flex justify-center pt-4 pb-3 flex-shrink-0" aria-hidden="true">
          <div className="w-10 h-1 rounded-full" style={{ background: "rgba(255,255,255,0.15)" }} />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pb-3 flex-shrink-0">
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

        {/* Scrollable area */}
        <div className="flex-1 overflow-y-auto">
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
              {MUSCLE_GROUPS.map((mg) => (
                <button
                  key={mg}
                  onClick={() => setSelectedMuscleGroup(mg)}
                  className="px-3 py-1.5 rounded-xl font-heading font-semibold text-xs whitespace-nowrap transition-all active:scale-95 flex-shrink-0"
                  style={{
                    background: mg === selectedMuscleGroup ? "var(--color-primary)" : "var(--color-surface-subtle)",
                    color: mg === selectedMuscleGroup ? "#fff" : "var(--color-text)",
                  }}
                >
                  {MUSCLE_GROUPS_VI[mg]}
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
              {SORTED_EQUIPMENT
                .filter((eq) => showAllEquipment || POPULAR_EQUIPMENT.has(eq))
                .map((eq) => (
                <button
                  key={eq}
                  onClick={() => setSelectedEquipment(eq)}
                  className="px-3 py-1.5 rounded-xl font-heading font-semibold text-xs whitespace-nowrap transition-all active:scale-95 flex-shrink-0"
                  style={{
                    background: eq === selectedEquipment ? "var(--color-primary)" : "var(--color-surface-subtle)",
                    color: eq === selectedEquipment ? "#fff" : "var(--color-text)",
                  }}
                >
                  {EQUIPMENT_VI[eq]}
                </button>
              ))}
              <button
                onClick={() => setShowAllEquipment(!showAllEquipment)}
                className="px-3 py-1.5 rounded-xl font-heading font-semibold text-xs whitespace-nowrap transition-all active:scale-95 flex-shrink-0"
                style={{
                  color: "var(--color-primary)",
                  background: "rgba(var(--color-primary-rgb), 0.08)",
                }}
              >
                {showAllEquipment ? "Thu gọn" : `Xem thêm`}
              </button>
            </div>
          </div>

          {/* Select all */}
          <div className="px-5 pb-2">
            <button
              onClick={toggleSelectAll}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl font-heading font-semibold text-xs transition-all active:scale-95"
              style={{
                color: "var(--color-primary)",
                background: "rgba(var(--color-primary-rgb), 0.08)",
              }}
            >
              <div
                className="w-4 h-4 rounded flex items-center justify-center"
                style={{
                  border: `1.5px solid var(--color-primary)`,
                  background: allFilteredSelected ? "var(--color-primary)" : "transparent",
                }}
              >
                {allFilteredSelected && <Check size={10} strokeWidth={3} style={{ color: "#fff" }} />}
              </div>
              {allFilteredSelected ? "Bỏ chọn tất cả" : `Chọn tất cả (${filtered.length})`}
            </button>
          </div>

          {/* Exercise list */}
          <div className="px-5 pb-4 space-y-2">
            {filtered.length === 0 ? (
              <p className="font-body text-sm text-center py-8" style={{ color: "var(--color-text-secondary)" }}>
                Không tìm thấy bài tập nào
              </p>
            ) : (
              filtered.map((ex) => {
                const isSelected = selectedIds.has(ex.id)
                return (
                  <button
                    key={ex.id}
                    onClick={() => toggleExercise(ex)}
                    className="flex items-center gap-3 p-2.5 rounded-2xl w-full text-left transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
                    style={{
                      background: isSelected ? "rgba(var(--color-primary-rgb), 0.1)" : "var(--color-surface)",
                      border: `1px solid ${isSelected ? "var(--color-primary)" : "var(--color-border)"}`,
                    }}
                  >
                    <div
                      className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0"
                      style={{
                        border: `1.5px solid ${isSelected ? "var(--color-primary)" : "rgba(255,255,255,0.3)"}`,
                        background: isSelected ? "var(--color-primary)" : "transparent",
                      }}
                    >
                      {isSelected && <Check size={12} strokeWidth={3} style={{ color: "#fff" }} />}
                    </div>
                    <div
                      onClick={(e) => {
                        e.stopPropagation()
                        setPreviewExercise(ex)
                      }}
                      className="flex-shrink-0 cursor-pointer"
                    >
                      <ExerciseThumbnail
                        exercise={ex}
                        className="w-12 h-12 rounded-xl object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-heading font-semibold text-sm truncate" style={{ color: "var(--color-text)" }}>
                        {ex.name}
                      </p>
                      <p className="font-body text-xs mt-0.5" style={{ color: "var(--color-text-secondary)" }}>
                        {ex.muscleGroup_vi ?? ex.muscleGroup} · {ex.level_vi ?? ex.level}
                      </p>
                    </div>
                  </button>
                )
              })
            )}
          </div>
        </div>

        {/* Sticky bottom bar */}
        <div
          className="flex-shrink-0 px-5 py-3"
          style={{
            background: "var(--color-surface)",
            borderTop: "1px solid var(--color-border)",
          }}
        >
          <button
            onClick={handleSubmit}
            className="w-full py-3.5 rounded-2xl font-heading font-bold text-sm transition-all active:scale-[0.98]"
            style={{
              background: selectedExercises.length > 0 ? "var(--color-primary)" : "var(--color-surface-subtle)",
              color: selectedExercises.length > 0 ? "#fff" : "var(--color-text-secondary)",
            }}
          >
            {selectedExercises.length > 0
              ? `Thêm ${selectedExercises.length} bài tập`
              : "Chọn bài tập"}
          </button>
        </div>
      </div>
      {previewExercise && (
        <ExerciseModal
          exercise={previewExercise}
          onClose={() => setPreviewExercise(null)}
        />
      )}
    </div>
  )
}
