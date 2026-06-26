# Plan: Muscle Group → Suggested Exercises (Homepage Redesign)

## Objective

Thay thế trải nghiệm chính của homepage: user chọn nhóm cơ → web generate 5-6 bài tập gợi ý → user chỉnh sửa (thay thế/xóa/thêm) → bắt đầu workout. Giáo án tuần thu gọn thành section phụ.

## UX Flow

```
Homepage:
┌──────────────────────────────────┐
│ Bạn muốn tập nhóm cơ nào?        │
│ Hãy chọn nhóm cơ để nhận gợi ý  │
│                                  │
│ [🏋️ Ngực]  [🏋️ Lưng]  [🏋️ Chân]│ ← 3-col grid, multi-select
│ [🏋️ Vai]   [🏋️ Tay]   [🏋️ Bụng]│
│                                  │
│ (khi đã chọn 1+ nhóm cơ)         │
│ Bài tập gợi ý (X bài):           │ ← auto-generate
│ [Bài tập 1]  [Thay thế] [Xóa]   │
│ [Bài tập 2]  [Thay thế] [Xóa]   │
│ ...                              │
│ [+ Thêm bài tập]                 │
│ [🔄 Hoàn tác]                    │
│                                  │
│ [Bắt Đầu Workout] ← fixed bottom │
├──────────────────────────────────┤
│ Giáo án tuần            [Chi tiết]│ ← compact section
│ [T2] [T3] [T4] ...              │
└──────────────────────────────────┘
```

## Kiến trúc

### Files

| File | Thay đổi |
|------|----------|
| `src/app/page.tsx` | Rewrite: muscle group grid + suggestions + compact plan section |
| `src/components/ui/MuscleGroupSelector.tsx` | **New**: grid các muscle group card (multi-select) |
| `src/lib/suggestions.ts` | **New**: `suggestExercises(muscles, count)` — chọn bài tập theo nhóm cơ |

### Data Flow

```
[MUSCLE_GROUPS] → MuscleGroupSelector (chọn nhiều)
  ↓ selectedMuscles
[suggestExercises(selectedMuscles, 6)]
  ↓ suggestedExercises
[SuggestionList] → replace/delete/add (local state)
  ↓ "Bắt Đầu Workout"
setTodayExercises(suggestedExercises) + startWorkout()
  → router.push("/workout")
```

### suggestExercises logic

```typescript
suggestExercises(muscleGroups: MuscleGroup[], count = 6): Exercise[]
```
1. Lấy danh sách exercise từ MOCK_EXERCISES match từng nhóm cơ (dùng MUSCLE_GROUP_MAP)
2. Phân bố đều: count / số nhóm cơ (làm tròn)
3. Ưu tiên exercise có equipment khác nhau (variety)
4. Trộn ngẫu nhiên trong mỗi nhóm

### State

Local state trên homepage:
- `selectedMuscles: MuscleGroup[]` — nhóm cơ đã chọn
- `suggestedExercises: Exercise[]` — bài tập gợi ý hiện tại
- `savedSuggestions: Exercise[]` — bản snapshot để undo
- `replaceTarget: { exercise: Exercise; index: number } | null` — cho replace

### UI Components

**MuscleGroupSelector:**
- Grid 3 cột
- Mỗi card: hình placeholder (gradient màu), tên nhóm cơ (VI)
- Click → toggle select, border highlight
- Selected state: primary border + glow

**Suggested exercises list:**
- Mỗi bài là ExerciseCard-like component
- 3 nút action: Thay thế (⟳), Xóa (trash), kèm confirm
- "Thêm bài tập" button → mở ExercisePicker (add mode)
- "Hoàn tác" button → restore savedSuggestions

## Tasks

### Task 1: Tạo suggestExercises utility
- Tạo `src/lib/suggestions.ts`
- Import `MOCK_EXERCISES`, `MUSCLE_GROUP_MAP`
- Hàm `suggestExercises(muscles, count)` → phân bố đều, shuffle
- Test với 2-3 nhóm cơ

### Task 2: Tạo MuscleGroupSelector component  
- Tạo `src/components/ui/MuscleGroupSelector.tsx`
- Props: `selected: MuscleGroup[]`, `onChange: (groups) => void`
- Grid 3 cột, card có placeholder hình (gradient)
- Toggle select, highlight border
- Import MUSCLE_GROUPS, MUSCLE_GROUPS_VI

### Task 3: Rewrite homepage
- Rewrite `src/app/page.tsx`
- Header: "Bạn muốn tập nhóm cơ nào?"
- MuscleGroupSelector section
- Suggested exercises section (auto-generate khi selectedMuscles thay đổi)
- Action buttons: thêm bài, hoàn tác
- Compact weekly plan section (dạng horizontal scroll)
- Fixed bottom "Bắt Đầu Workout" button
- ExercisePicker + ExerciseModal integration

### Task 4: Cleanup
- Xóa code cũ không dùng
- Build + test (105 tests)

## Checkpoints

| # | Checkpoint | Sau task | Verify |
|---|-----------|----------|--------|
| 1 | suggestExercises | Task 1 | `npm run test` |
| 2 | MuscleGroupSelector | Task 2 | `npm run build` |
| 3 | Homepage rewrite | Task 3 | `npm run build` |
| 4 | Tất cả pass | Task 4 | `npm run build && npm run test` |

## Boundaries

- **Luôn làm:** Multi-select muscle group; auto-generate khi chọn; replace/xóa/thêm từng bài; undo snapshot
- **Chưa làm:** Hình ảnh real (user cung cấp sau); phân tích level/goal để gợi ý (chỉ dựa trên nhóm cơ); pagination
- **Giữ nguyên:** PlanEditModal, CookieConsent, BottomNav, TopHeader
