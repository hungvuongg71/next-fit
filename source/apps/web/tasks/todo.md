# Task List: Empty State Home Page

## Task 1: Bỏ guard StatsCard trong page.tsx

**Description:** Bỏ điều kiện `state.workoutHistory.length > 0` bọc StatsCard. StatsCard sẽ luôn hiển thị, streak=0, total=0 khi chưa có lịch sử.

**Acceptance criteria:**
- [ ] StatsCard render mọi lúc (kể cả `workoutHistory = []`)
- [ ] Không có gì khác thay đổi trong page.tsx

**Verification:**
- [ ] Build: `pnpm --filter nextfit build`
- [ ] Test: `pnpm --filter nextfit test`

**Files:** `src/app/page.tsx`

**Scope:** XS

## Task 2: Thêm empty state trong RecentSessions.tsx

**Description:** Thay `if (history.length === 0) return null` bằng empty state UI với tiêu đề, thông báo "Chưa có buổi tập nào", và nút CTA "Bắt đầu tập luyện" dẫn `/workout`.

**Acceptance criteria:**
- [ ] `history.length === 0` → render section với title + empty message + CTA button
- [ ] CTA button navigate đến `/workout`
- [ ] `history.length > 0` → render danh sách (giữ nguyên logic hiện tại)

**Verification:**
- [ ] Build: `pnpm --filter nextfit build`
- [ ] Test: `pnpm --filter nextfit test`
- [ ] Manual: empty history → shows empty state; with history → shows list

**Files:** `src/components/ui/RecentSessions.tsx`

**Scope:** XS

## Checkpoint: Complete
- [ ] All acceptance criteria met
- [ ] 126 tests pass
- [ ] Build clean
