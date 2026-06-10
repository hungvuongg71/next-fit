"use client"

import { User } from "lucide-react"
import Link from "next/link"
import { THEME } from "@/lib/theme"

interface TopHeaderProps {
  title?: string
  subtitle?: string
  showBack?: boolean
  rightAction?: React.ReactNode
}

export default function TopHeader({ title, subtitle, rightAction }: TopHeaderProps) {
  return (
    <header
      className="sticky top-0 z-30 flex items-center justify-between px-5 py-4"
      style={{
        background: "rgba(0,0,0,0.9)",
        backdropFilter: "blur(20px)",
        borderBottom: `1px solid ${THEME.colors.border.subtle}`,
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: THEME.colors.primary }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="3" y="8" width="4" height="8" rx="1" fill="white" />
            <rect x="17" y="8" width="4" height="8" rx="1" fill="white" />
            <rect x="7" y="10" width="10" height="4" rx="1" fill="white" />
          </svg>
        </div>
        <span className="font-display font-bold text-lg tracking-tight" style={{ color: THEME.colors.text.primary }}>
          {title || "NextFit"}
        </span>
      </div>

      {subtitle && (
        <p
          className="text-xs font-body absolute left-1/2 -translate-x-1/2 hidden sm:block"
          style={{ color: THEME.colors.text.secondary }}
        >
          {subtitle}
        </p>
      )}

      {/* Right action */}
      {rightAction || (
        <Link
          href="/profile"
          aria-label="View profile"
          className="w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 focus-visible:ring-blue-400"
          style={{ background: THEME.colors.bg.subtle }}
        >
          <User size={18} style={{ color: THEME.colors.text.secondary }} aria-hidden="true" />
        </Link>
      )}
    </header>
  )
}
