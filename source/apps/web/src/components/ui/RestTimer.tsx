"use client"

import { useState, useEffect, useRef } from "react"
import { SkipForward, Pause, Play } from "lucide-react"

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
  const continueBtnRef = useRef<HTMLButtonElement>(null)
  const onCompleteRef = useRef(onComplete)
  const onSkipRef = useRef(onSkip)

  useEffect(() => {
    onCompleteRef.current = onComplete
    onSkipRef.current = onSkip
  })

  useEffect(() => {
    continueBtnRef.current?.focus()
  }, [])

  const adjustTime = (delta: number) => {
    const newSeconds = Math.max(15, seconds + delta)
    setSeconds(newSeconds)
    setRemaining((prev) => Math.max(0, prev + delta))
  }

  useEffect(() => {
    if (!isRunning) return
    if (remaining <= 0) {
      onCompleteRef.current()
      return
    }
    const timer = setInterval(() => setRemaining((prev) => prev - 1), 1000)
    return () => clearInterval(timer)
  }, [isRunning, remaining])

  const progress = remaining / seconds
  const circumference = 2 * Math.PI * 52
  const strokeDashoffset = circumference * (1 - progress)

  const mins = Math.floor(remaining / 60)
  const secs = remaining % 60
  const timeStr = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col"
      style={{ background: "var(--color-bg)" }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="timer-title"
    >
      <div
        className="pointer-events-none fixed inset-x-0 top-0 h-72 opacity-60"
        style={{
          background: "radial-gradient(circle at 50% 0%, rgba(var(--color-primary-rgb), 0.18), transparent 60%)",
        }}
        aria-hidden="true"
      />

      <div className="flex items-center justify-between px-5 pt-6 pb-4">
        <div>
          <h1 id="timer-title" className="font-display text-xl font-bold" style={{ color: "var(--color-text)" }}>
            Thời gian nghỉ
          </h1>
          <p className="mt-0.5 font-body text-sm" style={{ color: "var(--color-text-secondary)" }}>
            Hiệp {setNumber} · {exerciseName}
          </p>
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center">
        <div className="relative mb-6">
          <div
            className="absolute inset-0 rounded-full blur-2xl opacity-25"
            style={{ background: "var(--color-primary)", transform: "scale(0.7)" }}
            aria-hidden="true"
          />
          <svg width="160" height="160" viewBox="0 0 120 120" className="relative" aria-hidden="true">
            <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
            <circle
              cx="60"
              cy="60"
              r="52"
              fill="none"
              stroke="var(--color-primary)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              transform="rotate(-90 60 60)"
              style={{ transition: "stroke-dashoffset 1s linear" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span
              className="font-number text-2xl"
              style={{ color: "var(--color-text)" }}
              aria-live="polite"
              aria-atomic="true"
            >
              {timeStr}
            </span>
          </div>
        </div>

        <p className="mb-8 font-body text-sm" style={{ color: "var(--color-text-secondary)" }}>
          Đang nghỉ giữa các hiệp
        </p>

        <div className="mb-8 flex gap-3" role="group" aria-label="Chọn thời gian">
          {[30, 45, 60].map((s) => (
            <button
              key={s}
              onClick={() => {
                setSeconds(s)
                setRemaining(s)
              }}
              aria-pressed={seconds === s}
              className="w-20 rounded-xl py-3 font-heading text-sm font-semibold transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]"
              style={{
                background: seconds === s ? "var(--color-primary)" : "var(--color-surface-subtle)",
                color: seconds === s ? "#fff" : "var(--color-text)",
              }}
            >
              {s}s
            </button>
          ))}
        </div>

        <div className="mb-10 flex items-center gap-4" role="group" aria-label="Điều chỉnh">
          <button
            onClick={() => adjustTime(-15)}
            aria-label="Giảm 15 giây"
            className="rounded-xl px-6 py-3 font-heading text-sm font-semibold transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]"
            style={{
              background: "var(--color-surface-subtle)",
              color: "var(--color-text)",
            }}
          >
            &minus;15s
          </button>
          <span className="font-number text-lg" style={{ color: "var(--color-text-secondary)" }}>
            {seconds}s
          </span>
          <button
            onClick={() => adjustTime(15)}
            aria-label="Thêm 15 giây"
            className="rounded-xl px-6 py-3 font-heading text-sm font-semibold transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]"
            style={{
              background: "var(--color-surface-subtle)",
              color: "var(--color-text)",
            }}
          >
            +15s
          </button>
        </div>
      </div>

      <div className="flex gap-3 px-5 pb-10">
        <button
          ref={continueBtnRef}
          onClick={() => onSkipRef.current()}
          aria-label="Bỏ qua thời gian nghỉ"
          className="flex flex-1 items-center justify-center gap-2 rounded-2xl py-4 font-heading text-sm font-semibold transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]"
          style={{
            background: "var(--color-surface-subtle)",
            color: "var(--color-text)",
          }}
        >
          <SkipForward size={16} aria-hidden="true" />
          Bỏ qua
        </button>
        <button
          onClick={() => setIsRunning((v) => !v)}
          aria-label={isRunning ? "Tạm dừng" : "Tiếp tục"}
          aria-pressed={isRunning}
          className="flex flex-1 items-center justify-center gap-2 rounded-2xl py-4 font-heading text-sm font-semibold transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]"
          style={{
            background: "var(--color-primary)",
            color: "#fff",
          }}
        >
          {isRunning ? (
            <>
              <Pause size={16} aria-hidden="true" />
              Tạm dừng
            </>
          ) : (
            <>
              <Play size={16} aria-hidden="true" />
              Tiếp tục
            </>
          )}
        </button>
      </div>
    </div>
  )
}
