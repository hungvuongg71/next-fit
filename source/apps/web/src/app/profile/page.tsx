"use client"

import { useState } from "react"
import { Activity, Check, Clock3, Dumbbell, Edit3, User } from "lucide-react"
import BottomNav from "@/components/layout/BottomNav"
import TopHeader from "@/components/layout/TopHeader"
import ThemeSwitcher from "@/components/ui/ThemeSwitcher"
import { useApp } from "@/state/context"
import type { Equipment, Gender, Goal, Level, UserCriteria } from "@/types"
import { DURATIONS, FREQUENCIES } from "@/constants/workout"
import { EQUIPMENT, EQUIPMENT_VI, POPULAR_EQUIPMENT } from "@/constants/equipment"

const GENDERS: Gender[] = ["Nam", "Nữ", "Khác"]
const LEVELS: Level[] = ["Beginner", "Intermediate", "Advanced", "Expert"]
const GOALS: Goal[] = ["Strength", "Hypertrophy", "Endurance"]

type EditableField = "gender" | "level" | "goal" | "duration" | "frequency" | "equipment" | "body"

function FieldPicker({
  field,
  criteria,
  onSelect,
}: {
  field: EditableField
  criteria: UserCriteria
  onSelect: (updated: Partial<UserCriteria>) => void
}) {
  if (field === "gender") {
    return (
      <div className="mt-3 grid grid-cols-3 gap-2">
        {GENDERS.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => onSelect({ gender: item })}
            className="min-h-10 rounded-2xl px-3 py-2 text-left font-heading text-sm font-semibold transition-all duration-200 active:scale-[0.98]"
            style={{
              background: criteria.gender === item ? "rgba(var(--color-primary-rgb), 0.18)" : "rgba(255,255,255,0.045)",
              border: `1px solid ${criteria.gender === item ? "var(--color-primary)" : "var(--color-border)"}`,
              color: "var(--color-text)",
              boxShadow: criteria.gender === item ? "var(--shadow-glow)" : "none",
            }}
          >
            <span className="flex items-center justify-between gap-2">
              {item}
              {criteria.gender === item && <Check size={14} style={{ color: "var(--color-primary)" }} aria-hidden="true" />}
            </span>
          </button>
        ))}
      </div>
    )
  }

  if (field === "level") {
    return (
      <div className="mt-3 grid gap-2">
        {LEVELS.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => onSelect({ level: item })}
            className="min-h-10 rounded-2xl px-3 py-2 text-left font-heading text-sm font-semibold transition-all duration-200 active:scale-[0.98]"
            style={{
              background: criteria.level === item ? "rgba(var(--color-primary-rgb), 0.18)" : "rgba(255,255,255,0.045)",
              border: `1px solid ${criteria.level === item ? "var(--color-primary)" : "var(--color-border)"}`,
              color: "var(--color-text)",
              boxShadow: criteria.level === item ? "var(--shadow-glow)" : "none",
            }}
          >
            <span className="flex items-center justify-between gap-2">
              {item}
              {criteria.level === item && <Check size={14} style={{ color: "var(--color-primary)" }} aria-hidden="true" />}
            </span>
          </button>
        ))}
      </div>
    )
  }

  if (field === "goal") {
    return (
      <div className="mt-3 grid gap-2">
        {GOALS.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => onSelect({ goal: item })}
            className="min-h-10 rounded-2xl px-3 py-2 text-left font-heading text-sm font-semibold transition-all duration-200 active:scale-[0.98]"
            style={{
              background: criteria.goal === item ? "rgba(var(--color-primary-rgb), 0.18)" : "rgba(255,255,255,0.045)",
              border: `1px solid ${criteria.goal === item ? "var(--color-primary)" : "var(--color-border)"}`,
              color: "var(--color-text)",
              boxShadow: criteria.goal === item ? "var(--shadow-glow)" : "none",
            }}
          >
            <span className="flex items-center justify-between gap-2">
              {item}
              {criteria.goal === item && <Check size={14} style={{ color: "var(--color-primary)" }} aria-hidden="true" />}
            </span>
          </button>
        ))}
      </div>
    )
  }

  if (field === "duration") {
    return (
      <div className="mt-3 grid grid-cols-2 gap-2">
        {DURATIONS.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => onSelect({ duration: item })}
            className="min-h-10 rounded-2xl px-3 py-2 text-left font-heading text-sm font-semibold transition-all duration-200 active:scale-[0.98]"
            style={{
              background: criteria.duration === item ? "rgba(var(--color-primary-rgb), 0.18)" : "rgba(255,255,255,0.045)",
              border: `1px solid ${criteria.duration === item ? "var(--color-primary)" : "var(--color-border)"}`,
              color: "var(--color-text)",
              boxShadow: criteria.duration === item ? "var(--shadow-glow)" : "none",
            }}
          >
            <span className="flex items-center justify-between gap-2">
              {item}
              {criteria.duration === item && <Check size={14} style={{ color: "var(--color-primary)" }} aria-hidden="true" />}
            </span>
          </button>
        ))}
      </div>
    )
  }

  if (field === "frequency") {
    return (
      <div className="mt-3 grid grid-cols-2 gap-2">
        {FREQUENCIES.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => onSelect({ frequency: item })}
            className="min-h-10 rounded-2xl px-3 py-2 text-left font-heading text-sm font-semibold transition-all duration-200 active:scale-[0.98]"
            style={{
              background: criteria.frequency === item ? "rgba(var(--color-primary-rgb), 0.18)" : "rgba(255,255,255,0.045)",
              border: `1px solid ${criteria.frequency === item ? "var(--color-primary)" : "var(--color-border)"}`,
              color: "var(--color-text)",
              boxShadow: criteria.frequency === item ? "var(--shadow-glow)" : "none",
            }}
          >
            <span className="flex items-center justify-between gap-2">
              {item}
              {criteria.frequency === item && <Check size={14} style={{ color: "var(--color-primary)" }} aria-hidden="true" />}
            </span>
          </button>
        ))}
      </div>
    )
  }

  return null
}

export default function ProfilePage() {
  const { state, setCriteria, setWeeklyPlan } = useApp()
  const criteria = state.criteria

  const [editingField, setEditingField] = useState<EditableField | null>(null)
  const [tempEquipment, setTempEquipment] = useState<Equipment[]>([])
  const [showAllEquip, setShowAllEquip] = useState(false)
  const [tempWeight, setTempWeight] = useState("")
  const [tempHeight, setTempHeight] = useState("")

  if (!criteria) {
    return (
      <div className="min-h-dvh flex items-center justify-center" style={{ background: "var(--color-bg)", color: "var(--color-text)" }}>
        <p className="font-body text-sm" style={{ color: "var(--color-text-secondary)" }}>
          Chưa có dữ liệu. Vui lòng hoàn tất onboarding trước.
        </p>
      </div>
    )
  }

  const latestWorkout = state.workoutHistory[0]

  const fieldLabels: Record<EditableField, string> = {
    gender: "Giới tính",
    level: "Trình độ",
    goal: "Mục tiêu",
    duration: "Thời lượng",
    frequency: "Tần suất",
    equipment: "Dụng cụ",
    body: "Cân nặng & Chiều cao",
  }

  function fieldValue(field: EditableField): string {
    if (!criteria) return "Chưa chọn"
    switch (field) {
      case "gender": return criteria.gender ?? "Chưa chọn"
      case "level": return criteria.level ?? "Chưa chọn"
      case "goal": return criteria.goal ?? "Chưa chọn"
      case "duration": return criteria.duration ?? "Chưa chọn"
      case "frequency": return criteria.frequency ?? "Chưa chọn"
      case "equipment": return criteria.equipment.length ? criteria.equipment.slice(0, 3).join(", ") + (criteria.equipment.length > 3 ? "..." : "") : "Chưa chọn"
      case "body": return criteria.weight && criteria.height ? `${criteria.weight}kg / ${criteria.height}cm` : "Chưa chọn"
    }
  }

  async function saveAndRegenerate(newCriteria: UserCriteria) {
    const oldStr = JSON.stringify(criteria)
    const newStr = JSON.stringify(newCriteria)
    if (oldStr === newStr) return
    setCriteria(newCriteria)
    setEditingField(null)
    const { generateWeeklyPlan } = await import("@/lib/weekly-plan")
    const plan = generateWeeklyPlan(newCriteria)
    setWeeklyPlan(plan)
  }

  function handleSingleSelect(field: EditableField, partial: Partial<UserCriteria>) {
    if (!criteria) return
    const updated: UserCriteria = { ...criteria, ...partial }
    saveAndRegenerate(updated)
  }

  function handleEquipmentDone() {
    if (!criteria) return
    const updated: UserCriteria = { ...criteria, equipment: tempEquipment }
    saveAndRegenerate(updated)
  }

  function handleBodyDone() {
    if (!criteria) return
    const w = tempWeight ? Number(tempWeight) : undefined
    const h = tempHeight ? Number(tempHeight) : undefined
    if (w !== undefined && (w < 20 || w > 300)) return
    if (h !== undefined && (h < 100 || h > 250)) return
    const updated: UserCriteria = { ...criteria, weight: w, height: h }
    saveAndRegenerate(updated)
  }

  function toggleEquipment(item: Equipment) {
    setTempEquipment((prev) =>
      prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item],
    )
  }

  function toggleEdit(field: EditableField) {
    if (!criteria) return
    setEditingField((prev) => {
      if (prev === field) return null
      if (field === "equipment") setTempEquipment([...criteria.equipment])
      if (field === "body") {
        setTempWeight(criteria.weight?.toString() ?? "")
        setTempHeight(criteria.height?.toString() ?? "")
      }
      return field
    })
  }

  function renderFieldRow(field: EditableField) {
    const isEditing = editingField === field
    return (
      <div key={field}>
        <button
          type="button"
          onClick={() => toggleEdit(field)}
          className="flex w-full items-start justify-between gap-3 py-3 text-left focus-visible:outline-none transition-all hover:opacity-80 active:scale-[0.99]"
          style={{ borderBottom: "1px solid var(--color-border)" }}
        >
          <span className="shrink-0 pt-0.5 font-body text-sm" style={{ color: "var(--color-text-secondary)" }}>
            {fieldLabels[field]}
          </span>
          <span className="flex items-start gap-1.5 text-right min-w-0">
            <span
              className="font-heading text-sm font-semibold transition-all"
              style={{ color: isEditing ? "var(--color-primary)" : "var(--color-text)" }}
            >
              {fieldValue(field)}
            </span>
            {!isEditing && (
              <Edit3 size={13} className="mt-0.5 shrink-0" style={{ color: "var(--color-text-secondary)", opacity: 0.4 }} aria-hidden="true" />
            )}
          </span>
        </button>
        {isEditing && (
          <div className="pb-4" style={{ borderBottom: "1px solid var(--color-border)" }}>
            <FieldPicker field={field} criteria={criteria!} onSelect={(partial) => handleSingleSelect(field, partial)} />
            {field === "equipment" && (
              <>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {[...EQUIPMENT]
                    .sort((a, b) => {
                      const aPop = POPULAR_EQUIPMENT.has(a) ? 0 : 1
                      const bPop = POPULAR_EQUIPMENT.has(b) ? 0 : 1
                      return aPop - bPop
                    })
                    .filter((item) => showAllEquip || POPULAR_EQUIPMENT.has(item))
                    .map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => toggleEquipment(item)}
                        className="min-h-10 rounded-2xl px-3 py-2 text-left font-heading text-sm font-semibold transition-all duration-200 active:scale-[0.98]"
                        style={{
                          background: tempEquipment.includes(item) ? "rgba(var(--color-primary-rgb), 0.18)" : "rgba(255,255,255,0.045)",
                          border: `1px solid ${tempEquipment.includes(item) ? "var(--color-primary)" : "var(--color-border)"}`,
                          color: "var(--color-text)",
                          boxShadow: tempEquipment.includes(item) ? "var(--shadow-glow)" : "none",
                        }}
                      >
                        <span className="flex items-center justify-between gap-2">
                          {EQUIPMENT_VI[item]}
                          {tempEquipment.includes(item) && <Check size={14} style={{ color: "var(--color-primary)" }} aria-hidden="true" />}
                        </span>
                      </button>
                    ))}
                </div>
                <button
                  type="button"
                  onClick={() => setShowAllEquip(!showAllEquip)}
                  className="mt-3 px-4 py-2 rounded-xl font-heading font-semibold text-xs transition-all active:scale-95"
                  style={{ color: "var(--color-primary)", background: "rgba(var(--color-primary-rgb), 0.08)" }}
                >
                  {showAllEquip ? "Thu gọn" : `Xem thêm (${EQUIPMENT.length - POPULAR_EQUIPMENT.size})`}
                </button>
                <button
                  type="button"
                  onClick={handleEquipmentDone}
                  className="mt-3 min-h-10 w-full rounded-2xl font-heading text-sm font-bold transition-all active:scale-[0.98]"
                  style={{
                    background: "var(--color-primary)",
                    color: "#fff",
                    boxShadow: "var(--shadow-glow)",
                  }}
                >
                  Xong
                </button>
              </>
            )}
            {field === "body" && (
              <>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1.5 block font-body text-xs" style={{ color: "var(--color-text-secondary)" }}>
                      Cân nặng (kg)
                    </label>
                    <input
                      type="number"
                      min={20}
                      max={300}
                      step={0.5}
                      value={tempWeight}
                      onChange={(e) => setTempWeight(e.target.value)}
                      placeholder="VD: 70"
                      className="min-h-10 w-full rounded-2xl px-4 font-heading text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
                      style={{
                        background: "rgba(255,255,255,0.045)",
                        border: "1px solid var(--color-border)",
                        color: "var(--color-text)",
                      }}
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block font-body text-xs" style={{ color: "var(--color-text-secondary)" }}>
                      Chiều cao (cm)
                    </label>
                    <input
                      type="number"
                      min={100}
                      max={250}
                      step={1}
                      value={tempHeight}
                      onChange={(e) => setTempHeight(e.target.value)}
                      placeholder="VD: 175"
                      className="min-h-10 w-full rounded-2xl px-4 font-heading text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
                      style={{
                        background: "rgba(255,255,255,0.045)",
                        border: "1px solid var(--color-border)",
                        color: "var(--color-text)",
                      }}
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleBodyDone}
                  className="mt-3 min-h-10 w-full rounded-2xl font-heading text-sm font-bold transition-all active:scale-[0.98]"
                  style={{
                    background: "var(--color-primary)",
                    color: "#fff",
                    boxShadow: "var(--shadow-glow)",
                  }}
                >
                  Xong
                </button>
              </>
            )}
          </div>
        )}
      </div>
    )
  }

  const editableFields: EditableField[] = ["gender", "level", "goal", "duration", "frequency", "equipment", "body"]

  return (
    <div className="min-h-dvh" style={{ background: "var(--color-bg)", color: "var(--color-text)" }}>
      <TopHeader title="Hồ sơ" subtitle="Tiêu chí & tùy chỉnh" />

      <main className="mx-auto grid w-full max-w-4xl gap-5 px-4 pb-28 pt-5 md:px-6">
        <section
          className="relative overflow-hidden rounded-[30px] p-5"
          style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
        >
          <div
            className="pointer-events-none absolute -right-14 -top-16 h-44 w-44 rounded-full blur-3xl"
            style={{ background: "rgba(var(--color-primary-rgb), 0.2)" }}
            aria-hidden="true"
          />
          <div className="relative flex items-center gap-4">
            <div
              className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[28px]"
              style={{ background: "rgba(var(--color-primary-rgb), 0.14)", border: "1px solid rgba(var(--color-primary-rgb), 0.28)" }}
            >
              <User size={34} style={{ color: "var(--color-primary)" }} aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <h1 className="font-display text-3xl font-extrabold leading-tight">Gymer NextFit</h1>
              <p className="mt-1 font-body text-sm" style={{ color: "var(--color-text-secondary)" }}>
                {criteria.level ?? "Beginner"} · {criteria.goal ?? "Strength"}
              </p>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-3 gap-3">
          {[
            { icon: Dumbbell, label: "Buổi tập", value: state.workoutHistory.length.toString() },
            { icon: Activity, label: "Hiệp", value: state.workoutHistory.reduce((sum, entry) => sum + entry.completedSets, 0).toString() },
            { icon: Clock3, label: "Gần nhất", value: latestWorkout ? `${Math.round(latestWorkout.durationSeconds / 60)}m` : "--" },
          ].map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="rounded-[24px] p-4"
              style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
            >
              <Icon size={18} style={{ color: "var(--color-primary)" }} aria-hidden="true" />
              <p className="mt-3 font-number text-lg" style={{ color: "var(--color-primary)" }}>
                {value}
              </p>
              <p className="mt-1 font-body text-[11px]" style={{ color: "var(--color-text-secondary)" }}>
                {label}
              </p>
            </div>
          ))}
        </section>

        <section
          className="rounded-[28px] p-5"
          style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
        >
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="font-heading text-base font-semibold">Thông tin tập luyện</h2>
              <p className="mt-1 font-body text-xs" style={{ color: "var(--color-text-secondary)" }}>
                Nhấn vào từng mục để chỉnh sửa.
              </p>
            </div>
          </div>

          <div className="grid">{editableFields.map(renderFieldRow)}</div>
        </section>

        <section
          className="rounded-[28px] p-5"
          style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
        >
          <ThemeSwitcher />
        </section>
      </main>

      <BottomNav />
    </div>
  )
}
