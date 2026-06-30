# Spec: Ưu tiên bài tập Barbell/Dumbbell trong gợi ý

## Objective

Hiện tại `suggestExercises()` lọc cứng theo equipment (chỉ lấy bài tập matching equipment). Sửa thành **ưu tiên Barbell/Dumbbell lên đầu**, nếu không đủ thì bổ sung từ các thiết bị khác trong profile.

**Ví dụ:** User có equipment `["Barbell", "Dumbbell", "Cable", "Kettlebell"]`, chọn Chest, count=6:
1. Lấy tất cả Chest + Barbell/Dumbbell → shuffle → lấy tối đa 6
2. Nếu chưa đủ 6, bổ sung từ Chest + các equipment còn lại (Cable, Kettlebell) → shuffle → fill cho đủ 6

## Tech Stack

Next.js 16 + React 19 + TypeScript 5 + Vitest 4 (không đổi)

## Commands

```
Test: pnpm --filter=nextfit vitest run
Lint: pnpm --filter=nextfit lint
```

## Project Structure

```
src/lib/suggestions.ts                → [EDIT] Logic ưu tiên
src/lib/__tests__/suggestions.test.ts → [EDIT] Sửa/sửa test cho phù hợp
```

Chỉ 2 files.

## Code Style

```typescript
export function suggestExercises(
  muscleGroups: MuscleGroup[],
  equipment: string[] = DEFAULT_EQUIPMENT,
  count = 6,
): Exercise[] {
  if (muscleGroups.length === 0) return []
  const targets = new Set(muscleGroups)
  const equipSet = new Set(equipment.length > 0 ? equipment : DEFAULT_EQUIPMENT)

  const pool = MOCK_EXERCISES.filter((ex) =>
    targets.has(ex.target_muscle_group as MuscleGroup) && equipSet.has(ex.primary_equipment),
  )

  const priority = ["Barbell", "Dumbbell"]
  const priorityExercises = pool.filter((ex) => priority.includes(ex.primary_equipment))
  const otherExercises = pool.filter((ex) => !priority.includes(ex.primary_equipment))

  const shuffledPriority = shuffle(priorityExercises)
  const shuffledOther = shuffle(otherExercises)

  const result: Exercise[] = []
  for (const ex of shuffledPriority) {
    if (result.length >= count) break
    result.push(ex)
  }
  for (const ex of shuffledOther) {
    if (result.length >= count) break
    result.push(ex)
  }
  return result
}
```

Giữ nguyên shuffle giữa các bài trong cùng nhóm ưu tiên.

## Testing Strategy

Giữ vitest. Cập nhật/sửa test:

| Test | Mô tả |
|------|-------|
| `trả về Barbell/Dumbbell trước` | Khi có cả Barbell và Dumbbell trong pool, chúng xuất hiện trước các equipment khác |
| `bổ sung từ equipment khác nếu thiếu` | Filter sao cho chỉ có 1 bài Barbell, count=3 → 1 Barbell + 2 từ equipment khác |
| `chỉ Barbell/Dumbbell nếu đủ` | Filter sao cho có >=6 bài Barbell/Dumbbell → kết quả toàn Barbell/Dumbbell |
| `default equipment fallback` | equipment = [] → dùng default (vẫn ưu tiên Barbell/Dumbbell) |
| `không có Barbell/Dumbbell` | Equipment list không có Barbell/Dumbbell → lấy từ equipment khác |
| `empty muscle groups → []` | Giữ nguyên |

## Boundaries

**Always do:**
- Barbell/Dumbbell luôn đứng trước trong result array
- Shuffle trong cùng nhóm ưu tiên
- Giữ nguyên default equipment fallback

**Ask first:**
- Thêm equipment khác vào priority list (ví dụ: Cable)
- Thay đổi thứ tự ưu tiên

**Never do:**
- Thay đổi weekly plan / session-builder logic
- Thêm dependencies

## Success Criteria

1. `suggestExercises(["Chest"], ["Barbell", "Dumbbell", "Cable"], 6)` → các bài Barbell/Dumbbell đứng trước Cable
2. `suggestExercises(["Chest"], ["Barbell", "Cable"], 3)` với 1 bài Barbell → result[0] là Barbell, result[1..2] là Cable
3. All existing tests pass (đã update)

## Open Questions

Không có.
