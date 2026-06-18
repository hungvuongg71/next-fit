# Implementation Plan: Codebase Cleanup & Quality

## Overview

Dọn dẹp codebase và nâng cao chất lượng dựa trên kết quả code review. Các task được thiết kế theo vertical slices — mỗi task để lại hệ thống ở trạng thái hoạt động ổn định. Ưu tiên xử lý các vấn đề critical trước (rác git, lỗi ESLint, theme duplication), sau đó là các cải thiện về maintainability (constants, tests, type safety).

## Architecture Decisions

- **Dependency thứ tự:** Xoá file rác → sửa lỗi biên dịch → gộp code trùng → cải thiện type safety → thêm tests
- **Không thay đổi logic nghiệp vụ:** Tất cả task đều là refactor/code hygiene, không thêm tính năng mới
- **Mỗi task phải để lại code sạch:** Build pass, không warning mới

## Task List

### Phase 1: Housekeeping (Foundation)

- [ ] Task 1: Xoá 4 file JSON exercise trùng lặng khỏi git tracking
- [ ] Task 2: Xoá boilerplate create-next-app (README, public SVGs, empty api/)
- [ ] Task 3: Consolidate theme config (theme.ts + design-tokens.ts)

### Checkpoint: Phase 1
- [ ] `git status` sạch, không còn file rác
- [ ] Build thành công: `pnpm build`
- [ ] ESLint pass: `pnpm lint`
- [ ] Theme switching hoạt động trên `/themes` và `/profile`

### Phase 2: Maintainability & Type Safety

- [ ] Task 4: Extract magic strings + localStorage keys vào constants
- [ ] Task 5: Consolidate duplicate equipment/frequency lists vào 1 source
- [ ] Task 6: Fix ESLint `no-explicit-any` errors
- [ ] Task 7: Tighten Gender type + naming cleanup

### Checkpoint: Phase 2
- [ ] `pnpm lint` = 0 errors
- [ ] `pnpm build` thành công
- [ ] Equipment picker hoạt động trên Home + Onboarding + ExercisePicker

### Phase 3: Performance & UX

- [ ] Task 8: Debounce localStorage writes in context
- [ ] Task 9: Add `loading="lazy"` to all exercise images
- [ ] Task 10: Add `React.memo` to ExerciseCard

### Checkpoint: Phase 3
- [ ] Workout flow hoạt động không bị giật
- [ ] Images load đúng trên tất cả pages

### Phase 4: Testing (Quality)

- [ ] Task 11: Unit tests for split algorithm core functions
- [ ] Task 12: Unit tests for context state transitions
- [ ] Task 13: Update README with actual project info

### Checkpoint: Phase 4
- [ ] All tests pass
- [ ] Build succeeds
- [ ] Ready for review

## Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Git rm file exercise sẽ ảnh hưởng import | High | Kiểm tra file nào còn reference tới trong codebase trước khi xoá |
| Theme consolidation có thể break CSS variables | High | Test theme switching trên cả 3 themes sau khi gộp |
| Thêm React.memo có thể gây bug nếu props thay đổi không đúng | Low | Chỉ dùng React.memo đơn giản, không custom comparator |
| Tests cần test framework setup | Medium | Dùng vitest (phù hợp với monorepo, dùng được ESM) |

## Open Questions

- Có cần giữ `exercises_100_sample.json` cho testing không? (recommend: giữ lại)
- Dùng vitest hay jest cho unit tests? (recommend: vitest vì monorepo + ESM support)
- `design-tokens.ts` có nhiều chi tiết hơn — có muốn giữ làm canonical và xoá `theme.ts` không? (recommend: giữ design-tokens.ts vì có generateCSSVariables helper)
