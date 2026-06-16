// Centralized color & theme tokens để consistency
// Hỗ trợ 3 visual directions: premium-athletic, cyber-athlete, organic-performance

export type ThemeName = "premium-athletic" | "cyber-athlete" | "organic-performance"

export interface ThemeValue {
  colors: {
    primary: string
    text: {
      primary: string
      secondary: string
    }
    bg: {
      primary: string
      dark: string
      overlay: string
      subtle: string
      hover: string
      error: string
    }
    border: {
      subtle: string
      hover: string
      error: string
    }
  }
  spacing: {
    xs: string
    sm: string
    md: string
    lg: string
    xl: string
  }
  radius: {
    sm: string
    md: string
    lg: string
    xl: string
  }
}

// PREMIUM ATHLETIC - Default theme
export const THEME_PREMIUM: ThemeValue = {
  colors: {
    primary: "#0FA560",
    text: {
      primary: "#F5F5F7",
      secondary: "#A1A1A6",
    },
    bg: {
      primary: "#131315",
      dark: "#000000",
      overlay: "rgba(0,0,0,0.88)",
      subtle: "rgba(255,255,255,0.06)",
      hover: "rgba(255,255,255,0.08)",
      error: "rgba(255,0,127,0.08)",
    },
    border: {
      subtle: "rgba(255,255,255,0.08)",
      hover: "rgba(255,255,255,0.12)",
      error: "rgba(255,0,127,0.1)",
    },
  },
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "24px",
  },
  radius: {
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "20px",
  },
}

// CYBER ATHLETE - Bold neon theme
export const THEME_CYBER: ThemeValue = {
  colors: {
    primary: "#00D9FF",
    text: {
      primary: "#FFFFFF",
      secondary: "#A0E7E5",
    },
    bg: {
      primary: "#0A0A14",
      dark: "#000000",
      overlay: "rgba(0,0,0,0.92)",
      subtle: "rgba(0,217,255,0.08)",
      hover: "rgba(0,217,255,0.12)",
      error: "rgba(255,0,107,0.12)",
    },
    border: {
      subtle: "rgba(0,217,255,0.2)",
      hover: "rgba(0,217,255,0.3)",
      error: "rgba(255,0,107,0.4)",
    },
  },
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "24px",
  },
  radius: {
    sm: "4px",
    md: "8px",
    lg: "12px",
    xl: "16px",
  },
}

// ORGANIC PERFORMANCE - Warm earth tone theme
export const THEME_ORGANIC: ThemeValue = {
  colors: {
    primary: "#E8A542",
    text: {
      primary: "#F5E6D3",
      secondary: "#B8945F",
    },
    bg: {
      primary: "#1B1812",
      dark: "#0F0A06",
      overlay: "rgba(26,20,16,0.88)",
      subtle: "rgba(232,165,66,0.08)",
      hover: "rgba(232,165,66,0.12)",
      error: "rgba(239,68,68,0.1)",
    },
    border: {
      subtle: "rgba(232,165,66,0.15)",
      hover: "rgba(232,165,66,0.25)",
      error: "rgba(239,68,68,0.2)",
    },
  },
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "24px",
  },
  radius: {
    sm: "12px",
    md: "16px",
    lg: "20px",
    xl: "24px",
  },
}

// Default theme
export const THEME = THEME_PREMIUM

/**
 * Get theme by name
 */
export function getTheme(name: ThemeName): ThemeValue {
  const themes: Record<ThemeName, ThemeValue> = {
    "premium-athletic": THEME_PREMIUM,
    "cyber-athlete": THEME_CYBER,
    "organic-performance": THEME_ORGANIC,
  }
  return themes[name]
}

/**
 * Apply theme to HTML element
 */
export function applyTheme(name: ThemeName) {
  if (typeof document !== "undefined") {
    document.documentElement.setAttribute("data-theme", name)
  }
}
