# Spec: Sticky "Hôm nay của bạn" + Bỏ scroll criteria panel

## Objective

1. **Sticky banner "Hôm nay của bạn"** — Khi scroll xuống phần criteria hoặc exercise list, banner "Hôm nay của bạn" (dòng chào + ngày + tiêu chí + nút Thay Đổi Tiêu Chí) sẽ sticky ở top.
2. **Bỏ scroll trong criteria panel** — Criteria panel hiển thị full, không bị clip `max-h`, không scroll nội bộ.

## Commands

```bash
pnpm build        # Verify
pnpm test         # 51 tests
```

## Files chạm

Chỉ `src/app/page.tsx`

## Thay đổi

### 1. Bỏ scroll criteria panel
```
- max-h-[55vh] overflow-y-auto rounded-2xl  →  bỏ
- sticky top-0 z-10 trên split suggestion   →  bỏ
- border-bottom trên split suggestion       →  bỏ (về border cũ)
```

### 2. Sticky banner "Hôm nay của bạn"
```
Thêm: sticky top-0 z-10 vào div banner (có background solid)
```

## Boundaries
- Chỉ sửa `page.tsx`
- Không chạm logic, không chạm types
