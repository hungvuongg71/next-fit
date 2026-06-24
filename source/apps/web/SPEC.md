# Spec: Cấu trúc lại Resources

## Objective

Tổ chức lại cấu trúc thư mục resources trong source web để tách biệt rõ ràng data, constants, types, business logic, và state management. Hiện tại `src/lib/` chứa quá nhiều thứ không liên quan (JSON datasets 179K lines, constants, types helpers, theme tokens, context, business logic). Mục tiêu là giảm coupling, tăng maintainability, và theo chuẩn Next.js.

## Tech Stack

Next.js 16.2.7 + React 19 + TypeScript + Tailwind v4 + Vitest (SSG, `output: "export"`, basePath: `/next-fit`)

## Commands

```bash
pnpm dev          # Dev server
pnpm build        # Production build
pnpm test         # Unit tests (Vitest)
pnpm lint         # ESLint
```

## Hiện trạng (Pain Points)

| Vấn đề | Chi tiết |
|--------|----------|
| `src/lib/` quá tải | 10 entries: 2 JSON files (179K lines), constants (119 lines), context (200+ lines), data.ts, split.ts, progressive.ts, design-tokens.ts (530 lines), theme.ts |
| `workoutx_gifs/` ở root | 1325+ GIF files **không được dùng** — exercises.json tham chiếu YouTube URLs, không phải local files |
| Không có `public/` | Next.js convention thiếu; favicon.ico nằm trong `src/app/` thay vì `public/` |
| Constants lẫn lộn | Tiếng Anh và tiếng Việt trộn lẫn; tất cả trong 1 file constants.ts |
| YouTube URL parsing duplicate | Logic `getYouTubeThumbnailUrl` lặp ở `data.ts` và `ExerciseThumbnail.tsx` |
| `workoutx_exercises.json` tồn đọng | 49K lines raw data, không còn được import/reference (chỉ exercises.json được dùng) |
| styles/ chỉ có 1 file | `src/styles/focus-rings.css` lẻ loi, có thể gộp vào `globals.css` hoặc để trong `theme/` |

## Project Structure — Các phương án

### Phương án A: Layer-Based (Khuyến nghị)

Tách theo tầng kỹ thuật — mỗi thư mục là một loại resource riêng biệt.

```
src/
├── app/                       # Giữ nguyên
├── components/
│   ├── layout/                # Giữ nguyên
│   └── ui/                    # Giữ nguyên
├── data/                      # [MỚI] JSON datasets
│   ├── exercises.json         # ← từ src/lib/
│   └── workoutx_exercises.json# ← từ src/lib/ (giữ làm reference)
├── constants/                 # [MỚI] Constants, tách module
│   ├── storage.ts             # STORAGE_KEYS
│   ├── muscles.ts             # MUSCLE_GROUPS, MUSCLE_GROUPS_VI, DYNAMIC_STRETCHES
│   ├── equipment.ts           # EQUIPMENT, EQUIPMENT_VI, POPULAR_EQUIPMENT
│   └── workout.ts             # DURATIONS, FREQUENCIES
├── types/                     # Giữ nguyên
│   └── index.ts
├── state/                     # [MỚI] React Context
│   └── context.tsx            # ← từ src/lib/
├── theme/                     # [MỚI] Theming
│   ├── design-tokens.ts       # ← từ src/lib/
│   ├── theme.ts               # ← từ src/lib/
│   └── focus-rings.css        # ← từ src/styles/
├── lib/                       # Business logic thuần
│   ├── data.ts                # Data loading + image URL helpers (dedup YouTube parsing)
│   ├── split.ts               # Giữ nguyên
│   ├── progressive.ts         # Giữ nguyên
│   └── __tests__/
├── styles/                    # [XOÁ] chuyển vào theme/
└── public/                    # [MỚI] Static assets cho Next.js
    ├── favicon.ico            # ← từ src/app/
    └── gifs/                  # (tuỳ chọn) link/copy workoutx_gifs nếu cần serve local
```

**Tổng số file di chuyển:** ~10-12 files (không tính JSON)

**Thay đổi import paths:** ~50+ imports trong toàn project

**Ưu điểm:**
- Mỗi thư mục có một responsibility rõ ràng
- `src/lib/` chỉ còn business logic thuần (split, progressive, data)
- Dễ mở rộng (thêm constants = thêm file, không phình constants.ts)
- Theo đúng Next.js convention (`public/`, separate data)

**Nhược điểm:**
- Phải update ~50 imports
- Thay đổi cấu trúc nhiều file

---

### Phương án B: Domain-Feature Grouping

Nhóm resources theo domain "thể hình" thay vì tầng kỹ thuật.

```
src/
├── app/
├── components/
├── types/
├── state/
├── workout/                   # [MỚI] Domain: Workout
│   ├── data/
│   │   ├── exercises.json
│   │   └── workoutx_exercises.json
│   ├── constants/
│   │   ├── muscles.ts
│   │   ├── equipment.ts
│   │   └── workout.ts
│   └── lib/
│       ├── split.ts
│       ├── progressive.ts
│       └── data.ts
├── theme/                     # Theming (cross-domain)
│   ├── design-tokens.ts
│   ├── theme.ts
│   └── focus-rings.css
├── ui/                        # Shared UI
│   ├── constants/
│   │   └── storage.ts
│   └── components/
│       └── ... từ components/ui và components/layout
├── styles/                    # (xoá)
└── public/
```

**Ưu điểm:** Tách domain rõ — dễ hình dung feature boundaries

**Nhược điểm:** Over-engineering cho 1-page app; split.ts và progressive.ts phụ thuộc lẫn nhau (cùng domain nhưng khó tách); constants được dùng cả trong UI lẫn domain → conflict grouping

---

### Phương án C: Minimal — Chỉ tách src/lib/

Giữ nguyên cấu trúc tổng thể, chỉ restructure `src/lib/`:

```
src/
├── app/                       # Giữ nguyên
├── components/                # Giữ nguyên
├── lib/
│   ├── __tests__/             # Giữ nguyên
│   ├── context.tsx            # Giữ nguyên
│   ├── split.ts               # Giữ nguyên
│   ├── progressive.ts         # Giữ nguyên
│   ├── data/                  # [MỚI] Tách data
│   │   ├── index.ts           # data.ts cũ
│   │   ├── exercises.json     # ← lib/
│   │   └── workoutx_exercises.json
│   ├── constants/             # [MỚI] Tách constants
│   │   ├── index.ts           # Re-export tất cả
│   │   ├── storage.ts
│   │   ├── muscles.ts
│   │   ├── equipment.ts
│   │   └── workout.ts
│   └── theme/                 # [MỚI] Tách theme
│       ├── design-tokens.ts
│       └── theme.ts
├── styles/                    # Giữ nguyên
├── types/                     # Giữ nguyên
└── workoutx_gifs/             # Giữ nguyên (root)
```

**Thay đổi import paths:** Chỉ cần đổi `@/lib/constants` → `@/lib/constants/index` (re-export giữ backward compat)

**Ưu điểm:**
- Ít thay đổi nhất (20-30 imports thay đổi)
- Backward compatible nhờ re-export
- Giữ nguyên cấu trúc tổng thể

**Nhược điểm:**
- Không giải quyết được `workoutx_gifs/` ở root, không có `public/`
- `src/lib/` vẫn còn nhiều thứ (context, split, progressive, constants, data)
- Các constants không được dùng chung với nhau dễ dàng

---

### Phương án D: Phương án A + Xoá Legacy

Giống phương án A nhưng cleanup thêm:

```
src/
├── data/
│   └── exercises.json         # Chỉ giữ 1 file (đã merge)
├── constants/
├── types/
├── state/
├── theme/
├── lib/
│   ├── data.ts                # Data loading + image URL helpers
│   ├── split.ts
│   ├── progressive.ts
│   └── __tests__/
├── public/
│   ├── favicon.ico
│   └── gifs/                  # workoutx_gifs/ được move vào đây
└── [XOÁ]
    ├── src/lib/workoutx_exercises.json    # Raw data không cần
    ├── src/styles/focus-rings.css         # Gộp vào theme/
    └── workoutx_gifs/                     # Move vào public/gifs/
```

**Thay đổi:** Mạnh tay nhất — cleanup cả legacy data và GIFs.

**Ưu điểm:** Sạch nhất, không có file chết

**Nhược điểm:** Mất file reference gốc (có thể cần cho debug); phải move 1325+ GIF files

---

## Code Style

Giữ nguyên convention hiện tại. Khi tách constants thành modules:

```ts
// constants/storage.ts
export const STORAGE_KEYS = {
  STATE: "nextfit-state",
  THEME: "nextfit-theme",
  EXERCISE_LOGS: "nextfit-exercise-logs",
} as const

// constants/muscles.ts
export const MUSCLE_GROUPS = ["Chest", "Back", "Legs", "Shoulders", "Arms", "Core", "Cardio"] as const

export const MUSCLE_GROUPS_VI: Record<string, string> = {
  Chest: "Ngực",
  Back: "Lưng",
  // ... giữ nguyên
}
```

Import paths mới:
```ts
// Before
import { STORAGE_KEYS } from "@/lib/constants"
import { MUSCLE_GROUPS } from "@/lib/constants"

// After (Phương án A)
import { STORAGE_KEYS } from "@/constants/storage"
import { MUSCLE_GROUPS } from "@/constants/muscles"

// After (Phương án C — backward compatible)
import { STORAGE_KEYS, MUSCLE_GROUPS } from "@/lib/constants"  // index.ts re-exports
```

## Testing Strategy

- **Framework:** Vitest (jsdom)
- **Tests:** `src/lib/__tests__/` — giữ nguyên vị trí
- **Ảnh hưởng:** Restructure không thay đổi logic → tests vẫn pass
- **Verify:** `pnpm test` pass + `pnpm build` pass sau mỗi bước di chuyển

## Boundaries

### Always do
- Giữ nguyên nội dung file khi di chuyển (chỉ sửa import paths)
- Update tất cả import paths references trong project
- Chạy `pnpm test` và `pnpm build` sau mỗi lần batch di chuyển
- Sử dụng barrel re-export nếu cần backward compatibility

### Ask first
- Xoá file (chỉ xoá khi đã confirm không còn reference)
- Thay đổi nội dung function/logic (restructure = move, không refactor)
- Thêm dependency mới
- Đổi tên file (khác với di chuyển)

### Never do
- Để sót import path cũ
- Commit khi build fail
- Xoá workflowx_exercises.json mà không có backup plan
- Move file trong khi app đang chạy dev

## Success Criteria

- [ ] Tất cả import paths được update, không còn reference path cũ
- [ ] `pnpm dev` chạy không lỗi
- [ ] `pnpm build` pass
- [ ] `pnpm test` pass
- [ ] Cấu trúc thư mục mới phản ánh đúng phương án đã chọn
- [ ] Không có file `.ts` nào import từ path cũ (theo phương án)

## Open Questions

- [ ] Phương án nào phù hợp nhất? (Tôi recommend **A** hoặc **C**)
- [ ] Có muốn thêm barrel files (`index.ts`) để backward compatible không?
- [ ] workoutx_exercises.json có cần giữ làm reference không?
- [ ] Có muốn move workoutx_gifs/ vào public/ không? (Hiện tại exercises.json dùng YouTube URLs, local GIFs không được serve)
