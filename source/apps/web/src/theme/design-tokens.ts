/**
 * Design Tokens cho 3 Visual Directions của NextFit
 * Format: TypeScript objects tương tự THEME hiện tại
 * Hỗ trợ chuyển đổi theme động qua CSS variables
 */

// ============================================
// 1. PREMIUM ATHLETIC - Apple Watch Sport vibe
// ============================================
export const PREMIUM_ATHLETIC_THEME = {
  // Metadata
  name: "Premium Athletic",
  description: "Luxury minimalist aesthetic - Nike x Minimal",
  vibe: "Sophisticated, performance-focused, timeless elegance",

  // Colors
  colors: {
    primary: "#0FA560", // Premium forest green (Apple Watch Sport-inspired)
    secondary: "#E8E8E8", // Warm white for contrast
    accent: "#F5A623", // Subtle gold accent

    text: {
      primary: "#E0E0E0",
      secondary: "#8B8B95",
      muted: "rgba(255,255,255,0.15)",
      onPrimary: "#0F0F14", // Dark text on green
    },

    bg: {
      primary: "#0F0F14", // Deep black-blue
      dark: "#000000",
      overlay: "rgba(0,0,0,0.88)",
      subtle: "rgba(15,165,96,0.04)", // Subtle green tint
      hover: "rgba(15,165,96,0.08)",
      success: "rgba(15,165,96,0.1)",
    },

    border: {
      subtle: "rgba(15,165,96,0.08)",
      hover: "rgba(15,165,96,0.15)",
      active: "rgba(15,165,96,0.25)",
    },

    status: {
      success: "#0FA560",
      warning: "#F5A623",
      error: "#FF3B30",
      info: "#A2AAFF",
    },
  },

  // Typography - Font pairings from @fontsource
  typography: {
    fontFamily: {
      display: '"Be Vietnam Pro", system-ui, sans-serif', // Bold, premium feel
      body: '"Plus Jakarta Sans", system-ui, sans-serif', // Clean, modern readability
      mono: '"Rubik Mono One", monospace', // Data displays, accent elements
    },

    fontSize: {
      xs: "12px",
      sm: "13px",
      base: "14px",
      md: "16px",
      lg: "18px",
      xl: "20px",
      "2xl": "24px",
      "3xl": "32px",
      "4xl": "40px",
    },

    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },

    lineHeight: {
      tight: 1.2,
      snug: 1.375,
      normal: 1.5,
      relaxed: 1.625,
    },
  },

  // Spacing
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "24px",
    "2xl": "32px",
  },

  // Radius - minimal, understated
  radius: {
    sm: "4px",
    md: "8px",
    lg: "12px",
    xl: "16px",
    full: "9999px",
  },

  // Shadows - subtle, refined
  shadows: {
    none: "none",
    sm: "0 2px 4px rgba(0,0,0,0.15)",
    md: "0 4px 12px rgba(0,0,0,0.2)",
    lg: "0 8px 24px rgba(0,0,0,0.25)",
    xl: "0 16px 40px rgba(0,0,0,0.3)",
    glow: "0 0 20px rgba(15,165,96,0.15)",
  },

  // Signature animation/effect
  animation: {
    name: "premium-slide",
    keyframes: `
      @keyframes premium-slide {
        0% { opacity: 0; transform: translateY(8px); }
        100% { opacity: 1; transform: translateY(0); }
      }
    `,
    duration: "300ms",
    timing: "cubic-bezier(0.34, 1.56, 0.64, 1)", // Subtle bounce
    description: "Smooth, refined entrance with minimal bounce",
  },

  // Use case
  useCase: "Professional athletes, premium tier, data-driven fitness enthusiasts who value elegance and simplicity",
} as const

// ============================================
// 2. CYBER ATHLETE - Cyberpunk fitness vibe
// ============================================
export const CYBER_ATHLETE_THEME = {
  // Metadata
  name: "Cyber Athlete",
  description: "Bold maximalist aesthetic - Cyberpunk fitness, data-obsessed",
  vibe: "Intense, futuristic, tech-forward, high-contrast",

  // Colors
  colors: {
    primary: "#00D9FF", // Neon cyan
    secondary: "#B024FF", // Neon violet/purple
    tertiary: "#FF006E", // Hot magenta
    accent: "#FFBE0B", // Electric yellow

    text: {
      primary: "#E0F7FF",
      secondary: "#00D9FF",
      muted: "rgba(0,217,255,0.25)",
      onPrimary: "#000000",
    },

    bg: {
      primary: "#0A0E27", // Deep indigo-black
      dark: "#000000",
      overlay: "rgba(10,14,39,0.92)",
      subtle: "rgba(0,217,255,0.03)",
      hover: "rgba(0,217,255,0.12)",
      accent: "rgba(176,36,255,0.08)",
    },

    border: {
      subtle: "rgba(0,217,255,0.15)",
      hover: "rgba(0,217,255,0.35)",
      active: "rgba(0,217,255,0.6)",
      accent: "rgba(176,36,255,0.4)",
    },

    status: {
      success: "#00D9FF",
      warning: "#FFBE0B",
      error: "#FF006E",
      info: "#B024FF",
    },
  },

  // Typography - Bold, angular fonts
  typography: {
    fontFamily: {
      display: '"Be Vietnam Pro", system-ui, sans-serif', // Angular, tech-forward
      body: '"Be Vietnam Pro", system-ui, sans-serif', // Consistent geometric style
      mono: '"Rubik Mono One", monospace', // Perfect for data visualization
    },

    fontSize: {
      xs: "11px",
      sm: "12px",
      base: "13px",
      md: "15px",
      lg: "18px",
      xl: "21px",
      "2xl": "28px",
      "3xl": "36px",
      "4xl": "48px",
    },

    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },

    lineHeight: {
      tight: 1.1,
      snug: 1.3,
      normal: 1.4,
      relaxed: 1.6,
    },
  },

  // Spacing - slightly tighter for density
  spacing: {
    xs: "3px",
    sm: "6px",
    md: "10px",
    lg: "14px",
    xl: "20px",
    "2xl": "28px",
  },

  // Radius - sharp edges, minimal rounding
  radius: {
    sm: "2px",
    md: "4px",
    lg: "6px",
    xl: "8px",
    full: "9999px",
  },

  // Shadows - hard, directional, sci-fi
  shadows: {
    none: "none",
    sm: "0 0 8px rgba(0,217,255,0.2)",
    md: "0 0 16px rgba(0,217,255,0.3), 0 0 24px rgba(176,36,255,0.15)",
    lg: "0 0 32px rgba(0,217,255,0.4), 0 0 48px rgba(176,36,255,0.2)",
    xl: "0 0 48px rgba(0,217,255,0.5), 0 0 64px rgba(176,36,255,0.25)",
    glitch: "2px 2px 0px rgba(176,36,255,0.4), -2px -2px 0px rgba(0,217,255,0.4)",
  },

  // Signature animation/effect
  animation: {
    name: "cyber-pulse",
    keyframes: `
      @keyframes cyber-pulse {
        0%, 100% { 
          box-shadow: 0 0 8px rgba(0,217,255,0.3), 
                      0 0 16px rgba(176,36,255,0.1);
        }
        50% { 
          box-shadow: 0 0 16px rgba(0,217,255,0.6), 
                      0 0 32px rgba(176,36,255,0.3);
        }
      }
    `,
    duration: "1500ms",
    timing: "ease-in-out",
    description: "Pulsing neon glow effect - activates on hover/focus",
  },

  // Use case:
  useCase: "Tech-savvy athletes, gamers, data visualization enthusiasts, competitive fitness trackers",
} as const

// ============================================
// 3. ORGANIC PERFORMANCE - Earth tone vibe
// ============================================
export const ORGANIC_PERFORMANCE_THEME = {
  // Metadata
  name: "Organic Performance",
  description: "Warm dark aesthetic - Earth tone, human-centric, raw energy",
  vibe: "Natural, grounded, warm, energetic yet calming",

  // Colors
  colors: {
    primary: "#E8A542", // Warm gold/amber
    secondary: "#C67C3F", // Warm sand brown
    accent: "#F4C89E", // Soft tan
    tertiary: "#8B6D47", // Deep earth

    text: {
      primary: "#E5D4B8",
      secondary: "#B8A68F",
      muted: "rgba(229,212,184,0.25)",
      onPrimary: "#1A1410", // Dark brown on warm gold
    },

    bg: {
      primary: "#1A1410", // Deep brown-black
      dark: "#0D0A08",
      overlay: "rgba(26,20,16,0.88)",
      subtle: "rgba(232,165,66,0.05)", // Warm gold tint
      hover: "rgba(232,165,66,0.1)",
      warm: "rgba(198,124,63,0.08)",
    },

    border: {
      subtle: "rgba(232,165,66,0.08)",
      hover: "rgba(232,165,66,0.2)",
      active: "rgba(232,165,66,0.35)",
    },

    status: {
      success: "#E8A542",
      warning: "#F4C89E",
      error: "#E74C3C",
      info: "#A89968",
    },
  },

  // Typography - Warm, natural serif pairing
  typography: {
    fontFamily: {
      display: '"Plus Jakarta Sans", system-ui, sans-serif', // Warmth with modernity
      body: '"Plus Jakarta Sans", system-ui, sans-serif', // Natural readability
      mono: '"Rubik Mono One", monospace', // Accent/data
    },

    fontSize: {
      xs: "12px",
      sm: "13px",
      base: "14px",
      md: "16px",
      lg: "18px",
      xl: "20px",
      "2xl": "24px",
      "3xl": "32px",
      "4xl": "40px",
    },

    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },

    lineHeight: {
      tight: 1.3,
      snug: 1.4,
      normal: 1.6,
      relaxed: 1.75,
    },
  },

  // Spacing - slightly looser for breathing room
  spacing: {
    xs: "5px",
    sm: "10px",
    md: "14px",
    lg: "18px",
    xl: "28px",
    "2xl": "36px",
  },

  // Radius - organic, slightly larger
  radius: {
    sm: "6px",
    md: "10px",
    lg: "14px",
    xl: "18px",
    full: "9999px",
  },

  // Shadows - warm, diffused, earthy
  shadows: {
    none: "none",
    sm: "0 2px 6px rgba(0,0,0,0.25), inset 0 1px 0 rgba(232,165,66,0.08)",
    md: "0 6px 16px rgba(0,0,0,0.3), inset 0 2px 4px rgba(232,165,66,0.1)",
    lg: "0 12px 28px rgba(0,0,0,0.35), inset 0 2px 6px rgba(232,165,66,0.12)",
    xl: "0 20px 40px rgba(0,0,0,0.4), inset 0 3px 8px rgba(232,165,66,0.15)",
    glow: "0 0 24px rgba(232,165,66,0.2), inset 0 0 12px rgba(232,165,66,0.08)",
  },

  // Signature animation/effect
  animation: {
    name: "organic-breathe",
    keyframes: `
      @keyframes organic-breathe {
        0%, 100% { 
          transform: scale(1);
          opacity: 1;
        }
        50% { 
          transform: scale(1.02);
          opacity: 0.95;
        }
      }
    `,
    duration: "2500ms",
    timing: "ease-in-out",
    description: "Subtle breathing effect - creates sense of alive, natural motion",
  },

  // Use case
  useCase: "Wellness-focused users, yoga/pilates enthusiasts, holistic fitness approach, nature-inspired training",
} as const

// ============================================
// Helper: Theme Configuration Type
// ============================================
export interface ThemeConfig {
  readonly name: string
  readonly description: string
  readonly vibe: string
  readonly colors: {
    readonly primary: string
    readonly secondary?: string
    readonly tertiary?: string
    readonly accent?: string
    readonly text: {
      readonly primary: string
      readonly secondary: string
      readonly muted?: string
      readonly onPrimary?: string
    }
    readonly bg: {
      readonly primary: string
      readonly dark: string
      readonly overlay: string
      readonly subtle: string
      readonly hover: string
      readonly success?: string
      readonly accent?: string
      readonly warm?: string
      readonly error?: string
    }
    readonly border: {
      readonly subtle: string
      readonly hover: string
      readonly active?: string
      readonly accent?: string
      readonly error?: string
    }
    readonly status?: {
      readonly success: string
      readonly warning: string
      readonly error: string
      readonly info: string
    }
  }
  readonly typography?: {
    readonly fontFamily: {
      readonly display: string
      readonly body: string
      readonly mono: string
    }
    readonly fontSize?: Record<string, string>
    readonly fontWeight?: Record<string, number>
    readonly lineHeight?: Record<string, number>
  }
  readonly spacing?: Record<string, string>
  readonly radius?: Record<string, string>
  readonly shadows?: Record<string, string>
  readonly animation?: {
    readonly name: string
    readonly keyframes: string
    readonly duration: string
    readonly timing: string
    readonly description: string
  }
  readonly useCase?: string
}

export type ThemeName = "premium-athletic" | "cyber-athlete" | "organic-performance"

// ============================================
// Helper: Get theme by name
// ============================================
export const getThemeByName = (themeName: ThemeName): ThemeConfig => {
  const themes: Record<ThemeName, ThemeConfig> = {
    "premium-athletic": PREMIUM_ATHLETIC_THEME,
    "cyber-athlete": CYBER_ATHLETE_THEME,
    "organic-performance": ORGANIC_PERFORMANCE_THEME,
  }
  return themes[themeName]
}

export function applyTheme(name: ThemeName) {
  if (typeof document !== "undefined") {
    document.documentElement.setAttribute("data-theme", name)
  }
}

// ============================================
// Helper: Generate CSS variables from theme
// ============================================
export const generateCSSVariables = (theme: ThemeConfig): string => {
  const cssVars: string[] = []

  // Colors
  if (theme.colors?.primary) cssVars.push(`--color-primary: ${theme.colors.primary};`)
  if (theme.colors?.secondary) cssVars.push(`--color-secondary: ${theme.colors.secondary};`)
  if (theme.colors?.text?.primary) cssVars.push(`--color-text-primary: ${theme.colors.text.primary};`)
  if (theme.colors?.text?.secondary) cssVars.push(`--color-text-secondary: ${theme.colors.text.secondary};`)
  if (theme.colors?.bg?.primary) cssVars.push(`--color-bg-primary: ${theme.colors.bg.primary};`)
  if (theme.colors?.bg?.dark) cssVars.push(`--color-bg-dark: ${theme.colors.bg.dark};`)

  // Typography
  if (theme.typography?.fontFamily?.display)
    cssVars.push(`--font-family-display: ${theme.typography.fontFamily.display};`)
  if (theme.typography?.fontFamily?.body) cssVars.push(`--font-family-body: ${theme.typography.fontFamily.body};`)
  if (theme.typography?.fontFamily?.mono) cssVars.push(`--font-family-mono: ${theme.typography.fontFamily.mono};`)

  // Spacing
  if (theme.spacing?.xs) cssVars.push(`--spacing-xs: ${theme.spacing.xs};`)
  if (theme.spacing?.sm) cssVars.push(`--spacing-sm: ${theme.spacing.sm};`)
  if (theme.spacing?.md) cssVars.push(`--spacing-md: ${theme.spacing.md};`)
  if (theme.spacing?.lg) cssVars.push(`--spacing-lg: ${theme.spacing.lg};`)

  // Radius
  if (theme.radius?.md) cssVars.push(`--radius-md: ${theme.radius.md};`)
  if (theme.radius?.lg) cssVars.push(`--radius-lg: ${theme.radius.lg};`)

  // Animation
  if (theme.animation?.duration) cssVars.push(`--animation-duration: ${theme.animation.duration};`)
  if (theme.animation?.timing) cssVars.push(`--animation-timing: ${theme.animation.timing};`)

  return `:root {\n  ${cssVars.join("\n  ")}\n}`
}
