# Spec: Refactor Font System

## Objective

Tối ưu và đồng bộ hệ thống font cho toàn bộ Web App, hỗ trợ cả 3 themes.

**Vấn đề hiện tại:**
- Display + heading dùng chung font (Be Vietnam Pro) → redundant, lãng phí
- 2 font packages (`space-grotesk`, `syne`) installed nhưng không dùng
- Organic Performance theme: heading = Plus Jakarta Sans (trùng body) → thiếu tương phản
- Design tokens (`design-tokens.ts`) generate `--font-family-*` nhưng CSS dùng `--font-*` khác tên → không sync
- Chưa register font trong Tailwind v4 `@theme` → không dùng được `font-sans`/`font-mono`

**Đề xuất 3 phương án font pairing:**

| | Display/Heading | Body | Number | Phù hợp |
|---|---|---|---|---|
| **A — Tối ưu (giữ nguyên)** | Be Vietnam Pro | Plus Jakarta Sans | Rubik Mono One | Cleanup, fix sync, bỏ font thừa |
| **B — Mạnh mẽ** | Space Grotesk (đã có) | Plus Jakarta Sans | Rubik Mono One | Cá tính, năng động, thể thao |
| **C — Tối giản** | Syne (đã có) | Be Vietnam Pro | Rubik Mono One | Hiện đại, geometric, độc đáo |

## Tech Stack

- Next.js 16.2.7, React 19.2.4, TypeScript 5
- Tailwind CSS v4, @fontsource packages
- Vitest + Testing Library

## Commands

```
Build: pnpm build
Test: pnpm test
Dev: pnpm dev
Lint: pnpm lint
```

## Project Structure

```
src/
├── app/
│   └── globals.css           → Sửa @import font, CSS vars, thêm @theme
├── theme/
│   └── design-tokens.ts      → Sync fontFamily keys với CSS vars
└── package.json               → Gỡ font thừa (space-grotesk, syne) nếu không dùng
```

## Code Style

```css
/* globals.css — font imports chỉ import weights cần thiết */
@import "@fontsource/be-vietnam-pro/700.css";
@import "@fontsource/be-vietnam-pro/600.css";
@import "@fontsource/be-vietnam-pro/500.css";
@import "@fontsource/plus-jakarta-sans/400.css";
@import "@fontsource/plus-jakarta-sans/600.css";
@import "@fontsource/rubik-mono-one/400.css";

/* @theme block — register font families in Tailwind v4 */
@theme inline {
  --font-display: "Be Vietnam Pro", sans-serif;
  --font-heading: "Be Vietnam Pro", sans-serif;
  --font-body: "Plus Jakarta Sans", sans-serif;
  --font-number: "Rubik Mono One", sans-serif;
  --color-background: var(--color-bg);
  --color-foreground: var(--color-text);
}
```

## Testing Strategy

- **Framework:** Vitest
- **Testing:** Visual check (manual) — font changes không thể unit test
- **Verify:** `pnpm build` không lỗi, `pnpm lint` không lỗi mới

## Boundaries

- **Always do:**
  - Import chỉ weights đang dùng (không import all weights)
  - Đồng bộ fontFamily keys giữa design-tokens.ts và globals.css
  - Chạy `pnpm build` sau mọi thay đổi

- **Ask first:**
  - Thêm font package mới (cần download về)
  - Thay đổi tên CSS variable class (`.font-display`, `.font-heading`, etc.)

- **Never do:**
  - Import tất cả weights của font (làm tăng bundle size)
  - Xoá font vẫn đang được dùng

## Success Criteria

- [x] Font imports chỉ giữ weights cần thiết, bỏ thừa
- [x] CSS variables `--font-*` đồng bộ với design tokens
- [x] `@theme` block register đủ font families cho Tailwind v4
- [x] Cả 3 themes dùng font pairing nhất quán (không trùng body=heading)
- [x] Bonus: gỡ `space-grotesk`, `syne` khỏi package.json nếu không dùng
- [x] `pnpm build` pass, `pnpm test` pass
- [x] Font rendering không bị layout shift (FOUT)

## Open Questions

- [ ] Chọn phương án A, B, hay C?
- [ ] Có muốn giữ Space Grotesk và Syne cho tương lai không (dù chưa dùng)?
