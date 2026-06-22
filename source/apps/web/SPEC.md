# Spec: Cải thiện Gợi ý bài tập — số lượng, auto-load, reshuffle

## Objective

Cải thiện phần "Gợi ý bài tập" trên trang chủ để:

1. **Tự động gợi ý khi mở app** — nếu user đã có criteria (từ onboarding), load trang là thấy bài tập được gợi ý theo tiêu chí, không cần mở panel
2. **6-8 bài mỗi buổi** — tăng số lượng bài tập được gợi ý, phân bố đều theo các nhóm cơ, dựa trên thời lượng tập
3. **Reshuffle không exclude cứng** — nút "Gợi ý lại" random lại từ tổng thể, không loại trừ bài đã thấy để tránh cạn pool

## Tech Stack

Next.js 16.2.7 + React 19 + TypeScript + Tailwind v4 + Vitest

## Commands

```bash
pnpm dev          # Dev server
pnpm build        # Production build
pnpm test         # Unit tests (Vitest)
pnpm lint         # ESLint
```

## Files chạm

```
src/
├── app/page.tsx        # Auto-load logic, reshuffle, hiển thị
├── lib/split.ts        # computeExerciseCount, distributeSlotCounts, generateProgressiveExercises
└── lib/__tests__/
    ├── split.test.ts   # Update tests cho count mới
    └── progressive.test.ts
```

## Chi tiết

### 1. Auto-load exercises khi mở app

**Vấn đề hiện tại:** Exercises chỉ được generate khi `showCriteriaPanel === true` (useEffect dòng 66-79). Khi load trang, chỉ hiện `DEFAULT_EXERCISES` (4 bài đầu JSON).

**Giải pháp:** Thêm useEffect ngay khi criteria load xong:

```ts
useEffect(() => {
  if (state.criteria && state.todayExercises === DEFAULT_EXERCISES) {
    const fresh = generateProgressiveExercises(state.criteria, state.workoutHistory)
    if (fresh.length) setTodayExercises(fresh)
  }
}, [state.criteria])
```

Hoặc gọi generate ngay trong useEffect sync criteria (dòng 48-58).

### 2. Tăng số lượng bài tập lên 6-8

**Vấn đề:** `computeExerciseCount` trả về 5-6, nhưng `distributeSlotCounts` dùng `Math.floor` làm mất số dư (5 ÷ 3 nhóm = 1 mỗi nhóm = 3 tổng).

**Giải pháp:**

**a) `computeExerciseCount` — tăng base, mở clamp:**

```ts
function computeExerciseCount(...): number {
  const base: Record<Duration, number> = {
    "15 min": 5,
    "30 min": 6,
    "45 min": 7,
    "60+ min": 8,
  }
  const raw = base[...] + goalAdj + levelAdj + groupAdj
  return Math.max(5, Math.min(8, raw))
}
```

Clamp mới: `[5, 8]` thay vì `[5, 6]`.

**b) `distributeSlotCounts` — phân phối hết số dư:**

```ts
function distributeSlotCounts(groups, total, gender?): number[] {
  // Tính perSlot cơ bản
  // Phân phối số dư cho các nhóm đầu tiên
  // Đảm bảo tổng = total
}
```

Ví dụ: 7 exercises, 3 groups → [3, 2, 2] thay vì [2, 2, 2] (tổng 6).

**c) `generateProgressiveExercises` — không break sớm:**

Bỏ check `if (result.length >= count) break` ở dòng 389, để mỗi slot đều được xử lý. Dùng `slice(0, count)` ở cuối như hiện tại.

### 3. Reshuffle không exclude cứng

**Vấn đề:** `handleReshuffle` tích lũy `reshuffleSeenIds` và truyền vào `hardExcludeIds` của `generateProgressiveExercises`. Sau vài lần bấm, pool cạn.

**Giải pháp:** Bỏ hoàn toàn `reshuffleSeenIds` / `hardExcludeIds`. Reshuffle chỉ cần random seed mới (dùng Date.now() hoặc counter) để thứ tự khác đi, không exclude bài nào.

```ts
const handleReshuffle = () => {
  const fresh = generateProgressiveExercises(state.criteria, state.workoutHistory)
  if (fresh.length) setTodayExercises(fresh)
}
```

`generateProgressiveExercises` vẫn dùng seeded random dựa trên criteria, nhưng reshuffle sẽ dùng `extraExcludeIds` khác (hoặc dùng `Date.now()` làm seed phụ). Cụ thể:

- Thêm tham số `reshuffleSeed?: number` vào `generateProgressiveExercises`
- Khi reshuffle, truyền `Date.now()` để thay đổi thứ tự sorting
- Không truyền `hardExcludeIds` để không mất bài

## Code Style

Mẫu code mong muốn:

```ts
// split.ts
export function computeExerciseCount(
  duration?: Duration,
  goal?: Goal,
  level?: Level,
  groupsCount?: number,
): number {
  const base: Record<Duration, number> = {
    "15 min": 5,
    "30 min": 6,
    "45 min": 7,
    "60+ min": 8,
  }

  const goalAdj: Record<Goal, number> = {
    Strength: -1,
    Hypertrophy: 0,
    Endurance: +1,
  }

  const levelAdj = !level || level === "Novice" || level === "Beginner"
    ? -1
    : level === "Advanced" || level === "Expert"
      ? +1
      : 0

  const groupAdj = !groupsCount || groupsCount >= 4
    ? +1
    : groupsCount <= 1
      ? -1
      : 0

  const raw = (base[duration ?? "30 min"] ?? 6) + (goalAdj[goal ?? "Hypertrophy"]) + levelAdj + groupAdj
  return Math.max(5, Math.min(8, raw))
}

function distributeSlotCounts(
  groups: MuscleGroup[],
  totalCount: number,
  gender?: Gender,
): number[] {
  if (totalCount <= 0 || groups.length === 0) return []

  if (!gender || gender === "Khác") {
    const perSlot = Math.floor(totalCount / groups.length)
    const remainder = totalCount % groups.length
    return groups.map((_, i) => perSlot + (i < remainder ? 1 : 0))
  }

  const bias = GENDER_VOLUME_BIAS[gender] ?? { upper: 1.0, lower: 1.0 }
  const raw = groups.map((g) =>
    UPPER_UI_GROUPS.includes(g) ? bias.upper : bias.lower,
  )
  const sum = raw.reduce((a, b) => a + b, 0)
  const counts = raw.map((r) => Math.max(1, Math.round((r / sum) * totalCount)))

  // Adjust to match totalCount exactly
  const diff = totalCount - counts.reduce((a, b) => a + b, 0)
  for (let i = 0; diff !== 0 && i < counts.length; i++) {
    if (diff > 0) counts[i]++
    else if (counts[i] > 1) counts[i]--
  }
  return counts
}
```

```ts
// page.tsx
useEffect(() => {
  if (state.criteria && state.todayExercises.length <= 4) {
    const fresh = generateProgressiveExercises(state.criteria, state.workoutHistory)
    if (fresh.length) setTodayExercises(fresh)
  }
}, [state.criteria, state.todayExercises.length])

const handleReshuffle = () => {
  const fresh = generateProgressiveExercises(
    state.criteria,
    state.workoutHistory,
    undefined,
    undefined,
    Date.now(), // reshuffleSeed
  )
  if (fresh.length) setTodayExercises(fresh)
}
```

## Testing Strategy

- **Framework:** Vitest (jsdom)
- **Test files:** `src/lib/__tests__/split.test.ts`
- **Coverage:** các hàm thay đổi (`computeExerciseCount`, `distributeSlotCounts`)
- **Update tests:** Sửa expected values cho count mới (5-8 thay vì 5-6)
- **Verify:** `pnpm test` pass

## Boundaries

### Always do
- Run `pnpm test` before commit
- Giữ đúng convention: font-display/heading/body, CSS variables, "use client"
- Giữ seed-based deterministic selection cho cùng criteria trong cùng ngày
- Giữ nguyên signature của `generateProgressiveExercises` (thêm optional param, không breaking)

### Ask first
- Thay đổi cấu trúc dữ liệu `AppState` hoặc `UserCriteria`
- Thêm dependency mới
- Thay đổi tỉ lệ phân bố theo giới tính (GENDER_VOLUME_BIAS)

### Never do
- Xoá test mà không thay bằng test mới
- Commit khi test fail
- Hardcode số lượng bài tập cứng (phải dựa trên duration/goal/level)
- Phá vỡ deterministic seed (cùng criteria trong cùng ngày phải cho cùng kết quả, trừ reshuffle)

## Success Criteria

- [ ] Mở app (sau onboarding) → thấy 6-8 bài tập được gợi ý theo tiêu chí, không cần mở panel
- [ ] `computeExerciseCount` trả về 5-8 (tuỳ duration/goal/level)
- [ ] `distributeSlotCounts` phân phối hết tổng số, không mất số dư
- [ ] "Gợi ý lại" không exclude bài đã thấy, vẫn đủ số lượng
- [ ] Unit tests pass
- [ ] `pnpm build` pass
