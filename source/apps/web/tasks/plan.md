# Plan: Chặn iOS Safari zoom khi focus vào input

## Root Cause

iOS Safari tự động zoom vào input/select khi font-size < 16px. Viewport meta trong `layout.tsx` không có `maximum-scale` / `user-scalable`.

## Fix

Thêm viewport meta với `maximum-scale=1, user-scalable=no` vào `<head>` trong `layout.tsx`. Next.js có thể set viewport qua `export const viewport` metadata API.

## Task List

### Task 1: Thêm viewport meta chặn zoom

**Description:** Thêm `export const viewport = { maximumScale: 1, userScalable: false }` trong `layout.tsx`.

**Acceptance criteria:**
- [ ] Focus vào input trên iOS Safari không zoom
- [ ] Pinch-to-zoom bị disabled trên toàn app

**Verification:**
- [ ] `npx tsc --noEmit` — 0 errors
- [ ] `pnpm build` — build thành công
- [ ] Manual: test trên iOS Safari / Chrome devtools device mode

**Dependencies:** None

**Files touched:**
- `src/app/layout.tsx` (thêm viewport export)

## Checkpoint: Complete

- [ ] TypeScript pass, build pass
- [ ] iOS không zoom khi focus input
