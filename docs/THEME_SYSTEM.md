# NextFit Visual Directions - Design System

## 📋 Overview

NextFit now supports **3 distinct visual directions**, each with a unique aesthetic, color palette, typography, and micro-interactions. Users can switch themes dynamically, with their preference saved locally.

---

## 🎨 Theme 1: Premium Athletic

**Aesthetic**: Luxury minimalist, inspired by Apple Watch Sport  
**Target**: Professional athletes, premium tier users, data-driven enthusiasts  
**Vibe**: Sophisticated, performance-focused, timeless elegance

### Colors

- **Primary**: `#0FA560` (Forest green)
- **Text Primary**: `#F5F5F7` (Near white)
- **Text Secondary**: `#A1A1A6` (Subtle gray)
- **Background**: `#131315` (Deep black with warmth)
- **Surface**: `#131315` (Card backgrounds)

### Typography

- **Display**: Syne (bold, premium)
- **Heading**: Space Grotesk (geometric, modern)
- **Body**: Plus Jakarta Sans (clean, readable)
- **Number**: Rubik Mono One (data displays)

### Signature Animation

**Premium Slide**: Smooth entrance with subtle bounce

```css
@keyframes premium-slide {
  from {
    opacity: 0;
    transform: translateY(12px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
```

Duration: 500ms | Timing: cubic-bezier(0.16, 1, 0.3, 1)

### CSS Application

Default theme. No action needed, but can be explicitly applied:

```css
[data-theme="premium-athletic"]
```

---

## ⚡ Theme 2: Cyber Athlete

**Aesthetic**: Bold maximalist cyberpunk aesthetic  
**Target**: Tech-savvy athletes, gamers, data visualization obsessed  
**Vibe**: Intense, futuristic, tech-forward, high-contrast

### Colors

- **Primary**: `#00D9FF` (Neon cyan)
- **Secondary**: `#B024FF` (Neon violet)
- **Accent**: `#FF006B` (Hot magenta)
- **Text Primary**: `#FFFFFF` (Pure white)
- **Text Secondary**: `#A0E7E5` (Cyan-tinted gray)
- **Background**: `#0A0A14` (Deep navy-black)

### Typography

- **Display**: Syne (bold, sharp)
- **Heading**: Space Grotesk (angular, tech-forward)
- **Body**: Space Grotesk (consistent geometric style)
- **Number**: Rubik Mono One (perfect for data)

### Signature Animation

**Cyber Pulse**: Pulsing neon glow effect

```css
@keyframes cyber-pulse {
  0%,
  100% {
    box-shadow:
      0 0 10px rgba(0, 217, 255, 0.4),
      inset 0 0 10px rgba(0, 217, 255, 0.1);
  }
  50% {
    box-shadow:
      0 0 20px rgba(0, 217, 255, 0.8),
      inset 0 0 20px rgba(0, 217, 255, 0.2);
  }
}
```

Duration: 3s | Timing: ease-in-out | Infinite loop

**Glitch Effect** (optional):

```css
@keyframes glitch {
  0% {
    clip-path: inset(40% 0 61% 0);
    transform: translate(-2px, -2px);
  }
  /* ... rapid distortion frames ... */
  100% {
    clip-path: inset(58% 0 43% 0);
    transform: translate(2px, 2px);
  }
}
```

### CSS Application

```css
[data-theme="cyber-athlete"]
```

### Enhanced Shadows

- **Small**: `0 0 8px rgba(0,217,255,0.2)`
- **Large**: `0 0 32px rgba(0,217,255,0.4), 0 0 48px rgba(176,36,255,0.2)`
- **Glitch**: `2px 2px 0px rgba(176,36,255,0.4), -2px -2px 0px rgba(0,217,255,0.4)`

---

## 🌿 Theme 3: Organic Performance

**Aesthetic**: Warm earth-tone with natural curves  
**Target**: Wellness-focused users, yoga/pilates enthusiasts, holistic fitness approach  
**Vibe**: Natural, grounded, warm, energetic yet calming

### Colors

- **Primary**: `#E8A542` (Warm gold/amber)
- **Secondary**: `#C67C3F` (Burnt sienna)
- **Accent**: `#F5B55F` (Lighter gold)
- **Text Primary**: `#F5E6D3` (Warm cream)
- **Text Secondary**: `#B8945F` (Muted bronze)
- **Background**: `#1B1812` (Warm dark brown)

### Typography

- **Display**: Syne (warm, bold)
- **Heading**: Plus Jakarta Sans (warm sans-serif, modern)
- **Body**: Plus Jakarta Sans (natural readability)
- **Number**: Rubik Mono One (accent elements)

### Signature Animation

**Organic Breathe**: Subtle breathing effect for life and motion

```css
@keyframes organic-breathe {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.9;
  }
  50% {
    transform: scale(1.02);
    opacity: 1;
  }
}
```

Duration: 2.5s | Timing: ease-in-out | Infinite loop

### Enhanced Shadows (Warm & Diffused)

- **Small**: `0 2px 6px rgba(0,0,0,0.25), inset 0 1px 0 rgba(232,165,66,0.08)`
- **Large**: `0 12px 28px rgba(0,0,0,0.35), inset 0 2px 6px rgba(232,165,66,0.12)`

### CSS Application

```css
[data-theme="organic-performance"]
```

---

## 🔧 Implementation Guide

### 1. Default Theme (Premium Athletic)

The app loads with Premium Athletic by default. All CSS variables use this theme.

### 2. Switching Themes Programmatically

```typescript
import { applyTheme } from "@/lib/theme"

// Apply a theme
applyTheme("cyber-athlete")
applyTheme("organic-performance")
applyTheme("premium-athletic")
```

### 3. Persisting User Choice

Use the `ThemeSwitcher` component which automatically:

- Saves theme to `localStorage`
- Applies theme on mount
- Updates `data-theme` attribute

```tsx
import ThemeSwitcher from "@/components/ui/ThemeSwitcher"

export default function Page() {
  return <ThemeSwitcher className="mx-auto" />
}
```

### 4. CSS Variables (Auto-Updated by Theme)

```css
/* Colors */
var(--color-primary)
var(--color-text-primary)
var(--color-text-secondary)
var(--color-surface)
var(--color-border)

/* Shadows */
var(--shadow-sm)
var(--shadow-md)
var(--shadow-lg)
var(--shadow-glow)
```

### 5. Using Animations

```tsx
// Premium Athletic
<div className="animate-premium-slide">Enter smoothly</div>

// Cyber Athlete
<div className="animate-cyber-pulse">Pulse neon</div>

// Organic Performance
<div className="animate-organic-breathe">Breathe naturally</div>
```

---

## 📁 File Structure

```
src/
├── app/
│   ├── globals.css          ← CSS variables for all 3 themes
│   ├── themes/
│   │   └── page.tsx         ← Theme showcase/switcher page
│   └── profile/page.tsx     ← Profile with ThemeSwitcher component
├── lib/
│   ├── theme.ts             ← Theme objects (THEME_PREMIUM, THEME_CYBER, THEME_ORGANIC)
│   └── design-tokens.ts     ← Detailed design token definitions
└── components/
    └── ui/
        └── ThemeSwitcher.tsx ← Interactive theme switcher component
```

---

## 🎯 Design Principles

### Premium Athletic

- ✅ Minimal, clean interface
- ✅ Generous whitespace
- ✅ Refined typography
- ✅ Subtle animations (low intensity)
- ✅ High-precision alignment

### Cyber Athlete

- ✅ Maximum contrast
- ✅ Geometric forms & sharp edges
- ✅ Glowing effects & neon accents
- ✅ Energetic animations (high intensity)
- ✅ Data-visualization focus

### Organic Performance

- ✅ Natural curves & rounded corners
- ✅ Warm color transitions
- ✅ Inset shadows for depth
- ✅ Breathing/flowing animations
- ✅ Calming, rhythmic interactions

---

## 📱 Responsive Considerations

All themes maintain their aesthetic across device sizes:

- **Mobile**: Touch-friendly buttons, clear hierarchy
- **Tablet**: Extended use of spacing and visual hierarchy
- **Desktop**: Full visual language expression

---

## ♿ Accessibility

All themes meet WCAG 2.1 AA standards:

- **Color Contrast**: Primary text vs. background ≥ 4.5:1
- **Focus States**: Visible outline rings (blue focus from Tailwind)
- **Motion**: Reduced motion respected via `prefers-reduced-motion`
- **Semantic HTML**: Proper heading hierarchy, ARIA labels

---

## 🚀 Future Enhancements

- [ ] User preference sync across devices (via user profile)
- [ ] Additional themes (e.g., "Minimal Zen", "Retro Sport")
- [ ] Theme-aware dark/light mode toggle
- [ ] Advanced customization (pick own accent color)
- [ ] Animated theme transitions

---

## 🎨 Demo Page

Visit `/themes` to see all themes in action and switch between them in real-time.

---

## 📝 Notes for Designers & Developers

1. **When adding new components**: Use `var(--color-primary)`, `var(--color-text-primary)`, etc., instead of hardcoded colors.
2. **When designing for specific theme**: Reference the color palette and typography guidelines above.
3. **When testing**: Use `/themes` page to verify consistency across all 3 themes.
4. **When modifying theme**: Update both `src/lib/theme.ts` and `src/app/globals.css`.

---

**Last Updated**: 2026-06-10  
**Current Themes**: 3 (Premium Athletic, Cyber Athlete, Organic Performance)  
**Default Theme**: Premium Athletic
