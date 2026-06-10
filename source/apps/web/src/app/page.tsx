'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, RotateCcw } from 'lucide-react'
import { useApp } from '@/lib/context'
import { Exercise, MuscleGroup, Duration, Equipment } from '@/types'
import TopHeader from '@/components/layout/TopHeader'
import BottomNav from '@/components/layout/BottomNav'
import ExerciseCard from '@/components/ui/ExerciseCard'
import ExerciseModal from '@/components/ui/ExerciseModal'
import CookieConsent from '@/components/ui/CookieConsent'
import { MOCK_EXERCISES } from '@/lib/data'

const MUSCLE_GROUPS: MuscleGroup[] = ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core']
const DURATIONS: Duration[] = ['15 min', '30 min', '45 min', '60+ min']
const EQUIPMENTS: Equipment[] = ['Barbell', 'Dumbbell', 'Bodyweight']

function formatDate() {
  const now = new Date()
  const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy']
  const d = days[now.getDay()]
  const dd = String(now.getDate()).padStart(2, '0')
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  return `${d} ${dd}/${mm}`
}

export default function HomePage() {
  const router = useRouter()
  const { state, setCriteria, addExercise, removeExercise, replaceExercise, resetTodayExercises, startWorkout } = useApp()
  const [showCriteriaPanel, setShowCriteriaPanel] = useState(false)
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null)
  const [selectedMuscles, setSelectedMuscles] = useState<MuscleGroup[]>(state.criteria?.muscleGroups ?? [])
  const [selectedDuration, setSelectedDuration] = useState<Duration | null>(state.criteria?.duration ?? null)
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment[]>(state.criteria?.equipment ?? [])

  const toggleMuscle = (m: MuscleGroup) =>
    setSelectedMuscles(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m])
  const toggleEquipment = (e: Equipment) =>
    setSelectedEquipment(prev => prev.includes(e) ? prev.filter(x => x !== e) : [...prev, e])

  const handleSaveCriteria = () => {
    setCriteria({ ...state.criteria, muscleGroups: selectedMuscles, duration: selectedDuration ?? undefined, equipment: selectedEquipment })
    setShowCriteriaPanel(false)
  }

  const handleAddExercise = () => {
    const available = MOCK_EXERCISES.filter(e => !state.todayExercises.find(t => t.id === e.id))
    if (available.length > 0) addExercise(available[0])
  }

  const handleReplace = (id: string) => {
    const available = MOCK_EXERCISES.filter(e => !state.todayExercises.find(t => t.id === e.id))
    if (available.length > 0) replaceExercise(id, available[0])
  }

  const handleStartWorkout = () => {
    startWorkout()
    router.push('/workout')
  }

  const criteriaLabel = () => {
    const parts: string[] = []
    if (state.criteria?.muscleGroups?.length) parts.push(state.criteria.muscleGroups[0])
    if (state.criteria?.duration) parts.push(state.criteria.duration)
    if (state.criteria?.equipment?.length) parts.push(state.criteria.equipment[0])
    return parts.join(' · ') || 'Chưa chọn tiêu chí'
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#000000' }}>
      <TopHeader />
      <main className="flex-1 px-4 pt-5 pb-36 overflow-y-auto">
        <div className="mb-6">
          <h1 className="font-display font-extrabold text-3xl leading-tight mb-1" style={{ color: '#E0E0E0' }}>
            Hôm nay bạn muốn tập gì?
          </h1>
          <p className="font-body text-sm" style={{ color: '#6B6B7A' }}>
            Chọn các tiêu chí để nhận gợi ý bài tập phù hợp nhất
          </p>
        </div>

        {/* Returning user banner */}
        {!state.isFirstVisit && state.criteria && (
          <div className="flex items-center justify-between p-4 rounded-2xl mb-6"
            style={{ background: '#0F0F14', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div>
              <p className="font-heading font-semibold text-sm mb-0.5" style={{ color: '#E0E0E0' }}>Hôm nay của bạn</p>
              <p className="font-body text-xs" style={{ color: '#6B6B7A' }}>{formatDate()} · {criteriaLabel()}</p>
            </div>
            <div className="flex flex-col gap-2">
              <button onClick={() => setShowCriteriaPanel(!showCriteriaPanel)}
                className="px-3 py-2 rounded-xl font-heading font-semibold text-xs transition-all active:scale-95"
                style={{ background: 'rgba(41,121,255,0.15)', color: '#2979FF' }}>
                Thay Đổi Tiêu Chí
              </button>
              <button onClick={resetTodayExercises}
                className="px-3 py-2 rounded-xl font-heading font-semibold text-xs transition-all active:scale-95"
                style={{ background: 'rgba(255,255,255,0.04)', color: '#6B6B7A' }}>
                Reset
              </button>
            </div>
          </div>
        )}

        {/* Criteria panel */}
        {(showCriteriaPanel || state.isFirstVisit) && (
          <div className="mb-6 animate-fadeIn">
            {/* Nhóm Cơ */}
            <div className="mb-5">
              <p className="font-heading font-semibold text-xs mb-3 uppercase tracking-wider" style={{ color: '#6B6B7A' }}>Nhóm Cơ</p>
              <div className="flex flex-wrap gap-2">
                {MUSCLE_GROUPS.map(m => (
                  <button key={m} onClick={() => toggleMuscle(m)}
                    className="px-4 py-2 rounded-xl font-heading font-semibold text-sm transition-all active:scale-95"
                    style={{
                      background: selectedMuscles.includes(m) ? '#2979FF' : 'rgba(255,255,255,0.06)',
                      color: selectedMuscles.includes(m) ? '#fff' : '#E0E0E0',
                      border: `1px solid ${selectedMuscles.includes(m) ? '#2979FF' : 'transparent'}`,
                    }}>
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Thời Gian */}
            <div className="mb-5">
              <p className="font-heading font-semibold text-xs mb-3 uppercase tracking-wider" style={{ color: '#6B6B7A' }}>Thời Gian</p>
              <div className="flex flex-wrap gap-2">
                {DURATIONS.map(d => (
                  <button key={d} onClick={() => setSelectedDuration(d === selectedDuration ? null : d)}
                    className="px-4 py-2 rounded-xl font-heading font-semibold text-sm transition-all active:scale-95"
                    style={{
                      background: selectedDuration === d ? '#2979FF' : 'rgba(255,255,255,0.06)',
                      color: selectedDuration === d ? '#fff' : '#E0E0E0',
                      border: `1px solid ${selectedDuration === d ? '#2979FF' : 'transparent'}`,
                    }}>
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Thiết Bị */}
            <div className="mb-5">
              <p className="font-heading font-semibold text-xs mb-3 uppercase tracking-wider" style={{ color: '#6B6B7A' }}>Thiết Bị</p>
              <div className="flex flex-wrap gap-2">
                {EQUIPMENTS.map(e => (
                  <button key={e} onClick={() => toggleEquipment(e)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl font-heading font-semibold text-sm transition-all active:scale-95"
                    style={{
                      background: selectedEquipment.includes(e) ? 'rgba(41,121,255,0.15)' : 'rgba(255,255,255,0.06)',
                      color: selectedEquipment.includes(e) ? '#2979FF' : '#E0E0E0',
                      border: `1px solid ${selectedEquipment.includes(e) ? '#2979FF' : 'transparent'}`,
                    }}>
                    <div className="w-4 h-4 rounded flex items-center justify-center"
                      style={{
                        border: `1.5px solid ${selectedEquipment.includes(e) ? '#2979FF' : 'rgba(255,255,255,0.3)'}`,
                        background: selectedEquipment.includes(e) ? '#2979FF' : 'transparent',
                      }}>
                      {selectedEquipment.includes(e) && (
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    {e}
                  </button>
                ))}
              </div>
            </div>

            {showCriteriaPanel && (
              <button onClick={handleSaveCriteria}
                className="w-full py-3.5 rounded-2xl font-heading font-semibold text-sm transition-all active:scale-[0.98]"
                style={{ background: '#2979FF', color: '#fff' }}>
                Lưu tiêu chí
              </button>
            )}
          </div>
        )}

        {/* Exercise list */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="font-heading font-semibold text-base" style={{ color: '#E0E0E0' }}>
                {state.todayExercises.length} Bài Tập Hôm Nay
              </h2>
              <p className="font-body text-xs" style={{ color: '#6B6B7A' }}>
                Approx. {state.criteria?.duration || '30 min'}
              </p>
            </div>
            <button onClick={resetTodayExercises}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-heading font-semibold transition-all active:scale-95"
              style={{ background: 'rgba(255,255,255,0.04)', color: '#6B6B7A' }}>
              <RotateCcw size={12} />
              Hoàn tác
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {state.todayExercises.map((ex, i) => (
              <ExerciseCard key={ex.id} exercise={ex} index={i}
                onView={setSelectedExercise} onRemove={removeExercise} onReplace={handleReplace} showActions />
            ))}
          </div>
        </div>

        {/* Add exercise */}
        <button onClick={handleAddExercise}
          className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 font-heading font-semibold text-sm transition-all active:scale-[0.98]"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px dashed rgba(255,255,255,0.12)', color: '#6B6B7A' }}>
          <Plus size={16} />
          Thêm Bài Tập Khác?
        </button>
      </main>

      {/* Start Workout CTA */}
      <div className="fixed bottom-[68px] left-0 right-0 px-4 pt-4 pb-3"
        style={{ background: 'linear-gradient(to top, #000 50%, transparent)' }}>
        <button onClick={handleStartWorkout}
          className="w-full py-4 rounded-2xl font-heading font-bold text-base transition-all active:scale-[0.97]"
          style={{ background: '#2979FF', color: '#fff', boxShadow: '0 0 30px rgba(41,121,255,0.35)' }}>
          Bắt Đầu Workout
        </button>
      </div>

      <BottomNav />
      {selectedExercise && <ExerciseModal exercise={selectedExercise} onClose={() => setSelectedExercise(null)} />}
      <CookieConsent />
    </div>
  )
}
