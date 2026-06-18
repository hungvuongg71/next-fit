# Spec: Warmup nâng cao + Ẩn KG cho Bodyweight

## Objective

1. **Warmup thông minh:** Thay thế warmup hardcode vô dụng bằng dynamic stretches theo nhóm cơ + warmup sets cho từng bài tập
2. **Ẩn KG cho Bodyweight:** Trong workout page, bài tập Bodyweight ẩn hoàn toàn cột weight (kg)

## Tech Stack

Next.js 16.2.7 + React 19 + TypeScript + Tailwind v4

## Commands

```bash
pnpm dev        # Dev
pnpm build      # Build
pnpm test       # 48 tests
```

## Files chạm

```
src/
├── lib/
│   ├── constants.ts              # Update: dynamic stretches theo nhóm cơ
│   └── progressive.ts            # Update: suggestWarmup + suggestWarmupSets mới
├── components/
│   └── ui/
│       └── WarmupSection.tsx     # Rewrite: hiển thị dynamic stretches + warmup sets
├── app/workout/page.tsx          # Update: ẩn cột KG khi Bodyweight + warmup sets per exercise
```

## Warmup Design

### Phase 1 — General: Dynamic Stretches (2-3 động tác)
- Theo nhóm cơ đang tập (không hardcode bài tập vớ vẩn)
- Mỗi stretch 30-45s
- Ví dụ: Chest → Chest opener, Shoulder rolls, Cat-Cow

### Phase 2 — Specific: Warmup Sets (per exercise)
- Mỗi exercise trong danh sách → 1 warmup set
- Weight = 50% của working weight (hoặc weight nhẹ nhất)
- Reps = cao hơn working reps (12-15 reps)
- Hiển thị trong WarmupSection hoặc ngay trong exercise card

## KG Hide Logic

- Trong WorkoutPage, kiểm tra `item.exercise.equipment === "Bodyweight"`
- Nếu đúng: grid column chuyển từ `[32px_1fr_1fr_44px_36px_44px]` sang `[32px_1fr_44px_44px]`
- Ẩn: cột weight (kg), cột nút xoá set, cột check có thể giữ
- Reps picker vẫn hiển thị

## Success Criteria

- [ ] Dynamic stretches theo nhóm cơ, không còn hardcode "xoay tay 2 phút"
- [ ] Warmup sets cho từng bài tập (~50% weight)
- [ ] Bodyweight exercise: cột KG ẩn hoàn toàn
- [ ] Build + 48 tests pass
