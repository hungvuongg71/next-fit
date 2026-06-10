"use client"

import { useRef, useEffect } from "react"
import { useApp } from "@/lib/context"
import { THEME } from "@/lib/theme"

export default function CookieConsent() {
  const { state, setCookiesAccepted } = useApp()
  const dialogRef = useRef<HTMLDivElement>(null)
  const firstButtonRef = useRef<HTMLButtonElement>(null)

  // Focus trap for dialog
  useEffect(() => {
    if (!state.cookiesAccepted && dialogRef.current) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          // Cookies dialog should not close on Escape (user must make a choice)
          return
        }
      }
      document.addEventListener("keydown", handleKeyDown)
      // Focus first button
      firstButtonRef.current?.focus()
      return () => document.removeEventListener("keydown", handleKeyDown)
    }
  }, [state.cookiesAccepted])

  if (state.cookiesAccepted) return null

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-slideUp"
      style={{
        background: THEME.colors.bg.overlay,
        borderTop: `1px solid ${THEME.colors.border.subtle}`,
        backdropFilter: "blur(20px)",
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-title"
      ref={dialogRef}
    >
      <div className="max-w-lg mx-auto">
        <p
          className="font-heading text-sm font-semibold mb-1"
          style={{ color: THEME.colors.text.primary }}
          id="cookie-title"
        >
          Sử Dụng Cookies
        </p>
        <p className="text-xs mb-4 leading-relaxed" style={{ color: THEME.colors.text.secondary }}>
          Chúng tôi sử dụng cookies để lưu trữ thông tin cài đặt và cải thiện trải nghiệm người dùng.
        </p>
        <div className="flex gap-3">
          <button
            ref={firstButtonRef}
            onClick={() => setCookiesAccepted(false)}
            aria-label="Reject cookies"
            className="flex-1 py-3 rounded-xl text-sm font-heading font-semibold transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 focus-visible:ring-blue-400"
            style={{
              background: "transparent",
              border: `1px solid ${THEME.colors.border.subtle}`,
              color: THEME.colors.text.secondary,
            }}
          >
            Từ Chối
          </button>
          <button
            onClick={() => setCookiesAccepted(true)}
            aria-label="Accept cookies"
            className="flex-1 py-3 rounded-xl text-sm font-heading font-semibold transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 focus-visible:ring-blue-400"
            style={{
              background: THEME.colors.primary,
              color: "#fff",
            }}
          >
            Chấp Nhận
          </button>
        </div>
      </div>
    </div>
  )
}
