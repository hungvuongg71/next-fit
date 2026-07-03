# Plan: Thay DM Sans bằng Sora cho font-display & font-heading

## Overview

Thay thế toàn bộ font `DM Sans` bằng `Sora` (Google Fonts) cho `--font-display` và `--font-heading`. Gỡ `@fontsource/dm-sans`, thêm `@fontsource/sora`.

## Dependency Graph

```
Install @fontsource/sora (pnpm add)
    │
    ↓
globals.css: đổi imports + CSS variables
    │
    ↓
pnpm build (verify)
```

## Task List

### Task 1: Install @fontsource/sora + gỡ @fontsource/dm-sans

**Description:** `pnpm add @fontsource/sora` → `pnpm remove @fontsource/dm-sans`. Cần weights 500, 600, 700 (giống DM Sans cũ).

**Verification:** `pnpm build` không lỗi

**Files:** `package.json`, `pnpm-lock.yaml`

### Task 2: Cập nhật globals.css

**Description:** 
- Thay `@import "@fontsource/dm-sans/..."` bằng `@import "@fontsource/sora/..."`
- Đổi `--font-display` và `--font-heading` từ `"DM Sans", sans-serif` → `"Sora", sans-serif`

**Verification:** `npx tsc --noEmit`, `pnpm build`, manual check font trên UI

**Files:** `src/app/globals.css`

## Checkpoint: Complete

- [ ] Build pass
- [ ] Font-display và font-heading hiển thị bằng Sora
