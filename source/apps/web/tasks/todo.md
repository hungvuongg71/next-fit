# Task List — Codebase Cleanup & Quality

---

## Phase 1: Housekeeping (Foundation)

### Task 1: Xoá 4 file JSON exercise trùng lặng khỏi git tracking

**Description:** Hiện tại git đang track 5 file exercise JSON. Chỉ giữ lại `exercises.json`. Xoá 4 file còn lại khỏi git (giữ local), thêm vào `.gitignore`.

**Acceptance criteria:**
- [ ] `exercises_backup.json`, `exercises_pre_llm.json`, `exercises copy 2.json`, `exercises_100_sample.json` không còn trong git tracking
- [ ] Các file trên được thêm vào `.gitignore`
- [ ] `exercises.json` vẫn hoạt động bình thường trong `src/lib/data.ts`
- [ ] `git status` không còn show các file này

**Verification:**
- [ ] `git ls-files src/lib/ | grep exercises` chỉ còn `exercises.json`
- [ ] `pnpm build` thành công
- [ ] Application load danh sách exercise đúng

**Dependencies:** None

**Files likely touched:**
- `.gitignore`
- `src/lib/` (kiểm tra không còn import file khác)

**Estimated scope:** Small (2 files)

---

### Task 2: Xoá boilerplate create-next-app

**Description:** Xoá các file mặc định từ create-next-app:
- `public/globe.svg`, `public/next.svg`, `public/file.svg`, `public/vercel.svg`, `public/window.svg`
- `README.md` (sẽ update sau ở Task 13)
- Empty `src/app/api/` directory

**Acceptance criteria:**
- [ ] Các SVG không còn trong `public/`
- [ ] `src/app/api/` directory được xoá
- [ ] Build pass, không có 404 do missing files

**Verification:**
- [ ] `ls public/` không còn các SVG cũ
- [ ] `pnpm build` thành công

**Dependencies:** None

**Files likely touched:**
- `public/*.svg` (xóa)
- `src/app/api/` (xóa directory)

**Estimated scope:** XS (1 file)

---

### Task 3: Consolidate theme config (theme.ts + design-tokens.ts)

**Description:** Hiện tại có 2 file theme định nghĩa riêng biệt với cấu trúc khác nhau: `ThemeValue` (theme.ts) và `ThemeConfig` (design-tokens.ts). Giữ `design-tokens.ts` làm canonical vì có helper `generateCSSVariables`. Import và re-export từ `theme.ts` hoặc xoá `theme.ts` nếu không còn references.

Cần kiểm tra:
- `src/components/ui/ThemeSwitcher.tsx` import từ `theme.ts`
- `src/app/themes/page.tsx` import `applyTheme` từ `theme.ts`
- `src/lib/theme.ts` có `applyTheme()`, `getTheme()`, `THEME` constant

**Acceptance criteria:**
- [ ] Chỉ còn 1 file định nghĩa theme chính
- [ ] `applyTheme()`, `getTheme()` vẫn hoạt động
- [ ] Theme switcher trên `/profile` và `/themes` vẫn chuyển đổi được 3 themes
- [ ] CSS variables vẫn apply đúng

**Verification:**
- [ ] `pnpm build` thành công
- [ ] Vào `/themes`, chọn từng theme → màu sắc thay đổi đúng

**Dependencies:** None

**Files likely touched:**
- `src/lib/theme.ts` (rewrite to re-export from design-tokens)
- `src/lib/design-tokens.ts` (thêm `applyTheme` và `getTheme`)
- `src/components/ui/ThemeSwitcher.tsx` (cập nhật import)

**Estimated scope:** Medium (3-4 files)

---

## Checkpoint: Phase 1

- [ ] `git status` sạch
- [ ] `pnpm build` thành công
- [ ] `pnpm lint` pass
- [ ] Theme switching hoạt động trên `/themes` và `/profile`
- [ ] Review với human trước khi qua Phase 2

---

## Phase 2: Maintainability & Type Safety

### Task 4: Extract magic strings + localStorage keys vào constants

**Description:** Các string keys `"nextfit-state"` và `"nextfit-theme"` đang hardcode ở `context.tsx` và `ThemeSwitcher.tsx`. Tạo file `src/lib/constants.ts` và export chúng.

**Acceptance criteria:**
- [ ] `STORAGE_KEYS.STATE` và `STORAGE_KEYS.THEME` được định nghĩa trong constants
- [ ] `context.tsx` và `ThemeSwitcher.tsx` import từ constants thay vì hardcode
- [ ] Workflow không thay đổi

**Verification:**
- [ ] `pnpm build` thành công
- [ ] Mở app → state được load từ localStorage (F5 không mất data)
- [ ] Theme preference được lưu và phục hồi

**Dependencies:** None

**Files likely touched:**
- `src/lib/constants.ts` (new)
- `src/lib/context.tsx`
- `src/components/ui/ThemeSwitcher.tsx`

**Estimated scope:** Small (2-3 files)

---

### Task 5: Consolidate duplicate equipment/frequency lists

**Description:** Danh sách `Equipment[]` được định nghĩa ở 4 nơi:
1. `src/app/page.tsx` — EQUIPMENTS array
2. `src/app/onboarding/page.tsx` — EQUIPMENT_OPTIONS array
3. `src/components/ui/ExercisePicker.tsx` — EQUIPMENTS array
4. `src/types/index.ts` — Equipment type (giữ lại)

Cũng tương tự với DURATIONS, FREQUENCIES. Export từ `src/lib/constants.ts` và import ở các component.

**Acceptance criteria:**
- [ ] Equipment list chỉ define 1 lần
- [ ] Duration list chỉ define 1 lần
- [ ] Frequency list chỉ define 1 lần
- [ ] Cả 3 pages vẫn hiển thị đúng options

**Verification:**
- [ ] `pnpm build` thành công
- [ ] Home page equipment picker hiển thị đúng danh sách
- [ ] Onboarding page equipment picker hiển thị đúng danh sách
- [ ] ExercisePicker equipment filter hiển thị đúng

**Dependencies:** Task 4 (constants.ts)

**Files likely touched:**
- `src/lib/constants.ts`
- `src/app/page.tsx`
- `src/app/onboarding/page.tsx`
- `src/components/ui/ExercisePicker.tsx`

**Estimated scope:** Medium (4 files)

---

### Task 6: Fix ESLint `no-explicit-any` errors

**Description:** Sửa 4 lỗi `@typescript-eslint/no-explicit-any`:
- `src/lib/design-tokens.ts` lines 419-431: Định nghĩa `Record<string, any>` thành type cụ thể
- `src/app/themes/page.tsx` line 50: Cast `as any` — thay bằng type đúng

**Acceptance criteria:**
- [ ] `pnpm lint` = 0 errors
- [ ] Type safety được cải thiện (không còn `any`)
- [ ] Build pass

**Verification:**
- [ ] `pnpm lint` (không còn error)
- [ ] `pnpm build` thành công

**Dependencies:** Task 3 (sau khi consolidate themes sẽ clear hơn)

**Files likely touched:**
- `src/lib/design-tokens.ts`
- `src/app/themes/page.tsx`

**Estimated scope:** Small (2 files)

---

### Task 7: Tighten Gender type + naming cleanup

**Description:**
- `split.ts` line 25: Đổi `Record<string, ...>` thành `Record<Gender, ...>` cho `GENDER_VOLUME_BIAS`
- `split.ts` line 278 vs 325: Đổi `allExerciseMuscles` → `allMuscles` cho consistency

**Acceptance criteria:**
- [ ] `GENDER_VOLUME_BIAS` dùng `Record<Gender, ...>`
- [ ] Biến `allExerciseMuscles` renamed thành `allMuscles`
- [ ] Build + lint pass

**Verification:**
- [ ] `pnpm build` thành công
- [ ] `pnpm lint` thành công
- [ ] Split algorithm vẫn sinh ra kết quả giống (render không đổi)

**Dependencies:** None

**Files likely touched:**
- `src/lib/split.ts`

**Estimated scope:** XS (1 file)

---

## Checkpoint: Phase 2

- [ ] `pnpm lint` = 0 errors
- [ ] `pnpm build` thành công  
- [ ] Equipment picker hoạt động trên Home + Onboarding + ExercisePicker
- [ ] Review với human trước khi qua Phase 3

---

## Phase 3: Performance & UX

### Task 8: Debounce localStorage writes in context

**Description:** Hiện tại `useEffect` trong `context.tsx` line 97-99 ghi `localStorage.setItem` sau mỗi state change. Dùng `setTimeout` 1s debounce để tránh ghi quá nhiều.

**Acceptance criteria:**
- [ ] localStorage chỉ được ghi sau 1s không có state change mới
- [ ] State vẫn được persist đúng khi F5
- [ ] Không có data loss

**Verification:**
- [ ] Mở app, chọn exercises, bắt đầu workout → F5 → state vẫn còn
- [ ] Kiểm tra DevTools > Application > Local Storage: data được ghi

**Dependencies:** None

**Files likely touched:**
- `src/lib/context.tsx`

**Estimated scope:** XS (1 file)

---

### Task 9: Add `loading="lazy"` to all exercise images

**Description:** Tất cả `<img>` tag trong `ExerciseThumbnail` và các component khác cần thêm `loading="lazy"` để defer loading cho images dưới fold.

**Acceptance criteria:**
- [ ] `ExerciseThumbnail` render img với `loading="lazy"`
- [ ] Network tab show images loading lazily
- [ ] Không ảnh hưởng tới hiển thị

**Verification:**
- [ ] `pnpm build` thành công
- [ ] DevTools > Network > Img: exercise thumbnails có `loading=lazy` trong request

**Dependencies:** None

**Files likely touched:**
- `src/components/ui/ExerciseThumbnail.tsx`
- Các component dùng `<img>` (nếu có)

**Estimated scope:** XS (1-2 files)

---

### Task 10: Add `React.memo` to ExerciseCard

**Description:** `ExerciseCard` re-renders không cần thiết khi parent re-render (vd toggle criteria panel). Wrap với `React.memo`.

**Acceptance criteria:**
- [ ] `ExerciseCard` export wrapped với `React.memo`
- [ ] Render behavior không đổi

**Verification:**
- [ ] `pnpm build` thành công
- [ ] Home page hiển thị danh sách exercises đúng

**Dependencies:** None

**Files likely touched:**
- `src/components/ui/ExerciseCard.tsx`

**Estimated scope:** XS (1 file)

---

## Checkpoint: Phase 3

- [ ] `pnpm build` thành công
- [ ] Workout flow mượt, không giật
- [ ] Images load đúng
- [ ] Review với human trước khi qua Phase 4

---

## Phase 4: Testing & Documentation

### Task 11: Unit tests for split algorithm core functions

**Description:** Viết tests cho các pure functions trong `split.ts` bằng vitest:
- `computeExerciseCount()`
- `goalScore()`
- `compoundScore()`
- `repScore()`
- `fatiguePenalty()`
- `crossSlotFatiguePenalty()`
- `matchesLevel()`
- `getTodaySuggestion()`

**Acceptance criteria:**
- [ ] vitest được cài đặt và cấu hình
- [ ] Mỗi pure function có ít nhất 2-3 test cases (happy + edge)
- [ ] `pnpm test` pass

**Verification:**
- [ ] `pnpm test` — all tests pass
- [ ] `pnpm build` — build pass

**Dependencies:** Task 7 (naming cleanup)

**Files likely touched:**
- `package.json` (thêm vitest scripts)
- `vitest.config.ts` (new)
- `src/lib/__tests__/split.test.ts` (new)

**Estimated scope:** Medium (3 files)

---

### Task 12: Unit tests for context state transitions

**Description:** Viết tests cho các state transitions trong `context.tsx`:
- `startWorkout()` khởi tạo progress đúng
- `completeWorkout()` tính toán volume, sets, history
- `removeExercise()`/`addExercise()` cập nhật danh sách

Vì React Context khó test isolated, test thông qua `AppProvider` wrapper với `renderHook` từ `@testing-library/react`.

**Acceptance criteria:**
- [ ] Các state transitions cơ bản được test
- [ ] `pnpm test` pass

**Verification:**
- [ ] `pnpm test` — all tests pass

**Dependencies:** None

**Files likely touched:**
- `src/lib/__tests__/context.test.tsx` (new)
- `package.json` (nếu cần thêm testing-library)

**Estimated scope:** Medium (2-3 files)

---

### Task 13: Update README with actual project info

**Description:** Viết lại README.md mô tả dự án NextFit thực tế, thay thế boilerplate create-next-app.

**Acceptance criteria:**
- [ ] README có: tên project, mô tả, tech stack, cách run, kiến trúc, tính năng
- [ ] README bằng tiếng Việt (phù hợp với codebase)

**Verification:**
- [ ] Đọc lại và kiểm tra thông tin chính xác

**Dependencies:** All tasks trên (để có thể describe state hiện tại)

**Files likely touched:**
- `README.md`

**Estimated scope:** XS (1 file)

---

## Checkpoint: Phase 4 (Final)

- [ ] All tasks completed
- [ ] `pnpm test` — all tests pass
- [ ] `pnpm build` — build thành công  
- [ ] `pnpm lint` — 0 errors
- [ ] `git status` sạch
- [ ] Final review với human
