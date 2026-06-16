"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus, RotateCcw } from "lucide-react"
import { useApp } from "@/lib/context"
import { Exercise, MuscleGroup, Duration, Equipment, Goal, Level, Frequency, UserCriteria } from "@/types"
import TopHeader from "@/components/layout/TopHeader"
import BottomNav from "@/components/layout/BottomNav"
import ExerciseCard from "@/components/ui/ExerciseCard"
import ExerciseModal from "@/components/ui/ExerciseModal"
import CookieConsent from "@/components/ui/CookieConsent"
import { MOCK_EXERCISES, DEFAULT_EXERCISES } from "@/lib/data"

const MUSCLE_GROUPS: MuscleGroup[] = ["Chest", "Back", "Legs", "Shoulders", "Arms", "Core", "Cardio"]
const DURATIONS: Duration[] = ["15 min", "30 min", "45 min", "60+ min"]
const EQUIPMENTS: Equipment[] = [
  "Barbell",
  "Dumbbell",
  "Bodyweight",
  "Cable",
  "Kettlebell",
  "Pull-up bar",
  "Machine",
  "EZ Curl Bar",
]

function formatDate() {
  const now = new Date()
  const days = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"]
  const d = days[now.getDay()]
  const dd = String(now.getDate()).padStart(2, "0")
  const mm = String(now.getMonth() + 1).padStart(2, "0")
  return `${d} ${dd}/${mm}`
}

export default function HomePage() {
  const router = useRouter()
  const {
    state,
    setCriteria,
    setTodayExercises,
    addExercise,
    removeExercise,
    replaceExercise,
    resetTodayExercises,
    startWorkout,
  } = useApp()
  const [showCriteriaPanel, setShowCriteriaPanel] = useState(false)
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null)
  const [selectedMuscles, setSelectedMuscles] = useState<MuscleGroup[]>(state.criteria?.muscleGroups ?? [])
  const [selectedDuration, setSelectedDuration] = useState<Duration | null>(state.criteria?.duration ?? null)
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment[]>(state.criteria?.equipment ?? [])
  // Sync local state when criteria loads from context (e.g. after onboarding)
  useEffect(() => {
    if (state.isFirstVisit) {
      router.push("/onboarding")
    }
    if (!state.criteria) return
    if (selectedMuscles.length === 0 && state.criteria.muscleGroups.length > 0)
      setSelectedMuscles(state.criteria.muscleGroups)
    if (selectedEquipment.length === 0 && state.criteria.equipment.length > 0)
      setSelectedEquipment(state.criteria.equipment)
    if (!selectedDuration && state.criteria.duration) setSelectedDuration(state.criteria.duration)
  }, [state.criteria, state.isFirstVisit, router])

  const toggleMuscle = (m: MuscleGroup) =>
    setSelectedMuscles((prev) => (prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]))
  const toggleEquipment = (e: Equipment) =>
    setSelectedEquipment((prev) => (prev.includes(e) ? prev.filter((x) => x !== e) : [...prev, e]))

  const generateExercisesForCriteria = (criteria: UserCriteria | null) => {
    if (!criteria) return DEFAULT_EXERCISES

    const filtered = MOCK_EXERCISES.filter(
      (ex) =>
        (criteria.muscleGroups.length === 0 || criteria.muscleGroups.includes(ex.muscleGroup)) &&
        (criteria.equipment.length === 0 || criteria.equipment.includes(ex.equipment)) &&
        (!criteria.level || ex.level === criteria.level),
    )

    if (filtered.length >= 8) return filtered.slice(0, 8)
    if (filtered.length > 0) return filtered
    return DEFAULT_EXERCISES
  }

  const criteriaPlan = useMemo(() => {
    if (!state.criteria) return null

    const goalText = {
      Strength: "Tăng sức mạnh với bài tập compound.",
      Hypertrophy: "Tập trung vào tăng cơ và volume vừa phải.",
      Endurance: "Đẩy thể lực với bài tập circuit và nhịp độ đều.",
    }[state.criteria.goal ?? "Strength"]

    const splitText =
      state.criteria.frequency === "3 ngày"
        ? "Full body 3 ngày/tuần với 1-2 ngày nghỉ."
        : state.criteria.frequency === "4 ngày"
          ? "Push/Pull/Legs + 1 ngày core hoặc phục hồi."
          : state.criteria.frequency === "5 ngày"
            ? "Nên chia 5 ngày: ngực, lưng, chân, vai, core."
            : "4-5 ngày chính + 1 ngày recovery hoặc mobility."

    return {
      headline: `Lịch tập ${state.criteria.goal || "cá nhân hóa"}`,
      details: [goalText, splitText, "Nhớ nghỉ 1-2 ngày mỗi tuần để cơ phục hồi."],
    }
  }, [state.criteria])

  const handleSaveCriteria = () => {
    const newCriteria: UserCriteria = {
      ...(state.criteria ?? {}),
      muscleGroups: selectedMuscles,
      duration: selectedDuration ?? undefined,
      equipment: selectedEquipment,
    }
    setCriteria(newCriteria)
    setTodayExercises(generateExercisesForCriteria(newCriteria))
    setShowCriteriaPanel(false)
  }

  const handleAddExercise = () => {
    const available = MOCK_EXERCISES.filter((e) => !state.todayExercises.find((t) => t.id === e.id))
    if (available.length > 0) addExercise(available[0])
  }

  const handleReplace = (id: string) => {
    const available = MOCK_EXERCISES.filter((e) => !state.todayExercises.find((t) => t.id === e.id))
    if (available.length > 0) replaceExercise(id, available[0])
  }

  const handleStartWorkout = () => {
    startWorkout()
    router.push("/workout")
  }

  const criteriaLabel = () => {
    const parts: string[] = []
    if (state.criteria?.goal) parts.push(state.criteria.goal)
    if (state.criteria?.level) parts.push(state.criteria.level)
    if (state.criteria?.frequency) parts.push(state.criteria.frequency)
    if (state.criteria?.duration) parts.push(state.criteria.duration)
    return parts.join(" · ") || "Chưa chọn tiêu chí"
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--color-bg)" }}>
      <TopHeader />
      <main className="flex-1 px-4 pt-5 pb-36 overflow-y-auto">
        <div className="mb-6">
          <h1
            className="font-display font-extrabold text-3xl leading-tight mb-1"
            style={{ color: "var(--color-text)" }}
          >
            Hôm nay bạn muốn tập gì?
          </h1>
          <p className="font-body text-sm" style={{ color: "var(--color-text-secondary)" }}>
            Chọn các tiêu chí để nhận gợi ý bài tập phù hợp nhất
          </p>
        </div>

          {/* Returning user banner */}
        {!state.isFirstVisit && state.criteria && (
          <div
            className="flex items-center justify-between p-4 rounded-2xl mb-6"
            style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
          >
            <div>
              <p className="font-heading font-semibold text-sm mb-0.5" style={{ color: "var(--color-text)" }}>
                Hôm nay của bạn
              </p>
              <p className="font-body text-xs" style={{ color: "var(--color-text-secondary)" }}>
                {formatDate()} · {criteriaLabel()}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setShowCriteriaPanel(!showCriteriaPanel)}
                className="px-3 py-2 rounded-xl font-heading font-semibold text-xs transition-all active:scale-95"
                style={{ background: "rgba(var(--color-primary-rgb), 0.15)", color: "var(--color-primary)" }}
              >
                Thay Đổi Tiêu Chí
              </button>
            </div>
          </div>
        )}

        {/* Criteria panel */}
         {showCriteriaPanel && (
           <div className="mb-6 animate-fadeIn">
             {/* Nhóm Cơ */}
             <div className="mb-5">

              <p
                className="font-heading font-semibold text-xs mb-3 uppercase tracking-wider"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Nhóm Cơ
              </p>
              <div className="flex flex-wrap gap-2">
                {MUSCLE_GROUPS.map((m) => (
                  <button
                    key={m}
                    onClick={() => toggleMuscle(m)}
                    className="px-4 py-2 rounded-xl font-heading font-semibold text-sm transition-all active:scale-95"
                    style={{
                      background: selectedMuscles.includes(m) ? "var(--color-primary)" : "var(--color-surface-subtle)",
                      color: selectedMuscles.includes(m) ? "#fff" : "var(--color-text)",
                      border: `1px solid ${selectedMuscles.includes(m) ? "var(--color-primary)" : "transparent"}`,
                    }}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Thời Gian */}
            <div className="mb-5">
              <p
                className="font-heading font-semibold text-xs mb-3 uppercase tracking-wider"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Thời Gian
              </p>
              <div className="flex flex-wrap gap-2">
                {DURATIONS.map((d) => (
                  <button
                    key={d}
                    onClick={() => setSelectedDuration(d === selectedDuration ? null : d)}
                    className="px-4 py-2 rounded-xl font-heading font-semibold text-sm transition-all active:scale-95"
                    style={{
                      background: selectedDuration === d ? "var(--color-primary)" : "var(--color-surface-subtle)",
                      color: selectedDuration === d ? "#fff" : "var(--color-text)",
                      border: `1px solid ${selectedDuration === d ? "var(--color-primary)" : "transparent"}`,
                    }}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Thiết Bị */}
            <div className="mb-5">
              <p
                className="font-heading font-semibold text-xs mb-3 uppercase tracking-wider"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Thiết Bị
              </p>
              <div className="flex flex-wrap gap-2">
                {EQUIPMENTS.map((e) => (
                  <button
                    key={e}
                    onClick={() => toggleEquipment(e)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl font-heading font-semibold text-sm transition-all active:scale-95"
                    style={{
                      background: selectedEquipment.includes(e)
                        ? "rgba(var(--color-primary-rgb), 0.15)"
                        : "var(--color-surface-subtle)",
                      color: selectedEquipment.includes(e) ? "var(--color-primary)" : "var(--color-text)",
                      border: `1px solid ${selectedEquipment.includes(e) ? "var(--color-primary)" : "transparent"}`,
                    }}
                  >
                    <div
                      className="w-4 h-4 rounded flex items-center justify-center"
                      style={{
                        border: `1.5px solid ${selectedEquipment.includes(e) ? "var(--color-primary)" : "rgba(255,255,255,0.3)"}`,
                        background: selectedEquipment.includes(e) ? "var(--color-primary)" : "transparent",
                      }}
                    >
                      {selectedEquipment.includes(e) && (
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <path
                            d="M2 5l2.5 2.5L8 3"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </div>
                    {e}
                  </button>
                ))}
              </div>
            </div>

            {showCriteriaPanel && (
              <button
                onClick={handleSaveCriteria}
                className="w-full py-3.5 rounded-2xl font-heading font-semibold text-sm transition-all active:scale-[0.98]"
                style={{ background: "var(--color-primary)", color: "#fff" }}
              >
                Lưu tiêu chí
              </button>
            )}
          </div>
        )}

          {/* Exercise list */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-heading font-semibold text-base" style={{ color: "var(--color-text)" }}>
                  {state.todayExercises.length} Bài Tập Hôm Nay
                </h2>
              </div>
              <p className="font-body text-xs" style={{ color: "var(--color-text-secondary)" }}>
                {`Khoảng ${state.criteria?.duration || "30 phút"}`}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={resetTodayExercises}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-heading font-semibold transition-all duration-200 active:scale-95 hover:opacity-80"
                style={{ background: "var(--color-surface-subtle)", color: "var(--color-text-secondary)" }}
              >
                <RotateCcw size={12} />
                Hoàn tác
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {state.todayExercises.map((ex, i) => (
              <ExerciseCard
                key={ex.id}
                exercise={ex}
                index={i}
                onView={setSelectedExercise}
                onRemove={removeExercise}
                onReplace={handleReplace}
                showActions
              />
            ))}
          </div>
        </div>

        {/* Add exercise */}
        <button
          onClick={handleAddExercise}
          className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 font-heading font-semibold text-sm transition-all active:scale-[0.98]"
          style={{
            background: "var(--color-surface-subtle)",
            border: "1px dashed rgba(255,255,255,0.12)",
            color: "var(--color-text-secondary)",
          }}
        >
          <Plus size={16} />
          Thêm bài tập khác
        </button>
      </main>

      {/* Start Workout CTA */}
      <div
        className="fixed bottom-[68px] left-0 right-0 px-4 pt-4 pb-3"
        style={{ background: "linear-gradient(to top, var(--color-bg) 50%, transparent)" }}
      >
        <button
          onClick={handleStartWorkout}
          className="w-full py-4 rounded-2xl font-heading font-bold text-base transition-all active:scale-[0.97]"
          style={{
            background: "var(--color-primary)",
            color: "#fff",
            boxShadow: "0 0 30px rgba(var(--color-primary-rgb), 0.35)",
          }}
        >
          Bắt Đầu Workout
        </button>
      </div>

      <BottomNav />
      {selectedExercise && <ExerciseModal exercise={selectedExercise} onClose={() => setSelectedExercise(null)} />}
      <CookieConsent />
    </div>
  )
}
