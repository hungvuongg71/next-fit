"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus, RotateCcw, RefreshCw } from "lucide-react"
import { useApp } from "@/lib/context"
import { Exercise, MuscleGroup, Duration, Equipment, Goal, Level, Frequency, UserCriteria } from "@/types"
import TopHeader from "@/components/layout/TopHeader"
import BottomNav from "@/components/layout/BottomNav"
import ExerciseCard from "@/components/ui/ExerciseCard"
import ExerciseModal from "@/components/ui/ExerciseModal"
import ExercisePicker from "@/components/ui/ExercisePicker"
import CookieConsent from "@/components/ui/CookieConsent"
import { MOCK_EXERCISES } from "@/lib/data"
import { MUSCLE_GROUPS, MUSCLE_GROUPS_VI, DURATIONS, EQUIPMENT, EQUIPMENT_VI, POPULAR_EQUIPMENT } from "@/lib/constants"
import { generateProgressiveExercises, getTodaySuggestion, computeExerciseCount } from "@/lib/split"

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
  const [reshuffleSeenIds, setReshuffleSeenIds] = useState<Set<string>>(new Set())
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null)
  const [showPicker, setShowPicker] = useState(false)
  const [showAllEquipment, setShowAllEquipment] = useState(false)
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

  // Reset reshuffle history when criteria changes
  useEffect(() => {
    setReshuffleSeenIds(new Set())
  }, [selectedMuscles, selectedDuration, selectedEquipment])

  // Auto-apply criteria changes with debounce
  useEffect(() => {
    if (!showCriteriaPanel) return
    const timer = setTimeout(() => {
      const newCriteria: UserCriteria = {
        ...(state.criteria ?? {}),
        muscleGroups: selectedMuscles,
        duration: selectedDuration ?? undefined,
        equipment: selectedEquipment,
      }
      setCriteria(newCriteria)
      setTodayExercises(generateProgressiveExercises(newCriteria, state.workoutHistory))
    }, 300)
    return () => clearTimeout(timer)
  }, [selectedMuscles, selectedDuration, selectedEquipment, showCriteriaPanel])

  const toggleMuscle = (m: MuscleGroup) =>
    setSelectedMuscles((prev) => (prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]))
  const toggleEquipment = (e: Equipment) =>
    setSelectedEquipment((prev) => (prev.includes(e) ? prev.filter((x) => x !== e) : [...prev, e]))

  const todaySuggestion = useMemo(() => {
    if (!state.criteria?.frequency) return null
    return getTodaySuggestion(state.criteria.frequency)
  }, [state.criteria?.frequency])

  const suggestedCount = useMemo(() => {
    const c = state.criteria
    if (!c) return 5
    const groupsCount = c.muscleGroups.length > 0
      ? c.muscleGroups.length
      : c.frequency
        ? getTodaySuggestion(c.frequency).length
        : 0
    return computeExerciseCount(c.duration, c.goal, c.level, groupsCount)
  }, [state.criteria])

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

  const handleAddExercise = () => setShowPicker(true)

  const handleReplace = (id: string) => {
    const currentIds = new Set(state.todayExercises.map((t) => t.id))
    const fresh = generateProgressiveExercises(state.criteria, state.workoutHistory)
    const next = fresh.find((e) => !currentIds.has(e.id))
    if (next) replaceExercise(id, next)
  }

  const handleReshuffle = () => {
    const currentIds = new Set(state.todayExercises.map((e) => e.id))
    const newSeen = new Set([...reshuffleSeenIds, ...currentIds])
    setReshuffleSeenIds(newSeen)
    const fresh = generateProgressiveExercises(state.criteria, state.workoutHistory, undefined, newSeen)
    if (fresh.length) setTodayExercises(fresh)
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
            className="flex items-center justify-between p-4 rounded-2xl mb-6 sticky top-0 z-10"
            style={{ background: "var(--color-bg)", border: "1px solid var(--color-border)" }}
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
             {/* Split suggestion */}
          {state.criteria?.frequency && todaySuggestion && todaySuggestion.length > 0 && (
                <div
                  className="mb-5 p-4 rounded-2xl"
                  style={{
                    background: "rgba(var(--color-primary-rgb), 0.06)",
                    border: "1px solid rgba(var(--color-primary-rgb), 0.12)",
                  }}
                >
                 <p className="font-heading font-semibold text-xs mb-1.5" style={{ color: "var(--color-text)" }}>
                   Gợi ý hôm nay
                 </p>
                 <p className="font-body text-sm mb-3" style={{ color: "var(--color-text-secondary)" }}>
                   Theo lịch <strong>{state.criteria.frequency}</strong> hôm nay nên tập:{" "}
                   <strong className="font-heading font-semibold" style={{ color: "var(--color-text)" }}>
                     {todaySuggestion.map((m) => MUSCLE_GROUPS_VI[m] ?? m).join(", ")}
                   </strong>
                   {" · "}
                   <strong>{suggestedCount} bài</strong>
                 </p>
                 <button
                   onClick={() => setSelectedMuscles(todaySuggestion)}
                   className="px-4 py-2 rounded-xl font-heading font-semibold text-xs transition-all active:scale-95"
                   style={{ background: "var(--color-primary)", color: "#fff" }}
                 >
                   Áp dụng gợi ý
                 </button>
               </div>
             )}

             <div className="p-4">
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
                    {MUSCLE_GROUPS_VI[m]}
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
                {[...EQUIPMENT]
                  .sort((a, b) => {
                    const aPop = POPULAR_EQUIPMENT.has(a) ? 0 : 1
                    const bPop = POPULAR_EQUIPMENT.has(b) ? 0 : 1
                    return aPop - bPop
                  })
                  .filter((e) => showAllEquipment || POPULAR_EQUIPMENT.has(e))
                  .map((e) => (
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
                    {EQUIPMENT_VI[e]}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowAllEquipment(!showAllEquipment)}
                className="mt-3 px-4 py-2 rounded-xl font-heading font-semibold text-xs transition-all active:scale-95"
                style={{ color: "var(--color-primary)", background: "rgba(var(--color-primary-rgb), 0.08)" }}
              >
                {showAllEquipment ? "Thu gọn" : `Xem thêm (${EQUIPMENT.length - POPULAR_EQUIPMENT.size})`}
              </button>
            </div>
            </div>
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
                onClick={handleReshuffle}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-heading font-semibold transition-all duration-200 active:scale-95 hover:opacity-80"
                style={{ background: "var(--color-surface-subtle)", color: "var(--color-text-secondary)" }}
              >
                <RefreshCw size={12} />
                Gợi ý lại
              </button>
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
      {selectedExercise && (
        <ExerciseModal
          exercise={selectedExercise}
          onClose={() => setSelectedExercise(null)}
          onReplace={(newEx) => replaceExercise(selectedExercise.id, newEx)}
        />
      )}
      <ExercisePicker
        isOpen={showPicker}
        onClose={() => setShowPicker(false)}
        onSelect={addExercise}
        excludeIds={new Set(state.todayExercises.map((e) => e.id))}
      />
      <CookieConsent />
    </div>
  )
}
