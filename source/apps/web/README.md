# NextFit — Gym Workout Planner

Gợi ý bài tập cá nhân hoá mỗi ngày dựa trên mục tiêu, trình độ, và dụng cụ của bạn.

## Tính năng

- **Cá nhân hoá** — Chọn giới tính, trình độ, mục tiêu, thời lượng, tần suất, và dụng cụ
- **Gợi ý bài tập thông minh** — Thuật toán split với gender bias, fatigue management, compound scoring
- **Theme system** — 3 visual directions: Premium Athletic, Cyber Athlete, Organic Performance
- **Workout tracker** — Theo dõi sets, reps, weight, rest timer, và lịch sử tập luyện
- **Static export** — SSG với Next.js, deploy được lên GitHub Pages / Vercel / Netlify
- **Local-first** — Tất cả dữ liệu lưu trong localStorage, không cần server

## Tech Stack

| Công nghệ | Mục đích |
|-----------|----------|
| Next.js 16 (App Router) | Framework |
| React 19 | UI Library |
| TypeScript | Type Safety |
| Tailwind CSS v4 | Styling |
| Lucide React | Icons |
| Vitest | Unit Testing |
| @ncdai/react-wheel-picker | iOS-style wheel picker |

## Quick Start

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm build      # Static export → out/
pnpm test       # 33 unit tests
pnpm lint       # ESLint
```

## Cấu trúc thư mục

```
src/
├── app/               # Next.js App Router pages
│   ├── onboarding/    # Setup flow (6 criteria)
│   ├── workout/       # Active workout session
│   ├── stats/         # Lịch sử & thống kê
│   ├── profile/       # Hồ sơ & theme switcher
│   └── themes/        # Theme showcase demo
├── components/
│   ├── layout/        # TopHeader, BottomNav
│   └── ui/            # ExerciseCard, Modal, Picker, RestTimer, etc.
├── lib/
│   ├── constants.ts   # Centralized constants (storage keys, equipment lists)
│   ├── context.tsx    # React Context state management
│   ├── design-tokens.ts # Theme definitions (3 visual directions)
│   ├── theme.ts       # Backward-compat re-exports from design-tokens
│   ├── data.ts        # Exercise data loader + helpers
│   ├── split.ts       # Workout split algorithm
│   └── __tests__/     # Unit tests
├── types/
│   └── index.ts       # TypeScript type definitions
└── styles/
    └── focus-rings.css
```

## Theme System

3 visual directions với CSS variables, localStorage persistence:

| Theme | Primary | Vibe |
|-------|---------|------|
| Premium Athletic | Forest Green `#0FA560` | Luxury minimalist |
| Cyber Athlete | Neon Cyan `#00D9FF` | Futuristic cyberpunk |
| Organic Performance | Warm Gold `#E8A542` | Earth tone wellness |

## Testing

```bash
pnpm test              # Run all tests
pnpm test:watch        # Watch mode
```

Hiện tại có **33 unit tests** bao gồm:
- `split.test.ts` — 23 tests cho thuật toán split (computeExerciseCount, compoundScore, repScore, goalScore, fatiguePenalty, matchesLevel, v.v.)
- `context.test.tsx` — 10 tests cho state management (criteria, workout flow, history)

## Build & Deploy

```bash
pnpm build
# Output: out/ (static HTML, SSG)
```

Cấu hình trong `next.config.ts`:
- `output: "export"` — Static Site Generation
- `basePath: "/next-fit"` — GitHub Pages path
- `trailingSlash: true`

## License

MIT
