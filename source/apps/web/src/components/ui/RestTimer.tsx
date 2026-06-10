"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { X, SkipForward } from "lucide-react"
import { THEME } from "@/lib/theme"

interface RestTimerProps {
  exerciseName: string
  setNumber: number
  defaultSeconds?: number
  onComplete: () => void
  onSkip: () => void
}

export default function RestTimer({
  exerciseName,
  setNumber,
  defaultSeconds = 60,
  onComplete,
  onSkip,
}: RestTimerProps) {
  const [seconds, setSeconds] = useState(defaultSeconds)
  const [remaining, setRemaining] = useState(defaultSeconds)
  const [isRunning, setIsRunning] = useState(true)
  const skipButtonRef = useRef<HTMLButtonElement>(null)

  // Focus management on mount
  useEffect(() => {
    skipButtonRef.current?.focus()
  }, [])

  const adjustTime = (delta: number) => {
    const newSeconds = Math.max(15, seconds + delta)
    setSeconds(newSeconds)
    setRemaining((prev) => Math.max(0, prev + delta))
  }

  useEffect(() => {
    if (!isRunning) return
    if (remaining <= 0) {
      onComplete()
      return
    }
    const timer = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          onComplete()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [isRunning, remaining, onComplete])

  const progress = remaining / seconds
  const circumference = 2 * Math.PI * 52
  const strokeDashoffset = circumference * (1 - progress)

  const mins = Math.floor(remaining / 60)
  const secs = remaining % 60
  const timeStr = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col"
      style={{ background: THEME.colors.bg.dark }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="timer-title"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-6 pb-4">
        <div>
          <h1 id="timer-title" className="font-display font-bold text-xl" style={{ color: THEME.colors.text.primary }}>
            Thời gian nghỉ
          </h1>
          <p className="font-body text-sm mt-0.5" style={{ color: THEME.colors.text.secondary }}>
            Set {setNumber} · {exerciseName}
          </p>
        </div>
      </div>

      {/* Timer circle */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="relative mb-6">
          {/* Glow ring */}
          <div
            className="absolute inset-0 rounded-full blur-2xl opacity-20"
            style={{ background: THEME.colors.primary, transform: "scale(0.8)" }}
            aria-hidden="true"
          />
          <svg width="160" height="160" viewBox="0 0 120 120" className="relative" aria-hidden="true">
            {/* Track */}
            <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
            {/* Progress */}
            <circle
              cx="60"
              cy="60"
              r="52"
              fill="none"
              stroke={THEME.colors.primary}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              transform="rotate(-90 60 60)"
              style={{ transition: "stroke-dashoffset 1s linear" }}
            />
          </svg>
          {/* Time display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span
              className="font-number text-4xl"
              style={{ color: THEME.colors.text.primary }}
              aria-live="polite"
              aria-atomic="true"
            >
              {timeStr}
            </span>
          </div>
        </div>

        <p className="font-body text-sm mb-8" style={{ color: THEME.colors.text.secondary }}>
          Đang nghỉ giữa các hiệp
        </p>

        {/* Quick adjust buttons */}
        <div className="flex gap-3 mb-8" role="group" aria-label="Quick set durations">
          {[30, 45, 60].map((s) => (
            <button
              key={s}
              onClick={() => {
                setSeconds(s)
                setRemaining(s)
              }}
              aria-pressed={seconds === s}
              className="w-20 py-3 rounded-xl font-heading font-semibold text-sm transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 focus-visible:ring-blue-400"
              style={{
                background: seconds === s ? THEME.colors.primary : THEME.colors.bg.subtle,
                color: seconds === s ? "#fff" : THEME.colors.text.primary,
              }}
            >
              {s}s
            </button>
          ))}
        </div>

        {/* ±15s fine-tune */}
        <div className="flex items-center gap-4 mb-10" role="group" aria-label="Fine-tune duration">
          <button
            onClick={() => adjustTime(-15)}
            aria-label="Reduce time by 15 seconds"
            className="px-6 py-3 rounded-xl font-heading font-semibold text-sm transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 focus-visible:ring-blue-400"
            style={{
              background: THEME.colors.bg.subtle,
              color: THEME.colors.text.primary,
            }}
          >
            −15s
          </button>
          <span className="font-number text-lg" style={{ color: THEME.colors.text.secondary }}>
            {seconds}s
          </span>
          <button
            onClick={() => adjustTime(15)}
            aria-label="Increase time by 15 seconds"
            className="px-6 py-3 rounded-xl font-heading font-semibold text-sm transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 focus-visible:ring-blue-400"
            style={{
              background: THEME.colors.bg.subtle,
              color: THEME.colors.text.primary,
            }}
          >
            +15s
          </button>
        </div>
      </div>

      {/* Bottom actions */}
      <div className="flex gap-3 px-5 pb-10">
        <button
          ref={skipButtonRef}
          onClick={onSkip}
          aria-label="Skip rest period"
          className="flex-1 py-4 rounded-2xl flex items-center justify-center gap-2 font-heading font-semibold text-sm transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 focus-visible:ring-blue-400"
          style={{
            background: THEME.colors.bg.subtle,
            color: THEME.colors.text.primary,
          }}
        >
          <SkipForward size={16} aria-hidden="true" />
          Skip Rest
        </button>
        <button
          onClick={() => setIsRunning(!isRunning)}
          aria-label={isRunning ? "Pause timer" : "Resume timer"}
          aria-pressed={isRunning}
          className="flex-1 py-4 rounded-2xl font-heading font-semibold text-sm transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 focus-visible:ring-blue-400"
          style={{
            background: THEME.colors.primary,
            color: "#fff",
          }}
        >
          {isRunning ? "Pause" : "Resume"}
        </button>
      </div>
    </div>
  )
}
