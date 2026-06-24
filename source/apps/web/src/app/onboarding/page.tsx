"use client"

import { useMemo, useState, useEffect } from "react"
import type { ReactNode } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, Check, Dumbbell, ShieldCheck } from "lucide-react"
import { useApp } from "@/state/context"
import { Duration, Equipment, Frequency, Gender, Goal, Level, UserCriteria } from "@/types"
import CookieConsent from "@/components/ui/CookieConsent"

import { DURATIONS, FREQUENCIES } from "@/constants/workout"
import { EQUIPMENT, EQUIPMENT_VI, POPULAR_EQUIPMENT } from "@/constants/equipment"

const GENDERS: Gender[] = ["Nam", "Nữ", "Khác"]
const LEVELS: Level[] = ["Beginner", "Intermediate", "Advanced", "Expert"]
const GOALS: Goal[] = ["Strength", "Hypertrophy", "Endurance"]

function ChoiceButton({
  active,
  children,
  onClick,
}: {
  active: boolean
  children: ReactNode
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className="min-h-11 rounded-2xl px-4 py-3 text-left font-heading text-sm font-semibold transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
      style={{
        background: active ? "rgba(var(--color-primary-rgb), 0.18)" : "rgba(255,255,255,0.045)",
        border: `1px solid ${active ? "var(--color-primary)" : "var(--color-border)"}`,
        color: active ? "var(--color-text)" : "var(--color-text-secondary)",
        boxShadow: active ? "var(--shadow-glow)" : "none",
      }}
    >
      <span className="flex items-center justify-between gap-3">
        {children}
        {active && (
          <span
            className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
            style={{ background: "var(--color-primary)" }}
          >
            <Check size={12} color="white" aria-hidden="true" />
          </span>
        )}
      </span>
    </button>
  )
}

export default function OnboardingPage() {
  const router = useRouter()
  const { state, setCriteria, setCookiesAccepted, setFirstVisitDone } = useApp()

  useEffect(() => {
    if (!state.isFirstVisit) {
      router.push("/")
    }
  }, [state.isFirstVisit, router])

  const [gender, setGender] = useState<Gender | null>(null)
  const [level, setLevel] = useState<Level | null>(null)
  const [goal, setGoal] = useState<Goal | null>(null)
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [duration, setDuration] = useState<Duration | null>(null)
  const [frequency, setFrequency] = useState<Frequency | null>(null)
  const [allowStorage, setAllowStorage] = useState(true)
  const [showAllEquipment, setShowAllEquipment] = useState(false)

  const completedCount = [gender, level, goal, equipment.length > 0, duration, frequency].filter(Boolean).length
  const progress = Math.round((completedCount / 6) * 100)
  const canProceed = completedCount === 6

  const planPreview = useMemo(() => {
    if (!goal && !frequency) return "Lịch tập sẽ được dựng sau khi bạn chọn xong tiêu chí."
    const goalCopy = goal === "Hypertrophy" ? "tăng cơ" : goal === "Endurance" ? "sức bền" : "sức mạnh"
    const freqCopy = frequency ? `${frequency}/tuần` : "tần suất linh hoạt"
    return `NextFit sẽ ưu tiên ${goalCopy} với ${freqCopy}, tự động lọc bài theo dụng cụ bạn có.`
  }, [frequency, goal])

  const toggleEquipment = (item: Equipment) =>
    setEquipment((prev) => (prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item]))

  const handleContinue = () => {
    if (!canProceed || !gender || !level || !goal || !duration || !frequency) return
    const criteria: UserCriteria = {
      gender,
      level,
      goal,
      muscleGroups: [],
      equipment,
      duration,
      frequency,
    }
    setCriteria(criteria)
    setCookiesAccepted(allowStorage)
    setFirstVisitDone()
    router.push("/")
  }

  return (
    <div className="min-h-dvh overflow-hidden" style={{ background: "var(--color-bg)", color: "var(--color-text)" }}>
      <div
        className="pointer-events-none fixed inset-x-0 top-0 h-72 opacity-80"
        style={{
          background:
            "radial-gradient(circle at 50% 0%, rgba(var(--color-primary-rgb), 0.26), transparent 58%), linear-gradient(180deg, rgba(255,255,255,0.05), transparent)",
        }}
        aria-hidden="true"
      />

      <header className="relative z-10 flex items-center justify-between px-5 pb-5 pt-6">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-2xl"
            style={{ background: "var(--color-primary)", boxShadow: "var(--shadow-glow)" }}
          >
            <Dumbbell size={20} color="white" aria-hidden="true" />
          </div>
          <div>
            <p className="font-display text-xl font-extrabold leading-none">NextFit</p>
            <p className="mt-1 font-body text-xs" style={{ color: "var(--color-text-secondary)" }}>
              Setup cá nhân hóa
            </p>
          </div>
        </div>
        <div className="rounded-full px-3 py-1 font-number text-xs" style={{ color: "var(--color-primary)" }}>
          {progress}%
        </div>
      </header>

      <main className="relative z-10 px-5 pb-36">
        <section className="mb-7">
          <h1 className="max-w-sm font-display text-4xl font-extrabold leading-[1.02]">
            Khảo sát nhanh để dựng buổi tập hôm nay.
          </h1>
          <p className="mt-3 max-w-md font-body text-sm leading-6" style={{ color: "var(--color-text-secondary)" }}>
            Chọn 6 tiêu chí cốt lõi. NextFit sẽ lưu lại trong trình duyệt và dùng làm nền cho flow Home → Workout → Stats.
          </p>
          <div className="mt-5 h-1.5 overflow-hidden rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progress}%`, background: "var(--color-primary)" }}
            />
          </div>
        </section>

        <section className="mb-6 rounded-3xl p-4" style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}>
          <div className="mb-2 flex items-center gap-2">
            <ShieldCheck size={16} style={{ color: "var(--color-primary)" }} aria-hidden="true" />
            <p className="font-heading text-sm font-semibold">Plan preview</p>
          </div>
          <p className="font-body text-sm leading-6" style={{ color: "var(--color-text-secondary)" }}>
            {planPreview}
          </p>
        </section>

        <div className="grid gap-6">
          <section>
            <p className="mb-3 font-heading text-xs font-semibold uppercase tracking-[0.24em]" style={{ color: "var(--color-text-secondary)" }}>
              Bạn là?
            </p>
            <div className="grid grid-cols-3 gap-2">
              {GENDERS.map((item) => (
                <ChoiceButton key={item} active={gender === item} onClick={() => setGender(item)}>
                  {item}
                </ChoiceButton>
              ))}
            </div>
          </section>

          <section>
            <p className="mb-3 font-heading text-xs font-semibold uppercase tracking-[0.24em]" style={{ color: "var(--color-text-secondary)" }}>
              Trình độ
            </p>
            <div className="grid gap-2">
              {LEVELS.map((item) => (
                <ChoiceButton key={item} active={level === item} onClick={() => setLevel(item)}>
                  {item}
                </ChoiceButton>
              ))}
            </div>
          </section>

          <section>
            <p className="mb-3 font-heading text-xs font-semibold uppercase tracking-[0.24em]" style={{ color: "var(--color-text-secondary)" }}>
              Mục tiêu
            </p>
            <div className="grid gap-2">
              {GOALS.map((item) => (
                <ChoiceButton key={item} active={goal === item} onClick={() => setGoal(item)}>
                  {item}
                </ChoiceButton>
              ))}
            </div>
          </section>

          <section>
            <p className="mb-3 font-heading text-xs font-semibold uppercase tracking-[0.24em]" style={{ color: "var(--color-text-secondary)" }}>
              Dụng cụ
            </p>
            <div className="grid grid-cols-2 gap-2">
              {[...EQUIPMENT]
                .sort((a, b) => {
                  const aPop = POPULAR_EQUIPMENT.has(a) ? 0 : 1
                  const bPop = POPULAR_EQUIPMENT.has(b) ? 0 : 1
                  return aPop - bPop
                })
                .filter((item) => showAllEquipment || POPULAR_EQUIPMENT.has(item))
                .map((item) => (
                <ChoiceButton key={item} active={equipment.includes(item)} onClick={() => toggleEquipment(item)}>
                  {EQUIPMENT_VI[item]}
                </ChoiceButton>
              ))}
            </div>
            <button
              onClick={() => setShowAllEquipment(!showAllEquipment)}
              className="mt-3 px-4 py-2 rounded-xl font-heading font-semibold text-xs transition-all active:scale-95"
              style={{ color: "var(--color-primary)", background: "rgba(var(--color-primary-rgb), 0.08)" }}
            >
              {showAllEquipment ? "Thu gọn" : `Xem thêm (${EQUIPMENT.length - POPULAR_EQUIPMENT.size})`}
            </button>
          </section>

          <section>
            <p className="mb-3 font-heading text-xs font-semibold uppercase tracking-[0.24em]" style={{ color: "var(--color-text-secondary)" }}>
              Thời lượng
            </p>
            <div className="grid grid-cols-2 gap-2">
              {DURATIONS.map((item) => (
                <ChoiceButton key={item} active={duration === item} onClick={() => setDuration(item)}>
                  {item}
                </ChoiceButton>
              ))}
            </div>
          </section>

          <section>
            <p className="mb-3 font-heading text-xs font-semibold uppercase tracking-[0.24em]" style={{ color: "var(--color-text-secondary)" }}>
              Tần suất
            </p>
            <div className="grid grid-cols-2 gap-2">
              {FREQUENCIES.map((item) => (
                <ChoiceButton key={item} active={frequency === item} onClick={() => setFrequency(item)}>
                  {item}
                </ChoiceButton>
              ))}
            </div>
          </section>

          <button
            type="button"
            onClick={() => setAllowStorage((value) => !value)}
            className="flex min-h-11 items-center gap-3 rounded-2xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
            aria-pressed={allowStorage}
          >
            <span
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg"
              style={{
                background: allowStorage ? "var(--color-primary)" : "transparent",
                border: `1px solid ${allowStorage ? "var(--color-primary)" : "var(--color-border)"}`,
              }}
            >
              {allowStorage && <Check size={14} color="white" aria-hidden="true" />}
            </span>
            <span className="font-body text-sm" style={{ color: "var(--color-text-secondary)" }}>
              Cho phép lưu thông tin flow trong Local Storage của trình duyệt này.
            </span>
          </button>
        </div>
      </main>

      <div
        className="fixed inset-x-0 bottom-0 z-20 px-5 pb-8 pt-5"
        style={{ background: "linear-gradient(to top, var(--color-bg) 72%, transparent)" }}
      >
        <button
          type="button"
          onClick={handleContinue}
          disabled={!canProceed}
          className="flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl font-heading text-base font-bold transition-all duration-200 active:scale-[0.98] disabled:active:scale-100"
          style={{
            background: canProceed ? "var(--color-primary)" : "rgba(255,255,255,0.06)",
            color: canProceed ? "#fff" : "var(--color-text-secondary)",
            cursor: canProceed ? "pointer" : "not-allowed",
            boxShadow: canProceed ? "var(--shadow-glow)" : "none",
          }}
        >
          Tiếp tục
          <ArrowRight size={18} aria-hidden="true" />
        </button>
      </div>

      <CookieConsent />
    </div>
  )
}
