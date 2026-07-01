"use client"

import { useRouter } from "next/navigation"
import { Play, X } from "lucide-react"

interface WorkoutBannerProps {
  onDismiss: () => void
}

export default function WorkoutBanner({ onDismiss }: WorkoutBannerProps) {
  const router = useRouter()

  return (
    <div
      className="relative rounded-2xl p-4 mb-6 overflow-hidden"
      style={{
        background: "linear-gradient(135deg, rgba(var(--color-primary-rgb), 0.12) 0%, rgba(var(--color-primary-rgb), 0.04) 100%)",
        border: "1px solid rgba(var(--color-primary-rgb), 0.2)",
      }}
    >
      <button
        onClick={onDismiss}
        className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-lg transition-all active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
        style={{ background: "rgba(0,0,0,0.1)" }}
        aria-label="Bỏ qua"
      >
        <X size={12} style={{ color: "var(--color-text-secondary)" }} aria-hidden="true" />
      </button>
      <div className="flex items-center gap-3">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
          style={{ background: "rgba(var(--color-primary-rgb), 0.15)" }}
        >
          <Play size={18} style={{ color: "var(--color-primary)" }} aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-heading font-semibold text-sm" style={{ color: "var(--color-text)" }}>
            Tiếp tục workout
          </p>
          <p className="font-body text-xs" style={{ color: "var(--color-text-secondary)" }}>
            Bạn đang có buổi tập dang dở
          </p>
        </div>
        <button
          onClick={() => router.push("/workout")}
          className="shrink-0 px-4 py-2 rounded-xl font-heading text-xs font-semibold transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
          style={{ background: "var(--color-primary)", color: "#fff" }}
        >
          Tiếp tục
        </button>
      </div>
    </div>
  )
}
