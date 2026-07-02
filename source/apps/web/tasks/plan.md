# Implementation Plan: Empty State Home Page After Onboarding

## Overview

Sau onboarding, trang chủ trống trơn. Thay đổi 2 component: StatsCard luôn hiển thị, RecentSessions hiển thị empty state + CTA. Tổng cộng 2 files, 2 thay đổi nhỏ.

## Architecture Decisions

- **Không thêm section mới** — chỉ sửa render logic hiện tại
- **StatsCard** đã xử lý empty internally (ẩn chart), chỉ cần bỏ guard在外
- **RecentSessions** thêm early return với empty state UI thay vì `return null`

## Task List

### Phase 1: Implement

- [ ] Task 1: Bỏ guard `workoutHistory.length > 0` trên StatsCard trong `page.tsx`
- [ ] Task 2: Thêm empty state + CTA trong `RecentSessions.tsx`

### Checkpoint: Implement
- [ ] Build succeeds
- [ ] Tests pass (126)
- [ ] Manual: new user after onboarding → sees StatsCard (streak 0 / total 0) + RecentSessions empty state

## Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Flash empty state before onboarding redirect | Low | Guard `isFirstVisit && !criteria` vẫn redirect trước khi render |
| StatsCard renders chart with empty data | Low | StatsCard đã ẩn chart khi `chartData.length === 0` |

## Open Questions

(none)
