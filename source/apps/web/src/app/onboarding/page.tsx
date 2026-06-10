'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check } from 'lucide-react'
import { useApp } from '@/lib/context'
import { Gender, Level, Goal, UserCriteria } from '@/types'
import CookieConsent from '@/components/ui/CookieConsent'

const GENDERS: Gender[] = ['Nam', 'Nữ', 'Khác']
const LEVELS: Level[] = ['Beginner', 'Intermediate', 'Advanced', 'Expert']
const GOALS: Goal[] = ['Strength', 'Hypertrophy', 'Endurance']

export default function OnboardingPage() {
  const router = useRouter()
  const { setCriteria, setFirstVisitDone, setCookiesAccepted } = useApp()

  const [gender, setGender] = useState<Gender | null>(null)
  const [level, setLevel] = useState<Level | null>(null)
  const [goal, setGoal] = useState<Goal | null>(null)
  const [allowStorage, setAllowStorage] = useState(true)

  const canProceed = gender && level && goal

  const handleContinue = () => {
    if (!canProceed) return
    const criteria: UserCriteria = {
      gender,
      level,
      goal,
      muscleGroups: [],
      equipment: [],
    }
    setCriteria(criteria)
    setCookiesAccepted(allowStorage)
    setFirstVisitDone()
    router.push('/')
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: '#000000' }}
    >
      {/* Header logo */}
      <div className="flex items-center justify-between px-5 pt-6 pb-4">
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: '#2979FF' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="8" width="4" height="8" rx="1" fill="white" />
              <rect x="17" y="8" width="4" height="8" rx="1" fill="white" />
              <rect x="7" y="10" width="10" height="4" rx="1" fill="white" />
            </svg>
          </div>
          <span className="font-display font-bold text-xl" style={{ color: '#E0E0E0' }}>
            NextFit
          </span>
        </div>
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(255,255,255,0.06)' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="8" r="4" stroke="#6B6B7A" strokeWidth="1.5" />
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#6B6B7A" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 px-5 pb-40 overflow-y-auto">
        {/* Hero */}
        <div className="mb-8">
          <h1
            className="font-display font-extrabold text-4xl leading-[1.05] mb-3"
            style={{ color: '#E0E0E0' }}
          >
            NextFit xin chào, vui lòng cho mình sát nhanh xíu nhé!
          </h1>
          <p className="font-body text-sm" style={{ color: '#6B6B7A' }}>
            Chỉ mất 30 giây để cá nhân hóa lịch tập của bạn.
          </p>
        </div>

        {/* Gender */}
        <div className="mb-7">
          <label className="font-heading font-semibold text-sm block mb-3" style={{ color: '#E0E0E0' }}>
            Bạn là?
          </label>
          <div className="flex gap-3">
            {GENDERS.map(g => (
              <button
                key={g}
                onClick={() => setGender(g)}
                className="flex-1 py-3.5 rounded-xl font-heading font-semibold text-sm transition-all duration-200 active:scale-95"
                style={{
                  background: gender === g ? '#2979FF' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${gender === g ? '#2979FF' : 'rgba(255,255,255,0.08)'}`,
                  color: gender === g ? '#fff' : '#E0E0E0',
                }}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Level */}
        <div className="mb-7">
          <label className="font-heading font-semibold text-sm block mb-3" style={{ color: '#E0E0E0' }}>
            Trình độ của bạn hiện tại là?
          </label>
          <div className="flex flex-col gap-2.5">
            {LEVELS.map(l => (
              <button
                key={l}
                onClick={() => setLevel(l)}
                className="w-full py-4 px-5 rounded-xl flex items-center justify-between font-heading font-semibold text-sm transition-all duration-200 active:scale-[0.98]"
                style={{
                  background: level === l ? 'rgba(41,121,255,0.12)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${level === l ? '#2979FF' : 'rgba(255,255,255,0.08)'}`,
                  color: level === l ? '#2979FF' : '#E0E0E0',
                }}
              >
                {l}
                {level === l && (
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ background: '#2979FF' }}
                  >
                    <Check size={12} color="white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Goal */}
        <div className="mb-7">
          <label className="font-heading font-semibold text-sm block mb-3" style={{ color: '#E0E0E0' }}>
            Mục tiêu của bạn mong muốn?
          </label>
          <div className="flex flex-col gap-2.5">
            {GOALS.map(g => (
              <button
                key={g}
                onClick={() => setGoal(g)}
                className="w-full py-4 px-5 rounded-xl flex items-center justify-between font-heading font-semibold text-sm transition-all duration-200 active:scale-[0.98]"
                style={{
                  background: goal === g ? 'rgba(41,121,255,0.12)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${goal === g ? '#2979FF' : 'rgba(255,255,255,0.08)'}`,
                  color: goal === g ? '#2979FF' : '#E0E0E0',
                }}
              >
                {g}
                {goal === g && (
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ background: '#2979FF' }}
                  >
                    <Check size={12} color="white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Allow storage */}
        <button
          className="flex items-center gap-3 mb-2"
          onClick={() => setAllowStorage(!allowStorage)}
        >
          <div
            className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 transition-all"
            style={{
              background: allowStorage ? '#2979FF' : 'transparent',
              border: `1.5px solid ${allowStorage ? '#2979FF' : 'rgba(255,255,255,0.2)'}`,
            }}
          >
            {allowStorage && <Check size={12} color="white" />}
          </div>
          <span className="font-body text-sm text-left" style={{ color: '#6B6B7A' }}>
            Cho phép chúng tôi lưu trữ thông tin.
          </span>
        </button>
      </div>

      {/* Fixed bottom CTA */}
      <div
        className="fixed bottom-0 left-0 right-0 px-5 pb-8 pt-4"
        style={{
          background: 'linear-gradient(to top, #000 60%, transparent)',
        }}
      >
        <button
          onClick={handleContinue}
          disabled={!canProceed}
          className="w-full py-4 rounded-2xl font-heading font-semibold text-base transition-all duration-200 active:scale-[0.98]"
          style={{
            background: canProceed ? '#2979FF' : 'rgba(255,255,255,0.06)',
            color: canProceed ? '#fff' : '#6B6B7A',
            cursor: canProceed ? 'pointer' : 'not-allowed',
          }}
        >
          Tiếp Tục
        </button>
      </div>

      <CookieConsent />
    </div>
  )
}
