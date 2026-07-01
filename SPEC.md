# Spec: Cải thiện Trang Chủ

## Objective

Cải thiện trải nghiệm trang chủ với Daily Recommendation làm trung tâm, kết hợp cải thiện layout và các quick actions.

**User stories:**
- Khi mở app, tôi thấy "Bài tập trong ngày" — một bài tập nổi bật phù hợp với lịch sử tập & mục tiêu của tôi, có thể xem chi tiết hoặc thêm vào workout
- Tôi thấy "Micro-workout gợi ý hôm nay" — 2-3 bài tập nhẹ cho phiên nhanh, có nút "Bắt đầu ngay"
- Nếu tôi đang có workout dang dở, tôi thấy banner "Tiếp tục workout" ở đầu trang
- Tôi thấy thống kê nhanh đầu trang: số buổi tập tuần này, streak hiện tại
- Layout gọn gàng hơn, các section rõ ràng

## Tech Stack

- Next.js 16.2.7 (App Router), React 19.2.4, TypeScript 5
- Tailwind CSS v4, lucide-react
- Vitest + Testing Library
- localStorage persistence

## Commands

```
Build: pnpm build
Test: pnpm test
Dev: pnpm dev
Lint: pnpm lint
```

## Project Structure

```
src/
├── app/page.tsx              → Rewrite sections, integrate new components
├── components/ui/
│   ├── DailyExercise.tsx     → [MỚI] Bài tập trong ngày card
│   ├── MicroWorkout.tsx      → [MỚI] Micro-workout suggestion card
│   ├── WorkoutBanner.tsx     → [MỚI] Resume workout banner
│   └── QuickStats.tsx        → [MỚI] Thống kê nhanh đầu trang
├── lib/
│   ├── daily-recommendation.ts → [MỚI] Chọn bài daily + micro-workout
│   └── weekly-stats.ts       → [MỚI] Tính streak, volume tuần
├── state/context.tsx          → Giữ nguyên (đọc lastPerformances, workoutHistory)
└── types/index.ts             → Giữ nguyên
```

## Code Style

```typescript
// Ví dụ style: component nhẹ, không comment thừa
export default function DailyExercise({ exercise, onAdd }: DailyExerciseProps) {
  return (
    <div className="rounded-2xl p-4" style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}>
      <ExerciseThumbnail exercise={exercise} className="w-full rounded-xl mb-3" style={{ height: 140 }} />
      <h3 className="font-heading font-semibold text-sm truncate">{exercise.name}</h3>
      <p className="font-body text-xs" style={{ color: "var(--color-text-secondary)" }}>
        {exercise.target_muscle_group} · {exercise.difficulty_level}
      </p>
      <button onClick={onAdd} className="mt-2 w-full py-2 rounded-xl font-heading text-xs font-semibold"
        style={{ background: "var(--color-primary)", color: "#fff" }}>
        Thêm vào workout
      </button>
    </div>
  )
}
```

## Testing Strategy

- **Framework:** Vitest
- **Unit tests:** `src/lib/__tests__/daily-recommendation.test.ts`, `weekly-stats.test.ts`
- **Test concerns:**
  - Daily recommendation: chọn bài dựa trên lịch sử, ưu tiên nhóm cơ chưa tập, không lặp
  - Weekly stats: tính streak, volume tuần từ workoutHistory
- **Không test component UI** (chỉ logic)

## Boundaries

- **Always do:**
  - Chạy `pnpm test` trước commit
  - Daily exercise không lặp lại trong 7 ngày gần nhất
  - Micro-workout chọn bài đa dạng nhóm cơ (full body 15 phút)
  - Resume banner chỉ hiện khi có workout dang dở

- **Ask first:**
  - Thay đổi Exercise interface
  - Thêm dependency mới
  - Sửa state/context logic

- **Never do:**
  - Xoá dữ liệu JSON exercises
  - Xoá test hiện có
  - Commit secret/cấu hình cá nhân

## Success Criteria

- [x] `DailyExercise` component hiển thị bài tập trong ngày với thumbnail + nút "Thêm vào workout"
- [x] `MicroWorkout` component hiển thị 2-3 bài tập cho phiên nhanh + nút "Bắt đầu ngay"
- [x] `WorkoutBanner` hiển thị khi có workout dang dở, nút "Tiếp tục" → /workout
- [x] `QuickStats` hiển thị số buổi tuần này + streak
- [x] Layout trang chủ được tái cấu trúc: section rõ ràng, spacing hợp lý
- [x] Daily recommendation không lặp bài trong 7 ngày
- [x] Code pass `pnpm test`, `pnpm build`, `pnpm lint`
- [x] Không break existing tests

## Implementation Order (theo phân tích)

1. **Daily Recommendation + Micro-workout** (core feature — phần user chọn)
2. **QuickStats** (thống kê nhanh đầu trang — tác động lớn, code ít)
3. **WorkoutBanner** (resume workout — logic đơn giản)
4. **Layout refresh** (spacing, section ordering, empty state)

## Open Questions

- [ ] Micro-workout mặc định 15 phút, có cần cho user chọn duration?
- [ ] Workout dang dở: tự động detect khi có session trong localStorage?
