# Spec: Cải thiện Bài Tập Liên Quan (Related Exercises)

## Objective

Cải thiện phần "Bài tập liên quan" trong `ExerciseModal` — hiện tại chỉ lọc theo cùng `target_muscle_group` và lấy 3 bài đầu (`slice(0, 3)`) không có sắp xếp.

Thay đổi thành: hiển thị 10-15 bài tập liên quan, được sắp xếp theo mức độ phù hợp với người dùng (ưu tiên thiết bị người dùng có + trình độ phù hợp), giao diện dạng grid với nút "Xem thêm".

**User stories:**
- Khi mở modal chi tiết bài tập, tôi thấy 3-4 bài tập liên quan đầu tiên (đã được xếp hạng ưu tiên) dạng grid ngang
- Tôi có thể nhấn "Xem thêm" để mở rộng danh sách lên đến 15 bài
- Các bài tập gợi ý ưu tiên bài dùng thiết bị tôi có và phù hợp trình độ của tôi

## Tech Stack

- Next.js 16.2.7 (App Router), React 19.2.4
- TypeScript 5
- Tailwind CSS v4
- lucide-react
- Vitest + Testing Library

## Commands

```
Build: pnpm build
Test: pnpm test
Dev: pnpm dev
Lint: pnpm lint
```

Chạy từ thư mục `source/apps/web`.

## Project Structure

```
src/
├── components/ui/
│   ├── ExerciseModal.tsx     → Sửa related exercises logic & UI
│   └── ExerciseThumbnail.tsx → Giữ nguyên (đã có)
├── lib/
│   ├── related-exercises.ts  → [MỚI] Scoring & ranking functions
│   └── split.ts              → Dùng lại matchesLevel()
├── types/index.ts            → Giữ nguyên
└── state/context.tsx         → Đọc criteria (level, equipment) từ đây
```

## Code Style

- **Naming:** camelCase functions/variables, PascalCase components/types
- **Format:** dùng existing style (JSX single quotes, Tailwind inline style với `style={{}}`)
- **Scoring function** dạng `relatedScore(ex, criteria) => number`
- **Không thêm comment trừ khi thực sự cần**
- **Import pattern:** `@/` alias

```typescript
// Ví dụ style mong muốn
function relatedScore(
  exercise: Exercise,
  userEquipment: Equipment[],
  userLevel: Level,
): number {
  let score = 0
  if (userEquipment.includes(exercise.primary_equipment as Equipment)) score += 3
  if (matchesLevel(exercise.difficulty_level, userLevel)) score += 2
  return score
}
```

## Testing Strategy

- **Framework:** Vitest (đã có sẵn)
- **Test location:** `src/lib/__tests__/` cho unit test related-exercises.ts
- **Coverage:** Testing scoring logic (edge cases: thiết bị không match, level không match), không cần test component UI (ExerciseModal) vì chủ yếu là logic hiển thị
- **Các test case:**
  - `relatedScore` trả về điểm cao nhất khi equipment + level đều match
  - `relatedScore` trả về điểm thấp hơn khi chỉ equipment match
  - `relatedScore` xử lý userCriteria null/undefined
  - `getRelatedExercises` trả về đúng số lượng (3-4 mặc định, 10-15 khi mở rộng)
  - `getRelatedExercises` exclude bài hiện tại

## Boundaries

- **Always do:**
  - Chạy `pnpm test` trước khi commit
  - Giữ nguyên `Exercise` interface (không thêm field mới)
  - Sắp xếp theo score giảm dần
  - Exclude bài tập đang xem khỏi danh sách

- **Ask first:**
  - Thay đổi cấu trúc dữ liệu `Exercise`
  - Thêm dependency mới
  - Thay đổi UI component khác ngoài ExerciseModal

- **Never do:**
  - Xoá/sửa file JSON dữ liệu
  - Xoá test hiện có
  - Commit secret/config cá nhân

## Success Criteria

- [x] `relatedScore()` function tính điểm dựa trên equipment match + level match
- [x] `getRelatedExercises()` function trả về danh sách đã sort theo score, mặc định 3-4 bài
- [x] ExerciseModal hiển thị related exercises grid với nút "Xem thêm" mở rộng đến 10-15 bài
- [x] Không break existing tests
- [x] Code pass `pnpm build` và `pnpm lint`

## Open Questions

- [ ] Có muốn thêm movement pattern matching vào scoring không? (Hiện tại chưa — để MVP)
- [ ] Có muốn lưu trạng thái "mở rộng" vào localStorage? (Hiện tại chưa)
