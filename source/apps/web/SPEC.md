# Spec: Profile — Thay input number bằng NumberPickerWheel

## Objective

**Vấn đề:** Profile page dùng `<input type="number">` cho cân nặng và chiều cao, trong khi Onboarding dùng `NumberPickerWheel` (wheel picker). UX không đồng nhất.

**Mục tiêu:** Thay thế input native ở Profile bằng `NumberPickerWheel` giống hệt Onboarding.

**User:** Người dùng chỉnh sửa thông tin cá nhân trên Profile.

**Success:**
- Weight: 2 wheel picker (int 20-300 + dec 0-9) ngăn cách bởi `.`
- Height: 1 wheel picker (100-250, step 1)
- Style giống Onboarding (border đổi màu khi valid/invalid)
- Giữ nguyên logic save (`handleBodyDone` + `saveAndRegenerate`)

## Tech Stack

- React 19.2.4 / Next.js 16.2.7
- `NumberPickerWheel` component đã có sẵn
- `@ncdai/react-wheel-picker`

## Commands

```bash
Dev:       pnpm dev
Build:     pnpm build
Lint:      pnpm lint
Typecheck: npx tsc --noEmit
```

## Project Structure (affected files)

```
src/app/profile/page.tsx    → Thay <input> bằng NumberPickerWheel
```

Chỉ sửa 1 file.

## Code Style

- Giữ nguyên pattern: inline styles + Tailwind + CSS variables
- Dùng `NumberPickerWheel` props: `value`, `onChange`, `min`, `max`, `step`, `ariaLabel`
- Border validation style giống Onboarding: `1px solid ${valid ? "var(--color-primary)" : "var(--color-border)"}`

```tsx
<NumberPickerWheel
  value={tempWeightInt ?? 70}
  onChange={(v) => {
    const dec = tempWeightDec ?? 0
    setTempWeight(v !== null ? `${v}.${dec}` : "")
  }}
  min={20}
  max={300}
  step={1}
  ariaLabel="Cân nặng phần nguyên"
/>
```

## Testing Strategy

- `npx tsc --noEmit` — 0 errors
- `pnpm build` — build thành công
- Manual test:
  1. Profile → nhấn "Cân nặng & Chiều cao" → thấy wheel picker
  2. Chọn giá trị → "Xong" → lưu thành công
  3. Kiểm tra validation (20-300 weight, 100-250 height)

## Boundaries

- **Always:** Chỉ sửa Profile page
- **Always:** Giữ nguyên logic `handleBodyDone`, `saveAndRegenerate`
- **Ask first:** Thay đổi layout tổng thể của Profile page
- **Never:** Xoá NumberPickerWheel, thay đổi Onboarding

## Success Criteria

1. Weight dùng 2 wheel picker (int + dec) giống Onboarding
2. Height dùng 1 wheel picker giống Onboarding
3. Border đổi màu theo valid/invalid
4. Save hoạt động đúng
5. TypeScript pass, build pass

## Open Questions

(Không có — đã clarify)
