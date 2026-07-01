# Spec: Per-Mode Independent Exercise State

## Objective

Tách `suggestedExercises` (state dùng chung) thành 3 state riêng biệt — mỗi mode (Gợi ý / Giáo án / Tự chọn) quản lý danh sách bài tập độc lập. Chuyển đổi giữa các mode khôi phục đúng danh sách của mode đó.

## Tech Stack

- **Framework:** Next.js 16.2.7 (App Router)
- **Styling:** Tailwind CSS v4 + CSS variables

## Commands

```
Build:  pnpm build
Dev:    pnpm dev
Test:   pnpm test
```

## Project Structure (affected files)

```
src/app/page.tsx   → 3 state vars, new handlers, per-mode logic
SPEC.md            → This spec
tasks/plan.md      → Plan (to be written)
tasks/todo.md      → Task tracking (to be written)
```

## Code Style

**3 state variables, one per mode:**

```tsx
const [suggestExercises, setSuggestExercises] = useState<Exercise[]>([])
const [planExercises, setPlanExercises] = useState<Exercise[]>([])
const [freeExercises, setFreeExercises] = useState<Exercise[]>([])
```

**Derived current exercises:**

```tsx
const currentExercises = useMemo(() => {
  if (workoutMode === "suggest") return suggestExercises
  if (workoutMode === "plan")   return planExercises
  return freeExercises
}, [workoutMode, suggestExercises, planExercises, freeExercises])
```

**Per-mode saved baselines for undo:**

```tsx
const [suggestSaved, setSuggestSaved] = useState<Exercise[]>([])
const [planSaved, setPlanSaved] = useState<Exercise[]>([])
const [freeSaved, setFreeSaved] = useState<Exercise[]>([])
```

**Helper to update current mode's exercises:**

```tsx
function updateExercises(fn: (prev: Exercise[]) => Exercise[]) {
  if (workoutMode === "suggest") setSuggestExercises(fn)
  else if (workoutMode === "plan") setPlanExercises(fn)
  else setFreeExercises(fn)
}
```

**Grid heading per mode:**
```
Gợi ý:  "Bài tập gợi ý ({n})"
Giáo án: "Bài tập giáo án ({n})"
Tự chọn: "Bài tập của tôi ({n})"
```

## Layout

Identical to current layout — only the exercise state model changes internally.

## Mode Behavior

| Mode | Exercise source | Replace vs Append | Baseline for undo |
|---|---|---|---|
| **Gợi ý** | `useEffect` on `selectedMuscles` → `suggestExercises(muscles, dynamicCount)` | Replace | Saved on muscle change |
| **Giáo án** | `handleLoadPlanDay` → copy `day.exercises` | Replace | Saved on day click |
| **Tự chọn** | `ExercisePicker` → `handleAddExercises` | Append | Empty (no undo needed) |

### Suggest mode: dynamic count

Số lượng bài tập gợi ý tăng theo số nhóm cơ đã chọn:

| Nhóm cơ | Count |
|---|---|
| 1 | 6 |
| 2 | 8 |
| 3-4 | 10 |
| 5-6 | 12 |

```tsx
const muscles = selectedMuscles.length > 0 ? selectedMuscles : [...MUSCLE_GROUPS] as MuscleGroup[]
const count = muscles.length === 1 ? 6 : muscles.length <= 2 ? 8 : muscles.length <= 4 ? 10 : 12
const exercises = suggestExercises(muscles, state.criteria?.equipment, count)
```

Bài tập được chọn ngẫu nhiên từ pool chung của tất cả nhóm cơ đã chọn (giữ nguyên logic `suggestExercises` hiện tại).

### Mode switching preserves state

When user switches from Gợi ý → Giáo án:
1. Hides muscle pills, shows day cards
2. Exercise grid now shows `planExercises` (previously saved for plan mode)
3. When switching back to Gợi ý: `suggestExercises` (previously saved) is restored

### DnD, sort, add, remove, replace

All operations (`handleMoveUp`, `handleDragEnd`, `handleRemoveExercise`, `handleAddExercises`, `handleReplaceExercise`) dispatch to `updateExercises` which targets the current mode's state.

### Nút Reset (per-mode)

Xoá toàn bộ bài tập + baseline của mode hiện tại. Cần confirm trước khi reset.

**Behavior per mode:**

| Mode | Reset clears |
|---|---|
| Gợi ý | `suggestModeExercises` → `[]`, `suggestSaved` → `[]` |
| Giáo án | `planExercises` → `[]`, `planSaved` → `[]`, `selectedPlanDayIndex` → `null` |
| Tự chọn | `freeExercises` → `[]`, `freeSaved` → `[]` |

**UX:**
- Nút reset (icon `Trash2`) nằm cạnh nút "Hoàn tác" trong header exercise grid
- Chỉ hiện khi `currentExercises.length > 0`
- Click → dialog confirm "Xoá tất cả bài tập?" với 2 nút "Huỷ" / "Xoá"
- Confirm → xoá exercises + baseline của mode hiện tại
- Không ảnh hưởng đến các mode khác

Per-mode: reads the current mode's saved baseline.

```tsx
const currentSaved = useMemo(() => {
  if (workoutMode === "suggest") return suggestSaved
  if (workoutMode === "plan")   return planSaved
  return freeSaved
}, [workoutMode, suggestSaved, planSaved, freeSaved])

const handleUndo = () => {
  if (workoutMode === "suggest") setSuggestExercises([...suggestSaved])
  else if (workoutMode === "plan") setPlanExercises([...planSaved])
  // free mode: no undo (or clears to [])
}
```

`hasChanges` compares `currentExercises` to `currentSaved`.

### Bắt Đầu Workout

Uses `currentExercises`. After routing to `/workout`, reset ALL 3 states to `[]`.

```tsx
const handleStartWorkout = () => {
  if (currentExercises.length === 0) return
  setTodayExercises(currentExercises)
  startWorkout()
  router.push("/workout")
  setSuggestExercises([])
  setPlanExercises([])
  setFreeExercises([])
  setSuggestSaved([])
  setPlanSaved([])
  setFreeSaved([])
}
```

### DailyExercise `onAdd`

Adds exercise to the current mode's state (not all modes).

### PlanEditModal removed

Zone 3 already removed in previous iteration. No change needed.

## Operations Refactoring Summary

All these currently use `setSuggestedExercises` — change to `updateExercises`:

| Handler | Action |
|---|---|
| `handleAddExercises` | Append with dedup → `updateExercises` |
| `handleRemoveExercise` | Filter out → `updateExercises` |
| `handleMoveUp` | Swap with prev → `updateExercises` |
| `handleMoveDown` | Swap with next → `updateExercises` |
| `handleDragEnd` | Reorder → `updateExercises` |
| `handleReplaceExercise` | Replace at index → `updateExercises` |
| `DailyExercise.onAdd` | Append with dedup → `updateExercises` |
| ExercisePicker `onAdd` | Calls `handleAddExercises` already ✓ |
| Confirm modal `onConfirm` | Calls `handleRemoveExercise` already ✓ |

## Implementation Plan

### Phase 1: Dynamic count in suggest mode
1. Update `page.tsx` `useEffect` — calculate `count` based on `muscles.length`
2. Build + test verification

### Phase 2: Verify build + tests

## Testing Strategy

- **Framework:** Vitest (existing)
- **Coverage:** Existing 126 tests must pass
- Only page.tsx changes (no lib logic changes)

## Boundaries

**Always do:**
- Run `pnpm build` before marking done
- Keep DnD, sort controls working in all modes
- Each mode preserves its own state independently

**Ask first:**
- Adding new modes beyond the current 3
- Changing how `suggestExercises` (lib function) works

**Never do:**
- Break existing muscle → suggest flow
- Break DnD integration
- Introduce shared state between modes

## Open Questions

None — requirements are clear from user answers.
