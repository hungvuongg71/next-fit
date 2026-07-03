# Spec: Redesign StatsCard — Streak & Total Workouts

## Objective

**Vấn đề:** StatsCard hiện tại gộp streak và tổng buổi tập trong 1 card với số nhỏ, thiếu điểm nhấn thị giác.

**Mục tiêu:** Tách thành 2 card riêng biệt (streak + total), số lớn có animation đếm, giữ bar chart bên dưới.

**User:** Người dùng xem trang chủ, muốn thấy tiến trình tập luyện trực quan.

**Success:** 
- Streak và total là 2 card riêng, grid 2 cột
- Số hiển thị to (text-4xl+), font-display, animation đếm từ 0 lên giá trị thật
- Bar chart giữ nguyên ở phía dưới
- Animation chỉ chạy 1 lần khi component mount

## Tech Stack

- React 19.2.4 / Next.js 16.2.7
- Tailwind utility classes
- CSS keyframes (không thêm thư viện animation mới)

## Commands

```bash
Dev:       pnpm dev
Build:     pnpm build
Lint:      pnpm lint
Typecheck: npx tsc --noEmit
```

## Project Structure (affected files)

```
src/components/ui/StatsCard.tsx    → Redesign thành 2 card riêng + animation đếm số
```

Chỉ sửa 1 file.

## Code Style

- Giữ nguyên pattern: Tailwind classes + inline styles với CSS variables
- Animation đếm số: dùng `useState` + `useEffect` với `setInterval` / `requestAnimationFrame`
- 2 card dùng `grid grid-cols-2 gap-3`
- Số dùng `className="font-display text-4xl font-extrabold"`
- Icon dùng lucide-react (Flame, Calendar) sẵn có

```tsx
// Animation đếm số pattern
const [count, setCount] = useState(0)
useEffect(() => {
  if (target === 0) return
  const duration = 800
  const steps = 30
  const increment = target / steps
  let current = 0
  const timer = setInterval(() => {
    current += increment
    if (current >= target) {
      setCount(target)
      clearInterval(timer)
    } else {
      setCount(Math.round(current))
    }
  }, duration / steps)
  return () => clearInterval(timer)
}, [target])
```

## Testing Strategy

- `npx tsc --noEmit` — 0 errors
- `pnpm build` — build thành công
- Manual test:
  1. Load trang chủ → thấy 2 card, số đếm animation
  2. Streak = 0 → hiển thị 0, không animation
  3. Test responsive: 2 cột trên desktop, 1 cột trên mobile nhỏ

## Boundaries

- **Always:** Chỉ sửa StatsCard.tsx
- **Always:** Dùng `--color-primary-rgb` cho màu sắc
- **Always:** Animation chỉ chạy 1 lần khi mount
- **Ask first:** Thêm thư viện animation, thay đổi layout page.tsx
- **Never:** Xoá bar chart, thay đổi logic streak/total từ weekly-stats

## Success Criteria

1. 2 card riêng: streak (Flame) + total (Calendar)
2. Số to font-display, animation đếm từ 0 → giá trị thật trong ~800ms
3. Bar chart giữ nguyên bên dưới 2 card
4. Responsive: 2 cột, xuống 1 cột trên mobile nhỏ
5. TypeScript pass, build pass

## Open Questions

(Không có)
