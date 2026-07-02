# Spec: Empty State Home Page After Onboarding

## Objective

Sau khi user hoàn thành onboarding, trang chủ đang trống trơn (chỉ TopHeader + BottomNav + CookieConsent). Hiển thị các section dưới đây ngay cả khi chưa có dữ liệu tập luyện.

**User:** Người mới, vừa hoàn thành onboarding lần đầu.

**Success:**
- StatsCard hiển thị streak=0, totalWorkouts=0, ẩn chart
- RecentSessions hiển thị empty state + CTA "Bắt đầu tập luyện" → `/workout`
- Không còn trang chủ trống sau onboarding

## Commands

```
Build: pnpm --filter nextfit build
Dev:   pnpm --filter nextfit dev
Test:  pnpm --filter nextfit test
```

## Project Structure (affected files)

```
src/app/page.tsx                          → bỏ guard `history.length > 0` trên StatsCard
src/components/ui/StatsCard.tsx           → không cần sửa (đã tự ẩn chart khi empty)
src/components/ui/RecentSessions.tsx       → thêm empty state + CTA button
```

## Code Style

### RecentSessions empty state

```tsx
export default function RecentSessions({ history }: RecentSessionsProps) {
  const router = useRouter()

  if (history.length === 0) {
    return (
      <section>
        <h2 className="font-display text-base font-extrabold mb-4" style={{ color: "var(--color-text)" }}>
          Các buổi tập gần nhất
        </h2>
        <div
          className="rounded-2xl p-6 text-center"
          style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
        >
          <p className="font-body text-sm mb-4" style={{ color: "var(--color-text-secondary)" }}>
            Chưa có buổi tập nào. Bắt đầu buổi tập đầu tiên của bạn!
          </p>
          <button
            type="button"
            onClick={() => router.push("/workout")}
            className="min-h-10 rounded-xl font-heading text-xs font-bold transition-all active:scale-[0.98] px-6"
            style={{ background: "var(--color-primary)", color: "#fff" }}
          >
            Bắt đầu tập luyện
          </button>
        </div>
      </section>
    )
  }

  // ... existing list rendering
}
```

### page.tsx — bỏ guard StatsCard

```tsx
// Trước:
{state.workoutHistory.length > 0 && (
  <section className="mb-6">
    <StatsCard ... />
  </section>
)}

// Sau:
<section className="mb-6">
  <StatsCard ... />
</section>
```

## Testing Strategy

- **Framework:** Vitest (126 tests hiện tại)
- **No new unit tests needed** — chỉ thay đổi render logic UI đơn giản
- `pnpm test` pass

## Boundaries

**Always do:**
- StatsCard luôn render (kể cả `history = []`)
- RecentSessions render empty state khi `history.length === 0`
- Empty state có CTA button "Bắt đầu tập luyện" → `/workout`
- Giữ nguyên guard redirect `/onboarding` khi `isFirstVisit && !criteria`

**Ask first:**
- Thay đổi nội dung empty state text
- Thêm section mới khác ngoài StatsCard / RecentSessions

**Never do:**
- Xoá redirect onboarding
- Hiển thị empty section trước khi redirect (gây flash)
- StatsCard hiển thị chart khi không có dữ liệu

## Success Criteria

- [ ] User mới sau onboarding → trang chủ hiển thị StatsCard (streak 0 / tổng 0 / ẩn chart)
- [ ] User mới sau onboarding → RecentSessions hiển thị "Chưa có buổi tập nào." + CTA
- [ ] Click CTA → navigate đến `/workout`
- [ ] User có lịch sử → RecentSessions render danh sách (không ảnh hưởng)
- [ ] `pnpm build && pnpm test` pass

## Open Questions

- (none — scope confirmed qua questions)
