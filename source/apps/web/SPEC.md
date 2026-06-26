# Spec: Thay thế bài tập trong Workout

## Objective

Cho phép user thay thế bài tập không phù hợp trong lúc workout bằng cách bấm nút Replace → mở ExercisePicker (lọc cùng nhóm cơ) → chọn 1 bài → replace bài cũ. Progress của bài cũ bị reset.

## Tech Stack

- Next.js 16, React 19, TypeScript 5, Tailwind CSS 4
- lucide-react icons
- State: React Context + localStorage

## Commands

```
Build: npm run build
Dev:   npm run dev
Test:  npm run test
Lint:  npm run lint
```

## Project Structure (files ảnh hưởng)

```
src/components/ui/ExercisePicker.tsx    → Thêm replaceMode prop (single select, title, pre-filter)
src/state/context.tsx                   → replaceExercise cập nhật cả exerciseProgress
src/app/workout/page.tsx                → Thêm nút Replace trong exercise card header
```

## Data Flow

```
[ Nút Replace ] → open ExercisePicker (replaceMode, muscleGroup=current)
  → user chọn 1 bài → bấm "Thay thế"
  → onReplace(exerciseId, newExercise) được gọi
  → context.replaceExercise updates todayExercises + exerciseProgress
  → component re-render với bài mới, progress reset
```

## UI Changes

### Workout Page — Nút Replace
```
[Exercise Card Header]
┌──────────────────────────────────────────┐
│ [img]  Tên bài                    3/4   │
│        Dumbbell · Ngực · 90s nghỉ       │
│        Lần trước: 10 reps × 40kg        │
│        [Thay thế]                        │  ← nút mới
└──────────────────────────────────────────┘
```

- Nút "Thay thế" ở cuối phần thông tin exercise, trước phần sets
- Chỉ hiển thị khi exercise chưa hoàn thành (không phải tất cả sets đã check)
- Icon: `RefreshCw` hoặc `Shuffle` size 12
- Style: text-xs, primary color, rounded-xl

### ExercisePicker — Replace Mode

Khi mở từ workout với `replaceMode`:
- Title: "Thay thế bài tập" (thay vì "Thêm bài tập")
- Pre-select: muscle group của bài đang replace (không show equipment filter)
- Single select: chỉ chọn được 1 bài (checkbox → radio behavior)
- Submit button: "Thay thế" (thay vì "Thêm N bài tập"), disable khi chưa chọn
- Sau khi chọn + submit → gọi `onReplace` → đóng picker

### Context — replaceExercise

```typescript
replaceExercise(id: string, newEx: Exercise)
```
- `todayExercises`: replace exercise by id
- `exerciseProgress`: replace exercise progress (reset sets theo exercise mới)
- Không đổi: workoutStarted, workoutCompleted, v.v.

## OnConfirm (workout page)

Khi ExercisePicker submit với replaceMode:
1. `replaceExercise(exerciseId, newExercise)` — updates context
2. Reset local UI (nếu exercise đang được chọn/selectedExercise)
3. Đóng picker

## Acceptance Criteria

1. Nút "Thay thế" hiển thị trên mỗi exercise card (trừ khi đã hoàn thành)
2. Bấm → ExercisePicker mở với muscle group của bài đang replace
3. ExercisePicker ở chế độ single select, title "Thay thế bài tập"
4. Chọn 1 bài → bấm "Thay thế" → bài cũ bị thay, progress reset
5. Build + 105 tests pass

## Boundaries

- **Luôn làm:** Filter cùng muscle group; single select; reset progress khi replace
- **Hỏi trước:** Replace bài đã hoàn thành (hiện tại không cho); multi-replace; replace ảnh hưởng tới session save
- **Không làm:** Thay đổi `Exercise` data type; sửa `onAdd` behavior cho non-replace mode
