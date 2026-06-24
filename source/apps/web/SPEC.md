# Spec: Bỏ Auto-Suggestion — User Tự Chọn Bài Tập

## Objective

Loại bỏ cơ chế tự động gợi ý bài tập hiện tại, chuyển sang luồng User tự chọn bài tập hoàn toàn. Đây là bước dọn đường cho chức năng gợi ý mới sẽ được định nghĩa sau.

## Hiện trạng

**Luồng hiện tại:**
1. Mở app → `generateProgressiveExercises` tự động sinh 5-8 bài dựa trên criteria
2. User thấy danh sách bài đã được gợi ý sẵn
3. User có thể: "Gợi ý lại", "Thay đổi tiêu chí" (panel), "Thêm bài tập khác" (picker)
4. User bấm "Bắt đầu Workout"

**Luồng mới:**
1. Mở app → thấy empty state (nếu chưa có bài nào) hoặc load lại bài từ workout gần nhất
2. User tự thêm bài qua **ExercisePicker cải tiến** (show all exercises, multi-select, preview)
3. User bấm "Bắt đầu Workout"

## Tech Stack

Next.js 16.2.7 + React 19 + TypeScript + Tailwind v4 + Vitest

## Commands

```bash
pnpm dev          # Dev server
pnpm build        # Production build
pnpm test         # Unit tests (Vitest)
pnpm lint         # ESLint
```

## Phạm vi thay đổi

### Xoá khỏi split.ts
Toàn bộ logic gợi ý tự động — các function chỉ được dùng bởi `generateProgressiveExercises`:

| Function | Lý do |
|----------|-------|
| `generateProgressiveExercises` | Core suggestion engine — xoá |
| `computeExerciseCount` | Tính số lượng bài — xoá |
| `distributeSlotCounts` | Phân phối bài theo nhóm cơ — xoá |
| `getTodaySuggestion` | Xác định nhóm cơ hôm nay — xoá |
| `filterMuscleGroupsByEquipment` | Lọc nhóm cơ theo equipment — xoá |
| `getSeed`, `seededRandom`, `hashCode` | Seed-based random — xoá |
| `getSlotSeed`, `selectForSlot` | Chọn bài cho từng slot — xoá |
| `getRecentExerciseIds` | Loại bài đã tập gần đây — xoá |
| `crossSlotFatiguePenalty` | Penalty fatigue — xoá |

**Giữ lại:** `MUSCLE_GROUP_MAP`, `matchesLevel`, `parseAvgReps`, `compoundScore`, `repScore`, `goalScore`, `fatiguePenalty` — các utility này vẫn có thể dùng sau này.

### ExercisePicker — Cải tiến
- **Multi-select**: Có thể chọn nhiều bài cùng lúc, không đóng picker sau mỗi lần chọn
- **Preview panel**: Hiển thị danh sách bài đã chọn ngay trong picker (bên dưới filters)
- **Select all / Deselect all** theo filter hiện tại
- **Submit button**: "Thêm X bài tập" thay vì chọn từng cái rồi tự đóng

### Homepage (page.tsx)
- Bỏ auto-load useEffect (dòng 62-67)
- Bỏ debounce criteria useEffect (dòng 70-83)
- Bỏ criteria panel UI (null khi `!showCriteriaPanel` là đủ — hoặc xoá hẳn)
- Bỏ "Gợi ý lại" / "Hoàn tác" buttons
- Bỏ handleReshuffle, handleReplace
- **Thêm**: "Tải bài từ buổi tập gần nhất" nếu có workout history
- **Thêm**: Empty state nếu chưa có bài nào

### Xoá khỏi tests
- `src/lib/__tests__/split.test.ts` — xoá tests cho các function đã xoá

### Files chạm

```
src/
├── app/page.tsx                    # Restructure homepage
├── lib/split.ts                    # Xoá suggestion logic
├── lib/__tests__/split.test.ts     # Xoá tests tương ứng
├── components/ui/ExercisePicker.tsx # Multi-select, preview, submit
└── components/ui/ExerciseCard.tsx   # Có thể sửa onReplace
```

---

## Phương án triển khai

### Phương án A: Homepage tối giản (Recommended)

**Homepage:**
- Mặc định: empty state với icon + text "Hôm nay bạn muốn tập gì? Thêm bài tập bên dưới"
- Nếu có workout history: hiển thị nút "Tải bài tập từ buổi trước" (load exercises từ `WorkoutHistoryEntry` gần nhất)
- Nút "Thêm bài tập" mở Picker (đã cải tiến)
- Giữ nguyên header "Hôm nay bạn muốn tập gì?" + subtitle
- Giữ nguyên "Bắt đầu Workout" CTA
- Bỏ: criteria panel, suggestion banner, "Gợi ý lại"/"Hoàn tác" buttons, replace logic

**ExercisePicker:**
- Mode mới: `multiSelect` (default true)
- Không đóng sau khi chọn — User tích checkbox, xem preview dưới filters
- Nút "Thêm X bài tập" ở cuối picker
- Filters: muscle group, equipment (show all, không filter theo criteria)
- Search: giữ nguyên

### Phương án B: Homepage tối giản + Không có "load từ lịch sử"

Giống A nhưng bỏ nút "Tải bài từ buổi trước". Homepage luôn bắt đầu với empty state.

**Khi nào dùng:** Nếu bạn muốn mỗi buổi tập là một "phiên mới" hoàn toàn, không gợi ý lại bài cũ.

### Phương án C: Giữ criteria panel nhưng không auto-suggest

Criteria panel trên homepage vẫn hiển thị được (User có thể thay đổi criteria để lưu vào profile), nhưng không auto-sinh bài tập.

**Khi nào dùng:** Nếu criteria vẫn có giá trị cho stats/ history tracking và User muốn thấy criteria hiện tại.

---

## Code Style

Giữ nguyên convention hiện tại. Ví dụ ExercisePicker mới:

```tsx
// ExercisePicker.tsx — multi-select mode
interface ExercisePickerProps {
  isOpen: boolean
  selectedIds: Set<string>
  onToggle: (exercise: Exercise) => void
  onSubmit: () => void
  onClose: () => void
}

// Preview trong picker
{selectedIds.size > 0 && (
  <div className="px-5 pb-3">
    <p className="font-heading font-semibold text-xs mb-2">
      ĐÃ CHỌN ({selectedIds.size})
    </p>
    <div className="space-y-1">
      {selectedExercises.map((ex) => (
        <div key={ex.id} className="flex items-center gap-2 p-2 rounded-xl">
          <ExerciseThumbnail exercise={ex} className="w-8 h-8 rounded-lg" />
          <span className="font-body text-sm">{ex.name}</span>
        </div>
      ))}
    </div>
  </div>
)}
```

## Testing Strategy

- **Framework:** Vitest
- **Cập nhật:** Xoá tests cho function đã xoá khỏi split.test.ts
- **Không thêm test mới** (chức năng suggestion sau sẽ có test riêng)
- **Verify:** `pnpm test` pass + `pnpm build` pass

## Boundaries

### Always do
- Chạy `pnpm test` trước commit
- Chạy `pnpm build` sau mỗi batch thay đổi
- Xoá đúng function, không xoá utility có thể dùng sau

### Ask first
- Xoá `MUSCLE_GROUP_MAP` (vẫn dùng trong ExercisePicker)
- Thay đổi cấu trúc ExercisePicker props (ảnh hưởng page.tsx và workout calls)
- Thêm dependency mới

### Never do
- Xoá tất cả split.ts (giữ utility functions)
- Để sót import path đến function đã xoá
- Commit khi test fail

## Success Criteria

- [ ] `generateProgressiveExercises` và các function phụ trợ bị xoá khỏi split.ts
- [ ] `getTodaySuggestion`, `computeExerciseCount`, `filterMuscleGroupsByEquipment` bị xoá
- [ ] Không còn auto-load exercise khi mở app
- [ ] Không còn criteria panel trên homepage
- [ ] ExercisePicker hỗ trợ multi-select + preview
- [ ] "Gợi ý lại" và "Hoàn tác" buttons bị xoá
- [ ] Nút "Tải bài từ buổi trước" xuất hiện nếu có workout history
- [ ] `pnpm test` pass
- [ ] `pnpm build` pass
- [ ] Không còn reference đến function đã xoá trong codebase

## Open Questions

- [ ] Có muốn giữ criteria panel trên homepage không? (Phương án C)
- [ ] ExercisePicker multi-select có cần "Select all" button không?
- [ ] "Tải bài từ buổi trước" có nên load cả sets/reps/weight đã ghi không, hay chỉ load danh sách exercise?
