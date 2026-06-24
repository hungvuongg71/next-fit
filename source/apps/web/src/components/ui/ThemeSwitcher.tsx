"use client"

import { useState, useEffect } from "react"
import { applyTheme, type ThemeName } from "@/theme/theme"
import { STORAGE_KEYS } from "@/constants/storage"
import { Palette } from "lucide-react"

interface ThemeSwitcherProps {
  className?: string
}

const THEMES: Array<{ id: ThemeName; label: string; description: string }> = [
  {
    id: "premium-athletic",
    label: "Premium Athletic",
    description: "Luxury minimalist • Forest green",
  },
  {
    id: "cyber-athlete",
    label: "Cyber Athlete",
    description: "Bold maximalist • Neon cyan",
  },
  {
    id: "organic-performance",
    label: "Organic Performance",
    description: "Warm earth tones • Gold amber",
  },
]

export default function ThemeSwitcher({ className = "" }: ThemeSwitcherProps) {
  const [currentTheme, setCurrentTheme] = useState<ThemeName>(() => {
    if (typeof window === "undefined") return "premium-athletic"
    const saved = localStorage.getItem(STORAGE_KEYS.THEME) as ThemeName | null
    return saved && ["premium-athletic", "cyber-athlete", "organic-performance"].includes(saved)
      ? saved
      : "premium-athletic"
  })

  useEffect(() => {
    applyTheme(currentTheme)
  }, [currentTheme])

  const handleThemeChange = (themeId: ThemeName) => {
    setCurrentTheme(themeId)
    applyTheme(themeId)
    localStorage.setItem(STORAGE_KEYS.THEME, themeId)
  }

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <div className="flex items-center gap-2">
        <Palette size={18} style={{ color: "var(--color-text-secondary)" }} />
        <h3 className="font-heading font-semibold text-sm" style={{ color: "var(--color-text-primary)" }}>
          Chủ đề
        </h3>
      </div>

      <div className="flex flex-col gap-2">
        {THEMES.map((theme) => (
          <button
            key={theme.id}
            onClick={() => handleThemeChange(theme.id)}
            className="w-full flex flex-col items-start px-4 py-3 rounded-lg transition-all"
            style={{
              background: currentTheme === theme.id ? "var(--color-primary)" : "var(--color-surface)",
              border: `1px solid ${currentTheme === theme.id ? "var(--color-primary)" : "var(--color-border)"}`,
              color: currentTheme === theme.id ? "#fff" : "var(--color-text-primary)",
            }}
          >
            <span className="font-heading font-semibold text-sm">{theme.label}</span>
            <span
              className="font-body text-xs"
              style={{
                color: currentTheme === theme.id ? "rgba(255,255,255,0.7)" : "var(--color-text-secondary)",
              }}
            >
              {theme.description}
            </span>
          </button>
        ))}
      </div>

      <div
        className="p-3 rounded-lg"
        style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
      >
        <p className="font-body text-xs" style={{ color: "var(--color-text-secondary)" }}>
          Tùy chọn giao diện được lưu trong trình duyệt
        </p>
      </div>
    </div>
  )
}
