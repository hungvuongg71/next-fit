"use client"
import TopHeader from "@/components/layout/TopHeader"
import BottomNav from "@/components/layout/BottomNav"
import ThemeSwitcher from "@/components/ui/ThemeSwitcher"
import { User } from "lucide-react"
import { useApp } from "@/lib/context"
import { THEME } from "@/lib/theme"

export default function ProfilePage() {
  const { state } = useApp()
  return (
    <div className="min-h-screen flex flex-col" style={{ background: THEME.colors.bg.dark }}>
      <TopHeader />
      <main className="flex-1 px-4 pt-8 pb-24">
        <div className="flex flex-col items-center mb-8">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
            style={{ background: THEME.colors.bg.subtle, border: `2px solid ${THEME.colors.border.subtle}` }}
          >
            <User size={32} style={{ color: THEME.colors.text.secondary }} />
          </div>
          <h1 className="font-display font-bold text-2xl mb-1" style={{ color: THEME.colors.text.primary }}>
            Gymer NextFit
          </h1>
          <p className="font-body text-sm" style={{ color: THEME.colors.text.secondary }}>
            {state.criteria?.level || "Beginner"} · {state.criteria?.goal || "Strength"}
          </p>
        </div>
        <div
          className="p-5 rounded-2xl mb-6"
          style={{ background: THEME.colors.bg.primary, border: `1px solid ${THEME.colors.border.subtle}` }}
        >
          <h2 className="font-heading font-semibold text-sm mb-4" style={{ color: THEME.colors.text.secondary }}>
            THÔNG TIN
          </h2>
          {[
            { label: "Giới tính", value: state.criteria?.gender || "—" },
            { label: "Trình độ", value: state.criteria?.level || "—" },
            { label: "Mục tiêu", value: state.criteria?.goal || "—" },
          ].map((row) => (
            <div
              key={row.label}
              className="flex justify-between py-3"
              style={{ borderBottom: `1px solid ${THEME.colors.border.subtle}` }}
            >
              <span className="font-body text-sm" style={{ color: THEME.colors.text.secondary }}>
                {row.label}
              </span>
              <span className="font-heading font-semibold text-sm" style={{ color: THEME.colors.text.primary }}>
                {row.value}
              </span>
            </div>
          ))}
        </div>
        <ThemeSwitcher />
      </main>
      <BottomNav />
    </div>
  )
}
