"use client"

import { useState } from "react"
import { applyTheme } from "@/lib/theme"
import { STORAGE_KEYS } from "@/lib/constants"
import ThemeSwitcher from "@/components/ui/ThemeSwitcher"
import TopHeader from "@/components/layout/TopHeader"
import BottomNav from "@/components/layout/BottomNav"
import { Zap, Leaf, Crown } from "lucide-react"

interface ThemeDemo {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  color: string
}

const THEME_DEMOS: ThemeDemo[] = [
  {
    id: "premium-athletic",
    title: "Premium Athletic",
    description:
      "Luxury minimalist aesthetic inspired by Apple Watch Sport. High-end, refined, focus on clarity and elegance. Perfect for professional athletes and premium fitness enthusiasts.",
    icon: <Crown size={24} />,
    color: "#0FA560",
  },
  {
    id: "cyber-athlete",
    title: "Cyber Athlete",
    description:
      "Bold maximalist cyberpunk aesthetic with neon cyan + violet. Futuristic, tech-forward, high-contrast design. Perfect for tech-savvy athletes and data visualization enthusiasts.",
    icon: <Zap size={24} />,
    color: "#00D9FF",
  },
  {
    id: "organic-performance",
    title: "Organic Performance",
    description:
      "Warm earth-tone aesthetic with natural curves. Gold + brown palette for wellness-focused, human-centric design. Perfect for wellness-focused users and holistic fitness approach.",
    icon: <Leaf size={24} />,
    color: "#E8A542",
  },
]

export default function ThemesShowcasePage() {
  const [selectedTheme, setSelectedTheme] = useState("premium-athletic")

  const handleSelectTheme = (themeId: string) => {
    setSelectedTheme(themeId)
    applyTheme(themeId as "premium-athletic" | "cyber-athlete" | "organic-performance")
    localStorage.setItem(STORAGE_KEYS.THEME, themeId)
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--color-bg)" }}>
      <TopHeader title="NextFit Themes" />

      <main className="flex-1 px-4 pt-6 pb-36 overflow-y-auto">
        {/* Hero */}
        <div className="mb-8">
          <h1
            className="font-display font-extrabold text-3xl leading-tight mb-2"
            style={{ color: "var(--color-text)" }}
          >
            3 Visual Directions
          </h1>
          <p className="font-body text-sm" style={{ color: "var(--color-text-secondary)" }}>
            Choose your aesthetic. Your preference is saved locally.
          </p>
        </div>

        {/* Theme Grid */}
        <div className="grid grid-cols-1 gap-4 mb-8">
          {THEME_DEMOS.map((theme) => (
            <button
              key={theme.id}
              onClick={() => handleSelectTheme(theme.id)}
              className="p-5 rounded-2xl text-left transition-all duration-300 transform hover:scale-105"
              style={{
                background: "var(--color-surface)",
                border: `2px solid ${selectedTheme === theme.id ? "var(--color-primary)" : "var(--color-border)"}`,
                boxShadow: selectedTheme === theme.id ? `0 0 20px ${theme.color}40` : "none",
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ background: theme.color + "20", color: theme.color }}
                >
                  {theme.icon}
                </div>
                <h2 className="font-heading font-bold text-lg" style={{ color: "var(--color-text)" }}>
                  {theme.title}
                </h2>
              </div>
              <p className="font-body text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                {theme.description}
              </p>
            </button>
          ))}
        </div>

        {/* Demo Components Section */}
        <div className="mb-8">
          <h2 className="font-heading font-semibold text-base mb-4" style={{ color: "var(--color-text)" }}>
            Component Showcase
          </h2>

          {/* Buttons */}
          <div className="space-y-3 mb-6">
            <label
              className="font-body text-xs uppercase tracking-wider"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Buttons
            </label>
            <div className="flex gap-2 flex-wrap">
              <button
                className="px-4 py-2 rounded-lg font-heading font-semibold text-sm transition-all"
                style={{
                  background: "var(--color-primary)",
                  color: "#fff",
                }}
              >
                Primary
              </button>
              <button
                className="px-4 py-2 rounded-lg font-heading font-semibold text-sm transition-all"
                style={{
                  background: "var(--color-surface)",
                  color: "var(--color-text)",
                  border: "1px solid var(--color-border)",
                }}
              >
                Secondary
              </button>
            </div>
          </div>

          {/* Cards */}
          <div className="space-y-3 mb-6">
            <label
              className="font-body text-xs uppercase tracking-wider"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Cards
            </label>
            <div
              className="p-4 rounded-2xl"
              style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
            >
              <h3 className="font-heading font-semibold text-sm mb-1" style={{ color: "var(--color-text)" }}>
                Card Title
              </h3>
              <p className="font-body text-sm" style={{ color: "var(--color-text-secondary)" }}>
                This is a card component. Check how the colors adapt to each theme.
              </p>
            </div>
          </div>

          {/* Color Palette */}
          <div className="space-y-3 mb-6">
            <label
              className="font-body text-xs uppercase tracking-wider"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Color Palette
            </label>
            <div className="grid grid-cols-4 gap-2">
              <div
                className="h-16 rounded-lg border"
                style={{
                  background: "var(--color-primary)",
                  borderColor: "var(--color-border)",
                }}
                title="Primary"
              />
              <div
                className="h-16 rounded-lg border"
                style={{
                  background: "var(--color-surface)",
                  borderColor: "var(--color-border)",
                }}
                title="Surface"
              />
              <div
                className="h-16 rounded-lg border"
                style={{
                  background: "var(--color-surface-2)",
                  borderColor: "var(--color-border)",
                }}
                title="Surface 2"
              />
              <div
                className="h-16 rounded-lg border"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  borderColor: "var(--color-border)",
                }}
                title="Overlay"
              />
            </div>
          </div>
        </div>

        {/* Theme Switcher */}
        <ThemeSwitcher />
      </main>

      <BottomNav />
    </div>
  )
}
