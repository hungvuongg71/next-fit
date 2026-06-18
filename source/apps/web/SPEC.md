# Spec: Gợi ý thông minh — tích hợp Onboarding + Equipment filter

## Objective

Nâng cấp khung "Gợi ý hôm nay" và nút "Áp dụng gợi ý" để:

1. **Equipment filter**: Gợi ý nhóm cơ chỉ bao gồm các nhóm có bài tập phù hợp với equipment user đã chọn (từ Onboarding)
2. **Apply all**: Nút "Áp dụng gợi ý" set đồng thời muscles + duration + equipment
3. **Hiển thị đầy đủ**: Khung gợi ý hiển thị thêm duration + equipment được gợi ý

## Tech Stack

Next.js 16.2.7 + React 19 + TypeScript + Tailwind v4

## Commands

```bash
pnpm dev        # Dev
pnpm build      # Build
pnpm test       # 51 tests
```

## Files chạm

```
src/
├── app/page.tsx        # Logic gợi ý + hiển thị + nút apply
└── lib/split.ts        # Thêm filterMuscleGroupsByEquipment()
```

## Chi tiết

### 1. Equipment filter — `filterMuscleGroupsByEquipment()`

```ts
function filterMuscleGroupsByEquipment(
  groups: MuscleGroup[],
  equipment: Equipment[],
  allExercises: Exercise[],
): MuscleGroup[]
```

- Duyệt từng nhóm cơ trong `groups`
- Kiểm tra: có ít nhất 1 bài tập trong `MOCK_EXERCISES` khớp cả `muscleGroup` (qua MUSCLE_GROUP_MAP) và `equipment` không
- Chỉ giữ lại nhóm cơ có >= 1 bài phù hợp

### 2. Hiển thị gợi ý mở rộng

```
Gợi ý hôm nay
Theo lịch 4 ngày/tuần hôm nay nên tập: Ngực, Vai, Tay
Thiết bị: Tạ đơn, Thanh tạ đòn · 45 phút
6 bài

[Áp dụng gợi ý]
```

- `todaySuggestion` = kết quả từ `getTodaySuggestion(frequency)` → qua `filterMuscleGroupsByEquipment()`
- Hiển thị: `suggestedCount` bài + duration + equipment (tên Việt)

### 3. Áp dụng gợi ý

Nút "Áp dụng gợi ý" set đồng thời:
- `selectedMuscles` → muscle groups đã filter
- `selectedDuration` → `state.criteria.duration` (nếu có)
- `selectedEquipment` → `state.criteria.equipment` (nếu có)

## Success Criteria

- [ ] Gợi ý nhóm cơ loại bỏ nhóm không có bài tập phù hợp equipment user
- [ ] Khung gợi ý hiển thị duration + equipment
- [ ] Nút "Áp dụng" set muscles + duration + equipment
- [ ] Unit test cho `filterMuscleGroupsByEquipment`
- [ ] Build + 52 tests pass

## Effort

~15 phút, 1 commit
