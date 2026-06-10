'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Pause, Play, ChevronLeft, Check, Plus, Trophy } from 'lucide-react'
import { useApp } from '@/lib/context'
import { Exercise } from '@/types'
import PlaceholderImage from '@/components/ui/PlaceholderImage'
import ExerciseModal from '@/components/ui/ExerciseModal'
import RestTimer from '@/components/ui/RestTimer'

interface SetRow {
  setIndex: number
  reps: string
  weight: string
  completed: boolean
  showRest: boolean
}

interface ExerciseState {
  sets: SetRow[]
}

export default function WorkoutPage() {
  const router = useRouter()
  const { state, completeWorkout, resetWorkout } = useApp()

  const exercises = state.todayExercises
  const [isPaused, setIsPaused] = useState(false)
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null)
  const [showCompleted, setShowCompleted] = useState(false)

  // Rest timer state
  const [restState, setRestState] = useState<{
    active: boolean
    exerciseName: string
    setNumber: number
    restSeconds: number
  }>({ active: false, exerciseName: '', setNumber: 0, restSeconds: 60 })

  // Per-exercise set states
  const [exerciseStates, setExerciseStates] = useState<ExerciseState[]>(() =>
    exercises.map(ex => ({
      sets: Array.from({ length: ex.sets }, (_, i) => ({
        setIndex: i,
        reps: '',
        weight: '',
        completed: false,
        showRest: false,
      })),
    }))
  )

  // Scroll to active exercise
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  useEffect(() => {
    if (isPaused) return
    const t = setInterval(() => setElapsedSeconds(s => s + 1), 1000)
    return () => clearInterval(t)
  }, [isPaused])

  const formatElapsed = () => {
    const m = Math.floor(elapsedSeconds / 60)
    const s = elapsedSeconds % 60
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  const updateSet = (exIdx: number, setIdx: number, field: keyof SetRow, value: string | boolean) => {
    setExerciseStates(prev => {
      const next = [...prev]
      const sets = [...next[exIdx].sets]
      sets[setIdx] = { ...sets[setIdx], [field]: value }
      next[exIdx] = { ...next[exIdx], sets }
      return next
    })
  }

  const handleCheckSet = (exIdx: number, setIdx: number) => {
    updateSet(exIdx, setIdx, 'completed', true)
    updateSet(exIdx, setIdx, 'showRest', true)
    // Show rest timer
    setRestState({
      active: true,
      exerciseName: exercises[exIdx].name,
      setNumber: setIdx + 1,
      restSeconds: exercises[exIdx].restSeconds,
    })
  }

  const handleRestComplete = () => {
    setRestState(prev => ({ ...prev, active: false }))
  }

  const addSet = (exIdx: number) => {
    setExerciseStates(prev => {
      const next = [...prev]
      const sets = [...next[exIdx].sets]
      sets.push({ setIndex: sets.length, reps: '', weight: '', completed: false, showRest: false })
      next[exIdx] = { ...next[exIdx], sets }
      return next
    })
  }

  const allCompleted = exerciseStates.every(ex => ex.sets.every(s => s.completed))

  const handleComplete = () => {
    completeWorkout()
    setShowCompleted(true)
  }

  const handleCancel = () => {
    resetWorkout()
    router.push('/')
  }

  // Completion screen
  if (showCompleted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
        style={{ background: '#000000' }}>
        <div className="mb-6 relative">
          <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto"
            style={{ background: 'rgba(41,121,255,0.15)', border: '2px solid #2979FF' }}>
            <Trophy size={40} style={{ color: '#2979FF' }} />
          </div>
          <div className="absolute -inset-4 rounded-full opacity-20 blur-2xl"
            style={{ background: '#2979FF' }} />
        </div>
        <h1 className="font-display font-extrabold text-4xl mb-3" style={{ color: '#E0E0E0' }}>
          Xuất sắc! 🎉
        </h1>
        <p className="font-body text-base mb-2" style={{ color: '#6B6B7A' }}>
          Bạn đã hoàn thành buổi tập hôm nay
        </p>
        <p className="font-number text-2xl mb-10" style={{ color: '#2979FF' }}>
          {formatElapsed()}
        </p>
        <div className="flex flex-col gap-3 w-full max-w-sm">
          <div className="grid grid-cols-3 gap-3 mb-2">
            {exercises.map(ex => (
              <div key={ex.id} className="p-3 rounded-2xl text-center"
                style={{ background: '#0F0F14', border: '1px solid rgba(255,255,255,0.06)' }}>
                <p className="font-heading font-bold text-lg" style={{ color: '#2979FF' }}>
                  {ex.sets}
                </p>
                <p className="font-body text-xs leading-tight" style={{ color: '#6B6B7A' }}>
                  {ex.name.split(' ')[0]}
                </p>
              </div>
            ))}
          </div>
          <button onClick={() => router.push('/')}
            className="w-full py-4 rounded-2xl font-heading font-bold text-base"
            style={{ background: '#2979FF', color: '#fff' }}>
            Về Trang Chính
          </button>
        </div>
      </div>
    )
  }

  const totalSets = exerciseStates.reduce((s, e) => s + e.sets.length, 0)
  const completedSets = exerciseStates.reduce((s, e) => s + e.sets.filter(x => x.completed).length, 0)
  const progressPct = totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#000000' }}>
      {/* Top bar */}
      <div className="sticky top-0 z-30 px-4 pt-4 pb-3"
        style={{ background: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="flex items-center justify-between mb-3">
          <button onClick={handleCancel}
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.06)' }}>
            <ChevronLeft size={20} style={{ color: '#6B6B7A' }} />
          </button>
          <div className="text-center">
            <p className="font-display font-bold text-base" style={{ color: '#E0E0E0' }}>Buổi Tập Hôm Nay</p>
            <p className="font-body text-xs" style={{ color: '#6B6B7A' }}>Tập trung vào sức mạnh</p>
          </div>
          <button onClick={() => setIsPaused(!isPaused)}
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.06)' }}>
            {isPaused ? <Play size={16} style={{ color: '#2979FF' }} /> : <Pause size={16} style={{ color: '#6B6B7A' }} />}
          </button>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
            <div className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%`, background: '#2979FF' }} />
          </div>
          <span className="font-number text-sm" style={{ color: '#2979FF' }}>
            {progressPct}%
          </span>
        </div>

        <div className="flex items-center justify-between mt-2">
          <p className="font-body text-xs" style={{ color: '#6B6B7A' }}>
            {exercises.length} bài tập · {completedSets}/{totalSets} sets
          </p>
          <p className="font-number text-xs" style={{ color: '#6B6B7A' }}>
            {formatElapsed()}
          </p>
        </div>
      </div>

      {/* Exercise list */}
      <main className="flex-1 px-4 pt-4 pb-36 overflow-y-auto">
        <div className="flex flex-col gap-4">
          {exercises.map((ex, exIdx) => {
            const exState = exerciseStates[exIdx]
            const exCompleted = exState.sets.every(s => s.completed)

            return (
              <div key={ex.id}
                className="rounded-2xl overflow-hidden transition-all duration-300"
                style={{
                  background: '#0F0F14',
                  border: `1px solid ${exCompleted ? 'rgba(41,121,255,0.3)' : 'rgba(255,255,255,0.06)'}`,
                }}>
                {/* Exercise header */}
                <div className="flex items-start gap-3 p-4 pb-3">
                  <button onClick={() => setSelectedExercise(ex)} className="flex-shrink-0">
                    <PlaceholderImage className="w-16 rounded-xl" label=""
                      style={{ height: '64px' } as React.CSSProperties} />
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-heading font-semibold text-sm leading-tight" style={{ color: '#E0E0E0' }}>
                          {ex.name}
                        </p>
                        <p className="font-body text-xs mt-0.5" style={{ color: '#6B6B7A' }}>
                          {ex.equipment} · {ex.trainer ? `HLV ${ex.trainer}` : ex.level}
                        </p>
                      </div>
                      <span className="font-number text-xs flex-shrink-0 px-2 py-1 rounded-lg"
                        style={{
                          background: exCompleted ? 'rgba(41,121,255,0.15)' : 'rgba(255,255,255,0.06)',
                          color: exCompleted ? '#2979FF' : '#6B6B7A',
                        }}>
                        {exState.sets.length} sets
                      </span>
                    </div>
                  </div>
                </div>

                {/* Sets */}
                <div className="px-4 pb-2">
                  {/* Column headers */}
                  <div className="flex items-center gap-2 mb-2 px-1">
                    <div className="w-7" />
                    <div className="flex-1 text-center">
                      <span className="font-heading text-xs uppercase tracking-wider" style={{ color: '#6B6B7A' }}>Reps</span>
                    </div>
                    <div className="flex-1 text-center">
                      <span className="font-heading text-xs uppercase tracking-wider" style={{ color: '#6B6B7A' }}>Kg</span>
                    </div>
                    <div className="w-10 text-center">
                      <span className="font-heading text-xs uppercase tracking-wider" style={{ color: '#6B6B7A' }}>Rest</span>
                    </div>
                    <div className="w-8" />
                  </div>

                  {exState.sets.map((s, sIdx) => (
                    <div key={sIdx}
                      className="flex items-center gap-2 mb-2 p-2 rounded-xl transition-all"
                      style={{
                        background: s.completed ? 'rgba(41,121,255,0.06)' : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${s.completed ? 'rgba(41,121,255,0.15)' : 'rgba(255,255,255,0.04)'}`,
                      }}>
                      {/* Set number */}
                      <div className="w-7 text-center">
                        <span className="font-number text-xs" style={{ color: s.completed ? '#2979FF' : '#6B6B7A' }}>
                          {sIdx + 1}
                        </span>
                      </div>

                      {/* Reps input */}
                      <input
                        type="number" placeholder="0" value={s.reps}
                        disabled={s.completed}
                        onChange={e => updateSet(exIdx, sIdx, 'reps', e.target.value)}
                        className="flex-1 text-center py-2 rounded-lg text-sm font-number font-bold outline-none transition-all"
                        style={{
                          background: s.completed ? 'transparent' : 'rgba(255,255,255,0.06)',
                          color: s.completed ? '#2979FF' : '#E0E0E0',
                          border: 'none',
                          width: 0,
                        }}
                      />

                      {/* Weight input */}
                      <input
                        type="number" placeholder="0" value={s.weight}
                        disabled={s.completed}
                        onChange={e => updateSet(exIdx, sIdx, 'weight', e.target.value)}
                        className="flex-1 text-center py-2 rounded-lg text-sm font-number font-bold outline-none transition-all"
                        style={{
                          background: s.completed ? 'transparent' : 'rgba(255,255,255,0.06)',
                          color: s.completed ? '#2979FF' : '#E0E0E0',
                          border: 'none',
                          width: 0,
                        }}
                      />

                      {/* Rest badge */}
                      <div className="w-10 text-center">
                        <span className="font-body text-xs" style={{ color: '#6B6B7A' }}>
                          {ex.restSeconds}s
                        </span>
                      </div>

                      {/* Check button */}
                      <button
                        onClick={() => !s.completed && handleCheckSet(exIdx, sIdx)}
                        disabled={s.completed}
                        className="w-8 h-8 rounded-xl flex items-center justify-center transition-all active:scale-90"
                        style={{
                          background: s.completed ? 'rgba(41,121,255,0.2)' : '#2979FF',
                          opacity: s.completed ? 1 : 1,
                        }}>
                        <Check size={14} color="white" />
                      </button>
                    </div>
                  ))}

                  {/* Add set */}
                  <button onClick={() => addSet(exIdx)}
                    className="w-full py-2.5 rounded-xl flex items-center justify-center gap-1.5 font-heading font-semibold text-xs transition-all active:scale-[0.98] mb-3"
                    style={{ background: 'rgba(255,255,255,0.04)', color: '#6B6B7A' }}>
                    <Plus size={13} />
                    Thêm set
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </main>

      {/* Bottom actions */}
      <div className="fixed bottom-0 left-0 right-0 flex gap-3 px-4 pb-8 pt-4"
        style={{ background: 'linear-gradient(to top, #000 60%, transparent)' }}>
        <button onClick={handleCancel}
          className="flex-1 py-4 rounded-2xl font-heading font-semibold text-sm transition-all active:scale-[0.98]"
          style={{ background: 'rgba(255,255,255,0.06)', color: '#6B6B7A' }}>
          Hủy bỏ
        </button>
        <button
          onClick={handleComplete}
          disabled={!allCompleted}
          className="flex-[2] py-4 rounded-2xl font-heading font-bold text-base transition-all active:scale-[0.97]"
          style={{
            background: allCompleted ? '#2979FF' : 'rgba(255,255,255,0.06)',
            color: allCompleted ? '#fff' : '#6B6B7A',
            cursor: allCompleted ? 'pointer' : 'not-allowed',
            boxShadow: allCompleted ? '0 0 30px rgba(41,121,255,0.35)' : 'none',
          }}>
          Hoàn Thành
        </button>
      </div>

      {/* Rest timer overlay */}
      {restState.active && (
        <RestTimer
          exerciseName={restState.exerciseName}
          setNumber={restState.setNumber}
          defaultSeconds={restState.restSeconds}
          onComplete={handleRestComplete}
          onSkip={handleRestComplete}
        />
      )}

      {/* Exercise modal */}
      {selectedExercise && (
        <ExerciseModal exercise={selectedExercise} onClose={() => setSelectedExercise(null)} />
      )}
    </div>
  )
}
