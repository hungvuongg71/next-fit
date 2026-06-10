"use client"

import { Home, Dumbbell, BarChart2, User } from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { THEME } from "@/lib/theme"

const NAV_ITEMS = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/workout", icon: Dumbbell, label: "Workout" },
  { href: "/stats", icon: BarChart2, label: "Stat" },
  { href: "/profile", icon: User, label: "Profile" },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around px-2 pb-safe"
      style={{
        background: "rgba(10,10,14,0.96)",
        borderTop: `1px solid ${THEME.colors.border.subtle}`,
        backdropFilter: "blur(20px)",
        height: "68px",
      }}
      aria-label="Main navigation"
    >
      {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
        const active = pathname === href
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className="flex flex-col items-center gap-1 flex-1 py-2 transition-all duration-200 active:scale-90 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 focus-visible:ring-blue-400"
          >
            <Icon
              size={22}
              style={{ color: active ? THEME.colors.primary : THEME.colors.text.secondary }}
              aria-hidden="true"
            />
            <span
              className="font-heading text-[10px] font-semibold"
              style={{ color: active ? THEME.colors.primary : THEME.colors.text.secondary }}
            >
              {label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
