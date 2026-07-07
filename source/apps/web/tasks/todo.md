# Task List: Chặn iOS zoom khi focus input

- [ ] **Task 1: Thêm viewport meta chặn zoom**
  - Thêm `export const viewport` với `maximumScale: 1, userScalable: false` trong layout.tsx
  - Verification: `npx tsc --noEmit`, `pnpm build`, manual

## Checkpoint: Complete
- [ ] Build pass
- [ ] Test trên iOS Safari không zoom
