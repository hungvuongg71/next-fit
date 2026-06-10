import React from "react"
import { THEME } from "@/lib/theme"

interface PlaceholderImageProps {
  className?: string
  label?: string
  aspectRatio?: string
  style?: React.CSSProperties
}

export default function PlaceholderImage({
  className = "",
  label = "Image",
  aspectRatio = "aspect-square",
  style,
}: PlaceholderImageProps) {
  return (
    <div
      className={`${aspectRatio} ${className} flex items-center justify-center relative overflow-hidden`}
      style={{
        background: `linear-gradient(135deg, #1A1A24 0%, ${THEME.colors.bg.primary} 100%)`,
        border: `1px solid ${THEME.colors.border.subtle}`,
        ...style,
      }}
      role="img"
      aria-label={label || "Loading image"}
    >
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        fill="none"
        aria-hidden="true"
      >
        <line
          x1="0"
          y1="0"
          x2="100"
          y2="100"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
        <line
          x1="100"
          y1="0"
          x2="0"
          y2="100"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      {label && (
        <span className="relative text-xs font-heading z-10" style={{ color: "rgba(255,255,255,0.2)" }}>
          {label}
        </span>
      )}
    </div>
  )
}
