"use client"

import { useMemo } from "react"
import { WheelPicker, WheelPickerWrapper } from "@ncdai/react-wheel-picker"
import "@ncdai/react-wheel-picker/style.css"

interface NumberPickerWheelProps {
  value: number | null
  onChange: (value: number | null) => void
  min: number
  max: number
  step: number
  ariaLabel: string
  disabled?: boolean
}

export default function NumberPickerWheel({
  value,
  onChange,
  min,
  max,
  step,
  ariaLabel,
  disabled,
}: NumberPickerWheelProps) {
  const options = useMemo(() => {
    const count = Math.floor((max - min) / step) + 1
    return Array.from({ length: count }, (_, i) => {
      const val = Math.round((min + i * step) * 100) / 100
      return {
        value: val,
        label: val % 1 === 0 ? String(val) : val.toFixed(1),
      }
    })
  }, [min, max, step])

  if (disabled) {
    return (
      <div
        className="flex min-h-10 items-center justify-center rounded-xl text-center font-number text-sm"
        style={{
          color: "var(--color-primary)",
          background: "transparent",
        }}
      >
        {value !== null ? (value % 1 === 0 ? value : value.toFixed(1)) : "-"}
      </div>
    )
  }

  return (
    <div role="group" aria-label={ariaLabel}>
      <WheelPickerWrapper>
        <WheelPicker
          options={options}
          value={value ?? min}
          onValueChange={(v) => onChange(v)}
          visibleCount={8}
          optionItemHeight={24}
          dragSensitivity={3}
          scrollSensitivity={5}
          classNames={{
            optionItem: ["opacity-40", "transition-all duration-100"].join(" "),
          }}
        />
      </WheelPickerWrapper>
    </div>
  )
}
