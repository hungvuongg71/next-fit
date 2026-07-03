# Spec: Mobile Drag-and-Drop Cải thiện

## Objective

**Vấn đề:** Drag-and-drop exercise cards trong WorkoutBuilder không mượt trên mobile: thiếu TouchSensor, không có DragOverlay, drag handle bị ẩn trên màn hình nhỏ, thay bằng nút up/down kém trực quan.

**Mục tiêu:** Thay thế nút up/down trên mobile bằng drag-and-drop thực sự, mượt mà, có phản hồi thị giác khi kéo.

**User:** Người tập dùng mobile để xây dựng workout.

**Success:** 
- Kéo drag handle trên mobile cảm giác mượt, card nổi theo ngón tay (DragOverlay)
- Không còn nút up/down
- Không ảnh hưởng đến các chức năng khác

## Tech Stack

- React 19.2.4 / Next.js 16.2.7
- @dnd-kit/core ^6.3.1
- @dnd-kit/sortable ^10.0.0
- @dnd-kit/utilities ^3.2.2

## Commands

```bash
Dev:       pnpm dev
Build:     pnpm build
Lint:      pnpm lint
Typecheck: npx tsc --noEmit
```

## Project Structure (affected files)

```
WorkoutBuilder.tsx          → Component chính, chứa DnD logic hiện tại
  └─ SortableExerciseCard   → Card sắp xếp, chứa useSortable
```

Chỉ sửa 1 file duy nhất.

## Code Style

- Giữ nguyên style hiện tại (inline styles với CSSProperties, CSS variables)
- Không thêm thư viện mới
- Sử dụng `@dnd-kit` API có sẵn: `DragOverlay`, `TouchSensor`, `PointerSensor`

## Testing Strategy

- `npx tsc --noEmit` — không lỗi type
- `pnpm build` — build thành công
- Manual test trên mobile browser (Chrome DevTools device emulation + real device):
  1. Kéo thả exercise bằng drag handle
  2. Kiểm tra DragOverlay hiển thị khi kéo
  3. Kiểm tra scroll không bị interfere khi chạm vào handle
  4. Xoá + Thay thế bài vẫn hoạt động

## Boundaries

- **Always:** Chỉ sửa `WorkoutBuilder.tsx`, không thay đổi component khác
- **Always:** Giữ `useSortable`, `SortableContext`, `verticalListSortingStrategy`
- **Always:** Test typecheck + build trước khi done
- **Ask first:** Đổi collision detection strategy, thay đổi activation constraint values
- **Never:** Xoá PointerSensor, thay thế @dnd-kit bằng thư viện khác

## Success Criteria

1. Drag handle hiển thị trên mọi kích thước màn hình (không còn `hidden lg:flex`)
2. Nút ChevronUp/ChevronDown bị xoá
3. TouchSensor được thêm vào sensor config
4. DragOverlay được thêm: card nổi theo ngón tay khi kéo
5. `touch-action: none` trên drag handle
6. Card gốc opacity 0.4 khi kéo, DragOverlay hiển thị card đầy đủ
7. TypeScript pass, build pass

## Open Questions

(Không có — đã clarify ở phase 1)
