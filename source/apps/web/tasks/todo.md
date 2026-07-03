# Task List: Thay DM Sans bằng Sora

- [ ] **Task 1: Cài @fontsource/sora + gỡ @fontsource/dm-sans**
  - `pnpm add @fontsource/sora`
  - `pnpm remove @fontsource/dm-sans`
  - Verification: `pnpm build`

- [ ] **Task 2: Cập nhật globals.css**
  - Đổi imports DM Sans → Sora (500, 600, 700)
  - Đổi CSS variables `--font-display` và `--font-heading`
  - Verification: `npx tsc --noEmit`, `pnpm build`, manual check

## Checkpoint: Complete
- [ ] Build pass
- [ ] Sora hiển thị đúng trên UI
