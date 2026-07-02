"use client"

import { useRouter, usePathname } from "next/navigation"
import { Dumbbell, X } from "lucide-react"
import { useApp, getElapsedSeconds } from "@/state/context"
import { STORAGE_KEYS } from "@/constants/storage"

function formatElapsed(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
}

export default function ActiveWorkoutBanner() {
  const router = useRouter()
  const pathname = usePathname()
  const { state, resetWorkout, setTrackingMinimized } = useApp()
  const elapsedSeconds = getElapsedSeconds(state.workoutTimer)

  if (!state.workoutStarted || pathname.startsWith("/workout")) return null

  const handleContinue = () => {
    setTrackingMinimized(false)
    router.push("/workout")
  }
  const handleCancel = () => {
    resetWorkout()
    localStorage.removeItem(STORAGE_KEYS.WORKOUT_SESSION)
    router.push("/")
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 px-4 pb-4">
      <div
        className="relative rounded-2xl p-4 shadow-lg"
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-primary)",
        }}
      >
        <div className="flex items-start gap-3">
          <div
            className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
            style={{ background: "rgba(var(--color-primary-rgb), 0.14)" }}
          >
            <Dumbbell size={16} style={{ color: "var(--color-primary)" }} aria-hidden="true" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-heading text-sm font-semibold" style={{ color: "var(--color-text)" }}>
              Bạn đang có buổi tập
            </p>
            <p className="mt-0.5 font-body text-xs" style={{ color: "var(--color-text-secondary)" }}>
              Đã tập {formatElapsed(elapsedSeconds)} · Bạn có muốn tiếp tục?
            </p>
          </div>
          <button
            type="button"
            onClick={handleCancel}
            aria-label="Hủy buổi tập"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-all active:scale-90"
            style={{ background: "rgba(214,69,69,0.12)" }}
          >
            <X size={14} style={{ color: "#ff6b6b" }} aria-hidden="true" />
          </button>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleCancel}
            className="min-h-10 rounded-xl font-heading text-xs font-semibold transition-all active:scale-[0.98]"
            style={{ background: "rgba(255,255,255,0.06)", color: "var(--color-text-secondary)" }}
          >
            Hủy buổi tập
          </button>
          <button
            type="button"
            onClick={handleContinue}
            className="min-h-10 rounded-xl font-heading text-xs font-bold transition-all active:scale-[0.98]"
            style={{ background: "var(--color-primary)", color: "#fff" }}
          >
            Tiếp tục
          </button>
        </div>
      </div>
    </div>
  )
}
